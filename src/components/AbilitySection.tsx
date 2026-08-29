--- src/components/AbilitySection.tsx (原始)


+++ src/components/AbilitySection.tsx (修改后)
import { useEffect, useRef, useState } from "react";
import { CHARACTERS, DMG_COLOR, HIT_TABLE, type Ability, type Character } from "../data";
import { Reveal, Sheet } from "./chrome";
import { ProtagonistPicker } from "./CharacterSection";

/* ------------------------------ JSON viewer ------------------------------ */

function JsonBlock({ obj }: { obj: Record<string, unknown> }) {
  const raw = JSON.stringify(obj, null, 2);
  const parts = raw.split(/("(?:[^"\\]|\\.)*")(\s*:)?/g);
  return (
    <pre className="font-mono text-[11.5px] leading-[1.75] overflow-x-auto">
      {parts.map((p, i) => {
        if (/^"/.test(p)) {
          const isKey = i + 1 < parts.length && parts[i + 1].includes(":");
          return (
            <span key={i} className={isKey ? "text-cyan" : "text-ember"}>
              {p}
            </span>
          );
        }
        return (
          <span key={i} className="text-paper/80">
            {p}
          </span>
        );
      })}
    </pre>
  );
}

/* ---------------------------- hit-detection icons ---------------------------- */

function HitIcon({ kind }: { kind: string }) {
  const stroke = "#63c5ff";
  if (kind === "ray")
    return (
      <svg width="46" height="34" viewBox="0 0 46 34" aria-hidden="true">
        <circle cx="5" cy="17" r="3" fill={stroke} />
        <line x1="9" y1="17" x2="32" y2="17" stroke={stroke} strokeWidth="1.4" />
        <rect x="32" y="7" width="11" height="20" fill="none" stroke="#2e6399" strokeWidth="1.3" />
        <circle cx="37" cy="17" r="2" fill="#ff6e5a" />
      </svg>
    );
  if (kind === "swept")
    return (
      <svg width="46" height="34" viewBox="0 0 46 34" aria-hidden="true">
        <circle cx="8" cy="24" r="5" fill="none" stroke={stroke} strokeWidth="1.3" />
        <circle cx="34" cy="10" r="5" fill="none" stroke={stroke} strokeWidth="1.3" />
        <line x1="11" y1="20" x2="31" y2="13" stroke={stroke} strokeWidth="1.2" strokeDasharray="3 3" />
        <line x1="10" y1="29" x2="32" y2="15" stroke={stroke} strokeWidth="1.2" strokeDasharray="3 3" />
      </svg>
    );
  if (kind === "aoe")
    return (
      <svg width="46" height="34" viewBox="0 0 46 34" aria-hidden="true">
        <circle cx="23" cy="17" r="4" fill={stroke} opacity="0.85" />
        <circle cx="23" cy="17" r="9" fill="none" stroke={stroke} strokeWidth="1.2" opacity="0.6" />
        <circle cx="23" cy="17" r="14" fill="none" stroke={stroke} strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
      </svg>
    );
  return (
    <svg width="46" height="34" viewBox="0 0 46 34" aria-hidden="true">
      <rect x="8" y="8" width="18" height="18" fill="none" stroke={stroke} strokeWidth="1.3" />
      <rect x="20" y="12" width="18" height="18" fill="none" stroke="#ffc15e" strokeWidth="1.2" strokeDasharray="3 3" />
      <circle cx="26" cy="17" r="2.4" fill="#ff6e5a" className="pulse-dot" />
    </svg>
  );
}

/* -------------------------------- combat lab -------------------------------- */

type LogKind = "hit" | "warn" | "sys";

