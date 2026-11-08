import React, { useRef, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';

const CUP = '/assets/models/coffee-cup.glb';
const BEAN = '/assets/models/coffee_beans.glb';

// Scene 1: Text ke sath, Scene 3: Center
const POSE = {
  x: [1.8, 0, 0.8],        
  y: [-1.0, -0.3, -0.3],
  s: [1.8, 1.8, 1.8],      
  tilt: [0.8, 0.9, 0.8],
};

const S2 = { u: 0.584, f: 0.5, w: 0.28 }; 

const S2_BEANS = [
  { u: 0.48, f: 0.15 }, { u: 0.68, f: 0.12 }, { u: 0.49, f: 0.85 }, { u: 0.67, f: 0.88 },
];
const S2_BEAN_SIZE = 0.6;

const { lerp } = THREE.MathUtils;
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const smooth = (a, b, x) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const kf = (p, [a, b, c]) => (p < 1 ? lerp(a, b, smooth(0, 1, p)) : lerp(b, c, smooth(1, 2, p)));

class Safe extends React.Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(err) { console.error(`[CoffeeScene] "${this.props.name}" error:`, err); }
  render() { return this.state.failed ? null : this.props.children; }
}

const cloneMat = (mesh, fn) => {
  mesh.material = Array.isArray(mesh.material) ? mesh.material.map((m) => fn(m.clone())) : fn(mesh.material.clone());
};
const tuneCup = (mesh) => cloneMat(mesh, (m) => { m.envMapIntensity = 1.6; m.side = THREE.DoubleSide; return m; });
const tuneBean = (mesh) => cloneMat(mesh, (m) => { m.envMapIntensity = 1; return m; });

const dropFlatMeshes = (root) => {
  root.updateMatrixWorld(true);
  const flats = [];
  root.traverse((o) => {
    if (!o.isMesh) return;
    const s = new THREE.Box3().setFromObject(o).getSize(new THREE.Vector3());
    const [min, , max] = [s.x, s.y, s.z].sort((a, b) => a - b);
    if (max > 0 && min / max < 0.04) flats.push(o);
  });
  flats.forEach((o) => o.parent && o.parent.remove(o));
};

function measureCup(root) {
  root.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(root);
  const sz = box.getSize(new THREE.Vector3());
  const base = { topY: box.max.y, bottomY: box.min.y, width: sz.x, height: sz.y };
  const fallback = { cx: 0, cz: 0, r: 0.85, ...base };
  const v = new THREE.Vector3();
  const top = [];
  root.traverse((o) => {
    const pos = o.isMesh && o.geometry && o.geometry.attributes.position;
    if (!pos) return;
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i).applyMatrix4(o.matrixWorld);
      if (v.y > box.max.y - 0.04) top.push(v.x, v.z);
    }
  });
  if (top.length < 24) return fallback;
  const n = top.length / 2;
  let cx = 0; let cz = 0;
  for (let i = 0; i < top.length; i += 2) { cx += top[i]; cz += top[i + 1]; }
  cx /= n; cz /= n;
  const dists = [];
  for (let i = 0; i < top.length; i += 2) dists.push(Math.hypot(top[i] - cx, top[i + 1] - cz));
  dists.sort((a, b) => a - b);
  const r = dists[Math.floor(dists.length / 2)];
  if (!(r > 0.2)) return fallback;
  return { cx, cz, r, ...base };
}

function contentToWorld(u, f, size, viewport, navH) {
  const m = 0.03 * size.width;
  const top = navH + m;
  const bottom = size.height - m;
  const yPx = top + f * (bottom - top);
  return [(u - 0.5) * viewport.width, (0.5 - yPx / size.height) * viewport.height];
}

function useNormalizedClone(url, targetSize, tune, removeFlat = false, measure = false) {
  const { scene } = useGLTF(url);
  return useMemo(() => {
    const clone = scene.clone(true);
    if (removeFlat) dropFlatMeshes(clone);
    const meshes = [];
    clone.traverse((o) => { if (!o.isMesh) return; o.frustumCulled = false; meshes.push(o); if (tune) tune(o); });
    clone.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const k = targetSize / (Math.max(size.x, size.y, size.z) || 1);
    clone.position.sub(center);
    const wrapper = new THREE.Group();
    wrapper.add(clone);
    wrapper.scale.setScalar(k);
    if (measure) wrapper.userData.info = measureCup(wrapper);
    return wrapper;
  }, [scene, targetSize, tune, removeFlat, measure]);
}

