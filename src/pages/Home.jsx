import React from "react";
import { Link } from "react-router-dom";
import { Coffee, Leaf, Flame, Star, ArrowRight, Check, MapPin } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Aapke purane components
import ScrollFrames from "../components/ScrollFrames";
import Reveal from "../components/Reveal";
import Counter from "../components/Counter";
import Em from "../components/Em";
import TiltCard from "../components/TiltCard";
import Accordion from "../components/Accordion";
import ProcessSteps from "../components/ProcessSteps";

// NAYA CINEMATIC HERO COMPONENT
import HeroCinematic from "../components/HeroCinematic";

gsap.registerPlugin(ScrollTrigger);

const features = [
  { icon: Flame, title: "Roasted weekly", text: "Small batches roasted every Monday so every bag reaches you at peak flavor." },
  { icon: Leaf, title: "Direct trade", text: "We pay growers above fair-trade prices and visit every farm we buy from." },
  { icon: Coffee, title: "Brewed by hand", text: "Every cup is dialed in by a trained barista. No pods, no shortcuts." },
];

const featured = [
  { name: "Flat White", price: "$4.50", desc: "Silky microfoam, ristretto base" },
  { name: "Pour Over", price: "$5.00", desc: "Single origin, rotating weekly" },
  { name: "Cold Brew", price: "$4.75", desc: "18-hour steep, served over ice" },
];

const origins = [
  { country: "Ethiopia", region: "Yirgacheffe", altitude: "1,900 m", notes: ["Jasmine", "Bergamot", "Peach"] },
  { country: "Colombia", region: "Huila", altitude: "1,700 m", notes: ["Caramel", "Red apple", "Cocoa"] },
  { country: "Sumatra", region: "Lintong", altitude: "1,400 m", notes: ["Cedar", "Dark chocolate", "Spice"] },
];

const moments = [
  { src: "/frames/frame_0030.webp", label: "The first pour", span: "md:col-span-2 md:row-span-2" },
  { src: "/frames2/frame_0040.webp", label: "Fresh from the roaster", span: "" },
  { src: "/frames3/frame_0060.webp", label: "Window seat", span: "" },
  { src: "/frames2/frame_0120.webp", label: "Steam & light", span: "" },
  { src: "/frames/frame_0100.webp", label: "Dialed in", span: "" },

];

const reviews = [
  { name: "Amelia R.", text: "The best flat white I've had outside of Melbourne. I come in every morning." },
  { name: "Daniel K.", text: "You can taste the care in every cup. The pour over menu is a quiet adventure." },
  { name: "Sana M.", text: "Cozy, calm and the beans are unreal. My favorite place to read on a Sunday." },
];

const tiers = [
  {
    name: "Sip",
    price: "$14",
    blurb: "For the weekday ritual",
    perks: ["One 250g bag a month", "10% off in the café", "Early access to new roasts"],
    featured: false,
  },
  {
    name: "Savor",
    price: "$26",
    blurb: "Our most loved plan",
    perks: ["Two 250g bags a month", "Free refills on batch brew", "15% off in the café", "Members-only tastings"],
    featured: true,
  },
  {
    name: "Collect",
    price: "$48",
    blurb: "For the true coffee nerd",
    perks: ["Four bags incl. rare lots", "A free drink every Friday", "20% off in the café", "Roastery tour for two"],
    featured: false,
  },
];

const faqs = [
  { q: "Do you offer plant-based milk?", a: "Yes. Oat, almond and soy are always available at no extra charge, and our oat milk is steamed fresh for every drink." },
  { q: "Can I buy beans to take home?", a: "Of course. 250g and 1kg bags of every current roast are on the counter, and we're happy to grind them for your brewer." },
  { q: "Do I need a reservation?", a: "Walk-ins are always welcome. For groups of six or more, send us a note on the Visit page and we'll set a table aside." },
  { q: "Is the café laptop friendly?", a: "Yes. Fast Wi-Fi and plenty of outlets. We keep the long tables by the window quiet for working." },
  { q: "Do you run coffee classes?", a: "Every second Saturday we hold a small cupping and brewing workshop. Spots are limited, so book early." },
];

const marqueeWords = ["Espresso", "Pour Over", "Cold Brew", "Cortado", "Flat White", "Mocha", "Single Origin"];

function SectionTitle({ eyebrow, children, center = true }) {
  return (
    <Reveal className={`mb-16 ${center ? "text-center" : ""}`}>
      <p className="mb-4 text-sm uppercase tracking-[0.35em] text-amber-300">{eyebrow}</p>
      <h2 className="text-4xl font-semibold leading-tight md:text-6xl">{children}</h2>
    </Reveal>
  );
}

