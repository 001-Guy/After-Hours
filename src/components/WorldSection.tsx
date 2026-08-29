--- src/components/WorldSection.tsx (原始)


+++ src/components/WorldSection.tsx (修改后)
import { useState } from "react";
import { CITY_FRAME, DISTRICTS } from "../data";
import { Reveal, Sheet, Stamp } from "./chrome";

const PAUSE_STEPS = [
  { n: "1", body: "On ESC, grab the frame: canvas.transferToImageBitmap() freezes the world." },
  { n: "2", body: "A fragment shader converts RGB → luminance, then blends a red tint across the result." },
  { n: "3", body: "The processed image is drawn full-screen, nudged 2% past the frame with scanlines on top." },
  { n: "4", body: "The DOM menu layers over it: Resume · Settings · Main Menu — pure HTML/CSS, zero WebGL text." },
];

function PauseDemo() {
  const [paused, setPaused] = useState(false);
  return (
    <div className="relative border-2 border-line2 bg-ink overflow-hidden aspect-[16/10] select-none">
      <img
        src={CITY_FRAME}
        alt="Low-poly city street standing in for the WebGL canvas"
        className="absolute inset-0 w-full h-full object-cover transition-[filter,transform] duration-500"
        style={
          paused
            ? {
                filter: "grayscale(0.92) brightness(0.7) contrast(1.12) sepia(0.5) hue-rotate(-35deg) saturate(2.6)",
                transform: "scale(1.025)",
              }
            : { filter: "none", transform: "scale(1)" }
        }
      />

      {/* ---- live HUD (DOM over canvas) ---- */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${paused ? "opacity-0" : "opacity-100"}`}
        aria-hidden={paused}
      >
        <div className="absolute top-3 left-4 font-mono text-[11px] tracking-[0.2em] text-paper/90 bg-ink/60 border border-line px-2.5 py-1.5">
          <span className="text-amber">▶</span> PIER 7 SUBSTATION — 240m
        </div>
        <div className="absolute top-3 right-4 text-right leading-none">
          <div className="font-display text-3xl md:text-4xl text-amber tracking-wider drop-shadow-[0_2px_6px_rgba(4,12,22,0.9)]">
            $0014580
          </div>
          <div className="mt-1 flex items-center justify-end gap-2">
            <span className="font-display text-2xl md:text-3xl text-paper drop-shadow-[0_2px_6px_rgba(4,12,22,0.9)]">100</span>
            <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 3l2 4h4l-3 3 1 5-4-2-4 2 1-5-3-3h4z" fill="#ff6e5a" /></svg>
          </div>
          <div className="flex items-center justify-end gap-2">
            <span className="font-display text-2xl md:text-3xl text-cyan drop-shadow-[0_2px_6px_rgba(4,12,22,0.9)]">050</span>
            <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2l6 3v5c0 4-3 6-6 8-3-2-6-4-6-8V5z" fill="#63c5ff" /></svg>
          </div>
          <div className="mt-1.5 flex justify-end gap-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <svg key={i} width="15" height="15" viewBox="0 0 20 20" aria-hidden="true">
                <path
                  d="M10 2l2.4 5 5.6.7-4.1 3.8 1.1 5.5L10 14.2 5 17l1.1-5.5L2 7.7 7.6 7z"
                  fill={i < 2 ? "#ffc15e" : "rgba(217,233,247,0.25)"}
                />
              </svg>
            ))}
          </div>
        </div>
        {/* radar */}
        <div className="absolute bottom-3 left-4">
          <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full border-2 border-paper/70 bg-ink/75 overflow-hidden shadow-[0_0_24px_rgba(4,12,22,0.8)]">
            <div className="absolute inset-0 rounded-full radar-sweep" />
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-paper/20" />
            <div className="absolute top-1/2 left-0 right-0 h-px bg-paper/20" />
            <div className="absolute rounded-full w-1.5 h-1.5 bg-amber" style={{ left: "62%", top: "30%" }} />
            <div className="absolute rounded-full w-1.5 h-1.5 bg-alert" style={{ left: "30%", top: "64%" }} />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <svg width="12" height="14" viewBox="0 0 12 14" aria-hidden="true"><path d="M6 0l5 12-5-3-5 3z" fill="#d9e9f7" /></svg>
            </div>
          </div>
        </div>
      </div>

      {/* ---- paused state ---- */}
      {paused && (
        <div className="absolute inset-0 scanlines" aria-hidden="true" />
      )}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center bg-[#2a0a0a]/50 transition-opacity duration-500 ${
          paused ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="font-display text-4xl md:text-6xl tracking-[0.08em] text-paper drop-shadow-[0_3px_14px_rgba(20,2,2,0.95)]">
          LIBERTY PROTOCOL
        </div>
        <div className="mt-2 mb-7 font-mono text-[10px] tracking-[0.3em] text-alert/90">FREEZE-FRAME · LUMA + RED TINT</div>
        <button
          onClick={() => setPaused(false)}
          className="font-display text-2xl md:text-3xl tracking-[0.14em] py-1 text-paper transition-all duration-200 hover:text-alert hover:translate-x-2 cursor-pointer"
        >
          RESUME
        </button>
        {["SETTINGS", "MAIN MENU"].map((b) => (
          <div
            key={b}
            className="font-display text-2xl md:text-3xl tracking-[0.14em] py-1 text-paper/50 transition-all duration-200 hover:text-alert/70 hover:translate-x-2"
            aria-hidden="true"
          >
            {b}
          </div>
        ))}
      </div>

      {/* toggle */}
      <button
        onClick={() => setPaused((v) => !v)}
        className={`absolute bottom-3 right-3 font-mono text-[11px] tracking-[0.2em] px-3.5 py-2 border transition-colors cursor-pointer ${
          paused
            ? "bg-alert text-ink border-alert hover:bg-paper hover:border-paper"
            : "bg-ink/80 text-paper border-paper/60 hover:border-cyan hover:text-cyan"
        }`}
      >
        {paused ? "ESC · RESUME" : "ESC · PAUSE"}
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 hidden md:block">
        <Stamp tone={paused ? "alert" : "cyan"}>{paused ? "SHADER: GRAYSCALE × RED" : "HTML/CSS HUD OVER CANVAS"}</Stamp>
      </div>
    </div>
  );
}

function DistrictCard({ d, i }: { d: (typeof DISTRICTS)[number]; i: number }) {
  return (
    <Reveal delay={i * 100}>
      <article className="plate h-full group hover:border-cyan/70 transition-all duration-300 hover:-translate-y-1">
        <div className="hatch border-b border-line px-4 py-3 flex items-center justify-between">
          <h3 className="font-display text-3xl text-paper group-hover:text-cyan transition-colors">{d.name.toUpperCase()}</h3>
          <span className="font-mono text-[9px] text-muted tracking-wider">{String(i + 1).padStart(2, "0")}/03</span>
        </div>
        <div className="p-4">
          <div className="font-mono text-[10px] text-cyan/90 tracking-wider mb-2">{d.seed}</div>
          <div className="text-[13px] text-paper/85 mb-3">{d.mood}</div>
          <div className="flex gap-1.5 mb-4">
            {d.palette.map((c) => (
              <div key={c} className="flex-1">
                <div className="h-7 border border-line" style={{ backgroundColor: c }} />
                <div className="font-mono text-[8px] text-muted mt-1 text-center">{c}</div>
              </div>
            ))}
          </div>
          <ul className="space-y-1.5 mb-3">
            {d.landmarks.map((l) => (
              <li key={l} className="flex items-center gap-2 text-[12.5px] text-paper/75">
                <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true"><path d="M4 0v8M0 4h8" stroke="#63c5ff" strokeWidth="1" /></svg>
                {l}
              </li>
            ))}
          </ul>
          <p className="text-[12px] text-muted leading-snug border-t border-line/60 pt-3">{d.notes}</p>
        </div>
      </article>
    </Reveal>
  );
}

export default function WorldSection() {
  return (
    <Sheet
      id="sheet-03"
      no="03"
      title="THE CITY & ITS HUD"
      kicker="SHEET 03 — ENVIRONMENT RECREATION · UI/UX"
      stamp="3 DISTRICTS"
    >
      <Reveal>
        <p className="max-w-3xl text-[15px] leading-relaxed text-paper/85 mb-8">
          The map is generated, not sculpted: a JSON block-grid defines every lot, heights are data, and the original's drab
          brown-and-grey art direction does the mood work. Trees, streetlights and distant planes are{" "}
          <span className="text-cyan">camera-facing quads</span> — one quad, one draw call, zero regrets. Collision starts as
          bounding boxes and graduates to a navmesh so NPCs can actually walk the city.
        </p>
      </Reveal>

      <div className="grid md:grid-cols-3 gap-5 mb-10">
        {DISTRICTS.map((d, i) => (
          <DistrictCard key={d.name} d={d} i={i} />
        ))}
      </div>

      <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-6 items-start">
        <Reveal>
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[10px] tracking-[0.28em] text-muted">FIG. 4 — HUD + FREEZE-FRAME (INTERACTIVE)</span>
              <span className="font-mono text-[10px] text-cyan hidden sm:block">press the ESC plate</span>
            </div>
            <PauseDemo />
            <p className="mt-3 font-mono text-[10.5px] text-muted leading-relaxed">
              Money, health, wanted stars and the radar are absolutely-positioned DOM — the browser's compositor draws them for
              free. Only the radar's sweep earns a shader.
            </p>
          </div>
        </Reveal>
        <Reveal delay={140}>
          <div className="plate p-5">
            <div className="font-mono text-[10px] tracking-[0.28em] text-muted mb-4">PAUSE SEQUENCE — RDR-STYLE TINT</div>
            <ol className="space-y-4">
              {PAUSE_STEPS.map((s) => (
                <li key={s.n} className="flex gap-3 group">
                  <span className="font-display text-3xl leading-none txt-outline group-hover:text-cyan group-hover:[-webkit-text-stroke:0px] transition-colors">
                    {s.n}
                  </span>
                  <p className="text-[13px] text-paper/80 leading-relaxed pt-1">{s.body}</p>
                </li>
              ))}
            </ol>
            <div className="mt-5 border border-line bg-ink p-3 font-mono text-[11px] leading-relaxed text-paper/85 overflow-x-auto">
              <span className="text-muted">// fragment shader, core 2 lines</span>
              <br />
              float l = <span className="text-cyan">dot</span>(rgb, vec3(.299,.587,.114));
              <br />
              color = <span className="text-cyan">mix</span>(vec3(l), vec3(l) * <span className="text-alert">RED</span>, 0.55);
            </div>
          </div>
        </Reveal>
      </div>
    </Sheet>
  );
}
