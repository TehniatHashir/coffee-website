import { useRef } from "react";
import gsap from "gsap";

export default function TiltCard({ children, className = "", max = 10 }) {
  const ref = useRef(null);
  const glowRef = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;

    gsap.to(el, {
      rotateY: (px - 0.5) * max * 2,
      rotateX: -(py - 0.5) * max * 2,
      transformPerspective: 900,
      duration: 0.4,
      ease: "power2.out",
    });
    if (glowRef.current) {
      glowRef.current.style.background = `radial-gradient(300px circle at ${px * 100}% ${
        py * 100
      }%, rgba(252,211,77,0.18), transparent 60%)`;
    }
  };

  const onLeave = () => {
    gsap.to(ref.current, { rotateX: 0, rotateY: 0, duration: 0.6, ease: "power3.out" });
    if (glowRef.current) glowRef.current.style.background = "transparent";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`relative will-change-transform ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div ref={glowRef} className="pointer-events-none absolute inset-0 rounded-[inherit]" />
      {children}
    </div>
  );
}