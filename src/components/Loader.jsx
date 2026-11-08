import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Loader({ onDone, duration = 2.6 }) {
  const rootRef = useRef(null);
  const fillRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const counter = { v: 0 };
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.from(".loader-logo", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" })
        .to(
          counter,
          {
            v: 100,
            duration,
            ease: "power1.inOut",
            onUpdate: () => setProgress(Math.round(counter.v)),
          },
          0.2
        )
        .to(fillRef.current, { height: "100%", duration, ease: "power1.inOut" }, 0.2)
        .to(".loader-content", { opacity: 0, y: -20, duration: 0.5, ease: "power2.in" })
        .to(rootRef.current, {
          yPercent: -100,
          duration: 1,
          ease: "power4.inOut",
          onComplete: onDone,
        });
    }, rootRef);

    return () => ctx.revert();
  }, [duration, onDone]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-950"
    >
      <div className="loader-content flex flex-col items-center">
        {/* coffee cup */}
        <div className="relative mb-8 h-24 w-24">
          <div className="absolute -top-8 left-0 right-0 flex justify-center gap-3">
            {[0, 0.4, 0.8].map((d) => (
              <span
                key={d}
                className="steam block h-6 w-1 rounded-full bg-amber-300/60"
                style={{ animationDelay: `${d}s` }}
              />
            ))}
          </div>
          <div className="relative h-20 w-20 overflow-hidden rounded-b-[2rem] border-2 border-amber-300">
            <div
              ref={fillRef}
              className="absolute bottom-0 left-0 right-0 h-0 bg-amber-300/80"
            />
          </div>
          <div className="absolute right-0 top-3 h-9 w-6 rounded-r-full border-2 border-l-0 border-amber-300" />
        </div>

        <h1 className="loader-logo text-4xl font-semibold tracking-tight">
          Ember <span className="text-amber-300">&</span> Oak
        </h1>
        <p className="mt-2 text-xs uppercase tracking-[0.4em] text-white/50">
          Brewing your experience
        </p>
        <p className="mt-8 font-serif text-5xl text-amber-300 tabular-nums">
          {progress}
          <span className="text-2xl">%</span>
        </p>
      </div>
    </div>
  );
}
