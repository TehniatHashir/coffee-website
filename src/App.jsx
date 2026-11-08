import { useCallback, useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import MenuPage from "./pages/MenuPage";
import Story from "./pages/Story";
import Visit from "./pages/Visit";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    const t = setTimeout(() => ScrollTrigger.refresh(), 100);
    return () => clearTimeout(t);
  }, [pathname]);
  return null;
}

export default function App() {
  const [ready, setReady] = useState(false);
  const location = useLocation();
  const handleDone = useCallback(() => setReady(true), []);

  // lock scroll while the loader is on screen
  useEffect(() => {
    document.body.style.overflow = ready ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [ready]);

  return (
    <>
      {!ready && <Loader onDone={handleDone} />}

      <div className="bg-neutral-950 text-white">
        <ScrollToTop />
        <Navbar />

        {/* key forces a fresh mount (and fade-in) on every route change */}
        <div key={location.pathname} className="animate-[fadein_0.6s_ease-out]">
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/story" element={<Story />} />
            <Route path="/visit" element={<Visit />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </>
  );
}
