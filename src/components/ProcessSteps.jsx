import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { n: "01", title: "Source", text: "We buy green coffee directly from farms we have visited ourselves." },
  { n: "02", title: "Roast", text: "Small 5kg batches, roasted by sight, sound and smell every Monday." },
  { n: "03", title: "Grind", text: "Ground fresh for each cup, never earlier, never in advance." },
  { n: "04", title: "Pour", text: "Dialed in by hand by a barista who cares how it tastes." },
];

export default function ProcessSteps() {
  const wrapRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: "left center",
          ease: "none",
          scrollTrigger: {
            trigger: wrapRef.current,
            start: "top 75%",
            end: "bottom 60%",
            scrub: true,
          },
        }
      );

      gsap.from(".step-box", {
        y: 70,
        opacity: 0,
        immediateRender: false,
        duration: 0.9,
        stagger: 0.18,
        ease: "power3.out",
        scrollTrigger: { trigger: wrapRef.current, start: "top 80%", toggleActions: "play none none reverse" },
      });
    }, wrapRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapRef} className="relative">
      <div className="absolute left-0 right-0 top-[3.1rem] hidden h-px bg-white/10 md:block">
        <div ref={lineRef} className="h-px bg-amber-300" />
      </div>

      <div className="grid items-stretch gap-6 md:grid-cols-4">
        {steps.map((s) => (
          <div
            key={s.n}
            className="step-box group relative flex h-full min-h-[14rem] flex-col rounded-3xl border border-white/10 bg-neutral-900/60 p-8 pt-10 text-left transition-all duration-500 hover:-translate-y-3 hover:border-amber-300 hover:bg-amber-300 hover:shadow-2xl hover:shadow-amber-300/20"
          >
            <span className="absolute -top-0 left-8 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-amber-300 text-sm font-semibold text-black ring-8 ring-neutral-950 transition group-hover:bg-black group-hover:text-amber-300">
              {s.n}
            </span>
            <h3 className="mb-3 mt-4 text-left text-3xl font-semibold text-white transition group-hover:text-black">
              {s.title}
            </h3>
            <p className="text-left leading-relaxed text-white/80 transition group-hover:text-black/75">
              {s.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}