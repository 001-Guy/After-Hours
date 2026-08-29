--- src/components/MissionSection.tsx (原始)


+++ src/components/MissionSection.tsx (修改后)
import { useEffect, useRef, useState } from "react";
import { CHARACTERS, DMG_COLOR, type Character, type Mission } from "../data";
import { Reveal, Sheet, Stamp, prefersReducedMotion } from "./chrome";
import { ProtagonistPicker } from "./CharacterSection";

/* ------------------------------ dialogue player ------------------------------ */

function DialoguePlayer({ mission, accent }: { mission: Mission; accent: string }) {
  const [idx, setIdx] = useState(-1);
  const [chars, setChars] = useState(0);
  const reduced = useRef(prefersReducedMotion());

  useEffect(() => {
    setIdx(-1);
    setChars(0);
  }, [mission.id]);

  const line = idx >= 0 ? mission.dialogue[idx] : null;
  const full = line ? line.text : "";
  const typing = line !== null && chars < full.length;

  useEffect(() => {
    if (!line || reduced.current || chars >= full.length) return;
    const id = setTimeout(() => setChars((c) => c + 1), 20);
    return () => clearTimeout(id);
  }, [chars, line, full]);

  const advance = () => {
    if (idx === -1) {
      setIdx(0);
      setChars(reduced.current ? mission.dialogue[0].text.length : 0);
      return;
    }
    if (typing) {
      setChars(full.length);
      return;
    }
    if (idx < mission.dialogue.length - 1) {
      const next = idx + 1;
      setIdx(next);
      setChars(reduced.current ? mission.dialogue[next].text.length : 0);
    } else {
      setIdx(-1);
      setChars(0);
    }
  };

  const atEnd = idx === mission.dialogue.length - 1 && !typing;

  return (
    <div className="border border-line bg-ink p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[10px] tracking-[0.24em] text-muted">DIALOGUE EVENT STREAM</span>
        <span className="font-mono text-[10px] text-cyan">
          {idx === -1 ? "STANDBY" : `${idx + 1}/${mission.dialogue.length}`}
        </span>
      </div>
      <div className="min-h-[110px] flex flex-col justify-end">
        {line ? (
          <>
            <div
              className="font-mono text-[10px] tracking-[0.2em] mb-1.5 inline-block border px-2 py-0.5 self-start"
              style={{ color: accent, borderColor: `${accent}66` }}
            >
              {line.speaker.toUpperCase()}
            </div>
            <p className="text-[14px] text-paper/90 leading-relaxed">
              {full.slice(0, chars)}
              {typing && <span className="cursor-blink text-cyan">▌</span>}
            </p>
          </>
        ) : (
          <p className="font-mono text-[11px] text-muted">
            ▸ {mission.dialogue.length} lines queued from dialogueEvents[] — run the scene to preview delivery.
          </p>
        )}
      </div>
      <button
        onClick={advance}
        className="mt-3 font-mono text-[11px] tracking-[0.18em] border border-cyan/60 text-cyan px-4 py-2 hover:bg-cyan hover:text-ink transition-colors cursor-pointer"
      >
        {idx === -1 ? "▶ RUN DIALOGUE" : typing ? "▸▸ SKIP TYPING" : atEnd ? "↺ REPLAY SCENE" : "▼ NEXT LINE"}
      </button>
    </div>
  );
}

/* ------------------------------- mission desk ------------------------------- */

