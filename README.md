# Liberty Protocol — BP-003 · Technical Blueprint

An interactive engineering drawing set for a **high-fidelity anime protagonist in a
performance-constrained, GTA-style browser game** — targeting **50–60 FPS on 4 GB of RAM**.

Built with **React 18 + Vite + Tailwind CSS v4**. Presented as six blueprint sheets:

| Sheet | Subject |
| ----- | ------- |
| 00 | Drawing set overview, frame budget, reference plate |
| 01 | Foundation & asset pipeline — WebP / KTX2 (Basis) / Draco / LOD, automated conversion |
| 02 | Engine & render pipeline — PixiJS + Babylon.js hybrid, OffscreenCanvas worker, adaptive resolution sandbox |
| 03 | The city & its HUD — Portland / Staunton Island / Shoreside Vale districts, freeze-frame pause effect |
| 04 | Character system — three anime leads, layer decomposition, animation FSM, per-clip timing |
| 05 | Abilities & damage — 5 abilities per lead, cooldowns, hit-detection matrix, live combat lab |
| 06 | Narrative engine — data-driven missions, dialogue events, mission desk |

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # outputs dist/ (portable — works from any sub-path)