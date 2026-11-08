import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/story", label: "Our Story" },
  { to: "/visit", label: "Visit" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-neutral-950/95 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 md:px-12">
          <Link to="/" className="font-serif text-xl font-semibold tracking-tight sm:text-2xl">
            Ember <span className="text-amber-300">&</span> Oak
          </Link>

          <div className="hidden gap-10 text-sm uppercase tracking-[0.2em] md:flex">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end
                className={({ isActive }) =>
                  `transition hover:text-amber-300 ${isActive ? "text-amber-300" : "text-white/70"}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/menu"
              className="hidden rounded-full bg-amber-300 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-black transition hover:bg-amber-200 sm:block"
            >
              Order
            </Link>
            <button
              className="grid h-10 w-10 place-items-center rounded-full md:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* mobile drawer */}
      <div
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-neutral-950 transition-all duration-500 md:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {links.map((l) => (
          <Link key={l.to} to={l.to} className="font-serif text-4xl hover:text-amber-300">
            {l.label}
          </Link>
        ))}
      </div>
    </>
  );
}