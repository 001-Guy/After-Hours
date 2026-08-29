--- src/components/Footer.tsx (原始)


+++ src/components/Footer.tsx (修改后)
import { REV_HISTORY } from "../data";
import { CrosshairMark, Reveal, Stamp } from "./chrome";

const STANDARDS = ["KTX2 / BASIS", "DRACO GLB", "WEBP UI", "OGG VORBIS", "OFFSCREEN WORKER", "ADAPTIVE RES"];

export default function Footer() {
  return (
    <footer className="relative border-t-2 border-line2 mt-4">
      <div className="mx-auto max-w-6xl px-5 md:px-8 py-14">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <div>
              <div className="font-mono text-[11px] tracking-[0.32em] text-cyan/85 mb-3">END OF DRAWING SET</div>
              <div className="font-display text-5xl md:text-7xl leading-[0.9]">
                <span className="text-paper">SIX SHEETS.</span>{" "}
                <span className="txt-outline">ONE FRAME BUDGET.</span>
              </div>
            </div>
            <div className="flex flex-col items-start gap-2">
              <Stamp tone="ok">CHECKED — PERF REVIEW BOARD</Stamp>
              <span className="font-mono text-[10px] text-muted tracking-[0.2em]">SHEET 06/06 · REV 2.4 · 2026-W06</span>
            </div>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 mb-10">
          <Reveal>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CrosshairMark size={22} />
                <span className="font-display text-2xl text-paper tracking-wide">LIBERTY PROTOCOL · BP-003</span>
              </div>
              <p className="text-[13.5px] leading-relaxed text-muted max-w-lg">
                A blueprint for proving that an exact-appearance anime lead and a GTA-class open world can share a browser tab
                with 4GB of RAM — as long as every asset is compressed at the source, every triangle earns its place, and the
                simulation never touches the main thread.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {STANDARDS.map((s) => (
                  <span key={s} className="font-mono text-[10px] tracking-[0.16em] text-cyan/85 border border-line px-2.5 py-1.5 hover:border-cyan transition-colors cursor-default">
                    ✓ {s}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="plate overflow-hidden">
              <div className="border-b border-line px-4 py-2 bg-ink3/60">
                <span className="font-mono text-[10px] tracking-[0.25em] text-muted">REVISION HISTORY</span>
              </div>
              <div className="divide-y divide-line/50">
                {REV_HISTORY.map((r) => (
                  <div key={r.rev} className="grid grid-cols-[52px_56px_1fr_auto] gap-3 px-4 py-3 items-baseline hover:bg-ink3/50 transition-colors">
                    <span className="font-display text-2xl text-paper leading-none">{r.rev}</span>
                    <span className="font-mono text-[10px] text-muted">{r.date}</span>
                    <span className="text-[12px] text-muted leading-snug">{r.note}</span>
                    <span
                      className={`font-mono text-[9px] tracking-[0.14em] ${
                        r.status === "CURRENT" ? "text-ok" : r.status === "REJECTED" ? "text-alert" : "text-muted"
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        <div className="border-t border-line/60 pt-5 flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] tracking-[0.18em] text-muted">
          <span>BP-003 · DRAWN FOR THE OPEN WEB — NO ENGINE ROYALTY, NO NATIVE BUILD</span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan pulse-dot" />
            60 FPS OR IT DOESN'T SHIP
          </span>
        </div>
      </div>
    </footer>
  );
}
