--- src/components/EngineSection.tsx (原始)


+++ src/components/EngineSection.tsx (修改后)
import { useState } from "react";
import { CITY_FRAME, ENGINE_PICKS, ENGINE_STEPS } from "../data";
import { Reveal, Sheet, Stamp } from "./chrome";

function FailureNote() {
  return (
    <div className="border border-alert/50 bg-alert/[0.06] p-5 h-full">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[10px] tracking-[0.28em] text-alert">WHY REV 0.1 FAILED</span>
        <Stamp tone="alert">REJECTED</Stamp>
      </div>
      <p className="text-[13.5px] leading-relaxed text-paper/85">
        The first prototype ran game logic, physics and rendering <span className="text-alert font-semibold">synchronously on the
        main thread</span>. One long task blocked input, froze the HUD and dropped frames under any load. Every sheet in this set
        is a countermeasure to that failure.
      </p>
      <div className="mt-4 space-y-2">
        <div>
          <div className="flex justify-between font-mono text-[10px] text-muted mb-1">
            <span>FRAME BUDGET</span><span>16.6ms</span>
          </div>
          <div className="h-2 bg-ink border border-line">
            <div className="h-full bg-ok/70" style={{ width: "100%" }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between font-mono text-[10px] text-muted mb-1">
            <span>REV 0.1 MAIN-THREAD SPIKE</span><span className="text-alert">34.2ms</span>
          </div>
          <div className="h-2 bg-ink border border-line">
            <div className="h-full bg-alert/80" style={{ width: "100%" }} />
          </div>
        </div>
      </div>
      <p className="mt-3 font-mono text-[10px] text-muted">34.2ms ⇒ ~29 FPS. The sim had to leave this thread.</p>
    </div>
  );
}

function EnginePicks() {
  return (
    <div className="plate overflow-hidden h-full">
      <div className="border-b border-line px-4 py-2 bg-ink3/60">
        <span className="font-mono text-[10px] tracking-[0.25em] text-muted">TABLE 2.1 — STACK SELECTION</span>
      </div>
      <div className="divide-y divide-line/50">
        {ENGINE_PICKS.map((e) => (
          <div
            key={e.lib}
            className="grid md:grid-cols-[130px_1fr_150px] gap-x-5 gap-y-1 px-4 py-3.5 hover:bg-ink3/50 transition-colors group"
          >
            <div className="font-display text-2xl text-paper group-hover:text-cyan transition-colors leading-none pt-0.5">
              {e.lib}
            </div>
            <div>
              <div className="text-[13px] text-paper/90">
                <span className="text-cyan font-mono text-[11px] mr-2">[{e.use}]</span>
                {e.why}
              </div>
              <div className="font-mono text-[10px] text-muted mt-1 tracking-wider">
                {e.role} · targets {e.target}
              </div>
            </div>
            <div className="flex md:justify-end items-start">
              <Stamp tone={e.tag === "RECOMMENDED" ? "ok" : e.tag === "VIABLE" ? "cyan" : "amber"}>{e.tag}</Stamp>
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 py-3 border-t border-line bg-ink3/40 font-mono text-[11px] text-muted">
        Hybrid rule: <span className="text-paper/90">PixiJS owns every 2D pixel</span> (HUD, sprite animation) ·{" "}
        <span className="text-paper/90">Babylon owns the 3D city</span>. Renderer targets WebGPU where available, WebGL2 fallback —
        worth 2–10× on draw-call-heavy scenes.
      </div>
    </div>
  );
}

function ArchDiagram() {
  return (
    <div className="plate p-4 md:p-6 overflow-x-auto">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <span className="font-mono text-[10px] tracking-[0.28em] text-muted">FIG. 2 — OFF-THREAD RENDERING PIPELINE</span>
        <span className="flex items-center gap-4 font-mono text-[10px] text-muted">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan" /> input events</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber" /> state snapshots</span>
        </span>
      </div>
      <svg viewBox="0 0 920 380" className="w-full min-w-[720px]" role="img" aria-label="Diagram: the main thread handles DOM HUD and input, and posts messages to a web worker that runs the engine, physics, AI and renderer on an OffscreenCanvas">
        {/* main thread panel */}
        <rect x="20" y="24" width="320" height="332" fill="rgba(14,45,82,0.5)" stroke="#2e6399" />
        <text x="40" y="56" fontFamily="Bebas Neue" fontSize="26" fill="#d9e9f7" letterSpacing="2">MAIN THREAD</text>
        <text x="40" y="76" fontFamily="IBM Plex Mono" fontSize="10" fill="#7e9fbe" letterSpacing="2">NEVER BLOCKS · UI ONLY</text>
        {["DOM HUD — HTML/CSS over canvas", "input listeners (kb / pad / ptr)", "audio mixer (OGG streams)", "pause + menu UI", "canvas element → detached"].map((t, i) => (
          <g key={t}>
            <rect x="40" y={100 + i * 46} width="280" height="32" fill="rgba(10,35,64,0.9)" stroke="#1c4a75" />
            <text x="54" y={120 + i * 46} fontFamily="IBM Plex Mono" fontSize="11" fill="#d9e9f7" opacity="0.85">{t}</text>
          </g>
        ))}

        {/* worker panel */}
        <rect x="580" y="24" width="320" height="332" fill="rgba(14,45,82,0.5)" stroke="#2e6399" />
        <text x="600" y="56" fontFamily="Bebas Neue" fontSize="26" fill="#d9e9f7" letterSpacing="2">WEB WORKER</text>
        <text x="600" y="76" fontFamily="IBM Plex Mono" fontSize="10" fill="#7e9fbe" letterSpacing="2">SIM + RENDER · OFFSCREENCANVAS</text>
        {["new BABYLON.Engine(offscreen, true)", "scene update · fixed timestep", "physics + navmesh AI", "KTX2 texture cache", "renderer → presented by browser"].map((t, i) => (
          <g key={t}>
            <rect x="600" y={100 + i * 46} width="280" height="32" fill="rgba(10,35,64,0.9)" stroke="#1c4a75" />
            <text x="614" y={120 + i * 46} fontFamily="IBM Plex Mono" fontSize="11" fill="#d9e9f7" opacity="0.85">{t}</text>
          </g>
        ))}

        {/* channels */}
        <line x1="340" y1="160" x2="572" y2="160" stroke="#2e6399" strokeWidth="1.6" className="dash-flow-fast" />
        <text x="380" y="146" fontFamily="IBM Plex Mono" fontSize="10" fill="#63c5ff">postMessage(input)</text>
        <circle r="4.5" fill="#63c5ff" className="packet" style={{ offsetPath: "path('M 344 160 L 568 160')" }} />
        <circle r="4.5" fill="#63c5ff" className="packet" style={{ offsetPath: "path('M 344 160 L 568 160')", animationDelay: "1.4s" }} />

        <line x1="580" y1="270" x2="348" y2="270" stroke="#2e6399" strokeWidth="1.6" className="dash-flow-fast" />
        <text x="386" y="294" fontFamily="IBM Plex Mono" fontSize="10" fill="#ffc15e">camera + transforms @ 20Hz</text>
        <circle r="4.5" fill="#ffc15e" className="packet" style={{ offsetPath: "path('M 576 270 L 352 270')", animationDelay: "0.7s" }} />
        <circle r="4.5" fill="#ffc15e" className="packet" style={{ offsetPath: "path('M 576 270 L 352 270')", animationDelay: "2.1s" }} />

        <text x="398" y="215" fontFamily="IBM Plex Mono" fontSize="10" fill="#7e9fbe">structuredClone · zero canvas copies</text>
      </svg>
    </div>
  );
}

function ResolutionLab() {
  const [scale, setScale] = useState(100);
  const w = Math.round((1920 * scale) / 100);
  const h = Math.round((1080 * scale) / 100);
  const mp = ((w * h) / 1e6).toFixed(2);
  const ms = 23 * Math.pow(scale / 100, 2);
  const fps = ms <= 16.6 ? 60 : Math.round(1000 / ms);
  const status =
    fps >= 55
      ? { t: "BUDGET MET", cls: "text-ok border-ok/60" }
      : fps >= 45
        ? { t: "MARGINAL", cls: "text-amber border-amber/60" }
        : { t: "OVER BUDGET", cls: "text-alert border-alert/60" };
  let suggest = 40;
  for (let s = 100; s >= 40; s -= 5) {
    if (23 * Math.pow(s / 100, 2) <= 17.2) {
      suggest = s;
      break;
    }
  }

  return (
    <div className="plate p-5 md:p-7">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
        <span className="font-mono text-[10px] tracking-[0.28em] text-muted">FIG. 3 — ADAPTIVE RESOLUTION SANDBOX</span>
        <span className={`font-mono text-[10px] tracking-[0.2em] border px-2 py-0.5 ${status.cls}`}>{status.t}</span>
      </div>
      <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-7">
        <div>
          <p className="text-[13.5px] leading-relaxed text-paper/85 mb-5">
            The GPU bill is <span className="text-cyan">quadratic in resolution</span>. When average frame time creeps past 16.6ms,
            the engine shrinks its render buffer and CSS scales it back up — a little clarity traded for the whole frame budget.
            Drag the scaler on a simulated low-end iGPU profile (23ms native fill):
          </p>
          <div className="mb-5">
            <div className="flex justify-between font-mono text-[11px] text-muted mb-2">
              <span>RENDER SCALE</span>
              <span className="text-cyan">{scale}%</span>
            </div>
            <input
              type="range"
              min={40}
              max={100}
              step={5}
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="w-full accent-[#63c5ff] cursor-pointer"
              aria-label="Render scale percentage"
            />
            <div className="flex justify-between font-mono text-[9px] text-muted mt-1">
              <span>40%</span><span>70%</span><span>100%</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="border border-line p-3">
              <div className="font-mono text-[9px] tracking-[0.2em] text-muted">BUFFER</div>
              <div className="font-mono text-[15px] text-paper mt-1">{w}×{h}</div>
            </div>
            <div className="border border-line p-3">
              <div className="font-mono text-[9px] tracking-[0.2em] text-muted">PIXELS / FRAME</div>
              <div className="font-mono text-[15px] text-paper mt-1">{mp} MP</div>
            </div>
            <div className="border border-line p-3">
              <div className="font-mono text-[9px] tracking-[0.2em] text-muted">EST. FILL TIME</div>
              <div className="font-mono text-[15px] text-paper mt-1">{ms.toFixed(1)} ms</div>
            </div>
            <div className="border border-line p-3">
              <div className="font-mono text-[9px] tracking-[0.2em] text-muted">PROJECTED</div>
              <div className="font-display text-3xl leading-none mt-0.5" style={{ color: fps >= 55 ? "#64dfa0" : fps >= 45 ? "#ffc15e" : "#ff6e5a" }}>
                {fps} FPS
              </div>
            </div>
          </div>
          <button
            onClick={() => setScale(suggest)}
            className="mt-4 font-mono text-[11px] tracking-[0.18em] text-cyan border border-cyan/60 px-4 py-2 hover:bg-cyan hover:text-ink transition-colors"
          >
            APPLY AUTO-SUGGEST ({suggest}%)
          </button>
          <p className="mt-3 font-mono text-[10px] text-muted leading-relaxed">
            Profile with Spector.js in dev; the resize handler re-evaluates every 2s of rolling frame time.
          </p>
        </div>
        <div>
          <div className="relative border border-line2 bg-ink overflow-hidden aspect-video">
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src={CITY_FRAME}
                alt="City render preview at the selected buffer scale"
                className="max-w-full max-h-full transition-[width,height] duration-200 ease-out"
                style={{
                  width: `${scale}%`,
                  height: `${scale}%`,
                  objectFit: "cover",
                  imageRendering: scale < 100 ? "pixelated" : "auto",
                }}
              />
            </div>
            <span className="absolute top-2 left-2 font-mono text-[9px] tracking-[0.2em] text-cyan bg-ink/80 border border-line px-2 py-1">
              RENDER BUFFER · {scale}%
            </span>
            <span className="absolute bottom-2 right-2 font-mono text-[9px] tracking-[0.2em] text-muted bg-ink/80 border border-line px-2 py-1">
              CSS UPSCALE → 100%
            </span>
          </div>
          <div className="mt-2 font-mono text-[10px] text-muted">
            Live preview: the buffer downsamples, the viewport stays full-size. At {suggest}% this profile clears 60 FPS.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EngineSection() {
  return (
    <Sheet
      id="sheet-02"
      no="02"
      title="ENGINE & RENDER PIPELINE"
      kicker="SHEET 02 — STACK · OFFSCREEN WORKER · ADAPTIVE RESOLUTION"
      stamp="ARCHITECTURE"
    >
      <div className="grid lg:grid-cols-3 gap-5 mb-10">
        <Reveal><FailureNote /></Reveal>
        <Reveal delay={120} className="lg:col-span-2"><EnginePicks /></Reveal>
      </div>

      <Reveal className="mb-10">
        <ArchDiagram />
      </Reveal>

      <div className="grid md:grid-cols-5 gap-3 mb-10">
        {ENGINE_STEPS.map((s, i) => (
          <Reveal key={s.step} delay={i * 80}>
            <div className="plate p-4 h-full group hover:border-cyan/70 transition-colors duration-300">
              <div className="font-display text-4xl txt-outline-faint group-hover:text-cyan group-hover:[-webkit-text-stroke:0px] transition-colors">
                {s.step}
              </div>
              <div className="font-mono text-[11px] tracking-[0.14em] text-paper mt-2 uppercase">{s.title}</div>
              <p className="text-[12px] text-muted leading-snug mt-2">{s.body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <ResolutionLab />
      </Reveal>
    </Sheet>
  );
}
