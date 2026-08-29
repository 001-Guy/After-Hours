import JSZip from "jszip";

// Every project source file, embedded as text at build time (?raw).
// Nothing is hand-duplicated — the archive is always exactly what ships.
import pkgRaw from "../package.json?raw";
import viteConfigRaw from "../vite.config.js?raw";
import indexHtmlRaw from "../index.html?raw";
import tsconfigRaw from "../tsconfig.json?raw";
import gitignoreRaw from "../.gitignore?raw";
import readmeRaw from "../README.md?raw";
import mainRaw from "./main.tsx?raw";
import appRaw from "./App.tsx?raw";
import cssRaw from "./index.css?raw";
import dataRaw from "./data.ts?raw";
import chromeRaw from "./components/chrome.tsx?raw";
import titleSheetRaw from "./components/TitleSheet.tsx?raw";
import assetSectionRaw from "./components/AssetSection.tsx?raw";
import engineSectionRaw from "./components/EngineSection.tsx?raw";
import worldSectionRaw from "./components/WorldSection.tsx?raw";
import characterSectionRaw from "./components/CharacterSection.tsx?raw";
import abilitySectionRaw from "./components/AbilitySection.tsx?raw";
import missionSectionRaw from "./components/MissionSection.tsx?raw";
import footerRaw from "./components/Footer.tsx?raw";
import codePanelRaw from "./components/CodePanel.tsx?raw";
import viteEnvRaw from "./vite-env.d.ts?raw";
import codeExportRaw from "./codeExport.ts?raw";

export interface SourceFile {
  path: string;
  content: string;
}

export const SOURCE_FILES: SourceFile[] = [
  { path: "package.json", content: pkgRaw },
  { path: "vite.config.js", content: viteConfigRaw },
  { path: "index.html", content: indexHtmlRaw },
  { path: "tsconfig.json", content: tsconfigRaw },
  { path: ".gitignore", content: gitignoreRaw },
  { path: "README.md", content: readmeRaw },
  { path: "src/main.tsx", content: mainRaw },
  { path: "src/App.tsx", content: appRaw },
  { path: "src/index.css", content: cssRaw },
  { path: "src/data.ts", content: dataRaw },
  { path: "src/vite-env.d.ts", content: viteEnvRaw },
  { path: "src/codeExport.ts", content: codeExportRaw },
  { path: "src/components/chrome.tsx", content: chromeRaw },
  { path: "src/components/TitleSheet.tsx", content: titleSheetRaw },
  { path: "src/components/AssetSection.tsx", content: assetSectionRaw },
  { path: "src/components/EngineSection.tsx", content: engineSectionRaw },
  { path: "src/components/WorldSection.tsx", content: worldSectionRaw },
  { path: "src/components/CharacterSection.tsx", content: characterSectionRaw },
  { path: "src/components/AbilitySection.tsx", content: abilitySectionRaw },
  { path: "src/components/MissionSection.tsx", content: missionSectionRaw },
  { path: "src/components/Footer.tsx", content: footerRaw },
  { path: "src/components/CodePanel.tsx", content: codePanelRaw },
];

export async function downloadProjectZip(): Promise<void> {
  const zip = new JSZip();
  const root = zip.folder("liberty-protocol");
  for (const f of SOURCE_FILES) {
    root!.file(f.path, f.content);
  }
  const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "liberty-protocol.zip";
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 5000);
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

export const PUSH_COMMANDS = `unzip liberty-protocol.zip
cd liberty-protocol
git init
git add .
git commit -m "Liberty Protocol — BP-003 blueprint"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/After-Hours.git
git push -u origin main`;