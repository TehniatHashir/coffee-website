import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Flame,
  Snowflake,
  Sparkles,
  Droplets,
  Coffee,
  Timer,
  Thermometer,
  Scale,
  Minus,
  Plus,
} from "lucide-react";
import PageHero from "../components/PageHero";
import Em from "../components/Em";

/* ---------------- data ---------------- */

const signatures = [
  {
    name: "The Ember Flat White",
    price: "$5.00",
    badge: "Best seller",
    icon: Flame,
    desc: "Double ristretto, silky microfoam and a hint of toasted caramel.",
  },
  {
    name: "Maple Oak Latte",
    price: "$5.75",
    badge: "Seasonal",
    icon: Sparkles,
    desc: "Espresso, steamed oat milk, real maple syrup and a pinch of sea salt.",
  },
  {
    name: "Orange Espresso Tonic",
    price: "$5.25",
    badge: "Refreshing",
    icon: Snowflake,
    desc: "Bright espresso over tonic and ice, finished with orange peel.",
  },
];

const items = [
  { cat: "Espresso", name: "Espresso", price: "$3.00", desc: "Double shot, house blend" },
  { cat: "Espresso", name: "Cortado", price: "$4.25", desc: "Equal parts espresso and milk" },
  { cat: "Espresso", name: "Flat White", price: "$4.50", desc: "Silky microfoam, ristretto base" },
  { cat: "Espresso", name: "Cappuccino", price: "$4.50", desc: "Thick foam, dusted with cocoa" },
  { cat: "Espresso", name: "Mocha", price: "$5.25", desc: "70% dark chocolate, oat milk" },
  { cat: "Filter", name: "Pour Over", price: "$5.00", desc: "Single origin, rotating weekly" },
  { cat: "Filter", name: "Batch Brew", price: "$3.50", desc: "Today's roast, refills welcome" },
  { cat: "Filter", name: "Aeropress", price: "$5.25", desc: "Clean, bright, full-bodied" },
  { cat: "Cold", name: "Cold Brew", price: "$4.75", desc: "18-hour steep, served over ice" },
  { cat: "Cold", name: "Iced Latte", price: "$4.75", desc: "Espresso, cold milk, ice" },
  { cat: "Cold", name: "Espresso Tonic", price: "$5.25", desc: "Tonic, espresso, orange peel" },
  { cat: "Bites", name: "Butter Croissant", price: "$3.75", desc: "Baked every morning" },
  { cat: "Bites", name: "Almond Cake", price: "$4.25", desc: "Moist, nutty, lightly sweet" },
  { cat: "Bites", name: "Avocado Toast", price: "$8.50", desc: "Sourdough, chili, lime" },
];

const cats = ["All", "Espresso", "Filter", "Cold", "Bites"];

const bases = [
  { name: "Espresso", price: 3 },
  { name: "Flat White", price: 4.5 },
  { name: "Latte", price: 4.75 },
  { name: "Cappuccino", price: 4.5 },
  { name: "Mocha", price: 5.25 },
  { name: "Cold Brew", price: 4.75 },
];
const sizes = [
  { name: "Small", add: 0 },
  { name: "Regular", add: 0.5 },
  { name: "Large", add: 1 },
];
const milks = [
  { name: "Whole", add: 0 },
  { name: "Oat", add: 0.5 },
  { name: "Almond", add: 0.5 },
  { name: "Soy", add: 0.5 },
];
const syrups = ["None", "Vanilla", "Caramel", "Hazelnut", "Maple"];

const methods = [
  { name: "Espresso", icon: Flame, ratio: "1 : 2", temp: "93°C", time: "28 sec", note: "Rich, syrupy and concentrated." },
  { name: "Pour Over", icon: Droplets, ratio: "1 : 16", temp: "94°C", time: "3 min", note: "Clean, bright and layered." },
  { name: "Aeropress", icon: Coffee, ratio: "1 : 14", temp: "88°C", time: "2 min", note: "Smooth, full and forgiving." },
  { name: "Cold Brew", icon: Snowflake, ratio: "1 : 8", temp: "4°C", time: "18 hrs", note: "Sweet, low acid and mellow." },
];

