--- src/components/TitleSheet.tsx (原始)


+++ src/components/TitleSheet.tsx (修改后)
import { CHARACTERS } from "../data";
import { Reveal, RulerTicks, Stamp, useScramble } from "./chrome";

const SPEC_CHIPS = [
  "TARGET 50–60 FPS",
  "ENVELOPE ≤ 4GB RAM",
  "WEBGL2 → WEBGPU",
  "OFFSCREEN WORKER SIM",
  "3-DISTRICT OPEN MAP",
];

function TitleBlockCell({ k, v, wide = false }: { k: string; v: string; wide?: boolean }) {
  return (
    <div className={`px-4 py-3 ${wide ? "col-span-2 md:col-span-2" : ""}`}>
      <div className="font-mono text-[9px] tracking-[0.28em] text-muted">{k}</div>
      <div className="font-mono text-[12px] text-paper mt-1 leading-snug">{v}</div>
    </div>
  );
}

export default function TitleSheet() {
  const l1 = useScramble("HIGH-FIDELITY ANIME");
  const l2 = useScramble("IN A GTA-CLASS");
  const l3 = useScramble("BROWSER ENGINE");
  const lead = CHARACTERS[0];

  return (
    <section id="sheet-00" className="relative scroll-mt-20 pt-24 md:pt-32 pb-14 md:pb-20">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <div className="relative border-2 border-line2 corner-tick bg-ink2/40">
            <RulerTicks count={56} />

            <div className="grid lg:grid-cols-[1.12fr_0.88fr]">
              {/* -------- left: the drawing title -------- */}
              <div className="p-7 md:p-12 pt-12">
                <div className="flex flex-wrap items-center gap-3 mb-8">
                  <span className="font-mono text-[11px] tracking-[0.3em] text-cyan/85">
                    DRAWING SET BP-003
                  </span>
                  <span className="h-px w-10 bg-line2" />
                  <Stamp tone="cyan">REV 2.4</Stamp>
                  <Stamp tone="alert">PERF-CRITICAL</Stamp>
                </div>

                <h1 className="font-display leading-[0.86] select-none">
                  <span className="block text-6xl md:text-8xl text-paper">{l1}</span>
                  <span className="block text-6xl md:text-8xl txt-outline mt-2">{l2}</span>
                  <span className="block text-6xl md:text-8xl text-paper mt-2">
                    {l3}
                    <span className="text-cyan">.</span>
                  </span>
                </h1>

                <p className="mt-8 max-w-xl text-[15px] md:text-base leading-relaxed text-paper/85">
                  A technical blueprint for shipping an <em className="text-cyan not-italic font-semibold">exact-appearance anime
                  protagonist</em> inside a GTA&nbsp;3-style open world that must hold{" "}
                  <span className="font-mono text-[13px] text-amber">50–60&nbsp;FPS on 4GB of RAM</span>. Six sheets cover the
                  asset pipeline, the off-thread engine, the city, the character, the combat, and the story engine — every
                  decision annotated against the frame budget.
                </p>

                <div className="mt-8 flex flex-wrap gap-2">
                  {SPEC_CHIPS.map((c) => (
                    <span
                      key={c}
                      className="font-mono text-[10px] tracking-[0.18em] text-cyan/90 border border-line px-3 py-1.5 hover:border-cyan hover:bg-ink3/60 transition-colors cursor-default"
                    >
                      {c}
                    </span>
                  ))}
                </div>

                <div className="mt-10 flex flex-wrap items-center gap-6">
                  <a
                    href="#sheet-01"
                    className="group inline-flex items-center gap-3 border-2 border-cyan px-6 py-3 font-display text-2xl tracking-wide text-cyan hover:bg-cyan hover:text-ink transition-colors duration-200"
                  >
                    OPEN SHEET 01
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" className="group-hover:translate-y-0.5 transition-transform">
                      <path d="M8 2v11M3.5 8.5L8 13l4.5-4.5" />
                    </svg>
                  </a>
                  <a
                    href="#sheet-05"
                    className="font-mono text-[11px] tracking-[0.22em] text-muted hover:text-cyan transition-colors underline decoration-line underline-offset-4"
                  >
                    SKIP TO THE COMBAT LAB →
                  </a>
                </div>
              </div>

              {/* -------- right: FIG. 0 reference plate -------- */}
              <div className="relative border-t lg:border-t-0 lg:border-l border-line p-7 md:p-12 pt-12">
                <div className="font-mono text-[10px] tracking-[0.28em] text-muted mb-4 flex items-center justify-between">
                  <span>FIG. 0 — PROTAGONIST REFERENCE</span>
                  <span className="text-cyan">1:18</span>
                </div>
                <div className="relative border border-line2 bg-ink p-2">
                  <div className="relative overflow-hidden">
                    <img
                      src={lead.portrait}
                      alt={`${lead.name} — concept sheet on blueprint grid`}
                      className="w-full h-[380px] md:h-[440px] object-cover object-top transition-transform duration-700 hover:scale-[1.03]"
                      loading="eager"
                    />
                    {/* dimension line */}
                    <div className="absolute right-2 top-3 bottom-3 w-6 hidden sm:flex flex-col items-center" aria-hidden="true">
                      <span className="w-3 h-px bg-cyan" />
                      <span className="w-px flex-1 bg-cyan/70" />
                      <span className="w-3 h-px bg-cyan" />
                      <span className="absolute top-1/2 -translate-y-1/2 -left-14 font-mono text-[10px] text-cyan tracking-widest bg-ink/70 px-1">
                        1.72 m
                      </span>
                    </div>
                    {/* leader annotations */}
                    <div className="absolute left-3 top-8 hidden md:block">
                      <div className="font-mono text-[9px] tracking-wider text-cyan bg-ink/80 border border-line px-2 py-1">
                        HAIR LAYER · WIND RIG ±6°
                      </div>
                    </div>
                    <div className="absolute left-3 bottom-20 hidden md:block">
                      <div className="font-mono text-[9px] tracking-wider text-amber bg-ink/80 border border-line px-2 py-1">
                        HITBOX r = 0.42 m · i-FRAMES 0.25 s
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between font-mono text-[10px] tracking-[0.2em]">
                  <span className="text-paper">{lead.name.toUpperCase()} <span className="text-muted">/ {lead.alias}</span></span>
                  <span className="text-muted">ATLAS 1024² KTX2</span>
                </div>
              </div>
            </div>

            {/* -------- classic drawing title block -------- */}
            <div className="border-t-2 border-line2 grid grid-cols-2 md:grid-cols-6 divide-x divide-y md:divide-y-0 divide-line">
              <TitleBlockCell k="PROJECT" v="Liberty Protocol" wide />
              <TitleBlockCell k="DRAWN BY" v="Engineering Desk" />
              <TitleBlockCell k="CHECKED" v="Perf Review Board" />
              <TitleBlockCell k="SHEET" v="00 of 06" />
              <TitleBlockCell k="DATE" v="2026-W06" />
            </div>

            <div className="absolute -top-4 right-6 hidden md:block">
              <Stamp tone="ok">APPROVED FOR DEVELOPMENT</Stamp>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
