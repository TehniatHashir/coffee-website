import { useState } from "react";
import { Plus } from "lucide-react";

export default function Accordion({ items }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="space-y-4">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={item.q}
            className={`rounded-2xl border transition-colors duration-300 ${
              isOpen ? "border-amber-300/50 bg-neutral-900" : "border-white/10 bg-neutral-900/50"
            }`}
          >
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
              className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left"
            >
              <span className="font-serif text-xl font-semibold md:text-2xl">{item.q}</span>
              <Plus
                size={22}
                className={`shrink-0 text-amber-300 transition-transform duration-300 ${
                  isOpen ? "rotate-45" : ""
                }`}
              />
            </button>
            <div
              className={`grid transition-all duration-500 ease-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-6 leading-relaxed text-white/65">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}