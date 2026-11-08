import { useState } from "react";
import { MapPin, Clock, Phone, Mail, Check } from "lucide-react";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";

const hours = [
  ["Monday – Friday", "7:00 – 18:00"],
  ["Saturday", "8:00 – 19:00"],
  ["Sunday", "8:00 – 17:00"],
];

export default function Visit() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <PageHero
        eyebrow="Visit"
        title={
          <>
            Come say <span className="text-amber-300">hello</span>.
          </>
        }
        subtitle="Walk-ins always welcome. Groups of six or more, drop us a line."
        image="/frames3/frame_0001.webp"
      />

      <section className="bg-neutral-950 px-6 pb-32 md:px-12">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2">
          {/* info */}
          <Reveal direction="left" className="space-y-10">
            <div className="rounded-3xl border border-white/10 bg-neutral-900/60 p-8">
              <h3 className="mb-6 flex items-center gap-3 text-2xl font-semibold">
                <Clock className="text-amber-300" size={22} /> Opening hours
              </h3>
              <ul className="space-y-3">
                {hours.map(([d, h]) => (
                  <li key={d} className="flex justify-between border-b border-white/10 pb-3 text-white/70">
                    <span>{d}</span>
                    <span className="text-amber-300">{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-white/10 bg-neutral-900/60 p-8">
              <h3 className="mb-6 text-2xl font-semibold">Find us</h3>
              <ul className="space-y-4 text-white/70">
                <li className="flex items-center gap-3"><MapPin size={18} className="text-amber-300" /> 123 Roastery Lane</li>
                <li className="flex items-center gap-3"><Phone size={18} className="text-amber-300" /> +1 (555) 012-3456</li>
                <li className="flex items-center gap-3"><Mail size={18} className="text-amber-300" /> hello@emberandoak.coffee</li>
              </ul>

              {/* map placeholder: replace with a Google Maps iframe */}
              <div className="mt-8 grid h-48 place-items-center rounded-2xl border border-dashed border-white/15 text-sm text-white/40">
                Map goes here
              </div>
            </div>
          </Reveal>

          {/* form */}
          <Reveal direction="right">
            <div className="rounded-3xl border border-white/10 bg-neutral-900/60 p-8 md:p-10">
              <h3 className="mb-2 text-3xl font-semibold">Reserve a table</h3>
              <p className="mb-8 text-white/60">Tell us when you're coming and we'll save you a seat.</p>

              {sent ? (
                <div className="flex flex-col items-center gap-4 py-16 text-center">
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-amber-300 text-black">
                    <Check size={30} />
                  </div>
                  <p className="text-2xl font-semibold">Thank you!</p>
                  <p className="text-white/60">We'll confirm by email shortly.</p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSent(true);
                  }}
                  className="space-y-4"
                >
                  <input required placeholder="Your name" className="field" />
                  <input required type="email" placeholder="Email" className="field" />
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <input required type="date" className="field" />
                    <input required type="time" className="field" />
                  </div>
                  <select className="field" defaultValue="2">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n} className="bg-neutral-900">
                        {n} {n === 1 ? "guest" : "guests"}
                      </option>
                    ))}
                  </select>
                  <textarea rows={3} placeholder="Anything we should know?" className="field resize-none" />
                  <button className="w-full rounded-full bg-amber-300 py-3 text-sm font-semibold uppercase tracking-widest text-black transition hover:bg-amber-200">
                    Request table
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* tiny shared style for the inputs */}
      <style>{`
        .field {
          width: 100%;
          border-radius: 1rem;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.05);
          padding: 0.8rem 1.2rem;
          font-size: 0.9rem;
          color: white;
          outline: none;
          transition: border-color .2s;
        }
        .field:focus { border-color: #fcd34d; }
        .field::-webkit-calendar-picker-indicator { filter: invert(1); }
      `}</style>
    </>
  );
}
