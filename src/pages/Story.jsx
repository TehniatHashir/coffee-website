import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Recycle, Sprout, HeartHandshake, Zap } from "lucide-react";
import PageHero from "../components/PageHero";
import Em from "../components/Em";
import Reveal from "../components/Reveal";
import Counter from "../components/Counter";
import TiltCard from "../components/TiltCard";

gsap.registerPlugin(ScrollTrigger);

/* ---------------- data ---------------- */

const timeline = [
  { year: "2020", title: "One drum, one garage", text: "We roasted our first 5kg batch for friends and neighbors." },
  { year: "2021", title: "The first counter", text: "A tiny window on Roastery Lane opened and the queue never stopped." },
  { year: "2023", title: "Direct trade", text: "We flew to Ethiopia and Colombia and signed our first grower partnerships." },
  { year: "2024", title: "A bigger roaster", text: "A 15kg drum arrived, and with it our weekly roast schedule." },
  { year: "2025", title: "The café", text: "Ember & Oak became a full café with seating, a bar and a bigger roaster." },
];

const values = [
  { title: "Craft over speed", text: "We'd rather serve a perfect cup in five minutes than a good one in one." },
  { title: "Know the source", text: "Every bag carries the farm, the altitude and the harvest date." },
  { title: "Make room for people", text: "A café should feel like a living room. Stay as long as you like." },
];

const team = [
  { name: "Mariam Qureshi", role: "Head roaster", quote: "I listen for the first crack before I ever look at the clock." },
  { name: "Daniel Park", role: "Head barista", quote: "A great espresso is just patience with good timing." },
  { name: "Sofia Reyes", role: "Green coffee buyer", quote: "Every bean has a person behind it. I like to meet them." },
  { name: "Omar Haddad", role: "Café manager", quote: "If you leave slower than you arrived, we've done our job." },
];

const farms = [
  { farm: "Finca La Esperanza", place: "Huila, Colombia", person: "Carlos Mendoza", since: "2023", text: "Third-generation growers who dry their coffee on raised beds in the mountain sun." },
  { farm: "Kebede Cooperative", place: "Yirgacheffe, Ethiopia", person: "Tigist Bekele", since: "2023", text: "A cooperative of 300 smallholders, known for floral, tea-like washed lots." },
  { farm: "Lintong Highlands", place: "Sumatra, Indonesia", person: "Ibu Sari", since: "2024", text: "Wet-hulled coffee from the shores of Lake Toba with deep, earthy sweetness." },
];

const pledges = [
  { icon: HeartHandshake, label: "Beans bought direct from growers", value: 92 },
  { icon: Recycle, label: "Cups and packaging compostable", value: 100 },
  { icon: Sprout, label: "Coffee waste turned into compost", value: 85 },
  { icon: Zap, label: "Roastery powered by renewables", value: 70 },
];

/* ---------------- small pieces ---------------- */

function SectionTitle({ eyebrow, children }) {
  return (
    <Reveal className="mb-16 text-center">
      <p className="mb-4 text-sm uppercase tracking-[0.35em] text-amber-300">{eyebrow}</p>
      <h2 className="text-4xl font-semibold leading-tight md:text-6xl">{children}</h2>
    </Reveal>
  );
}

function Timeline() {
  const wrapRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: "top center",
          ease: "none",
          scrollTrigger: {
            trigger: wrapRef.current,
            start: "top 70%",
            end: "bottom 65%",
            scrub: true,
          },
        }
      );
    }, wrapRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapRef} className="relative">
      <div className="absolute bottom-0 left-[1.05rem] top-0 w-px bg-white/10 md:left-1/2">
        <div ref={lineRef} className="h-full w-px bg-amber-300" />
      </div>

      {timeline.map((t, i) => {
        const right = i % 2 === 1;
        return (
          <Reveal
            key={t.year}
            direction={right ? "right" : "left"}
            className={`relative mb-14 pl-12 last:mb-0 md:w-1/2 md:pl-0 ${
              right ? "md:ml-auto md:pl-14" : "md:pr-14 md:text-right"
            }`}
          >
            <span
              className={`absolute top-2 h-4 w-4 rounded-full border-2 border-amber-300 bg-neutral-900 left-[0.55rem] ${
                right ? "md:left-[-0.5rem]" : "md:left-auto md:right-[-0.5rem]"
              }`}
            />
            <p className="font-serif text-4xl font-bold italic text-amber-300">{t.year}</p>
            <h3 className="mt-1 text-2xl font-semibold">{t.title}</h3>
            <p className="mt-2 text-white/60">{t.text}</p>
          </Reveal>
        );
      })}
    </div>
  );
}