const bags = [
  { name: "Ember House", origin: "Colombia & Brazil blend", roast: 3, notes: "Caramel, hazelnut, cocoa", price: "$16" },
  { name: "Yirgacheffe", origin: "Ethiopia, single origin", roast: 2, notes: "Jasmine, bergamot, peach", price: "$19" },
  { name: "Lintong Dark", origin: "Sumatra, single origin", roast: 5, notes: "Cedar, dark chocolate, spice", price: "$17" },
];

/* ---------------- small pieces ---------------- */

function SectionTitle({ eyebrow, children }) {
  return (
    <div className="mb-16 text-center">
      <p className="mb-4 text-sm uppercase tracking-[0.35em] text-amber-300">{eyebrow}</p>
      <h2 className="text-4xl font-semibold leading-tight md:text-6xl">{children}</h2>
    </div>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-5 py-2 text-xs uppercase tracking-widest transition ${
        active
          ? "border-amber-300 bg-amber-300 text-black"
          : "border-white/15 text-white/70 hover:border-amber-300 hover:text-amber-300"
      }`}
    >
      {children}
    </button>
  );
}

function Row({ label, children }) {
  return (
    <div className="mb-7">
      <p className="mb-3 text-xs uppercase tracking-[0.3em] text-white/50">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function DrinkBuilder() {
  const [base, setBase] = useState(bases[1]);
  const [size, setSize] = useState(sizes[1]);
  const [milk, setMilk] = useState(milks[0]);
  const [syrup, setSyrup] = useState("None");
  const [shots, setShots] = useState(0);

  const total =
    base.price + size.add + (base.name === "Espresso" ? 0 : milk.add) + (syrup === "None" ? 0 : 0.6) + shots * 0.75;

  return (
    <div className="grid gap-8 md:grid-cols-5">
      <div className="rounded-3xl border border-white/10 bg-neutral-900/60 p-8 md:col-span-3">
        <Row label="Drink">
          {bases.map((b) => (
            <Chip key={b.name} active={base.name === b.name} onClick={() => setBase(b)}>
              {b.name}
            </Chip>
          ))}
        </Row>
        <Row label="Size">
          {sizes.map((s) => (
            <Chip key={s.name} active={size.name === s.name} onClick={() => setSize(s)}>
              {s.name}
            </Chip>
          ))}
        </Row>
        {base.name !== "Espresso" && (
          <Row label="Milk">
            {milks.map((m) => (
              <Chip key={m.name} active={milk.name === m.name} onClick={() => setMilk(m)}>
                {m.name}
              </Chip>
            ))}
          </Row>
        )}
        <Row label="Syrup">
          {syrups.map((s) => (
            <Chip key={s} active={syrup === s} onClick={() => setSyrup(s)}>
              {s}
            </Chip>
          ))}
        </Row>
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-white/50">Extra shots</p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setShots((s) => Math.max(0, s - 1))}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/20 transition hover:border-amber-300 hover:text-amber-300"
              aria-label="Fewer shots"
            >
              <Minus size={16} />
            </button>
            <span className="w-6 text-center font-serif text-3xl">{shots}</span>
            <button
              type="button"
              onClick={() => setShots((s) => Math.min(3, s + 1))}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/20 transition hover:border-amber-300 hover:text-amber-300"
              aria-label="More shots"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* live summary */}
      <div className="glow-border flex flex-col justify-between rounded-3xl bg-neutral-900 p-8 md:col-span-2">
        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.3em] text-amber-300">Your drink</p>
          <h3 className="text-4xl font-semibold">
            <Em tone="white">{size.name}</Em> {base.name}
          </h3>
          <ul className="mt-6 space-y-2 text-white/65">
            {base.name !== "Espresso" && <li>{milk.name} milk</li>}
            <li>{syrup === "None" ? "No syrup" : `${syrup} syrup`}</li>
            <li>{shots === 0 ? "Standard shots" : `+ ${shots} extra shot${shots > 1 ? "s" : ""}`}</li>
          </ul>
        </div>
        <div className="mt-10">
          <p className="font-serif text-7xl text-amber-300">${total.toFixed(2)}</p>
          <Link
            to="/visit"
            className="mt-6 block rounded-full bg-amber-300 py-3 text-center text-xs font-semibold uppercase tracking-widest text-black transition hover:bg-amber-200"
          >
            Order at the counter
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ---------------- page ---------------- */

export default function MenuPage() {
  const [active, setActive] = useState("All");

  const visible = active === "All" ? items : items.filter((i) => i.cat === active);

  return (
    <>
      <PageHero
        eyebrow="The Menu"
        title={
          <>
            Brewed with <Em>intention</Em>.
          </>
        }
        subtitle="Everything is made to order. Ask us about today's single origin."
        image="/frames/frame_0001.webp"
      />

      {/* signature drinks */}
      <section className="bg-neutral-950 px-6 pb-32 pt-10 md:px-12">
        <div className="mx-auto max-w-6xl">
          <SectionTitle eyebrow="Signature drinks">
            Our <Em>house</Em> favorites.
          </SectionTitle>

          <div className="grid gap-6 md:grid-cols-3">
            {signatures.map(({ name, price, badge, icon: Icon, desc }) => (
              <div
                key={name}
                className="group flex flex-col rounded-3xl border border-white/10 bg-neutral-900/60 p-8 transition-colors duration-300 hover:border-amber-300/50"
              >
                <div className="mb-8 flex items-center justify-between">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-amber-300/10 text-amber-300 transition group-hover:bg-amber-300 group-hover:text-black">
                    <Icon size={26} />
                  </div>
                  <span className="rounded-full border border-amber-300/40 px-3 py-1 text-[10px] uppercase tracking-widest text-amber-300">
                    {badge}
                  </span>
                </div>
                <h3 className="text-3xl font-semibold leading-tight">{name}</h3>
                <p className="my-4 flex-1 leading-relaxed text-white/60">{desc}</p>
                <p className="font-serif text-3xl text-amber-300">{price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* full menu with filter */}
      <section className="bg-neutral-900 px-6 py-32 md:px-12">
        <div className="mx-auto max-w-5xl">
          <SectionTitle eyebrow="Everything we pour">
            The <Em>full</Em> menu.
          </SectionTitle>

          <div className="mb-14 flex flex-wrap justify-center gap-3">
            {cats.map((c) => (
              <Chip key={c} active={active === c} onClick={() => setActive(c)}>
                {c}
              </Chip>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {visible.map((item) => (
              <div
                key={item.name}
                className="group flex items-start justify-between rounded-2xl border border-white/10 bg-neutral-950/60 p-6 transition-colors duration-300 hover:border-amber-300/50"
              >
                <div>
                  <h3 className="text-2xl font-medium transition group-hover:text-amber-300">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-sm text-white/60">{item.desc}</p>
                </div>
                <span className="text-lg text-amber-300">{item.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* build your drink */}
      <section className="bg-neutral-950 px-6 py-32 md:px-12">
        <div className="mx-auto max-w-6xl">
          <SectionTitle eyebrow="Make it yours">
            Build your <Em>own</Em> drink.
          </SectionTitle>
          <DrinkBuilder />
        </div>
      </section>

      {/* seasonal special */}
      <section className="bg-neutral-900 px-6 py-32 md:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="glow-border relative overflow-hidden rounded-[2rem] bg-neutral-950 p-10 md:p-16">
            <div className="floaty pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-amber-300/15 blur-3xl" />
            <p className="mb-4 text-sm uppercase tracking-[0.35em] text-amber-300">
              Autumn special · limited time
            </p>
            <h2 className="max-w-2xl text-4xl font-semibold leading-tight md:text-6xl">
              The <Em>Maple Oak</Em> Latte is back.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
              Real maple syrup, a pinch of sea salt and <Em tone="white">steamed oat milk</Em> over a
              double shot. Available until the <Em tone="white">first frost</Em>, or until the maple
              runs out.
            </p>
            <div className="mt-8 flex items-center gap-6">
              <span className="font-serif text-4xl text-amber-300">$5.75</span>
              <Link
                to="/visit"
                className="rounded-full bg-amber-300 px-7 py-3 text-xs font-semibold uppercase tracking-widest text-black transition hover:bg-amber-200"
              >
                Come try it
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* brew guide */}
      <section className="bg-neutral-950 px-6 py-32 md:px-12">
        <div className="mx-auto max-w-6xl">
          <SectionTitle eyebrow="Brew guide">
            Pick your <Em>method</Em>.
          </SectionTitle>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {methods.map(({ name, icon: Icon, ratio, temp, time, note }) => (
              <div
                key={name}
                className="group rounded-3xl border border-white/10 bg-neutral-900/60 p-7 transition-colors duration-300 hover:border-amber-300/50"
              >
                <Icon size={30} className="mb-6 text-amber-300" />
                <h3 className="mb-1 text-3xl font-semibold">{name}</h3>
                <p className="mb-6 text-sm text-white/55">{note}</p>
                <ul className="space-y-3 text-sm text-white/70">
                  <li className="flex items-center gap-3">
                    <Scale size={16} className="text-amber-300" /> Ratio {ratio}
                  </li>
                  <li className="flex items-center gap-3">
                    <Thermometer size={16} className="text-amber-300" /> {temp}
                  </li>
                  <li className="flex items-center gap-3">
                    <Timer size={16} className="text-amber-300" /> {time}
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* beans to take home */}
      <section className="bg-neutral-900 px-6 py-32 md:px-12">
        <div className="mx-auto max-w-6xl">
          <SectionTitle eyebrow="Take it home">
            Fresh <Em>beans</Em>, every week.
          </SectionTitle>

          <div className="grid gap-6 md:grid-cols-3">
            {bags.map((b) => (
              <div
                key={b.name}
                className="rounded-3xl border border-white/10 bg-neutral-950/70 p-8 transition-colors duration-300 hover:border-amber-300/50"
              >
                <p className="mb-2 text-xs uppercase tracking-[0.3em] text-white/50">{b.origin}</p>
                <h3 className="mb-6 text-4xl font-semibold">
                  <Em tone="white">{b.name}</Em>
                </h3>

                <p className="mb-2 text-xs uppercase tracking-[0.3em] text-white/50">Roast level</p>
                <div className="mb-6 flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span
                      key={n}
                      className={`h-2 flex-1 rounded-full ${n <= b.roast ? "bg-amber-300" : "bg-white/10"}`}
                    />
                  ))}
                </div>

                <p className="mb-8 text-white/65">{b.notes}</p>
                <div className="flex items-end justify-between">
                  <span className="font-serif text-4xl text-amber-300">{b.price}</span>
                  <span className="text-xs uppercase tracking-widest text-white/50">250g bag</span>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-12 text-center text-sm text-white/50">
            Ask us to grind any bag for your brewer. Oat, almond and soy milk are always available.
            Please tell us about any allergies when you order.
          </p>
        </div>
      </section>

      {/* closing cta */}
      <section className="bg-neutral-950 px-6 py-28 md:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-semibold leading-tight md:text-6xl">
            Hungry for <Em>more</Em>?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/70">
            Reserve a table, or just walk in. We'll have the <Em tone="white">kettle on</Em>.
          </p>
          <Link
            to="/visit"
            className="mt-10 inline-block rounded-full bg-amber-300 px-10 py-4 text-sm font-semibold uppercase tracking-widest text-black transition hover:bg-amber-200"
          >
            Plan your visit
          </Link>
        </div>
      </section>
    </>
  );
}