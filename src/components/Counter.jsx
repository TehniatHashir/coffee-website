import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Counter({ to, suffix = "", label }) {
  const numRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    const obj = { v: 0 };
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        v: to,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: { trigger: wrapRef.current, start: "top 90%", once: true },
        onUpdate: () => {
          if (numRef.current) {
            numRef.current.textContent = Number.isInteger(to)
              ? Math.round(obj.v).toLocaleString()
              : obj.v.toFixed(1);
          }
        },
      });
    }, wrapRef);
    return () => ctx.revert();
  }, [to]);

  return (
    <div ref={wrapRef} className="text-center">
      <p className="font-serif text-5xl text-amber-300 md:text-6xl">
        <span ref={numRef}>0</span>
        {suffix}
      </p>
      <p className="mt-2 text-xs uppercase tracking-[0.3em] text-white/60">{label}</p>
    </div>
  );
}