function makeShadowTexture() {
  const c = document.createElement('canvas'); c.width = 256; c.height = 256;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(128, 128, 10, 128, 128, 128);
  gr.addColorStop(0, 'rgba(0,0,0,0.85)'); gr.addColorStop(0.55, 'rgba(0,0,0,0.35)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(c); return tex;
}

// ---- 1. Cup ----
function Cup({ prog, navH }) {
  const viewport = useThree((s) => s.viewport);
  const size = useThree((s) => s.size);
  const model = useNormalizedClone(CUP, 3, tuneCup, false, true);
  const info = model.userData.info;
  const cupW = Math.max(0.5, info.width);
  const blob = useMemo(() => makeShadowTexture(), []);
  const group = useRef(); const spin = useRef(); const shadow = useRef();
  const mouse = useRef({ x: 0, y: 0 });
  const steamRefs = useRef([]);

  useEffect(() => {
    const onMove = (e) => { mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1; mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1; };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame(({ clock }) => {
    const p = prog.current.p;
    const t = clock.elapsedTime;

    const [x2, y2] = contentToWorld(S2.u, S2.f, size, viewport, navH);
    const s2 = (S2.w * viewport.width) / cupW;

    group.current.position.x = kf(p, [POSE.x[0], x2, POSE.x[2]]);
    group.current.position.y = kf(p, [POSE.y[0], y2, POSE.y[2]]) + Math.sin(t * 0.8) * 0.05;
    group.current.scale.setScalar(kf(p, [POSE.s[0], s2, POSE.s[2]]));

    spin.current.rotation.y = lerp(0, Math.PI * 2, p);
    const tiltTarget = kf(p, POSE.tilt) - mouse.current.y * 0.12;
    spin.current.rotation.x += (tiltTarget - spin.current.rotation.x) * 0.06;

    shadow.current.material.opacity = 0.55;

    // STEAM: Scene 3 mein late aayegi (p=1.6 ke baad)
    const steamAmt = smooth(1.6, 2.0, p); 
    steamRefs.current.forEach((steam, i) => {
      if (!steam) return;
      const offset = (t * 0.3 + i * 0.8) % 2.5;
      steam.position.y = info.topY + 0.4 + offset;
      const scale = 0.15 + offset * 0.15;
      steam.scale.set(scale, scale, scale);
      const opacity = Math.sin((offset / 2.5) * Math.PI) * steamAmt * 0.5;
      steam.material.opacity = Math.max(0, opacity);
      steam.position.x = info.cx + Math.sin(t * 0.4 + i) * 0.2;
      steam.position.z = info.cz + Math.cos(t * 0.5 + i) * 0.1;
    });
  });

  return (
    <group ref={group}>
      <mesh ref={shadow} position={[0, info.bottomY - 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.2, 4.2]} />
        <meshBasicMaterial map={blob} transparent depthWrite={false} />
      </mesh>
      <group ref={spin}>
        <primitive object={model} />
        {Array.from({ length: 10 }).map((_, i) => (
          <mesh key={i} ref={(el) => (steamRefs.current[i] = el)} position={[info.cx, info.topY + 0.4, info.cz]}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshBasicMaterial color="#ffffff" transparent={true} opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ---- 2. Beans (Scene 3) ----
function Beans({ prog }) {
  const model = useNormalizedClone(BEAN, 0.18, tuneBean);
  const group = useRef(); const refs = useRef([]);

  const items = useMemo(() => {
    const arr = [];
    const sizes = [0.5, 0.7, 0.4, 0.8, 0.6, 0.45, 0.65, 0.55, 0.75, 0.4, 0.6, 0.7];
    const positions = [
      { x: -4.5, y: 1.5, z: -2 }, { x: -6.0, y: -2.0, z: -3 }, { x: -3.5, y: -4.0, z: -4 }, { x: -7.5, y: 3.0, z: -1 }, { x: -5.0, y: 4.5, z: -5 },
      { x: 4.5, y: 1.5, z: -2 }, { x: 6.0, y: -2.0, z: -3 }, { x: 3.5, y: -4.0, z: -4 }, { x: 7.5, y: 3.0, z: -1 }, { x: 5.0, y: 4.5, z: -5 },
      { x: -1.5, y: 2.0, z: -8 }, { x: 1.5, y: -1.5, z: -7 },
    ];

    positions.forEach((pos, i) => {
      arr.push({ scale: sizes[i % sizes.length], x: pos.x, y: pos.y, z: pos.z, rot: [Math.random() * 6, Math.random() * 6, Math.random() * 6], speed: 0.2 + Math.random() * 0.5, phase: Math.random() * 10, floatAmp: 0.2 + Math.random() * 0.3 });
    });
    return arr;
  }, []);

  const clones = useMemo(() => items.map(() => model.clone()), [items, model]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    // BEANS: Cup ke baad aayenge (p=1.4 ke baad)
    const amt = smooth(1.4, 1.8, prog.current.p); 
    group.current.visible = amt > 0.001;
    group.current.scale.setScalar(Math.max(amt, 0.0001));
    refs.current.forEach((g, i) => {
      if (!g) return; const it = items[i];
      g.position.y = it.y + Math.sin(t * it.speed + it.phase) * it.floatAmp;
      g.rotation.x += 0.005 * it.speed; g.rotation.y += 0.008 * it.speed; g.rotation.z += 0.003 * it.speed;
    });
  });

  return (
    <group ref={group}>
      {items.map((it, i) => (
        <group key={i} ref={(el) => (refs.current[i] = el)} position={[it.x, it.y, it.z]} rotation={it.rot}>
          <primitive object={clones[i]} scale={it.scale} />
        </group>
      ))}
    </group>
  );
}

// ---- 3. Scene 2 Beans ----
function Scene2Beans({ prog, navH }) {
  const viewport = useThree((s) => s.viewport);
  const size = useThree((s) => s.size);
  const model = useNormalizedClone(BEAN, S2_BEAN_SIZE, tuneBean);
  const refs = useRef([]);
  const items = useMemo(() => S2_BEANS.map((b, i) => ({
    ...b, r0: 0.5 + i * 1.7, r1: 1 + i * 2.3, r2: 0.4 * i, sx: 0.25 + 0.07 * i, sy: 0.3 + 0.05 * i, sp: 0.5 + i * 0.13, ph: i * 1.9,
  })), []);
  const clones = useMemo(() => items.map(() => model.clone()), [items, model]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime; const p = prog.current.p;
    const v = 1 - smooth(0.15, 0.5, Math.abs(p - 1));
    items.forEach((it, i) => {
      const g = refs.current[i]; if (!g) return;
      g.visible = v > 0.01;
      if (!g.visible) return;
      g.scale.setScalar(Math.max(v, 0.0001));
      const [bx, by] = contentToWorld(it.u, it.f, size, viewport, navH);
      g.position.set(bx, by + Math.sin(t * it.sp + it.ph) * 0.12, 0.5);
      g.rotation.set(it.r0 + t * it.sx, it.r1 + t * it.sy, it.r2);
    });
  });

  return (
    <group>
      {items.map((it, i) => (
        <group key={i} ref={(el) => (refs.current[i] = el)}>
          <primitive object={clones[i]} />
        </group>
      ))}
    </group>
  );
}

export default function CoffeeScene({ prog, navH = 96 }) {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 45 }} gl={{ alpha: true, antialias: true }} dpr={[1, 2]} style={{ background: 'transparent' }}>
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 10, 5]} intensity={3} />
      <pointLight position={[-5, 5, 5]} intensity={2.5} color="#ffedd5" />
      <Suspense fallback={null}>
        <Environment resolution={256}>
          <Lightformer form="rect" intensity={5} position={[0, 5, -5]} scale={[12, 5, 1]} />
          <Lightformer form="rect" intensity={3} position={[-6, 1, 2]} scale={[4, 8, 1]} color="#ffd9a0" />
          <Lightformer form="rect" intensity={2.5} position={[6, 1, 2]} scale={[4, 8, 1]} color="#fff3e0" />
          <Lightformer form="ring" intensity={2.5} position={[0, 0, 6]} scale={6} color="#ffffff" />
        </Environment>
        <Safe name="cup"><Cup prog={prog} navH={navH} /></Safe>
        <Safe name="beans"><Beans prog={prog} /></Safe>
        <Safe name="beans-scene2"><Scene2Beans prog={prog} navH={navH} /></Safe>
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload(CUP);
useGLTF.preload(BEAN);