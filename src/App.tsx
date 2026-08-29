--- src/App.tsx (原始)
export default function App() {
  return (
    <div/>
  );
}


+++ src/App.tsx (修改后)
import { useEffect, useState } from "react";
import { NAV_SECTIONS } from "./data";
import { Nav, Ticker } from "./components/chrome";
import TitleSheet from "./components/TitleSheet";
import AssetSection from "./components/AssetSection";
import EngineSection from "./components/EngineSection";
import WorldSection from "./components/WorldSection";
import CharacterSection from "./components/CharacterSection";
import AbilitySection from "./components/AbilitySection";
import MissionSection from "./components/MissionSection";
import Footer from "./components/Footer";

export default function App() {
  const [active, setActive] = useState("sheet-00");
  const [progress, setProgress] = useState(0);
  const [charId, setCharId] = useState("kaito");

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, h.scrollTop / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const els = NAV_SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen font-body text-paper">
      <div className="fixed inset-0 bp-grid pointer-events-none" aria-hidden="true" />
      <div className="fixed inset-0 vignette pointer-events-none" aria-hidden="true" />
      <div className="noise" aria-hidden="true" />

      <Nav active={active} progress={progress} />

      <main className="relative">
        <TitleSheet />
        <Ticker />
        <AssetSection />
        <EngineSection />
        <WorldSection />
        <CharacterSection charId={charId} onChange={setCharId} />
        <AbilitySection charId={charId} onChange={setCharId} />
        <MissionSection charId={charId} onChange={setCharId} />
      </main>

      <Footer />
    </div>
  );
}
