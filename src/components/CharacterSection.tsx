--- src/components/CharacterSection.tsx (原始)


+++ src/components/CharacterSection.tsx (修改后)
import { CHARACTERS, DMG_COLOR, type Character } from "../data";
import { Reveal, Sheet, Stamp } from "./chrome";

/* ------------------------- shared protagonist picker ------------------------- */

export function ProtagonistPicker({
  charId,
  onChange,
  compact = false,
}: {
  charId: string;
  onChange: (id: string) => void;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {CHARACTERS.map((c) => (
          <button
            key={c.id}
            onClick={() => onChange(c.id)}
            className={`font-mono text-[11px] tracking-[0.14em] px-3 py-1.5 border transition-colors cursor-pointer ${
              charId === c.id
                ? "text-ink bg-cyan border-cyan"
                : "text-muted border-line hover:text-cyan hover:border-cyan/60"
            }`}
          >
            {c.name.split(" ")[0].toUpperCase()}
          </button>
        ))}
      </div>
    );
  }
  return (
    <div className="grid sm:grid-cols-3 gap-4">
      {CHARACTERS.map((c) => {
        const active = charId === c.id;
        return (
          <button
            key={c.id}
            onClick={() => onChange(c.id)}
            aria-pressed={active}
            className={`group relative text-left border p-4 flex items-center gap-4 transition-all duration-300 cursor-pointer ${
              active
                ? "border-cyan bg-ink3/80 shadow-[0_0_30px_rgba(99,197,255,0.12)]"
                : "border-line bg-ink2/50 hover:border-line2 hover:-translate-y-0.5"
            }`}
          >
            <img
              src={c.portrait}
              alt={c.name}
              loading="lazy"
              className="w-16 h-20 object-cover object-top border border-line shrink-0"
            />
            <span className="min-w-0">
              <span className="block font-display text-2xl leading-none text-paper group-hover:text-cyan transition-colors">
                {c.name.toUpperCase()}
              </span>
              <span className="block font-mono text-[10px] tracking-[0.18em] mt-1.5" style={{ color: DMG_COLOR[c.element] }}>
                {c.alias} · {c.element.toUpperCase()}
              </span>
              <span className="block text-[11.5px] text-muted mt-1 truncate">{c.role}</span>
            </span>
            {active && (
              <span className="absolute -top-2.5 -right-2">
                <Stamp tone="cyan">ACTIVE</Stamp>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------ FSM diagram ------------------------------ */

function FsmDiagram({ color }: { color: string }) {
  const node = "fill-[#0e2d52] transition-all duration-300 hover:stroke-[#63c5ff]";
  return (
    <svg viewBox="0 0 720 230" className="w-full" role="img" aria-label="Character animation state machine: idle to walk to run to cast, with jump and death branches">
      <defs>
        <marker id="fsmArr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill={color} />
        </marker>
      </defs>
      {/* main row */}
      {[
        { x: 16, label: "IDLE" },
        { x: 200, label: "WALK" },
        { x: 384, label: "RUN" },
        { x: 568, label: "CAST" },
      ].map((n) => (
        <g key={n.label}>
          <rect x={n.x} y="34" width="136" height="46" className={node} stroke="#2e6399" strokeWidth="1.4" />
          <text x={n.x + 68} y="63" textAnchor="middle" fontFamily="Bebas Neue" fontSize="22" fill="#d9e9f7" letterSpacing="2">
            {n.label}
          </text>
        </g>
      ))}
      <line x1="152" y1="57" x2="194" y2="57" stroke={color} strokeWidth="1.4" markerEnd="url(#fsmArr)" />
      <text x="158" y="47" fontFamily="IBM Plex Mono" fontSize="9" fill="#7e9fbe">vel&gt;0</text>
      <line x1="336" y1="57" x2="378" y2="57" stroke={color} strokeWidth="1.4" markerEnd="url(#fsmArr)" />
      <text x="340" y="47" fontFamily="IBM Plex Mono" fontSize="9" fill="#7e9fbe">v&gt;runTh</text>
      <line x1="520" y1="57" x2="562" y2="57" stroke={color} strokeWidth="1.4" markerEnd="url(#fsmArr)" />
      <text x="522" y="47" fontFamily="IBM Plex Mono" fontSize="9" fill="#7e9fbe">ability✓</text>
      {/* return arrows */}
      <path d="M568 92 Q 380 128 210 92" fill="none" stroke={color} strokeWidth="1.1" opacity="0.6" markerEnd="url(#fsmArr)" />
      <text x="330" y="120" fontFamily="IBM Plex Mono" fontSize="9" fill="#7e9fbe">clip done → blend to idle</text>
      {/* jump */}
      <rect x="250" y="158" width="136" height="44" className={node} stroke="#2e6399" strokeWidth="1.4" />
      <text x="318" y="186" textAnchor="middle" fontFamily="Bebas Neue" fontSize="22" fill="#d9e9f7" letterSpacing="2">JUMP</text>
      <line x1="282" y1="86" x2="296" y2="152" stroke={color} strokeWidth="1.1" markerEnd="url(#fsmArr)" />
      <text x="240" y="124" fontFamily="IBM Plex Mono" fontSize="9" fill="#7e9fbe">grounded &amp; space</text>
      <line x1="352" y1="158" x2="420" y2="88" stroke={color} strokeWidth="1.1" opacity="0.6" markerEnd="url(#fsmArr)" />
      <text x="392" y="136" fontFamily="IBM Plex Mono" fontSize="9" fill="#7e9fbe">landed</text>
      {/* death */}
      <rect x="568" y="158" width="136" height="44" className={node} stroke="#ff6e5a" strokeWidth="1.2" strokeDasharray="5 4" />
      <text x="636" y="186" textAnchor="middle" fontFamily="Bebas Neue" fontSize="22" fill="#ff6e5a" letterSpacing="2">DEATH</text>
      <line x1="560" y1="86" x2="606" y2="154" stroke="#ff6e5a" strokeWidth="1.1" strokeDasharray="4 4" markerEnd="url(#fsmArr)" />
      <text x="556" y="128" fontFamily="IBM Plex Mono" fontSize="9" fill="#ff6e5a">hp&lt;=0</text>
    </svg>
  );
}

/* ------------------------------ main section ------------------------------ */

export default function CharacterSection({
  charId,
  onChange,
}: {
  charId: string;
  onChange: (id: string) => void;
}) {
  const ch: Character = CHARACTERS.find((c) => c.id === charId) ?? CHARACTERS[0];
  const accent = DMG_COLOR[ch.element];

  return (
    <Sheet
      id="sheet-04"
      no="04"
      title="CHARACTER SYSTEM"
      kicker="SHEET 04 — PROTAGONIST SELECT · LAYERS · ANIMATION FSM"
      stamp="3 LEADS"
    >
      <Reveal className="mb-10">
        <div className="font-mono text-[10px] tracking-[0.28em] text-muted mb-3">
          MAIN MENU → CHARACTER SELECT — the pick carries into the combat lab and mission desk
        </div>
        <ProtagonistPicker charId={charId} onChange={onChange} />
      </Reveal>

      <div className="grid lg:grid-cols-[0.82fr_1.18fr] gap-6 mb-10">
        {/* portrait plate */}
        <Reveal>
          <div className="plate p-4 h-full">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[10px] tracking-[0.24em] text-muted">FIG. 5 — MODEL REFERENCE</span>
              <span className="font-mono text-[10px]" style={{ color: accent }}>{ch.jp}</span>
            </div>
            <div className="relative overflow-hidden border border-line2">
              <img
                src={ch.portrait}
                alt={`${ch.name} full-body concept sheet`}
                loading="lazy"
                className="w-full h-[420px] object-cover object-top transition-transform duration-700 hover:scale-[1.03]"
              />
              <div className="absolute left-3 top-6 hidden md:block font-mono text-[9px] tracking-wider text-cyan bg-ink/85 border border-line px-2 py-1">
                {ch.layers[2].name.toUpperCase()} · {ch.layers[2].tech.toUpperCase()}
              </div>
              <div className="absolute right-3 bottom-6 hidden md:block font-mono text-[9px] tracking-wider bg-ink/85 border border-line px-2 py-1" style={{ color: accent }}>
                &lt;5K TRIS · DRACO · LOD0
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <div className="font-mono text-[9px] tracking-[0.24em] text-muted mb-2">EXTRACTED PALETTE</div>
                <div className="flex gap-1.5">
                  {ch.palette.map((p) => (
                    <div key={p} className="flex-1 h-8 border border-line" style={{ backgroundColor: p }} title={p} />
                  ))}
                </div>
              </div>
              <div>
                <div className="font-mono text-[9px] tracking-[0.24em] text-muted mb-2">COMBAT PROFILE</div>
                <div className="space-y-1.5">
                  {ch.stats.map((s) => (
                    <div key={s.label} className="flex items-center gap-2">
                      <span className="font-mono text-[9px] text-muted w-16">{s.label}</span>
                      <div className="flex-1 h-1.5 bg-ink border border-line/60">
                        <div className="h-full transition-all duration-700" style={{ width: `${s.value}%`, backgroundColor: accent }} />
                      </div>
                      <span className="font-mono text-[9px] text-paper/80 w-6 text-right">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* dossier */}
        <Reveal delay={120}>
          <div className="h-full flex flex-col gap-5">
            <div>
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <h3 className="font-display text-5xl md:text-6xl leading-none text-paper">{ch.name.toUpperCase()}</h3>
                <span className="font-mono text-[11px] tracking-[0.2em]" style={{ color: accent }}>"{ch.alias}"</span>
              </div>
              <div className="mt-2 text-[13px] text-muted font-mono tracking-wide">{ch.role}</div>
              <p className="mt-3 text-[14.5px] leading-relaxed text-paper/85 max-w-xl">{ch.lore}</p>
            </div>

            <div className="plate p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[10px] tracking-[0.24em] text-muted">LAYER DECOMPOSITION — WIND, CLOTH, VFX SEPARATED</span>
              </div>
              <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
                {ch.layers.map((l, i) => (
                  <li key={l.name} className="flex items-baseline gap-3 border-b border-line/40 pb-2 group">
                    <span className="font-mono text-[10px] text-muted">L{i}</span>
                    <span className="font-mono text-[12px] text-cyan group-hover:text-paper transition-colors">{l.name}</span>
                    <span className="text-[11px] text-muted ml-auto text-right">{l.tech}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[12px] text-muted leading-snug">
                Hair, sleeves and scarves live on their own layers, offset and rotated against the body — the cheap 80% of
                single-image layer decomposition, bought without the research pipeline.
              </p>
            </div>

            <div className="plate p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] tracking-[0.24em] text-muted">FIG. 6 — ANIMATION FSM (PER CHARACTER)</span>
                <span className="font-mono text-[10px] text-cyan">crossfades on every edge</span>
              </div>
              <FsmDiagram color={accent} />
            </div>
          </div>
        </Reveal>
      </div>

      {/* animation timing table */}
      <Reveal>
        <div className="plate overflow-hidden">
          <div className="border-b border-line px-4 py-2 bg-ink3/60 flex items-center justify-between">
            <span className="font-mono text-[10px] tracking-[0.25em] text-muted">TABLE 4.1 — PER-CLIP TIMING · {ch.alias}</span>
            <span className="font-mono text-[10px] text-cyan hidden sm:block">anime timing ≠ uniform loops</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="font-mono text-[10px] tracking-[0.2em] text-muted uppercase">
                  <th className="text-left py-2.5 px-4 border-b border-line2 font-medium">Clip</th>
                  <th className="text-left py-2.5 px-4 border-b border-line2 font-medium">Rate</th>
                  <th className="text-left py-2.5 px-4 border-b border-line2 font-medium">Frames</th>
                  <th className="text-left py-2.5 px-4 border-b border-line2 font-medium w-[38%]">Director's note</th>
                </tr>
              </thead>
              <tbody>
                {ch.animTable.map((a) => (
                  <tr key={a.clip} className="border-b border-line/40 last:border-0 hover:bg-ink3/50 transition-colors">
                    <td className="py-2.5 px-4 font-mono text-[12px] text-cyan">{a.clip}</td>
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[12px] text-paper">{a.fps} fps</span>
                        <div className="w-24 h-1.5 bg-ink border border-line/60 hidden sm:block">
                          <div className="h-full" style={{ width: `${(a.fps / 24) * 100}%`, backgroundColor: accent }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 font-mono text-[12px] text-paper/80">{a.frames}</td>
                    <td className="py-2.5 px-4 text-[12.5px] text-muted">{a.note}</td>
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
