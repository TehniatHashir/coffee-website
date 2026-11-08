import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Animates children into view on scroll.
 * direction: "up" | "left" | "right" | "fade" | "scale"
 * stagger: if > 0, each direct child animates one after another.
 */
export default function Reveal({
  children,
  direction = "up",
  delay = 0,
  stagger = 0,
  className = "",
  as: Tag = "div",
}) {
  const ref = useRef(null);

  useEffect(() => {
    const from = { opacity: 0 };
    if (direction === "up") from.y = 50;
    const mobileSlide = window.innerWidth < 1024 ? 24 : 60;
    if (direction === "left") from.x = -mobileSlide;
    if (direction === "right") from.x = mobileSlide;
    if (direction === "scale") from.scale = 0.9;

    const ctx = gsap.context(() => {
      const targets = stagger > 0 ? ref.current.children : ref.current;
      gsap.from(targets, {
        ...from,
        duration: 1,
        delay,
        stagger,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    }, ref);
    return () => ctx.revert();
  }, [direction, delay, stagger]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
