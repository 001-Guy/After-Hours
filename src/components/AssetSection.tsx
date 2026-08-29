--- src/components/AssetSection.tsx (原始)


+++ src/components/AssetSection.tsx (修改后)
import { ASSET_TABLE, STAT_TILES } from "../data";
import { Reveal, Sheet } from "./chrome";

function TerminalCard() {
  return (
    <div className="plate overflow-hidden h-full">
      <div className="flex items-center justify-between border-b border-line px-4 py-2 bg-ink3/60">
        <span className="font-mono text-[10px] tracking-[0.25em] text-muted">DEV SHELL — ASSET SERVING</span>
        <span className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-alert/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-ok/80" />
        </span>
      </div>
      <div className="p-5 font-mono text-[12px] leading-[1.9]">
        <p>
          <span className="text-ok">$ </span>
          <span className="text-paper">python -m http.server 8000</span>
        </p>
        <p className="text-muted">Serving HTTP on 0.0.0.0 port 8000 (http://localhost:8000/) ...</p>
        <p className="text-cyan/90">GET /assets/textures/portland_atlas.ktx2&nbsp;&nbsp;→ 200 · 41ms</p>
        <p className="text-cyan/90">GET /assets/models/kaito_lod0.glb&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ 200 · 63ms</p>
        <p className="text-cyan/90">GET /assets/spritesheets/yui_atlas.webp&nbsp;&nbsp;→ 200 · 22ms</p>
        <p className="text-alert">✗ file:// blocks every fetch() — browser CORS policy</p>
        <p className="text-ok">✓ serve over HTTP in dev; mirror production exactly</p>
        <p>
          <span className="text-ok">$ </span>
          <span className="cursor-blink text-cyan">█</span>
        </p>
      </div>
    </div>
  );
}

function TreeCard() {
  return (
    <div className="plate overflow-hidden h-full">
      <div className="flex items-center justify-between border-b border-line px-4 py-2 bg-ink3/60">
        <span className="font-mono text-[10px] tracking-[0.25em] text-muted">PROJECT TREE — REQUEST MINIMIZED</span>
        <span className="font-mono text-[10px] text-cyan">git init ✓</span>
      </div>
      <pre className="p-5 font-mono text-[12px] leading-[1.9] text-paper/85 overflow-x-auto">
{`liberty-protocol/
├─ assets/
│  ├─ models/         *.glb   draco-compressed
│  ├─ textures/       *.ktx2  basis + mipmaps
│  ├─ spritesheets/   *.webp  one atlas per lead
│  └─ audio/          *.ogg   stream, don't preload
├─ src/
│  ├─ js/             game loop (worker context)
│  ├─ scenes/         district generators
│  └─ ui/             DOM HUD over canvas
├─ raw/               drop zone → auto-optimized
└─ pipeline.config.json`}
      </pre>
    </div>
  );
}

const TONE: Record<string, string> = {
  cyan: "text-cyan",
  alert: "text-alert",
  ok: "text-ok",
  amber: "text-amber",
};

function PipelineDiagram() {
  return (
    <div className="plate p-4 md:p-6 overflow-x-auto">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[10px] tracking-[0.28em] text-muted">FIG. 1 — AUTOMATED ASSET PIPELINE</span>
        <span className="font-mono text-[10px] text-cyan hidden sm:block">pipeline.mjs --watch</span>
      </div>
      <svg viewBox="0 0 920 260" className="w-full min-w-[720px]" role="img" aria-label="Asset pipeline: raw sources are converted by squoosh, toktx and gltfpack into webp, ktx2, glb and ogg assets">
        <defs>
          <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill="#2e6399" />
          </marker>
        </defs>

        {/* RAW */}
        <rect x="20" y="60" width="190" height="150" fill="rgba(14,45,82,0.55)" stroke="#2e6399" />
        <text x="36" y="86" fontFamily="IBM Plex Mono" fontSize="11" fill="#63c5ff" letterSpacing="2">RAW / SOURCE</text>
        <text x="36" y="116" fontFamily="IBM Plex Mono" fontSize="11" fill="#d9e9f7" opacity="0.75">PSD · 4K renders</text>
        <text x="36" y="140" fontFamily="IBM Plex Mono" fontSize="11" fill="#d9e9f7" opacity="0.75">FBX · hi-poly sculpts</text>
        <text x="36" y="164" fontFamily="IBM Plex Mono" fontSize="11" fill="#d9e9f7" opacity="0.75">WAV masters</text>
        <text x="36" y="188" fontFamily="IBM Plex Mono" fontSize="11" fill="#7e9fbe">never shipped as-is</text>

        {/* arrows 1 */}
        <line x1="210" y1="135" x2="322" y2="135" stroke="#2e6399" strokeWidth="1.6" className="dash-flow" markerEnd="url(#arr)" />
        <text x="228" y="120" fontFamily="IBM Plex Mono" fontSize="10" fill="#64dfa0">25–34% ↓</text>

        {/* PROCESS */}
        <rect x="330" y="28" width="260" height="214" fill="rgba(14,45,82,0.55)" stroke="#2e6399" />
        <text x="346" y="54" fontFamily="IBM Plex Mono" fontSize="11" fill="#63c5ff" letterSpacing="2">PIPELINE (NODE WATCHER)</text>
        <text x="346" y="88" fontFamily="IBM Plex Mono" fontSize="11" fill="#d9e9f7" opacity="0.85">squoosh-cli&nbsp;&nbsp;→&nbsp;.webp</text>
        <text x="346" y="116" fontFamily="IBM Plex Mono" fontSize="11" fill="#d9e9f7" opacity="0.85">toktx / basisu → .ktx2</text>
        <text x="346" y="144" fontFamily="IBM Plex Mono" fontSize="11" fill="#d9e9f7" opacity="0.85">gltfpack + draco → .glb</text>
        <text x="346" y="172" fontFamily="IBM Plex Mono" fontSize="11" fill="#d9e9f7" opacity="0.85">loudnorm&nbsp;&nbsp;&nbsp;&nbsp;→ .ogg</text>
        <text x="346" y="206" fontFamily="IBM Plex Mono" fontSize="10" fill="#7e9fbe">runs on every file dropped</text>
        <text x="346" y="222" fontFamily="IBM Plex Mono" fontSize="10" fill="#7e9fbe">into /raw — zero manual steps</text>

        {/* arrows 2 */}
        <line x1="590" y1="135" x2="702" y2="135" stroke="#2e6399" strokeWidth="1.6" className="dash-flow" markerEnd="url(#arr)" />
        <text x="604" y="120" fontFamily="IBM Plex Mono" fontSize="10" fill="#64dfa0">GPU-resident ↓</text>

        {/* SHIP */}
        <rect x="710" y="60" width="190" height="150" fill="rgba(14,45,82,0.55)" stroke="#2e6399" />
        <text x="726" y="86" fontFamily="IBM Plex Mono" fontSize="11" fill="#63c5ff" letterSpacing="2">SHIP / ASSETS</text>
        <text x="726" y="116" fontFamily="IBM Plex Mono" fontSize="11" fill="#d9e9f7" opacity="0.85">.webp&nbsp;&nbsp;.ktx2</text>
        <text x="726" y="140" fontFamily="IBM Plex Mono" fontSize="11" fill="#d9e9f7" opacity="0.85">.glb&nbsp;&nbsp;&nbsp;.ogg</text>
        <text x="726" y="170" fontFamily="IBM Plex Mono" fontSize="10" fill="#ffc15e">character atlas 1024²</text>
        <text x="726" y="188" fontFamily="IBM Plex Mono" fontSize="10" fill="#ffc15e">packed, one draw call</text>
      </svg>
    </div>
  );
}

export default function AssetSection() {
  return (
    <Sheet
      id="sheet-01"
      no="01"
      title="FOUNDATION & ASSET PIPELINE"
      kicker="SHEET 01 — PROJECT SETUP · FORMATS · COMPRESSION"
      stamp="LOCKED"
    >
      <div className="grid lg:grid-cols-2 gap-5 mb-10">
        <Reveal><TerminalCard /></Reveal>
        <Reveal delay={120}><TreeCard /></Reveal>
      </div>

      <Reveal>
        <p className="max-w-3xl text-[15px] leading-relaxed text-paper/85 mb-8">
          The first build failed because fidelity was planned <em className="not-italic text-cyan">after</em> performance. This set
          inverts that: every asset is converted at the source and stays compressed all the way to the GPU. WebP carries the UI,
          KTX2/Basis carries anything the fragment shader touches, and Draco carries the geometry — so a 4096² texture stops
          costing 64MB of VRAM the moment it lands in the pipeline.
        </p>
      </Reveal>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
        {STAT_TILES.map((t, i) => (
          <Reveal key={t.big} delay={i * 70}>
            <div className="plate p-4 h-full group hover:border-cyan/70 transition-colors duration-300">
              <div className={`font-display text-4xl lg:text-[2.6rem] leading-none ${TONE[t.tone]} group-hover:drop-shadow-[0_0_16px_rgba(99,197,255,0.4)] transition-all`}>
                {t.big}
              </div>
              <div className="font-mono text-[10px] tracking-[0.14em] text-paper/90 mt-3 uppercase">{t.label}</div>
              <div className="text-[12px] text-muted mt-1.5 leading-snug">{t.sub}</div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mb-10">
        <PipelineDiagram />
      </Reveal>

      <Reveal>
        <div className="plate overflow-hidden">
          <div className="border-b border-line px-4 py-2 bg-ink3/60 flex items-center justify-between">
            <span className="font-mono text-[10px] tracking-[0.25em] text-muted">TABLE 1.1 — ASSET SPECIFICATIONS</span>
            <span className="font-mono text-[10px] text-cyan hidden sm:block">NON-NEGOTIABLE</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] border-collapse">
              <thead>
                <tr className="font-mono text-[10px] tracking-[0.2em] text-muted uppercase">
                  <th className="text-left py-3 px-4 border-b border-line2 font-medium">Category</th>
                  <th className="text-left py-3 px-4 border-b border-line2 font-medium">Format</th>
                  <th className="text-left py-3 px-4 border-b border-line2 font-medium">Optimization</th>
                  <th className="text-left py-3 px-4 border-b border-line2 font-medium">Rationale</th>
                </tr>
              </thead>
              <tbody>
                {ASSET_TABLE.map((r) => (
                  <tr key={r.category} className="group border-b border-line/50 last:border-0 hover:bg-ink3/50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-paper whitespace-nowrap">{r.category}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className="font-mono text-[11px] px-2 py-0.5 border whitespace-nowrap"
                        style={{ color: r.chip, borderColor: `${r.chip}66` }}
                      >
                        {r.format}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-paper/85">{r.technique}</td>
                    <td className="py-3.5 px-4 text-[13px] text-muted leading-snug">{r.rationale}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>
    </Sheet>
  );
}
