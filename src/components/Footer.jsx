import { Link } from "react-router-dom";
import { Instagram, Mail, MapPin, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-neutral-950 px-6 py-20 md:px-12">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <h3 className="text-3xl font-semibold">
            Ember <span className="text-amber-300">&</span> Oak
          </h3>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
            Small-batch roasters and a slow-morning café. Coffee sourced directly, roasted weekly,
            poured with care.
          </p>
        </div>

        <div className="flex flex-col gap-3 text-sm text-white/60">
          <span className="mb-1 text-xs uppercase tracking-widest text-white">Explore</span>
          <Link to="/" className="transition hover:text-amber-300">Home</Link>
          <Link to="/menu" className="transition hover:text-amber-300">Menu</Link>
          <Link to="/story" className="transition hover:text-amber-300">Our Story</Link>
          <Link to="/visit" className="transition hover:text-amber-300">Visit</Link>
        </div>

        <div className="flex flex-col gap-3 text-sm text-white/60">
          <span className="mb-1 text-xs uppercase tracking-widest text-white">Find us</span>
          <span className="flex items-center gap-2"><MapPin size={14} className="text-amber-300" /> 123 Roastery Lane</span>
          <span className="flex items-center gap-2"><Clock size={14} className="text-amber-300" /> Daily 7am–6pm</span>
          <span className="flex items-center gap-2 break-all"><Mail size={14} className="shrink-0 text-amber-300" /> <span className="break-all">hello@emberandoak.coffee</span></span>
          <span className="flex items-center gap-2"><Instagram size={14} className="text-amber-300" /> @emberandoak</span>
        </div>
      </div>
      <p className="mx-auto mt-16 max-w-6xl text-xs text-white/30">
        © {new Date().getFullYear()} Ember & Oak Coffee Roasters.
      </p>
    </footer>
  );
}
