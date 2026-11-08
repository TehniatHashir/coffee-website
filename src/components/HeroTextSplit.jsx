import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroTextSplit() {
  const containerRef = useRef();
  const textLeftRef = useRef();
  const textRightRef = useRef();

  useEffect(() => {
    // Jab scroll ho, toh text left aur right jaye
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=1000", // Text kitna jaldi split hoga
        scrub: 1,
      },
    });

    tl.to(textLeftRef.current, { x: -300, opacity: 0.2, duration: 1 }, 0)
      .to(textRightRef.current, { x: 300, opacity: 0.2, duration: 1 }, 0);

  }, []);

  return (
    <div 
      ref={containerRef} 
      className="relative z-10 h-full flex flex-col justify-center items-center pointer-events-none"
    >
      <div className="flex gap-5 text-6xl md:text-8xl text-white font-serif overflow-hidden">
        <h1 ref={textLeftRef} className="m-0">Luxing</h1>
        <h1 ref={textRightRef} className="m-0">Collecting</h1>
      </div>
      <p className="text-white mt-5 max-w-lg text-center text-lg">
        Experience the premium taste of our signature coffee.
      </p>
    </div>
  );
}