// Static: always visible, no scroll animation
function Pledge({ icon: Icon, label, value }) {
  return (
    <div className="group rounded-3xl border border-white/10 bg-neutral-900/60 p-8 transition-[translate,border-color] duration-300 hover:-translate-y-2 hover:border-amber-300/50">
      <div className="mb-6 flex items-center justify-between">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-300/10 text-amber-300 transition group-hover:bg-amber-300 group-hover:text-black">
          <Icon size={22} />
        </div>
        <p className="font-serif text-5xl text-amber-300">
          {value}
          <span className="text-2xl">%</span>
        </p>
      </div>
      <p className="mb-5 text-lg text-white/80">{label}</p>
      <div className="h-1.5 w-full rounded-full bg-white/10">
        <div className="h-1.5 rounded-full bg-amber-300" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

/* ---------------- page ---------------- */

export default function Story() {
  return (
    <>
      <PageHero
        eyebrow="Our Story"
        title={
          <>
            Roasted with <Em>patience</Em>.
          </>
        }
        subtitle="From one small drum to a café the neighborhood calls home."
        image="/frames2/frame_0001.webp"
      />

      {/* intro */}
      <section className="bg-neutral-950 px-6 py-28 md:px-12">
        <div className="mx-auto grid max-w-6xl items-center gap-16 md:grid-cols-2">
          <Reveal direction="left">
            <p className="mb-4 text-sm uppercase tracking-[0.35em] text-amber-300">Who we are</p>
            <h2 className="text-4xl font-semibold leading-tight md:text-5xl">
              Coffee is a <Em>conversation</Em>.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-white/70">
              We started Ember &amp; Oak because we wanted a place that took coffee{" "}
              <Em tone="white">seriously</Em> without taking itself too seriously. We roast in small
              batches, buy directly from growers, and train every barista ourselves.
            </p>
            <p className="mt-5 text-lg leading-relaxed text-white/70">
              The result is a cup that tastes like <Em tone="white">where it came from</Em>, served by
              people who care that you enjoy it.
            </p>
          </Reveal>

          {/* two overlapping images: positioning on plain divs, TiltCard fills them */}
          <div className="relative mx-auto h-[420px] w-full max-w-[520px] md:h-[520px]">
            <div className="floaty pointer-events-none absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300/20 blur-3xl" />

            {/* image 1: top left, behind */}
            <div className="absolute left-0 top-0 z-0 h-[250px] w-[62%] md:h-[310px]">
              <TiltCard className="h-full w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
                <img
                  src="/frames2/frame_0060.webp"
                  alt="Roasting"
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </TiltCard>
            </div>

            {/* image 2: bottom right, overlapping image 1, in front */}
            <div className="absolute bottom-0 right-0 z-10 h-[220px] w-[56%] md:h-[290px]">
              <TiltCard className="h-full w-full overflow-hidden rounded-3xl border-4 border-neutral-950 shadow-[0_25px_60px_-10px_rgba(0,0,0,0.8)]">
                <img
                  src="/frames/frame_0070.webp"
                  alt="Pouring"
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </TiltCard>
            </div>
          </div>
        </div>
      </section>

      {/* stats band */}
      <section className="border-y border-white/10 bg-neutral-900 px-6 py-20 md:px-12">
        <Reveal stagger={0.15} className="mx-auto grid max-w-6xl grid-cols-2 gap-10 md:grid-cols-4">
          <Counter to={12} suffix="+" label="Partner farms" />
          <Counter to={3} label="Countries" />
          <Counter to={9} label="Baristas" />
          <Counter to={52} label="Roasts a year" />
        </Reveal>
      </section>

      {/* timeline */}
      <section className="bg-neutral-950 px-6 py-28 md:px-12">
        <div className="mx-auto max-w-4xl">
          <SectionTitle eyebrow="Timeline">
            How we <Em>got</Em> here.
          </SectionTitle>
          <Timeline />
        </div>
      </section>

      {/* values */}
      <section className="bg-neutral-900 px-6 py-28 md:px-12">
        <div className="mx-auto max-w-6xl">
          <SectionTitle eyebrow="What we believe">
            Our <Em>values</Em>.
          </SectionTitle>
          <Reveal stagger={0.15} className="grid gap-6 md:grid-cols-3">
            {values.map((v, i) => (
              <TiltCard
                key={v.title}
                className="rounded-3xl border border-white/10 bg-neutral-950/70 p-8 transition-colors duration-300 hover:border-amber-300/50"
              >
                <p className="mb-6 font-serif text-5xl font-bold italic text-amber-300/40">0{i + 1}</p>
                <h3 className="mb-3 text-2xl font-semibold">{v.title}</h3>
                <p className="leading-relaxed text-white/60">{v.text}</p>
              </TiltCard>
            ))}
          </Reveal>
        </div>
      </section>

      {/* team */}
      <section className="bg-neutral-950 px-6 py-28 md:px-12">
        <div className="mx-auto max-w-6xl">
          <SectionTitle eyebrow="The people">
            Meet the <Em>team</Em>.
          </SectionTitle>
          <Reveal stagger={0.12} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((p) => (
              <TiltCard
                key={p.name}
                className="group rounded-3xl border border-white/10 bg-neutral-900/60 p-7 text-center transition-colors duration-300 hover:border-amber-300/50"
              >
                <div className="mx-auto mb-6 grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-amber-300 to-amber-600 font-serif text-4xl font-bold italic text-black transition-transform duration-500 group-hover:rotate-6 group-hover:scale-105">
                  {p.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")}
                </div>
                <h3 className="text-2xl font-semibold">{p.name}</h3>
                <p className="mb-5 mt-1 text-xs uppercase tracking-[0.25em] text-amber-300">{p.role}</p>
                <p className="font-serif text-lg italic leading-snug text-white/65">“{p.quote}”</p>
              </TiltCard>
            ))}
          </Reveal>
        </div>
      </section>

      {/* partner farms */}
      <section className="bg-neutral-900 px-6 py-28 md:px-12">
        <div className="mx-auto max-w-6xl">
          <SectionTitle eyebrow="Where it grows">
            Our <Em>partner</Em> farms.
          </SectionTitle>
          <Reveal stagger={0.15} className="grid gap-6 md:grid-cols-3">
            {farms.map((f) => (
              <TiltCard
                key={f.farm}
                className="rounded-3xl border border-white/10 bg-neutral-950/70 p-8 transition-colors duration-300 hover:border-amber-300/50"
              >
                <p className="mb-3 text-xs uppercase tracking-[0.3em] text-amber-300">{f.place}</p>
                <h3 className="mb-4 text-3xl font-semibold leading-tight">{f.farm}</h3>
                <p className="mb-6 leading-relaxed text-white/60">{f.text}</p>
                <div className="flex items-center justify-between border-t border-white/10 pt-5 text-sm text-white/60">
                  <span>
                    Grower <Em tone="white">{f.person}</Em>
                  </span>
                  <span>Since {f.since}</span>
                </div>
              </TiltCard>
            ))}
          </Reveal>
        </div>
      </section>

      {/* sustainability: plain grid, always visible */}
      <section className="bg-neutral-950 px-6 py-28 md:px-12">
        <div className="mx-auto max-w-6xl">
          <SectionTitle eyebrow="Our promise">
            Good coffee, <Em>kind</Em> footprint.
          </SectionTitle>
          <div className="grid gap-6 md:grid-cols-2">
            {pledges.map((p) => (
              <Pledge key={p.label} {...p} />
            ))}
          </div>
        </div>
      </section>

      {/* big quote + cta */}
      <section className="relative overflow-hidden bg-neutral-900 px-6 py-32 md:px-12">
        <div className="floaty pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-amber-300/10 blur-3xl" />
        <Reveal className="relative mx-auto max-w-4xl text-center">
          <p className="font-serif text-4xl leading-snug md:text-6xl">
            “We don't rush the <Em>roast</Em>, and we don't rush <Em tone="white">you</Em>.”
          </p>
          <p className="mt-8 text-sm uppercase tracking-[0.35em] text-white/50">
            — The Ember &amp; Oak team
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link
              to="/menu"
              className="rounded-full bg-amber-300 px-8 py-3 text-xs font-semibold uppercase tracking-widest text-black transition hover:bg-amber-200"
            >
              See the menu
            </Link>
            <Link
              to="/visit"
              className="rounded-full border border-white/20 px-8 py-3 text-xs uppercase tracking-widest transition hover:border-amber-300 hover:text-amber-300"
            >
              Visit us
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}