export default function Home() {
  return (
    <>
      <HeroCinematic />

      {/* 1 — VIDEO (multi-caption, enhanced design) */}
      <ScrollFrames
        folder="/frames"
        totalFrames={150}
        scrollLength={6000}
        segments={[
          {
            eyebrow: "Our Signature",
            title: (
              <>
                The <Em>perfect</Em> pour.
              </>
            ),
            text: (
              <>
                Every great cup starts with a ritual. We dose, level and pull each
                shot by the clock, because{" "}
                <Em tone="white">consistency is craft</Em>, not luck.
              </>
            ),
            tags: ["Ristretto base", "Single origin", "Small batch"],
            stats: [
              { value: "18g", label: "Dose in" },
              { value: "36g", label: "Yield out" },
              { value: "28s", label: "Pull time" },
            ],
            cta: { label: "Explore the menu", href: "/menu" },
            start: 0.0,
            end: 0.28,
            position: "bottom-left",
          },
          {
            eyebrow: "The Grind",
            title: (
              <>
                Ground to <Em>order</Em>.
              </>
            ),
            text: (
              <>
                Beans are ground seconds before extraction so the aromatics stay
                locked in. Every shot is weighed, tamped and pulled by a{" "}
                <Em tone="white">trained barista</Em>.
              </>
            ),
            tags: ["Weighed", "Tamped", "Hand-pulled"],
            stats: [
              { value: "0s", label: "Pre-ground" },
              { value: "93°", label: "Water temp" },
              { value: "9 bar", label: "Pressure" },
            ],
            start: 0.42,
            end: 0.68,
            position: "mid-right",
          },
          {
            eyebrow: "The Cup",
            title: (
              <>
                Served with <Em>intention</Em>.
              </>
            ),
            text: (
              <>
                Silky microfoam, a warm cup and a moment that's{" "}
                <Em tone="white">entirely yours</Em>. Slow down, take a sip, and let
                the morning unfold.
              </>
            ),
            tags: ["Microfoam", "Pre-warmed cup", "Made by hand"],
            stats: [
              { value: "4.9", label: "Avg. rating" },
              { value: "8k+", label: "Cups a month" },
              { value: "6 yrs", label: "Roasting" },
            ],
            cta: { label: "See our story", href: "/story" },
            start: 0.8,
            end: 1.0,
            position: "bottom-left",
          },
        ]}
      />

      {/* 2 — PLAIN: welcome, features, stats */}
      <section className="relative overflow-hidden bg-neutral-950 px-6 py-32 md:px-12">
        <div className="floaty pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-amber-300/10 blur-3xl" />
        <div
          className="floaty pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl"
          style={{ animationDelay: "3s" }}
        />

        <div className="relative mx-auto max-w-6xl">
          <Reveal className="mx-auto mb-20 max-w-3xl text-center">
            <p className="mb-4 text-sm uppercase tracking-[0.35em] text-amber-300">Welcome</p>
            <h2 className="text-4xl font-semibold leading-tight md:text-6xl">
              A coffee house for <Em>slow mornings</Em>.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-white/70">
              Ember &amp; Oak began as a tiny roaster with a single drum and a big idea: great coffee
              should feel <Em tone="white">personal</Em>. Today we still roast every batch ourselves,
              and we still know the <Em tone="white">name of the farmer</Em> behind every bean.
            </p>
          </Reveal>

          <Reveal stagger={0.15} className="grid gap-6 md:grid-cols-3">
            {features.map(({ icon: Icon, title, text }) => (
              <TiltCard
                key={title}
                className="group rounded-3xl border border-white/10 bg-neutral-900/60 p-8 transition-colors duration-300 hover:border-amber-300/50"
              >
                <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-amber-300/10 text-amber-300 transition group-hover:bg-amber-300 group-hover:text-black">
                  <Icon size={26} />
                </div>
                <h3 className="mb-3 text-2xl font-semibold">{title}</h3>
                <p className="leading-relaxed text-white/60">{text}</p>
              </TiltCard>
            ))}
          </Reveal>

          <Reveal stagger={0.15} className="mt-24 grid grid-cols-2 gap-10 md:grid-cols-4">
            <Counter to={12} suffix="+" label="Origins" />
            <Counter to={8000} suffix="+" label="Cups a month" />
            <Counter to={6} label="Years roasting" />
            <Counter to={4.9} label="Avg. rating" />
          </Reveal>
        </div>
      </section>

      {/* 3 — PLAIN: process */}
      <section className="bg-neutral-900 px-6 py-32 md:px-12">
        <div className="mx-auto max-w-6xl">
          <SectionTitle eyebrow="From farm to cup">
            Four steps to a <Em>better</Em> cup.
          </SectionTitle>
          <ProcessSteps />
        </div>
      </section>

      {/* marquee strip */}
      <div className="overflow-hidden border-y border-white/10 bg-amber-300 py-5 text-black">
        <div className="marquee flex w-max gap-12 whitespace-nowrap font-serif text-3xl">
          {[...marqueeWords, ...marqueeWords, ...marqueeWords, ...marqueeWords].map((w, i) => (
            <span key={i} className="flex items-center gap-12">
              <span className={i % 2 ? "font-bold italic" : ""}>{w}</span> <span>✦</span>
            </span>
          ))}
        </div>
      </div>

           {/* 4 — VIDEO (factory process, 3 captions) */}
      <ScrollFrames
        folder="/frames2"
        totalFrames={159}
        scrollLength={9000}
        segments={[
          {
            variant: "process",
            stage: "Hopper",
            eyebrow: "Single Origin",
            title: (
              <>
                Beans with a <Em>birthplace</Em>.
              </>
            ),
            text: (
              <>
                Every lot starts in a sealed hopper, labelled with its{" "}
                <Em tone="white">farm name</Em>. Beans are released gently and
                evenly, so nothing is bruised before it reaches the line.
              </>
            ),
            readouts: [
              { label: "Origin", value: "Ethiopia · Colombia · Sumatra" },
              { label: "Hopper load", value: "60 kg" },
              { label: "Feed", value: "Gravity-fed" },
            ],
            start: 0.0,
            end: 0.28,
            position: "mid-left",
          },
          {
            variant: "process",
            stage: "Machine",
            eyebrow: "Sorted & Weighed",
            title: (
              <>
                Checked <Em>bean by bean</Em>.
              </>
            ),
            text: (
              <>
                Inside the machine, every bean is sorted by size and colour, and
                each batch is weighed to the gram. Only the{" "}
                <Em tone="white">best beans</Em> move on.
              </>
            ),
            readouts: [
              { label: "Optical sorting", value: "99.9%" },
              { label: "Weight accuracy", value: "±1 g" },
              { label: "Quality checks", value: "3 per batch" },
            ],
            start: 0.36,
            end: 0.64,
            position: "mid-right",
          },
          {
            variant: "process",
            stage: "Pack",
            eyebrow: "Sealed Fresh",
            title: (
              <>
                Packed at <Em>peak flavor</Em>.
              </>
            ),
            text: (
              <>
                Beans drop straight into one-way valve bags, flushed with
                nitrogen and sealed within minutes. Your bag ships within{" "}
                <Em tone="white">48 hours</Em> of roasting.
              </>
            ),
            readouts: [
              { label: "Bag sizes", value: "250 g · 1 kg" },
              { label: "Oxygen in bag", value: "< 1%" },
              { label: "Ships within", value: "48 hrs" },
            ],
            cta: { label: "Read our story", href: "/story" },
            start: 0.72,
            end: 1.0,
            position: "mid-left",
          },
        ]}
      />

      {/* 5 — PLAIN: featured drinks + origins */}
      <section className="bg-neutral-900 px-6 py-32 md:px-12">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="mb-4 text-sm uppercase tracking-[0.35em] text-amber-300">Favorites</p>
              <h2 className="text-4xl font-semibold md:text-6xl">
                Pour something <Em>good</Em>.
              </h2>
            </div>
            <Link
              to="/menu"
              className="group flex items-center gap-2 text-sm uppercase tracking-widest text-amber-300"
            >
              Full menu
              <ArrowRight size={16} className="transition group-hover:translate-x-1" />
            </Link>
          </Reveal>

          <Reveal stagger={0.12} className="grid gap-6 md:grid-cols-3">
            {featured.map((f) => (
              <TiltCard
                key={f.name}
                className="rounded-3xl border border-white/10 bg-neutral-950/70 p-8 transition-colors duration-300 hover:border-amber-300/50"
              >
                <div className="mb-8 flex items-start justify-between">
                  <h3 className="text-3xl font-semibold">{f.name}</h3>
                  <span className="text-amber-300">{f.price}</span>
                </div>
                <p className="text-white/60">{f.desc}</p>
              </TiltCard>
            ))}
          </Reveal>

          <div className="mt-32">
            <SectionTitle eyebrow="This season's origins">
              Taste the <Em>map</Em>.
            </SectionTitle>

            <Reveal stagger={0.15} className="grid gap-6 md:grid-cols-3">
              {origins.map((o) => (
                <TiltCard
                  key={o.country}
                  className="group overflow-hidden rounded-3xl border border-white/10 bg-neutral-950/70 p-8 transition-colors duration-300 hover:border-amber-300/50"
                >
                  <div className="mb-6 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-amber-300">
                    <MapPin size={14} /> {o.region}
                  </div>
                  <h3 className="mb-1 text-4xl font-semibold">
                    <Em tone="white" className="transition group-hover:text-amber-300">
                      {o.country}
                    </Em>
                  </h3>
                  <p className="mb-6 text-sm text-white/50">Grown at {o.altitude}</p>
                  <div className="flex flex-wrap gap-2">
                    {o.notes.map((n) => (
                      <span
                        key={n}
                        className="rounded-full border border-white/15 px-4 py-1.5 text-xs uppercase tracking-widest text-white/70 transition group-hover:border-amber-300/60 group-hover:text-amber-300"
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                </TiltCard>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* 6 — PLAIN: moments gallery */}
      <section className="bg-neutral-950 px-6 py-32 md:px-12">
        <div className="mx-auto max-w-6xl">
          <SectionTitle eyebrow="Moments">
            Small <Em>rituals</Em>, big flavor.
          </SectionTitle>

          <Reveal stagger={0.1} className="grid auto-rows-[220px] gap-4 md:grid-cols-4">
            {moments.map((m) => (
              <div
                key={m.src}
                className={`group relative overflow-hidden rounded-3xl border border-white/10 ${m.span}`}
              >
                <img
                  src={m.src}
                  alt={m.label}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70 transition group-hover:opacity-100" />
                <p className="absolute bottom-5 left-6 translate-y-2 font-serif text-2xl font-bold italic opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  {m.label}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* 7 — PLAIN: big quote + reviews */}
      <section className="relative overflow-hidden bg-neutral-900 px-6 py-32 md:px-12">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mx-auto mb-28 max-w-4xl text-center">
            <p className="font-serif text-4xl leading-snug md:text-6xl">
              “Good coffee is a <Em>conversation</Em> between the <Em tone="white">farmer</Em>, the{" "}
              <Em tone="white">roaster</Em> and <Em>you</Em>.”
            </p>
            <p className="mt-8 text-sm uppercase tracking-[0.35em] text-white/50">
              — The Ember &amp; Oak team
            </p>
          </Reveal>

          <Reveal>
            <p className="mb-10 text-center text-sm uppercase tracking-[0.35em] text-amber-300">
              Kind words
            </p>
          </Reveal>
          <Reveal stagger={0.15} className="grid gap-6 md:grid-cols-3">
            {reviews.map((r) => (
              <TiltCard
                key={r.name}
                className="rounded-3xl border border-white/10 bg-neutral-950/70 p-8"
              >
                <div className="mb-4 flex gap-1 text-amber-300">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <blockquote className="mb-6 leading-relaxed text-white/80">“{r.text}”</blockquote>
                <p className="text-sm uppercase tracking-widest text-white/50">{r.name}</p>
              </TiltCard>
            ))}
          </Reveal>
        </div>
      </section>

           {/* 8 — VIDEO (bean close-up → machine pour, 3 captions) */}
      <ScrollFrames
        folder="/frames3"
        totalFrames={144}
        scrollLength={9000}
        segments={[
          {
            variant: "tasting",
            eyebrow: "The Bean",
            title: (
              <>
                Every cup begins with <Em>one bean</Em>.
              </>
            ),
            text: (
              <>
                Look closely. Oils, ridges and a deep roast colour: this is where{" "}
                <Em tone="white">all the flavor</Em> is hiding, waiting for the
                right grind and the right water.
              </>
            ),
            meters: [
              { label: "Aroma", level: 92 },
              { label: "Body", level: 70 },
              { label: "Sweetness", level: 64 },
            ],
            notes: ["Dark chocolate", "Toasted almond", "Orange peel"],
            start: 0.0,
            end: 0.3,
            position: "mid-left",
          },
          {
            variant: "tasting",
            eyebrow: "The Brew",
            title: (
              <>
                Pressure, heat and <Em>patience</Em>.
              </>
            ),
            text: (
              <>
                Hot water meets freshly ground coffee at exactly the right
                moment. A steady flow, a rich crema and{" "}
                <Em tone="white">nothing rushed</Em>.
              </>
            ),
            meters: [
              { label: "Crema", level: 85 },
              { label: "Strength", level: 78 },
              { label: "Balance", level: 90 },
            ],
            notes: ["Caramel", "Cocoa", "Warm spice"],
            start: 0.4,
            end: 0.66,
            position: "mid-right",
          },
          {
            variant: "tasting",
            eyebrow: "The Ritual",
            title: (
              <>
                Slow down. <Em>Sip slower.</Em>
              </>
            ),
            text: (
              <>
                Coffee isn't fuel here. It's a <Em tone="white">pause</Em>. Sit
                by the window, order a flat white, and let the morning{" "}
                <Em tone="white">take its time</Em>.
              </>
            ),
            meters: [
              { label: "Smoothness", level: 95 },
              { label: "Sweetness", level: 72 },
              { label: "Finish", level: 88 },
            ],
            notes: ["Silky", "Warm", "Lingering"],
            cta: { label: "Plan your visit", href: "/visit" },
            start: 0.74,
            end: 1.0,
            position: "bottom-left",
          },
        ]}
      />

      {/* 9 — PLAIN: membership */}
      <section className="bg-neutral-950 px-6 py-32 md:px-12">
        <div className="mx-auto max-w-6xl">
          <SectionTitle eyebrow="The Coffee Club">
            Fresh beans, <Em>delivered</Em>.
          </SectionTitle>

          <Reveal stagger={0.15} className="grid items-stretch gap-6 md:grid-cols-3">
            {tiers.map((t) => (
              <TiltCard
                key={t.name}
                max={6}
                className={`flex flex-col rounded-3xl p-8 ${
                  t.featured
                    ? "glow-border bg-neutral-900 md:-translate-y-4"
                    : "border border-white/10 bg-neutral-900/60"
                }`}
              >
                {t.featured && (
                  <span className="mb-4 self-start rounded-full bg-amber-300 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-black">
                    Most loved
                  </span>
                )}
                <h3 className="text-4xl font-semibold">
                  <Em tone={t.featured ? "gold" : "white"}>{t.name}</Em>
                </h3>
                <p className="mt-1 text-sm text-white/50">{t.blurb}</p>
                <p className="my-6 font-serif text-6xl">
                  {t.price}
                  <span className="font-sans text-sm text-white/50"> / month</span>
                </p>
                <ul className="mb-8 flex-1 space-y-3">
                  {t.perks.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-white/70">
                      <Check size={18} className="mt-0.5 shrink-0 text-amber-300" />
                      {p}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/visit"
                  className={`rounded-full py-3 text-center text-xs font-semibold uppercase tracking-widest transition ${
                    t.featured
                      ? "bg-amber-300 text-black hover:bg-amber-200"
                      : "border border-white/20 hover:border-amber-300 hover:text-amber-300"
                  }`}
                >
                  Join {t.name}
                </Link>
              </TiltCard>
            ))}
          </Reveal>
        </div>
      </section>

      {/* 10 — PLAIN: FAQ */}
      <section className="bg-neutral-900 px-6 py-32 md:px-12">
        <div className="mx-auto max-w-3xl">
          <SectionTitle eyebrow="Good to know">
            Questions, <Em>answered</Em>.
          </SectionTitle>
          <Reveal>
            <Accordion items={faqs} />
          </Reveal>
        </div>
      </section>

      {/* 11 — PLAIN: closing CTA */}
      <section className="relative overflow-hidden bg-neutral-950 px-6 py-32 md:px-12">
        <div className="floaty pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-amber-300/10 blur-3xl" />
        <Reveal className="relative mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-amber-300">See you soon</p>
          <h2 className="text-4xl font-semibold leading-tight md:text-6xl">
            Your table is <Em>waiting</Em>.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/70">
            Drop by for a cup, or join our list for <Em tone="white">new roasts</Em>, events and the
            occasional <Em tone="white">free espresso</Em>.
          </p>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              placeholder="you@email.com"
              className="flex-1 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm outline-none transition focus:border-amber-300"
            />
            <button className="rounded-full bg-amber-300 px-8 py-3 text-sm font-semibold uppercase tracking-widest text-black transition hover:bg-amber-200">
              Join
            </button>
          </form>

          <div className="mt-10 flex justify-center gap-4">
            <Link
              to="/menu"
              className="rounded-full border border-white/20 px-6 py-3 text-xs uppercase tracking-widest transition hover:border-amber-300 hover:text-amber-300"
            >
              View menu
            </Link>
            <Link
              to="/visit"
              className="rounded-full border border-white/20 px-6 py-3 text-xs uppercase tracking-widest transition hover:border-amber-300 hover:text-amber-300"
            >
              Find us
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}