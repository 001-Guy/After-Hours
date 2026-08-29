--- src/components/chrome.tsx (原始)


+++ src/components/chrome.tsx (修改后)
import { useEffect, useRef, useState, type ReactNode } from "react";
import { NAV_SECTIONS, TICKER_ITEMS } from "../data";

/* ------------------------------ motion utils ------------------------------ */

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function useScramble(text: string): string {
  const [out, setOut] = useState(text);
  useEffect(() => {
    if (prefersReducedMotion()) {
      setOut(text);
      return;
    }
    const glyphs = "▓▒░<>/\\+*#=~";
    let frame = 0;
    let raf = 0;
    const total = Math.max(18, text.length + 8);
    const tick = () => {
      frame += 1;
      if (frame % 2 !== 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const prog = frame / 2 / total;
      const resolved = Math.floor(prog * text.length);
      let s = "";
      for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (c === " ") {
          s += c;
          continue;
        }
        s += i < resolved ? c : glyphs[Math.floor(Math.random() * glyphs.length)];
      }
      if (resolved >= text.length) {
        setOut(text);
        return;
      }
      setOut(s);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text]);
  return out;
}

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add("is-in");
            io.disconnect();
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

/* ------------------------------ small marks ------------------------------ */

export function CrosshairMark({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="9" fill="none" stroke="#63c5ff" strokeWidth="1.6" />
      <path d="M16 2v8M16 22v8M2 16h8M22 16h8" stroke="#63c5ff" strokeWidth="1.6" />
      <circle cx="16" cy="16" r="2" fill="#63c5ff" />
    </svg>
  );
}

export function Stamp({
  children,
  tone = "amber",
  className = "",
}: {
  children: ReactNode;
  tone?: "amber" | "alert" | "ok" | "cyan";
  className?: string;
}) {
  const color =
    tone === "amber"
      ? "text-amber"
      : tone === "alert"
        ? "text-alert"
        : tone === "ok"
          ? "text-ok"
          : "text-cyan";
  return (
    <span className={`stamp text-[10px] md:text-[11px] ${color} ${className}`}>
      {children}
    </span>
  );
}

export function RulerTicks({ count = 48 }: { count?: number }) {
  return (
    <div className="absolute inset-x-0 top-0 flex justify-between px-2 pointer-events-none" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={`w-px bg-cyan/40 ${i % 6 === 0 ? "h-3.5" : "h-2"}`}
        />
      ))}
    </div>
  );
}

/* ------------------------------- section head ------------------------------- */

export function Sheet({
  id,
  no,
  title,
  kicker,
  stamp,
  children,
}: {
  id: string;
  no: string;
  title: string;
  kicker: string;
  stamp?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="relative scroll-mt-20 border-t border-line/60 py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <header className="mb-10 md:mb-14">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <div className="font-mono text-[11px] tracking-[0.32em] text-cyan/85 mb-3">
                  {kicker}
                </div>
                <h2 className="font-display text-5xl md:text-7xl leading-[0.92]">
                  <span className="txt-outline-faint mr-4 select-none">{no}</span>
                  <span className="text-paper">{title}</span>
                </h2>
              </div>
              <div className="flex flex-col items-end gap-3">
                {stamp && <Stamp tone="amber">{stamp}</Stamp>}
                <div className="rule-draw h-px w-44 bg-line2" />
                <div className="font-mono text-[10px] text-muted tracking-[0.25em]">
                  BP-003 · REV 2.4 · SCALE 1:1
                </div>
              </div>
            </div>
          </header>
        </Reveal>
        {children}
      </div>
    </section>
  );
}

/* --------------------------------- nav bar --------------------------------- */

export function Nav({ active, progress }: { active: string; progress: number }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div
        className="fixed top-0 left-0 z-[90] h-[3px] bg-cyan transition-[width] duration-150 ease-out"
        style={{ width: `${Math.round(progress * 1000) / 10}%` }}
        aria-hidden="true"
      />
      <header className="fixed top-0 inset-x-0 z-[80] border-b border-line/60 bg-ink/90 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-5 md:px-8 h-14 flex items-center justify-between gap-4">
          <a href="#sheet-00" className="flex items-center gap-3 group" onClick={() => setOpen(false)}>
            <CrosshairMark />
            <span className="leading-none">
              <span className="block font-display text-xl tracking-wide text-paper group-hover:text-cyan transition-colors">
                LIBERTY PROTOCOL
              </span>
              <span className="block font-mono text-[9px] tracking-[0.3em] text-muted mt-1">
                BP-003 · TECHNICAL BLUEPRINT
              </span>
            </span>
          </a>
          <nav className="hidden lg:flex items-center gap-1" aria-label="Sheets">
            {NAV_SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`font-mono text-[11px] tracking-wider px-2.5 py-1.5 border transition-colors duration-200 ${
                  active === s.id
                    ? "text-ink bg-cyan border-cyan"
                    : "text-muted border-transparent hover:text-cyan hover:border-line"
                }`}
              >
                <span className="opacity-60">{s.no}</span> {s.label.toUpperCase()}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden md:flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-ok">
              <span className="w-1.5 h-1.5 rounded-full bg-ok pulse-dot" />
              BUILD GREEN
            </span>
            <button
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden border border-line p-2 text-cyan hover:border-cyan transition-colors"
              aria-label="Toggle sheet index"
              aria-expanded={open}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
                {open ? <path d="M3 3l10 10M13 3L3 13" /> : <path d="M2 4h12M2 8h12M2 12h12" />}
              </svg>
            </button>
          </div>
        </div>
        {open && (
          <nav className="lg:hidden border-t border-line/60 bg-ink2/95 px-5 py-3 grid grid-cols-2 gap-1.5" aria-label="Sheets mobile">
            {NAV_SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={() => setOpen(false)}
                className={`font-mono text-[11px] tracking-wider px-3 py-2 border transition-colors ${
                  active === s.id
                    ? "text-ink bg-cyan border-cyan"
                    : "text-muted border-line/60 hover:text-cyan"
                }`}
              >
                <span className="opacity-60">{s.no}</span> {s.label.toUpperCase()}
              </a>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}

/* ---------------------------------- ticker ---------------------------------- */

export function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="relative border-y border-line/70 bg-ink2/80 overflow-hidden py-2.5">
      <div className="ticker-track items-center">
        {items.map((t, i) => (
          <span key={i} className="flex items-center shrink-0">
            <span className="font-mono text-[11px] tracking-[0.28em] text-cyan/85 whitespace-nowrap px-5">
              {t}
            </span>
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" className="shrink-0">
              <path d="M5 0v10M0 5h10" stroke="#2e6399" strokeWidth="1" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}