function AbilityLab({ ch }: { ch: Character }) {
  const [resource, setResource] = useState(100);
  const [dummyHp, setDummyHp] = useState(1000);
  const [dummyDead, setDummyDead] = useState(false);
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});
  const [now, setNow] = useState(() => Date.now());
  const [log, setLog] = useState<{ t: string; text: string; kind: LogKind }[]>([]);
  const [floaters, setFloaters] = useState<{ id: number; dmg: number; color: string; x: number; crit: boolean; born: number }[]>([]);
  const [shakeKey, setShakeKey] = useState(0);
  const [denyKey, setDenyKey] = useState<Record<string, number>>({});
  const startRef = useRef(Date.now());
  const respawnRef = useRef(0);
  const logBoxRef = useRef<HTMLDivElement>(null);

  const pushLog = (text: string, kind: LogKind) => {
    const t = ((Date.now() - startRef.current) / 1000).toFixed(1).padStart(5, "0");
    setLog((l) => [...l.slice(-30), { t: `+${t}s`, text, kind }]);
  };

  useEffect(() => {
    pushLog(`${ch.alias} loadout online — 5 abilities bound to keys 1–5`, "sys");
    pushLog("training dummy: 1000 HP · i-frames 0.25s after each hit", "sys");
    setResource(100);
    setDummyHp(1000);
    setDummyDead(false);
    setCooldowns({});
    setFloaters([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ch.id]);

  useEffect(() => {
    const id = setInterval(() => {
      const t = Date.now();
      setNow(t);
      setResource((r) => Math.min(100, r + 0.9));
      if (dummyDead && t > respawnRef.current) {
        setDummyDead(false);
        setDummyHp(1000);
        pushLog("training dummy reconstructed — range is open", "sys");
      }
    }, 100);
    return () => clearInterval(id);
  }, [dummyDead]);

  useEffect(() => {
    const el = logBoxRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [log]);

  const cast = (a: Ability) => {
    const t = Date.now();
    const readyAt = cooldowns[a.key] ?? 0;
    if (t < readyAt) {
      setDenyKey((d) => ({ ...d, [a.key]: (d[a.key] ?? 0) + 1 }));
      pushLog(`${a.name} cooling down — ${((readyAt - t) / 1000).toFixed(1)}s left`, "warn");
      return;
    }
    if (resource < a.cost) {
      setDenyKey((d) => ({ ...d, [a.key]: (d[a.key] ?? 0) + 1 }));
      pushLog(`not enough resource for ${a.name} — needs ${a.cost}, pool at ${Math.floor(resource)}`, "warn");
      return;
    }
    setResource((r) => r - a.cost);
    setCooldowns((c) => ({ ...c, [a.key]: t + a.cd * 1000 }));

    if (a.damage === 0) {
      pushLog(`${a.name} active — ${a.desc.split("—")[0].trim().toLowerCase()}`, "sys");
      return;
    }
    if (dummyDead) {
      pushLog("no valid target — dummy is rebuilding", "warn");
      return;
    }
    const crit = Math.random() < 0.15;
    const dmg = Math.round(a.damage * (crit ? 1.5 : 1) * (0.9 + Math.random() * 0.2));
    const nhp = Math.max(0, dummyHp - dmg);
    setDummyHp(nhp);
    setShakeKey((k) => k + 1);
    setFloaters((f) => [
      ...f.slice(-6),
      { id: t + Math.random(), dmg, color: DMG_COLOR[a.damageType], x: 38 + Math.random() * 24, crit, born: t },
    ]);
    pushLog(`${crit ? "CRIT · " : ""}${a.name} → dummy · ${dmg} ${a.damageType}`, "hit");
    if (nhp <= 0) {
      setDummyDead(true);
      respawnRef.current = t + 3000;
      pushLog("dummy destroyed — reconstruction in 3.0s", "sys");
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tgt = e.target as HTMLElement | null;
      if (tgt && (tgt.tagName === "INPUT" || tgt.tagName === "TEXTAREA")) return;
      const i = parseInt(e.key, 10);
      if (i >= 1 && i <= ch.abilities.length) cast(ch.abilities[i - 1]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const visibleFloaters = floaters.filter((f) => now - f.born < 950);
  const hpPct = (dummyHp / 1000) * 100;

  return (
    <div className="plate p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <span className="font-mono text-[10px] tracking-[0.28em] text-muted">FIG. 7 — ABILITY SYSTEM SIMULATION</span>
        <span className="font-mono text-[10px] text-cyan">keys 1–5 cast · pool regens 9/s</span>
      </div>

      {/* target */}
      <div className="grid sm:grid-cols-[220px_1fr] gap-5 mb-5">
        <div className="relative border border-line bg-ink p-4 flex flex-col items-center justify-center min-h-[190px] overflow-hidden">
          <div key={shakeKey} className={`relative ${shakeKey > 0 && !dummyDead ? "dummy-hit" : ""}`}>
            <svg
              width="110"
              height="130"
              viewBox="0 0 110 130"
              className={`transition-all duration-500 ${dummyDead ? "opacity-25 rotate-90 translate-y-3" : ""}`}
              aria-hidden="true"
            >
              <circle cx="55" cy="28" r="17" fill="none" stroke="#7e9fbe" strokeWidth="2" />
              <circle cx="55" cy="28" r="7" fill="none" stroke="#ff6e5a" strokeWidth="1.6" />
              <rect x="30" y="50" width="50" height="56" fill="rgba(14,45,82,0.8)" stroke="#7e9fbe" strokeWidth="2" />
              <line x1="55" y1="50" x2="55" y2="106" stroke="#2e6399" strokeWidth="1.4" />
              <line x1="30" y1="78" x2="80" y2="78" stroke="#2e6399" strokeWidth="1.4" />
              <rect x="46" y="106" width="18" height="10" fill="none" stroke="#7e9fbe" strokeWidth="2" />
            </svg>
          </div>
          {visibleFloaters.map((f) => (
            <span
              key={f.id}
              className="floater absolute font-display text-3xl pointer-events-none"
              style={{ left: `${f.x}%`, top: "26%", color: f.color, textShadow: "0 2px 8px rgba(4,12,22,0.9)" }}
            >
              {f.dmg}
              {f.crit && <span className="text-[13px] align-top ml-0.5">CRIT</span>}
            </span>
          ))}
          <div className="absolute bottom-2 left-2 right-2">
            <div className="flex justify-between font-mono text-[9px] text-muted mb-1">
              <span>{dummyDead ? "REBUILDING…" : "TRAINING DUMMY"}</span>
              <span>{dummyHp}/1000</span>
            </div>
            <div className="h-2 bg-ink2 border border-line">
              <div
                className="h-full transition-all duration-200"
                style={{ width: `${hpPct}%`, backgroundColor: hpPct > 50 ? "#64dfa0" : hpPct > 20 ? "#ffc15e" : "#ff6e5a" }}
              />
            </div>
          </div>
        </div>

        {/* resource + log */}
        <div className="flex flex-col">
          <div className="mb-3">
            <div className="flex justify-between font-mono text-[10px] tracking-[0.18em] text-muted mb-1.5">
              <span>RESOURCE POOL — {ch.element.toUpperCase()}</span>
              <span className="text-cyan">{Math.floor(resource)} / 100</span>
            </div>
            <div className="h-3.5 bg-ink border border-line relative overflow-hidden">
              <div
                className="h-full transition-all duration-150"
                style={{ width: `${resource}%`, background: `linear-gradient(90deg, ${DMG_COLOR[ch.element]}88, ${DMG_COLOR[ch.element]})` }}
              />
              {[25, 50, 75].map((m) => (
                <span key={m} className="absolute top-0 bottom-0 w-px bg-ink/80" style={{ left: `${m}%` }} />
              ))}
            </div>
          </div>
          <div
            ref={logBoxRef}
            className="flex-1 min-h-[130px] max-h-[170px] overflow-y-auto border border-line bg-ink p-3 font-mono text-[11px] leading-[1.8]"
            aria-live="polite"
          >
            {log.map((l, i) => (
              <p key={i} className="flex gap-2">
                <span className="text-muted shrink-0">{l.t}</span>
                <span className={l.kind === "hit" ? "text-paper/90" : l.kind === "warn" ? "text-amber" : "text-cyan/80"}>
                  {l.text}
                </span>
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* ability cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {ch.abilities.map((a, i) => {
          const readyAt = cooldowns[a.key] ?? 0;
          const remaining = Math.max(0, readyAt - now);
          const frac = Math.min(1, remaining / (a.cd * 1000));
          const onCd = remaining > 0;
          const poor = resource < a.cost;
          const accent = DMG_COLOR[a.damageType];
          return (
            <button
              key={`${ch.id}-${a.key}`}
              onClick={() => cast(a)}
              className="relative text-left border border-line bg-ink2/70 p-3 overflow-hidden group hover:border-cyan/70 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              <div key={denyKey[a.key] ?? 0} className={denyKey[a.key] ? "card-deny" : undefined}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[8.5px] tracking-[0.14em] border border-line px-1.5 py-0.5 text-muted">
                  [{i + 1}] {a.type.replace("_", " ").toUpperCase()}
                </span>
                <span className="font-mono text-[8.5px] tracking-[0.14em] px-1.5 py-0.5 border" style={{ color: accent, borderColor: `${accent}66` }}>
                  {a.damageType.toUpperCase()}
                </span>
              </div>
              <div className="font-display text-xl leading-none text-paper group-hover:text-cyan transition-colors">
                {a.name.toUpperCase()}
              </div>
              <div className="font-mono text-[9px] text-muted mt-1">{a.jp}</div>
              <p className="text-[10.5px] text-muted leading-snug mt-2 min-h-[42px]">{a.desc}</p>
              <div className="flex items-end justify-between mt-2 pt-2 border-t border-line/50">
                <span className="font-display text-2xl leading-none" style={{ color: a.damage > 0 ? accent : "#7e9fbe" }}>
                  {a.damage > 0 ? a.damage : "—"}
                </span>
                <span className="text-right font-mono text-[9.5px] leading-tight">
                  <span className={poor ? "text-alert" : "text-paper/85"}>COST {a.cost}</span>
                  <br />
                  <span className="text-muted">CD {a.cd}s</span>
                </span>
              </div>
              </div>
              {onCd && (
                <span
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  style={{ background: `conic-gradient(rgba(6,24,43,0.88) ${frac * 360}deg, rgba(6,24,43,0.35) 0deg)` }}
                >
                  <span className="font-display text-3xl text-paper">{(remaining / 1000).toFixed(1)}</span>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* --------------------------------- section --------------------------------- */

export default function AbilitySection({
  charId,
  onChange,
}: {
  charId: string;
  onChange: (id: string) => void;
}) {
  const ch: Character = CHARACTERS.find((c) => c.id === charId) ?? CHARACTERS[0];
  const jsonAbility = ch.abilities[1];

  return (
    <Sheet
      id="sheet-05"
      no="05"
      title="ABILITIES & DAMAGE"
      kicker="SHEET 05 — DATA-DRIVEN COMBAT · HIT DETECTION · I-FRAMES"
      stamp="5 ABILITIES / LEAD"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="font-mono text-[10px] tracking-[0.28em] text-muted mb-2">LOADOUT</div>
          <ProtagonistPicker charId={charId} onChange={onChange} compact />
        </div>
        <p className="max-w-md text-[13px] text-muted leading-relaxed">
          Every ability is a row of JSON — cost, cooldown, damage type, animation clip, particle tag. The lab below runs the
          real rules: resource checks, cooldown gates, 15% crits and a 0.25s invincibility window.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1.25fr_0.75fr] gap-5 mb-10 items-start">
        <Reveal>
          <AbilityLab ch={ch} />
        </Reveal>
        <Reveal delay={130}>
          <div className="plate overflow-hidden">
            <div className="border-b border-line px-4 py-2 bg-ink3/60 flex items-center justify-between">
              <span className="font-mono text-[10px] tracking-[0.22em] text-muted">SCHEMA — {jsonAbility.name.toUpperCase()}</span>
              <span className="font-mono text-[10px] text-cyan">abilities.json</span>
            </div>
            <div className="p-4">
              <JsonBlock
                obj={{
                  name: jsonAbility.name,
                  type: jsonAbility.type,
                  damageType: jsonAbility.damageType,
                  damage: jsonAbility.damage,
                  chakraCost: jsonAbility.cost,
                  cooldownSeconds: jsonAbility.cd,
                  animationClip: jsonAbility.animClip,
                  particleEffect: jsonAbility.particle,
                }}
              />
              <p className="mt-4 text-[12px] text-muted leading-snug border-t border-line/60 pt-3">
                takeDamage(amount) is generic across player and NPCs: health reduction → i-frame flag for 0.25s → death state.
                Cooldowns and the resource pool live in one module, exposed as <span className="font-mono text-cyan">useAbility(index)</span>.
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      <Reveal>
        <div className="plate overflow-hidden">
          <div className="border-b border-line px-4 py-2 bg-ink3/60">
            <span className="font-mono text-[10px] tracking-[0.25em] text-muted">TABLE 5.1 — HIT DETECTION BY ABILITY TYPE</span>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-line/60">
            {HIT_TABLE.map((h) => (
              <div key={h.type} className="p-4 group hover:bg-ink3/50 transition-colors">
                <div className="mb-3 opacity-80 group-hover:opacity-100 transition-opacity">
                  <HitIcon kind={h.icon} />
                </div>
                <div className="font-display text-2xl text-paper leading-none">{h.type.toUpperCase()}</div>
                <div className="font-mono text-[10.5px] text-cyan mt-1.5 tracking-wide">{h.method}</div>
                <p className="text-[12px] text-muted leading-snug mt-2">{h.note}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </Sheet>
  );
}
