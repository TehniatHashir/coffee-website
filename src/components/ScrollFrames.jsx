import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Layout presets: only used when `segments` is passed.
// pt-24 / pt-28 keeps every caption clear of the fixed navbar.
const POSITIONS = {
  "bottom-left": "inset-0 flex items-end justify-start text-left px-6 pt-28 pb-6 md:px-16 md:pb-10",
  "bottom-right": "inset-0 flex items-end justify-end text-right px-6 pt-28 pb-6 md:px-16 md:pb-10",
  "bottom-center": "inset-0 flex items-end justify-center text-center px-6 pt-28 pb-6 md:px-16 md:pb-10",
  "mid-right": "inset-0 flex items-center justify-end text-right px-6 pt-24 pb-6 md:px-16",
  "mid-left": "inset-0 flex items-center justify-start text-left px-6 pt-24 pb-6 md:px-16",
  "top-left": "inset-0 flex items-start justify-start text-left px-6 pt-28 md:px-16",
  "top-right": "inset-0 flex items-start justify-end text-right px-6 pt-28 md:px-16",
  center: "inset-0 flex items-center justify-center text-center px-6 pt-24 pb-6",
};

const ROMAN = ["I", "II", "III", "IV", "V", "VI"];

export default function ScrollFrames({
  folder = "/frames",
  totalFrames,
  scrollLength = 3000,
  segments = [],
  overlay = {},
}) {
  const canvasRef = useRef(null);
  const sectionRef = useRef(null);
  const textRefs = useRef([]);
  const imagesRef = useRef([]);
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  // legacy = old single `overlay` mode (exactly like your original file)
  const legacy = segments.length === 0;

  const captionList = !legacy
    ? segments
    : overlay.title
    ? [{ ...overlay, start: 0, end: 0.2 }]
    : [];

  // safe primitive key: React elements can't be JSON.stringify'd
  const captionKey =
    (legacy ? "L|" : "S|") +
    captionList
      .map(
        (s, i) =>
          `${i}:${s.start ?? 0}:${s.end ?? 0}:${s.eyebrow ?? ""}:${
            s.cta?.label ?? ""
          }:${s.cta?.href ?? ""}:${s.position ?? ""}:${s.variant ?? ""}:${
            s.stage ?? ""
          }:${(s.tags || []).join(",")}:${(s.notes || []).join(",")}:${(
            s.stats || []
          )
            .map((x) => x.value + x.label)
            .join(",")}:${(s.readouts || [])
            .map((x) => x.value + x.label)
            .join(",")}:${(s.meters || [])
            .map((x) => x.label + x.level)
            .join(",")}`
      )
      .join("|");

  // preload frames
  useEffect(() => {
    let cancelled = false;
    let count = 0;
    const imgs = [];
    setLoaded(false);
    setProgress(0);

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      img.src = `${folder}/frame_${String(i).padStart(4, "0")}.webp`;
      const done = () => {
        if (cancelled) return;
        count++;
        if (count % 5 === 0 || count === totalFrames) {
          setProgress(Math.round((count / totalFrames) * 100));
        }
        if (count === totalFrames) setLoaded(true);
      };
      img.onload = done;
      img.onerror = done; // a missing frame should not block the page forever
      imgs.push(img);
    }
    imagesRef.current = imgs;

    return () => {
      cancelled = true;
    };
  }, [folder, totalFrames]);

  const render = (index) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img || !img.complete || !img.naturalWidth) return;

    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    if (canvas.width !== Math.round(rect.width * dpr)) {
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
    }

    const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    const x = (canvas.width - w) / 2;
    const y = (canvas.height - h) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, x, y, w, h);
  };

  useLayoutEffect(() => {
    if (!loaded) return;

    const state = { frame: 0 };

    const ctx = gsap.context(() => {
      gsap.to(state, {
        frame: totalFrames - 1,
        snap: "frame",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${scrollLength}`,
          scrub: 0.5,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;

            textRefs.current.forEach((el, i) => {
              if (!el) return;
              const seg = captionList[i];
              if (!seg) return;

              // ---------- LEGACY: identical to your original behaviour ----------
              if (legacy) {
                const o = p < 0.2 ? 1 : Math.max(0, 1 - (p - 0.2) / 0.15);
                el.style.opacity = o;
                el.style.transform = `translateY(${(1 - o) * 30}px)`;
                return;
              }

              // ---------- MULTI-SEGMENT ----------
              const { start, end } = seg;
              const fade = 0.07;

              const pos = seg.position || "bottom-left";
              let dx = 0;
              let dy = 30;
              if (pos === "bottom-right" || pos === "mid-right" || pos === "top-right") {
                dx = 60;
                dy = 0;
              } else if (pos === "mid-left" || pos === "top-left") {
                dx = -60;
                dy = 0;
              } else if (pos === "center" || pos === "bottom-center") {
                dx = 0;
                dy = 24;
              }

              let opacity = 0;
              let ox = dx;
              let oy = dy;

              if (p >= start && p <= end) {
                opacity = 1;
                ox = 0;
                oy = 0;
              } else if (p >= start - fade && p < start) {
                const t = (p - (start - fade)) / fade;
                opacity = t;
                ox = (1 - t) * dx;
                oy = (1 - t) * dy;
              } else if (p > end && p <= end + fade) {
                const t = 1 - (p - end) / fade;
                opacity = t;
                ox = (1 - t) * -dx;
                oy = (1 - t) * -dy;
              }

              el.style.opacity = opacity;
              el.style.transform = `translate3d(${ox}px, ${oy}px, 0)`;
              el.style.pointerEvents = opacity > 0.05 ? "auto" : "none";
            });
          },
        },
        onUpdate: () => render(state.frame),
      });

      render(0);

      // intro animation for the first caption
      if (textRefs.current[0]) {
        const targets = legacy
          ? textRefs.current[0].children
          : textRefs.current[0].querySelectorAll("[data-reveal]");
        gsap.from(targets, {
          y: 40,
          opacity: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          delay: 0.1,
        });
      }
    }, sectionRef);

    const onResize = () => render(Math.round(state.frame));
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, totalFrames, scrollLength, captionKey]);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      <canvas ref={canvasRef} className="block h-full w-full" />

      {/* soft gradient only at the bottom, so the video stays clear */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {captionList.map((seg, i) => {
        // ---------- LEGACY markup: your original, untouched ----------
        if (legacy) {
          return (
            <div
              key={i}
              className="pointer-events-none absolute inset-x-0 bottom-0 px-6 pb-14 md:px-16 md:pb-20"
            >
              <div
                ref={(el) => (textRefs.current[i] = el)}
                className="max-w-xl will-change-transform"
              >
                {seg.eyebrow && (
                  <p className="mb-3 text-xs uppercase tracking-[0.4em] text-amber-300">
                    {seg.eyebrow}
                  </p>
                )}
                <h2 className="mb-4 text-4xl font-semibold leading-tight drop-shadow-lg md:text-6xl">
                  {seg.title}
                </h2>
                {seg.text && (
                  <p className="mb-6 text-sm leading-relaxed text-white/85 drop-shadow md:text-base">
                    {seg.text}
                  </p>
                )}
                {seg.cta && (
                  <Link
                    to={seg.cta.href || "/"}
                    className="pointer-events-auto inline-block rounded-full bg-amber-300 px-7 py-3 text-xs font-semibold uppercase tracking-widest text-black transition hover:bg-amber-200"
                  >
                    {seg.cta.label}
                  </Link>
                )}
              </div>
            </div>
          );
        }

        // ---------- MULTI-SEGMENT markup ----------
        const posClass = POSITIONS[seg.position || "bottom-left"];
        const isRight =
          seg.position === "bottom-right" ||
          seg.position === "mid-right" ||
          seg.position === "top-right";
        const isCenter =
          seg.position === "center" || seg.position === "bottom-center";

        // ===== VARIANT: "process" (factory / machine style) =====
        if (seg.variant === "process") {
          const stages = captionList.map((s) => s.stage || "");
          return (
            <div
              key={i}
              className={`pointer-events-none absolute ${posClass}`}
            >
              <div
                ref={(el) => (textRefs.current[i] = el)}
                className="w-full max-w-lg will-change-transform"
                style={{ opacity: (seg.start ?? 0) <= 0 ? 1 : 0 }}
              >
                <div
                  className={`bg-black/55 p-5 shadow-2xl backdrop-blur-sm md:p-6 ${
                    isRight
                      ? "border-r-2 border-amber-300"
                      : "border-l-2 border-amber-300"
                  }`}
                >
                  {/* stage tag */}
                  <div
                    data-reveal
                    className={`mb-4 flex items-center justify-between gap-6 font-mono text-[10px] uppercase tracking-[0.3em] ${
                      isRight ? "flex-row-reverse" : ""
                    }`}
                  >
                    <span className="bg-amber-300 px-2 py-1 font-bold text-black">
                      Stage {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-white/50">
                      {seg.stage} · {i + 1}/{captionList.length}
                    </span>
                  </div>

                  {seg.eyebrow && (
                    <p
                      data-reveal
                      className="mb-2 font-mono text-xs uppercase tracking-[0.4em] text-amber-300"
                    >
                      {seg.eyebrow}
                    </p>
                  )}

                  <h2
                    data-reveal
                    className="mb-3 text-3xl font-semibold leading-tight drop-shadow-lg md:text-5xl"
                  >
                    {seg.title}
                  </h2>

                  {seg.text && (
                    <p
                      data-reveal
                      className="mb-4 text-sm leading-relaxed text-white/85 drop-shadow md:text-base"
                    >
                      {seg.text}
                    </p>
                  )}

                  {/* spec readouts with dotted leaders */}
                  {seg.readouts?.length > 0 && (
                    <dl
                      data-reveal
                      className="mb-5 space-y-2 border-y border-white/10 py-3 font-mono text-xs"
                    >
                      {seg.readouts.map((r) => (
                        <div
                          key={r.label}
                          className={`flex items-baseline gap-2 ${
                            isRight ? "flex-row-reverse" : ""
                          }`}
                        >
                          <dt className="uppercase tracking-widest text-white/55">
                            {r.label}
                          </dt>
                          <span className="flex-1 border-b border-dotted border-white/20" />
                          <dd className="font-bold text-amber-300">{r.value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}

                  {/* pipeline tracker: highlights the current stage */}
                  <div
                    data-reveal
                    className={`mb-1 flex items-center ${
                      isRight ? "flex-row-reverse" : ""
                    }`}
                  >
                    {stages.map((label, si) => (
                      <div
                        key={label + si}
                        className={`flex items-center ${
                          si < stages.length - 1 ? "flex-1" : ""
                        } ${isRight ? "flex-row-reverse" : ""}`}
                      >
                        <div className="flex flex-col items-center gap-1.5">
                          <span
                            className={`block h-2.5 w-2.5 rounded-full ${
                              si === i
                                ? "bg-amber-300 ring-4 ring-amber-300/30"
                                : si < i
                                ? "bg-amber-300/60"
                                : "border border-white/30"
                            }`}
                          />
                          <span
                            className={`font-mono text-[9px] uppercase tracking-widest ${
                              si === i ? "text-amber-300" : "text-white/40"
                            }`}
                          >
                            {label}
                          </span>
                        </div>
                        {si < stages.length - 1 && (
                          <span
                            className={`mx-2 mb-4 h-px flex-1 ${
                              si < i ? "bg-amber-300/60" : "bg-white/15"
                            }`}
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  {seg.cta && (
                    <div data-reveal className="mt-5">
                      <Link
                        to={seg.cta.href || "/"}
                        className="pointer-events-auto inline-block bg-amber-300 px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-widest text-black transition hover:bg-amber-200"
                      >
                        {seg.cta.label} →
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        }

        // ===== VARIANT: "tasting" (editorial: no box, meters + notes) =====
        if (seg.variant === "tasting") {
          return (
            <div
              key={i}
              className={`pointer-events-none absolute ${posClass}`}
            >
              <div
                ref={(el) => (textRefs.current[i] = el)}
                className="w-full max-w-xl will-change-transform"
                style={{ opacity: (seg.start ?? 0) <= 0 ? 1 : 0 }}
              >
                {/* soft shadow behind the text instead of a card */}
                <div
                  className={`p-5 md:p-7 ${
                    isRight
                      ? "bg-gradient-to-l from-black/70 via-black/40 to-transparent"
                      : "bg-gradient-to-r from-black/70 via-black/40 to-transparent"
                  }`}
                >
                  {/* chapter label */}
                  <div
                    data-reveal
                    className={`mb-4 flex items-center gap-4 ${
                      isRight ? "flex-row-reverse" : ""
                    }`}
                  >
                    <span className="font-serif text-lg italic text-amber-300">
                      Chapter {ROMAN[i] || i + 1}
                    </span>
                    <span className="h-px w-16 bg-amber-300/60" />
                    {seg.eyebrow && (
                      <span className="text-[10px] uppercase tracking-[0.4em] text-white/60">
                        {seg.eyebrow}
                      </span>
                    )}
                  </div>

                  <h2
                    data-reveal
                    className="mb-4 font-serif text-4xl font-semibold italic leading-[1.05] drop-shadow-lg md:text-6xl"
                  >
                    {seg.title}
                  </h2>

                  {seg.text && (
                    <p
                      data-reveal
                      className="mb-5 max-w-md text-sm leading-relaxed text-white/85 drop-shadow md:text-base"
                    >
                      {seg.text}
                    </p>
                  )}

                  {/* flavor meters */}
                  {seg.meters?.length > 0 && (
                    <div
                      data-reveal
                      className="mb-5 max-w-sm space-y-3"
                    >
                      {seg.meters.map((m) => (
                        <div key={m.label}>
                          <div className="mb-1 flex items-baseline justify-between text-[10px] uppercase tracking-[0.3em]">
                            <span className="text-white/70">{m.label}</span>
                            <span className="font-serif text-sm italic text-amber-300">
                              {m.level}
                            </span>
                          </div>
                          <div className="h-[3px] w-full bg-white/15">
                            <div
                              className={`h-full bg-gradient-to-r from-amber-500 to-amber-200 ${
                                isRight ? "float-right" : ""
                              }`}
                              style={{ width: `${m.level}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* tasting notes line */}
                  {seg.notes?.length > 0 && (
                    <p
                      data-reveal
                      className="mb-5 font-serif text-base italic text-white/80 md:text-lg"
                    >
                      <span className="mr-2 font-sans text-[10px] not-italic uppercase tracking-[0.35em] text-amber-300">
                        Notes
                      </span>
                      {seg.notes.join("  ·  ")}
                    </p>
                  )}

                  {seg.cta && (
                    <div data-reveal>
                      <Link
                        to={seg.cta.href || "/"}
                        className="pointer-events-auto inline-flex items-center gap-3 border-b border-amber-300 pb-1 text-xs font-semibold uppercase tracking-[0.3em] text-amber-300 transition hover:gap-5 hover:text-amber-200"
                      >
                        {seg.cta.label} <span>→</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        }

        // ===== DEFAULT variant: glass card (used in section 1) =====
        return (
          <div
            key={i}
            className={`pointer-events-none absolute ${posClass}`}
          >
            <div
              ref={(el) => (textRefs.current[i] = el)}
              className="w-full max-w-xl will-change-transform"
              style={{ opacity: (seg.start ?? 0) <= 0 ? 1 : 0 }}
            >
              <div className="rounded-3xl border border-white/10 bg-black/35 p-5 shadow-2xl backdrop-blur-md md:p-6">
                {/* step number + rail + counter */}
                <div
                  data-reveal
                  className={`mb-3 flex items-center gap-4 ${
                    isRight ? "flex-row-reverse" : ""
                  }`}
                >
                  <span
                    className="font-serif text-4xl font-bold italic leading-none text-transparent md:text-5xl"
                    style={{ WebkitTextStroke: "1px rgba(252, 211, 77, 0.85)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`h-px flex-1 ${
                      isRight
                        ? "bg-gradient-to-l from-amber-300/70 to-transparent"
                        : "bg-gradient-to-r from-amber-300/70 to-transparent"
                    }`}
                  />
                  <span className="text-[10px] uppercase tracking-[0.35em] text-white/50">
                    {i + 1} / {captionList.length}
                  </span>
                </div>

                {seg.eyebrow && (
                  <p
                    data-reveal
                    className="mb-2 text-xs uppercase tracking-[0.4em] text-amber-300"
                  >
                    {seg.eyebrow}
                  </p>
                )}

                <h2
                  data-reveal
                  className="mb-3 text-3xl font-semibold leading-tight drop-shadow-lg md:text-5xl"
                >
                  {seg.title}
                </h2>

                {seg.text && (
                  <p
                    data-reveal
                    className="mb-4 text-sm leading-relaxed text-white/85 drop-shadow md:text-base"
                  >
                    {seg.text}
                  </p>
                )}

                {/* tags */}
                {seg.tags?.length > 0 && (
                  <div
                    data-reveal
                    className={`mb-4 flex flex-wrap gap-2 ${
                      isRight ? "justify-end" : isCenter ? "justify-center" : ""
                    }`}
                  >
                    {seg.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-amber-300/40 bg-amber-300/10 px-3 py-1 text-[10px] uppercase tracking-widest text-amber-200"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {/* stats */}
                {seg.stats?.length > 0 && (
                  <div
                    data-reveal
                    className="mb-4 grid grid-cols-3 gap-3 border-t border-white/10 pt-4"
                  >
                    {seg.stats.map((s) => (
                      <div key={s.label}>
                        <p className="font-serif text-xl font-bold text-amber-300 md:text-2xl">
                          {s.value}
                        </p>
                        <p className="mt-1 text-[10px] uppercase tracking-widest text-white/50">
                          {s.label}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {seg.cta && (
                  <div data-reveal>
                    <Link
                      to={seg.cta.href || "/"}
                      className="pointer-events-auto inline-block rounded-full bg-amber-300 px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-black transition hover:bg-amber-200"
                    >
                      {seg.cta.label}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {!loaded && (
        <div className="absolute inset-0 grid place-items-center text-white/70">
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.3em]">Loading {progress}%</p>
            <div className="mx-auto mt-4 h-px w-40 bg-white/20">
              <div
                className="h-px bg-amber-300 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}