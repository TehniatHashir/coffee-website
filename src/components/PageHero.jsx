import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function PageHero({ eyebrow, title, subtitle, image }) {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".ph-eyebrow", { y: 20, opacity: 0, duration: 0.7, delay: 0.1 })
        .from(".ph-title", { y: 60, opacity: 0, duration: 1 }, "-=0.4")
        .from(".ph-sub", { y: 30, opacity: 0, duration: 0.8 }, "-=0.6");
      gsap.to(".ph-bg", {
        yPercent: 20,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative flex h-[70vh] min-h-[420px] items-center justify-center overflow-hidden">
      {image && (
        <div
          className="ph-bg absolute inset-0 scale-110 bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-neutral-950" />
      <div className="relative z-10 px-6 text-center">
        <p className="ph-eyebrow mb-4 text-xs uppercase tracking-[0.4em] text-amber-300">{eyebrow}</p>
        <h1 className="ph-title text-5xl font-semibold leading-tight md:text-7xl">{title}</h1>
        {subtitle && (
          <p className="ph-sub mx-auto mt-6 max-w-xl text-white/70 md:text-lg">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
