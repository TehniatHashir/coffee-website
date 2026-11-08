import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CoffeeScene from './CoffeeScene';

gsap.registerPlugin(ScrollTrigger);

const NAV_H = 96;

// Lower = faster scrolling through the whole hero
const EXIT = 8;
const VH_PER_SECOND = 110; // was 191
const SCROLL_VH = Math.round((EXIT + 10) * VH_PER_SECOND);

const REVEAL_X = '50%';
const REVEAL_Y = `calc(50% + ${NAV_H / 2}px)`;
const REVEAL_FEATHER = '8vmax';
const REVEAL_FEATHER_HALF = '4vmax';
const REVEAL_END = '80vmax';
const REVEAL_DURATION = 6; 
const REVEAL_RING_D = `max(0px, calc(2 * (var(--r, 0vmax) - ${REVEAL_FEATHER_HALF})))`;
const REVEAL_MASK = `radial-gradient(circle at ${REVEAL_X} ${REVEAL_Y}, #000 calc(var(--r, 0vmax) - ${REVEAL_FEATHER}), transparent var(--r, 0vmax))`;

export default function HeroCinematic() {
  const wrap = useRef(null);
  const dots = useRef([]);
  const prog = useRef({ p: 0 });

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.s2', { yPercent: 100 });
      gsap.set(['.s3', '.reveal-ring'], { '--r': '0vmax' });
      gsap.to('.reveal-shine', { rotation: 360, duration: 3.5, repeat: -1, ease: 'none' });
      
      gsap.set('.s2-l', { x: -90, opacity: 0 });
      gsap.set('.s2-c1', { y: -50, opacity: 0 });
      gsap.set('.s2-c2', { y: 70, opacity: 0 });
      gsap.set('.s2-r', { x: 90, opacity: 0 });

      gsap.from('.intro', { y: 50, opacity: 0, duration: 1.4, ease: 'power3.out', delay: 0.3 });

      const setDots = () => {
        const p = prog.current.p;
        const idx = p < 0.5 ? 0 : p < 1.5 ? 1 : 2;
        dots.current.forEach((el, i) => {
          if (!el) return;
          el.style.background = i === idx ? '#fbbf24' : 'transparent';
          el.style.transform = i === idx ? 'scale(1.35)' : 'scale(1)';
        });
      };
      setDots();

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: wrap.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          onUpdate: setDots,
        },
      });

            tl
        .to(prog.current, { p: 1, duration: 5, ease: 'power1.inOut' }, 2)
        .to(prog.current, { p: 2, duration: 8, ease: 'power1.inOut' }, EXIT)

        .to('.hero-left', { x: '-30vw', opacity: 0, duration: 1.5, ease: 'power2.in' }, 2)
        .to('.hero-right', { x: '30vw', opacity: 0, duration: 1.5, ease: 'power2.in' }, 2)
        .to('.hero-fade', { opacity: 0, duration: 1 }, 2)

        .to('.s2', { yPercent: 0, duration: 2.5, ease: 'power2.inOut' }, 2.5)
        .to('.s2-l', { x: 0, opacity: 1, duration: 1.5, ease: 'power2.out' }, 4)
        .to('.s2-c1', { y: 0, opacity: 1, duration: 1.5, ease: 'power2.out' }, 4.5)
        .to('.s2-c2', { y: 0, opacity: 1, duration: 1.5, ease: 'power2.out' }, 5)
        .to('.s2-r', { x: 0, opacity: 1, duration: 1.5, stagger: 0.15, ease: 'power2.out' }, 5.5)

        .to(['.s2-l', '.s2-c1', '.s2-c2'], { x: -120, opacity: 0, duration: 2.5, ease: 'power2.in' }, EXIT)
        .to('.s2-r', { x: 120, opacity: 0, duration: 2.5, ease: 'power2.in', stagger: 0.1 }, EXIT)
        .to(['.s3', '.reveal-ring'], { '--r': REVEAL_END, duration: REVEAL_DURATION, ease: 'power1.inOut' }, EXIT + 0.5)
        .to('.reveal-ring', { opacity: 1, duration: 1, ease: 'power1.out' }, EXIT + 0.6)
        .to('.reveal-ring', { opacity: 0, duration: 1.5, ease: 'power1.in' }, EXIT + 4)

        .fromTo('.scene3-left', { autoAlpha: 0, x: -50 }, { autoAlpha: 1, x: 0, duration: 2, ease: 'power2.out' }, EXIT + 6)
        .fromTo('.scene3-right', { autoAlpha: 0, x: 50 }, { autoAlpha: 1, x: 0, duration: 2, ease: 'power2.out' }, EXIT + 8);
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={wrap} className="relative" style={{ height: `${SCROLL_VH}vh` }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-neutral-950">

        {/* SCENE 1 */}
        <div className="s1 absolute inset-0 z-[1] overflow-hidden">
          <div className="absolute inset-0" style={{ backgroundImage: 'url(/assets/images/hero.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className="intro absolute inset-0 flex items-center px-5 pt-[10vh] text-white sm:px-[6vw] md:pt-[8vh]">
            <div className="hero-copy max-w-[45vw]">
              <p className="hero-fade mb-3 flex items-center gap-3 text-sm uppercase tracking-[0.4em] text-amber-200 [text-shadow:0_2px_12px_rgba(0,0,0,0.7)] font-bold leading-tight">
                <span className="h-px w-10 bg-amber-300" /> Luxury coffee
              </p>
              <h1 className="hero-title font-serif text-[17vw] leading-[0.85] [text-shadow:0_4px_24px_rgba(0,0,0,0.6)] sm:text-[7.5vw]">
                <span className="hero-left block">Luxing</span>
                <span className="hero-right block italic text-amber-100">Collecting</span>
              </h1>
              <p className="hero-fade mt-4 max-w-lg text-xl [text-shadow:0_2px_12px_rgba(0,0,0,0.7)] md:text-2xl leading-snug">
                Experience the premium taste of our signature coffee, roasted small and poured slow.
              </p>
              <div className="hero-fade mt-6 flex flex-wrap items-center gap-3 sm:gap-4">
                <span className="rounded-full bg-amber-300 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-black sm:px-10 sm:py-4 sm:text-base">Order Online</span>
                <span className="rounded-full border border-white/80 px-6 py-3 text-xs uppercase tracking-widest sm:px-10 sm:py-4 sm:text-base">View Menu</span>
              </div>
            </div>
          </div>
        </div>

        {/* SCENE 2 */}
        <div className="s2 absolute inset-0 z-[2] overflow-hidden text-[#2a1a10]" style={{ background: '#f6ecdc' }}>
          <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1000 560" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0,0 L345,0 C335,55 375,115 335,195 C305,255 235,290 150,322 C90,345 40,395 0,455 Z" fill="#ecd9bd" />
            <path d="M0,330 C55,305 130,335 205,415 C265,478 345,500 430,560 L0,560 Z" fill="#faf1e2" />
            <path d="M850,560 C905,515 965,505 1000,478 L1000,560 Z" fill="#ecd9bd" />
            <g fill="#e2d0b0" opacity="0.55">
              <path d="M905,60 C930,30 975,28 1000,38 C985,70 940,82 905,60 Z" />
              <path d="M845,95 C850,60 870,40 890,30 C895,60 880,90 845,95 Z" />
            </g>
          </svg>

          <div
            className="absolute grid grid-cols-[minmax(0,17.5fr)_minmax(0,21.5fr)_minmax(0,22fr)_minmax(0,11.5fr)_minmax(0,11.5fr)] grid-rows-[minmax(0,52fr)_minmax(0,48fr)] gap-[1.5vw]"
            style={{ left: '3vw', right: '3vw', top: `calc(${NAV_H}px + 3vw)`, bottom: '3vw' }}
          >
            <div className="s2-l col-start-1 row-span-2 row-start-1 flex min-h-0 flex-col">
              <div className="relative min-h-0 flex-1 overflow-hidden shadow-xl">
                <img src="/frames/frame_0030.webp" alt="" className="absolute inset-0 h-full w-full object-cover" />
              </div>
              <h3 className="mt-[min(2.6vw,4vh)] font-serif text-[length:min(2.6vw,5vh)] font-semibold leading-none">Rich Roasts</h3>
              <p className="mt-[min(0.8vw,1.4vh)] text-[length:min(1vw,1.9vh)] leading-snug">
                Experience our carefully sourced beans, roasted to perfection in-house. Taste the difference in every cup.
              </p>
              <button className="mt-[min(1.4vw,2.4vh)] self-start rounded-full bg-[#7b5238] px-[min(1.6vw,3vh)] py-[min(0.8vw,1.5vh)] text-[length:min(0.95vw,1.8vh)] text-[#fbf1e2]">
                Explore Roasts
              </button>
            </div>

            <div className="s2-c1 col-start-2 row-start-1 min-h-0 overflow-hidden rounded-[1.2vw] bg-[#ecd9bd] p-[min(2vw,3.6vh)]">
              <h2 className="font-serif text-[length:min(3.4vw,6.2vh)] font-semibold leading-[0.95] tracking-tight">
                Signature<br />Blends
              </h2>
              <p className="mt-[min(1.2vw,2.2vh)] text-[length:min(1vw,1.9vh)] leading-snug">
                Crafted by our master baristas. Each blend is a story, a moment of perfect balance. Discover your new favorite.
              </p>
            </div>

            <div className="s2-c2 col-start-2 row-start-2 flex min-h-0 flex-col overflow-hidden rounded-[1.6vw] bg-[#6b4129] p-[min(2vw,3.6vh)] text-[#f6ecdc]">
              <p className="text-[length:min(0.95vw,1.8vh)] leading-snug">
                <b>Quality &amp; Sustainability.</b> From ethically sourced beans to your cup, every blend is made with care.
              </p>
              <p className="mt-[min(0.9vw,1.6vh)] text-[length:min(0.95vw,1.8vh)] leading-snug">
                <b>The Art of Roasting.</b> Small batches bring out the best of each bean.
              </p>
              <button className="mt-auto self-start rounded-full bg-[#ecd9bd] px-[min(1.5vw,2.8vh)] py-[min(0.8vw,1.5vh)] text-[length:min(0.95vw,1.8vh)] text-[#6b4129]">
                Our Sustainability Story
              </button>
            </div>

            <div
              className="pointer-events-none col-start-3 row-span-2 row-start-1 rounded-[2vw]"
              style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0) 68%)' }}
            />

            <div className="s2-r col-start-4 row-start-1 flex min-h-0 flex-col overflow-hidden rounded-[1.2vw] bg-[#ecd9bd] p-[min(1.1vw,2vh)]">
              <h4 className="font-serif text-[length:min(1.7vw,3.2vh)] font-semibold leading-[1.02]">Artisan Selection</h4>
              <p className="mt-[min(0.6vw,1.1vh)] text-[length:min(0.85vw,1.65vh)] leading-snug">
                A curated collection of micro-lot and specialty beans, perfect for the refined palate.
              </p>
              <button className="mt-auto self-start rounded-full bg-[#7b5238] px-[min(0.9vw,1.7vh)] py-[min(0.5vw,1vh)] text-[length:min(0.78vw,1.5vh)] text-[#fbf1e2]">
                Special Batches
              </button>
            </div>
            <div className="s2-r col-start-5 row-start-1 flex min-h-0 flex-col overflow-hidden rounded-[1.2vw] bg-[#ecd9bd] p-[min(1.1vw,2vh)]">
              <h4 className="font-serif text-[length:min(1.7vw,3.2vh)] font-semibold leading-[1.02]">Global Collection</h4>
              <p className="mt-[min(0.6vw,1.1vh)] text-[length:min(0.85vw,1.65vh)] leading-snug">
                Explore unique coffee origins from South America, Africa, and Asia.
              </p>
              <button className="mt-auto self-start rounded-full bg-[#7b5238] px-[min(0.9vw,1.7vh)] py-[min(0.5vw,1vh)] text-[length:min(0.78vw,1.5vh)] text-[#fbf1e2]">
                Single Origins
              </button>
            </div>

            <div className="s2-r relative col-start-4 row-start-2 min-h-0 overflow-hidden shadow-xl">
              <img src="/frames2/frame_0040.webp" alt="" className="absolute inset-0 h-full w-full object-cover" />
            </div>
            <div className="s2-r relative col-start-5 row-start-2 min-h-0 overflow-hidden shadow-xl">
              <img src="/frames3/frame_0060.webp" alt="" className="absolute inset-0 h-full w-full object-cover" />
            </div>
          </div>
        </div>

        {/* SCENE 3 */}
        <div
          className="s3 absolute inset-0 z-[3]"
          style={{
            backgroundImage: 'url(/assets/images/bg3.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            WebkitMaskImage: REVEAL_MASK,
            maskImage: REVEAL_MASK,
          }}
        >
          <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 45%, rgba(255,214,150,0.30) 0%, transparent 55%)' }} />
          <div className="absolute inset-x-0 bottom-0 h-[45%]" style={{ background: 'linear-gradient(to top, rgba(20,10,4,0.65), transparent)' }} />
        </div>

        {/* REVEAL RING */}
        <div
          className="reveal-ring pointer-events-none absolute z-[4] rounded-full opacity-0"
          style={{
            left: REVEAL_X,
            top: REVEAL_Y,
            transform: 'translate(-50%, -50%)',
            width: REVEAL_RING_D,
            height: REVEAL_RING_D,
            border: '2px solid rgba(255,244,210,0.95)',
            boxShadow: '0 0 22px 4px rgba(255,216,140,0.9), 0 0 70px 16px rgba(255,172,72,0.42), 0 0 160px 40px rgba(255,200,110,0.18), inset 0 0 46px 8px rgba(255,228,165,0.6)',
          }}
        >
          <div
            className="reveal-shine absolute rounded-full"
            style={{
              inset: '-2px',
              background: 'conic-gradient(from 0deg, transparent 0deg, transparent 240deg, rgba(255,247,222,0.95) 318deg, transparent 360deg)',
              WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 6px), #000 calc(100% - 5px))',
              mask: 'radial-gradient(farthest-side, transparent calc(100% - 6px), #000 calc(100% - 5px))',
            }}
          />
        </div>

        {/* 3D Canvas */}
        <div className="pointer-events-none absolute inset-0 z-10">
          <CoffeeScene prog={prog} navH={NAV_H} />
        </div>

               {/* Scene 3 Text (Left & Right) */}
        <div className="scene3-overlay absolute inset-0 z-20 pointer-events-none flex items-center justify-between px-[6vw]">
          
          {/* Left Text */}
          <div className="scene3-left flex flex-col justify-center text-white max-w-lg">
            <p className="mb-2 text-sm uppercase tracking-[0.4em] text-amber-200 font-bold leading-tight">The finishing touch</p>
            <h2 className="font-serif text-6xl [text-shadow:0_4px_20px_rgba(0,0,0,0.5)] md:text-8xl leading-[0.9]">The <em className="text-amber-300">Perfect</em> Blend</h2>
            <p className="mt-4 text-lg text-white/90 md:text-xl leading-snug">
              Golden espresso, cold milk and a handful of ice. Poured fresh, served your way.
            </p>
            <div className="mt-6 flex gap-4 pointer-events-auto">
              <button className="rounded-full bg-amber-300 px-10 py-4 font-bold text-black transition hover:bg-amber-200 text-lg">Order Online</button>
              <button className="rounded-full border border-white/70 px-10 py-4 uppercase tracking-widest text-white transition hover:bg-white/10 text-lg">View Menu</button>
            </div>
          </div>

                   {/* Right Side Text: Glass Box (Floating on Right) */}
          <div className="scene3-right scene3-glass flex flex-col justify-center text-white text-left max-w-sm mt-40 mr-[-3vw] p-6 bg-black/30 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl">
             <h3 className="font-serif text-3xl font-bold mb-3 text-amber-100">Pure Indulgence</h3>
             <p className="text-white/90 text-base leading-relaxed">Crafted with passion, served with love. Every sip is a moment of bliss.</p>
          </div>

        </div>
        {/* Dots */}
        <div className="absolute right-[2vw] top-1/2 z-30 flex -translate-y-1/2 flex-col gap-3">
          {[0, 1, 2].map((i) => (<span key={i} ref={(el) => (dots.current[i] = el)} className="h-3 w-3 rounded-full border-2 border-amber-400 transition-all duration-300" />))}
        </div>
      </div>
    </section>
  );
}