function MissionDesk({ ch }: { ch: Character }) {
  const [missionId, setMissionId] = useState(ch.missions[0].id);
  const [checked, setChecked] = useState<Record<string, boolean[]>>({});
  const accent = DMG_COLOR[ch.element];

  useEffect(() => {
    setMissionId(ch.missions[0].id);
  }, [ch.id]);

  const mission = ch.missions.find((m) => m.id === missionId) ?? ch.missions[0];
  const marks = checked[mission.id] ?? mission.objectives.map((o) => o.done);
  const doneCount = marks.filter(Boolean).length;

  const toggle = (i: number) => {
    setChecked((c) => {
      const cur = c[mission.id] ?? mission.objectives.map((o) => o.done);
      const next = cur.map((v, j) => (j === i ? !v : v));
      return { ...c, [mission.id]: next };
    });
  };

  return (
    <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-5 items-start">
      {/* list */}
      <div className="space-y-3">
        <div className="font-mono text-[10px] tracking-[0.28em] text-muted">MISSION LOG — {ch.alias}</div>
        {ch.missions.map((m) => {
          const active = m.id === missionId;
          return (
            <button
              key={m.id}
              onClick={() => setMissionId(m.id)}
              className={`w-full text-left border p-4 transition-all duration-200 cursor-pointer group ${
                active ? "border-cyan bg-ink3/70" : "border-line bg-ink2/50 hover:border-line2 hover:-translate-y-0.5"
              }`}
            >
              <div className="flex items-center justify-between gap-3 mb-1.5">
                <span className="font-display text-2xl leading-none text-paper group-hover:text-cyan transition-colors">
                  {m.title.toUpperCase()}
                </span>
                <Stamp tone={m.status === "active" ? "amber" : m.status === "completed" ? "ok" : "cyan"}>{m.status}</Stamp>
              </div>
              <div className="font-mono text-[10px] tracking-[0.16em] text-muted">
                {m.giver.toUpperCase()} · {m.district.toUpperCase()} · {m.objectives.length} OBJECTIVES
              </div>
              <p className="text-[12.5px] text-muted leading-snug mt-2">{m.summary}</p>
            </button>
          );
        })}
        <div className="border border-line/60 p-3 font-mono text-[10.5px] text-muted leading-relaxed">
          Status machine: <span className="text-paper/85">available → active → completed</span>, with{" "}
          <span className="text-alert">failed</span> on death or timer. State persists to the save blob as plain JSON.
        </div>
      </div>

      {/* detail */}
      <div className="plate p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
          <span className="font-mono text-[10px] tracking-[0.24em] text-cyan">{mission.id.toUpperCase()}</span>
          <span className="font-mono text-[10px] text-muted">{mission.district.toUpperCase()} DISTRICT</span>
        </div>
        <h3 className="font-display text-4xl text-paper leading-none mb-3">{mission.title.toUpperCase()}</h3>

        <div className="mb-4">
          <div className="flex justify-between font-mono text-[10px] text-muted mb-1.5">
            <span>OBJECTIVES</span>
            <span className="text-cyan">{doneCount}/{mission.objectives.length}</span>
          </div>
          <div className="h-1.5 bg-ink border border-line mb-3">
            <div className="h-full transition-all duration-300" style={{ width: `${(doneCount / mission.objectives.length) * 100}%`, backgroundColor: accent }} />
          </div>
          <ul className="space-y-2">
            {mission.objectives.map((o, i) => (
              <li key={o.text}>
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center gap-3 text-left group cursor-pointer"
                  aria-pressed={marks[i]}
                >
                  <span
                    className={`w-4 h-4 border flex items-center justify-center shrink-0 transition-colors ${
                      marks[i] ? "bg-cyan border-cyan" : "border-line2 group-hover:border-cyan"
                    }`}
                  >
                    {marks[i] && (
                      <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                        <path d="M1.5 5.5L4 8l4.5-6" fill="none" stroke="#06182b" strokeWidth="1.8" />
                      </svg>
                    )}
                  </span>
                  <span className={`text-[13px] transition-colors ${marks[i] ? "text-muted line-through" : "text-paper/90"}`}>
                    {o.text}
                  </span>
                  <span className="ml-auto font-mono text-[9px] tracking-wider text-muted border border-line/60 px-1.5 py-0.5 shrink-0">
                    {o.type}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <div className="font-mono text-[9px] tracking-[0.24em] text-muted mb-2">REQUIRED ABILITIES</div>
            <div className="flex flex-wrap gap-1.5">
              {mission.requiredAbilities.map((k) => {
                const ab = ch.abilities.find((a) => a.key === k);
                return (
                  <span key={k} className="font-mono text-[10px] px-2 py-1 border" style={{ color: accent, borderColor: `${accent}55` }}>
                    {ab ? ab.name : k}
                  </span>
                );
              })}
            </div>
          </div>
          <div>
            <div className="font-mono text-[9px] tracking-[0.24em] text-muted mb-2">REWARDS</div>
            <div className="space-y-1">
              {mission.rewards.map((r) => (
                <div key={r.label} className="flex justify-between font-mono text-[11px] border-b border-line/40 pb-1">
                  <span className="text-muted">{r.label}</span>
                  <span className="text-ok">{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialoguePlayer mission={mission} accent={accent} />
      </div>
    </div>
  );
}

/* --------------------------------- section --------------------------------- */

const FLOW = ["AVAILABLE", "ACTIVE", "COMPLETED"];

export default function MissionSection({
  charId,
  onChange,
}: {
  charId: string;
  onChange: (id: string) => void;
}) {
  const ch: Character = CHARACTERS.find((c) => c.id === charId) ?? CHARACTERS[0];

  return (
    <Sheet
      id="sheet-06"
      no="06"
      title="NARRATIVE ENGINE"
      kicker="SHEET 06 — DATA-DRIVEN MISSIONS · DIALOGUE · LORE"
      stamp="STORY LOCKED"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="font-mono text-[10px] tracking-[0.28em] text-muted mb-2">STORY THREAD</div>
          <ProtagonistPicker charId={charId} onChange={onChange} compact />
        </div>
        {/* status flow */}
        <div className="flex items-center gap-2" aria-label="Mission status flow">
          {FLOW.map((s, i) => (
            <span key={s} className="flex items-center gap-2">
              <span
                className={`font-mono text-[10px] tracking-[0.18em] border px-2.5 py-1.5 ${
                  i === 1 ? "text-amber border-amber/60" : i === 2 ? "text-ok border-ok/50" : "text-muted border-line"
                }`}
              >
                {s}
              </span>
              {i < FLOW.length - 1 && (
                <svg width="18" height="10" viewBox="0 0 18 10" aria-hidden="true">
                  <path d="M0 5h14M11 1l5 4-5 4" fill="none" stroke="#2e6399" strokeWidth="1.4" />
                </svg>
              )}
            </span>
          ))}
        </div>
      </div>

      <Reveal>
        <p className="max-w-3xl text-[15px] leading-relaxed text-paper/85 mb-8">
          Missions are authored, not coded: one JSON file carries every quest for every lead — objectives, required abilities,
          rewards and the dialogueEvents timeline. Each arc is written so it can only be solved with that protagonist's kit,
          and the whole narrative database stays compact enough for the weakest machine in the room.
        </p>
      </Reveal>

      <Reveal>
        <MissionDesk ch={ch} />
      </Reveal>
    </Sheet>
  );
}
