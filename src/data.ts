--- src/data.ts (原始)


+++ src/data.ts (修改后)
/* ------------------------------------------------------------------ */
/*  BP-003 · LIBERTY PROTOCOL — content model for the blueprint site   */
/* ------------------------------------------------------------------ */

export type DamageType = "lightning" | "fire" | "shadow" | "physical";

export const CITY_FRAME =
  "https://image.qwenlm.ai/generated-images/6807f2d6-7fb1-41ba-b1ef-56381abac8eb/_result.png";

export const DMG_COLOR: Record<DamageType, string> = {
  lightning: "#63c5ff",
  fire: "#ff8a4b",
  shadow: "#b18cff",
  physical: "#d9e9f7",
};

export interface Ability {
  key: string;
  name: string;
  jp: string;
  type: "projectile" | "area_of_effect" | "buff" | "dash" | "summon" | "melee";
  damageType: DamageType;
  damage: number;
  cost: number;
  cd: number; // seconds
  animClip: string;
  particle: string;
  desc: string;
}

export interface AnimRow {
  clip: string;
  fps: number;
  frames: number;
  note: string;
}

export interface Mission {
  id: string;
  title: string;
  giver: string;
  district: string;
  status: "active" | "available" | "completed";
  summary: string;
  objectives: { text: string; type: string; done: boolean }[];
  requiredAbilities: string[];
  rewards: { label: string; value: string }[];
  dialogue: { speaker: string; text: string }[];
}

export interface Character {
  id: string;
  name: string;
  jp: string;
  alias: string;
  element: DamageType;
  role: string;
  lore: string;
  portrait: string;
  palette: string[];
  layers: { name: string; tech: string }[];
  animTable: AnimRow[];
  abilities: Ability[];
  missions: Mission[];
  stats: { label: string; value: number }[]; // 0-100
}

export const CHARACTERS: Character[] = [
  {
    id: "kaito",
    name: "Kaito Arashiro",
    jp: "嵐城 カイト",
    alias: "STORM CELL",
    element: "lightning",
    role: "Hand-to-hand skirmisher · burst assassin",
    lore: "A dockworker's son who woke up grounded to the city's power grid. Every blackout in Portland is a sentence he is still learning to read.",
    portrait:
      "https://image.qwenlm.ai/generated-images/6ab6e7cd-29ad-4cce-9b5f-49769f4b2a57/_result.png",
    palette: ["#63c5ff", "#1b3f66", "#0a2340", "#cfe6ff"],
    layers: [
      { name: "aura_ground", tech: "additive quad · 1 draw call" },
      { name: "body_base", tech: "packed atlas 1024² KTX2" },
      { name: "hair_spikes", tech: "separate layer · wind rig ±6°" },
      { name: "arms_upper", tech: "IK-driven for cast poses" },
      { name: "arc_lance_vfx", tech: "billboard · 3-frame strip" },
    ],
    animTable: [
      { clip: "idle", fps: 8, frames: 12, note: "2-frame hold on key pose" },
      { clip: "walk", fps: 12, frames: 16, note: "contact + passing poses" },
      { clip: "run", fps: 16, frames: 14, note: "smear frames 6–8" },
      { clip: "cast_arc", fps: 24, frames: 18, note: "windup 5f · release 2f" },
      { clip: "hit_react", fps: 18, frames: 8, note: "snappy, 44ms" },
      { clip: "death", fps: 14, frames: 22, note: "dissipates to ions" },
    ],
    abilities: [
      {
        key: "static-step",
        name: "Static Step",
        jp: "静歩",
        type: "dash",
        damageType: "lightning",
        damage: 22,
        cost: 10,
        cd: 4,
        animClip: "dash_step",
        particle: "spark_trail",
        desc: "Ionize the path ahead and ride it — a 6m dash that leaves a charged wake.",
      },
      {
        key: "arc-lance",
        name: "Arc Lance",
        jp: "弧光槍",
        type: "projectile",
        damageType: "lightning",
        damage: 45,
        cost: 18,
        cd: 3,
        animClip: "cast_arc",
        particle: "lance_bolt",
        desc: "A thrown spear of compressed current. Swept-sphere hit test, no tunneling.",
      },
      {
        key: "thunderclap",
        name: "Thunderclap Array",
        jp: "雷鳴陣",
        type: "area_of_effect",
        damageType: "lightning",
        damage: 70,
        cost: 30,
        cd: 8,
        animClip: "cast_slam",
        particle: "ring_shock",
        desc: "Ground-strike with a 4.5m radius check against the spatial grid.",
      },
      {
        key: "ion-veil",
        name: "Ion Veil",
        jp: "イオンヴェール",
        type: "buff",
        damageType: "lightning",
        damage: 0,
        cost: 25,
        cd: 12,
        animClip: "buff_shield",
        particle: "veil_loop",
        desc: "A standing field that converts the next hit into resource. Extends i-frames to 0.5s.",
      },
      {
        key: "tempest-verdict",
        name: "Tempest Verdict",
        jp: "天罰・嵐裁",
        type: "area_of_effect",
        damageType: "lightning",
        damage: 140,
        cost: 60,
        cd: 20,
        animClip: "ult_tempest",
        particle: "storm_column",
        desc: "Calls the grid's full debt down on one city block. 24f cinematic cast at 24fps.",
      },
    ],
    missions: [
      {
        id: "m-kaito-01",
        title: "Sparks Over Portland",
        giver: "Det. Mara Voss",
        district: "Portland",
        status: "active",
        summary:
          "Every light on Callahan Pier died at the same second. Voss says blackouts don't have signatures — yours does.",
        objectives: [
          { text: "Reach the Pier 7 substation", type: "reach_location", done: true },
          { text: "Re-seat 3 blown fuse boxes", type: "interact", done: true },
          { text: "Defeat 4 Wirejack enforcers", type: "defeat_x", done: false },
        ],
        requiredAbilities: ["arc-lance", "static-step"],
        rewards: [
          { label: "ARMOR", value: "+25" },
          { label: "ITEM", value: "Arc Cell Mk.I" },
          { label: "REP", value: "Portland +1" },
        ],
        dialogue: [
          { speaker: "Det. Voss", text: "Every dock light on this pier just died at once. That's not a blackout — that's a signature." },
          { speaker: "Kaito", text: "Lightning doesn't sign autographs, Detective." },
          { speaker: "Det. Voss", text: "Yours does. Substation's two blocks north. Try not to fry my city on the way." },
        ],
      },
      {
        id: "m-kaito-02",
        title: "The Grounded Tower",
        giver: "Unknown caller",
        district: "Staunton Island",
        status: "available",
        summary:
          "A storm is parked over the Calloway Tower that the weather service refuses to acknowledge. Something up there is hoarding current.",
        objectives: [
          { text: "Climb the Calloway service elevators", type: "reach_location", done: false },
          { text: "Discharge the rooftop accumulator", type: "interact", done: false },
          { text: "Survive the storm's keeper", type: "boss", done: false },
        ],
        requiredAbilities: ["tempest-verdict", "ion-veil"],
        rewards: [
          { label: "HP", value: "+50" },
          { label: "ABILITY", value: "Storm Cell Overdrive" },
        ],
        dialogue: [
          { speaker: "???", text: "You feel it too, don't you. The tower is breathing in." },
          { speaker: "Kaito", text: "Then I guess I'm the only one who knows how to make it exhale." },
        ],
      },
    ],
    stats: [
      { label: "BURST", value: 92 },
      { label: "RANGE", value: 58 },
      { label: "MOBILITY", value: 84 },
      { label: "DURABILITY", value: 47 },
    ],
  },
  {
    id: "yui",
    name: "Yui Hoshikawa",
    jp: "星川 結衣",
    alias: "CINDER BLOSSOM",
    element: "fire",
    role: "Mid-range controller · zone denial",
    lore: "Raised above a fireworks shop in Shoreside Vale, she learned early that every beautiful thing is a controlled burn. The city keeps testing her control.",
    portrait:
      "https://image.qwenlm.ai/generated-images/d959da51-c7ce-4c0c-a79a-74e44d823985/_result.png",
    palette: ["#ff8a4b", "#a32c2c", "#2b1220", "#ffd9a8"],
    layers: [
      { name: "ember_motes", tech: "additive · 24-particle cap" },
      { name: "body_kimono", tech: "packed atlas 1024² KTX2" },
      { name: "hair_flame", tech: "UV-scroll layer · 8f loop" },
      { name: "arms_sleeves", tech: "cloth sim baked to 12f" },
      { name: "fox_orb_vfx", tech: "billboard · 4-frame strip" },
    ],
    animTable: [
      { clip: "idle", fps: 8, frames: 14, note: "sleeve sway on loop" },
      { clip: "walk", fps: 12, frames: 16, note: "hair trail offset 2f" },
      { clip: "run", fps: 15, frames: 14, note: "embers shed from hem" },
      { clip: "cast_fan", fps: 20, frames: 16, note: "sleeve whip on release" },
      { clip: "hit_react", fps: 18, frames: 8, note: "guard pose available" },
      { clip: "death", fps: 14, frames: 20, note: "petals of ash" },
    ],
    abilities: [
      {
        key: "ember-fan",
        name: "Ember Fan",
        jp: "火扇",
        type: "projectile",
        damageType: "fire",
        damage: 40,
        cost: 15,
        cd: 2.5,
        animClip: "cast_fan",
        particle: "ember_spread",
        desc: "Three arcing embers in a 30° cone. Cheap, fast, and very good at starting arguments.",
      },
      {
        key: "petal-burst",
        name: "Petal Burst",
        jp: "花弁炸裂",
        type: "area_of_effect",
        damageType: "fire",
        damage: 65,
        cost: 28,
        cd: 7,
        animClip: "cast_bloom",
        particle: "bloom_fire",
        desc: "A firework that blooms at ground level. 4m sphere check, leaves a 2s burn zone.",
      },
      {
        key: "foxfire-waltz",
        name: "Foxfire Waltz",
        jp: "狐火の円舞",
        type: "projectile",
        damageType: "fire",
        damage: 55,
        cost: 24,
        cd: 6,
        animClip: "cast_waltz",
        particle: "fox_orbs",
        desc: "Five homing wisps that split their pathfinding across two worker ticks.",
      },
      {
        key: "salamander-skin",
        name: "Salamander Skin",
        jp: "火蝾螈の衣",
        type: "buff",
        damageType: "fire",
        damage: 0,
        cost: 20,
        cd: 10,
        animClip: "buff_kindle",
        particle: "kindle_loop",
        desc: "Regenerates 4 HP/s for 6s and ignites melee attackers for 12 damage.",
      },
      {
        key: "solar-chrysanthemum",
        name: "Solar Chrysanthemum",
        jp: "日輪菊",
        type: "area_of_effect",
        damageType: "fire",
        damage: 150,
        cost: 65,
        cd: 22,
        animClip: "ult_bloom",
        particle: "sun_bloom",
        desc: "The shop's grand finale, scaled up. One bloom, one block, zero apologies.",
      },
    ],
    missions: [
      {
        id: "m-yui-01",
        title: "Ash Tuesday",
        giver: "Capt. Edda Rune",
        district: "Portland",
        status: "active",
        summary:
          "Warehouse row is burning in a pattern that spells out an invitation. The arsonists left exactly one door unlocked — for her.",
        objectives: [
          { text: "Escort 5 civilians off warehouse row", type: "escort", done: true },
          { text: "Smother 3 flare stacks", type: "interact", done: false },
          { text: "Break the Cinder Cell ambush", type: "defeat_x", done: false },
        ],
        requiredAbilities: ["ember-fan", "petal-burst"],
        rewards: [
          { label: "HP", value: "+30" },
          { label: "ITEM", value: "Fuse Cord" },
          { label: "REP", value: "Portland +1" },
        ],
        dialogue: [
          { speaker: "Capt. Rune", text: "Fire crews can't get down Row 4. Someone is feeding the flames on purpose — in a pattern." },
          { speaker: "Yui", text: "That's not a pattern. That's a guest list. Keep your crew back, Captain." },
          { speaker: "Capt. Rune", text: "Then hurry. My city doesn't do well as a candle." },
        ],
      },
      {
        id: "m-yui-02",
        title: "Lanterns Over Shoreside",
        giver: "Grandmother Hoshi",
        district: "Shoreside Vale",
        status: "available",
        summary:
          "The festival lanterns went out one by one, upstream toward the dam. Grandmother says a lantern that dies alone is a lantern that was stolen.",
        objectives: [
          { text: "Trace the dead lanterns to the dam access", type: "reach_location", done: false },
          { text: "Relight the 7 shrine lanterns", type: "interact", done: false },
          { text: "Face whatever is drinking the light", type: "boss", done: false },
        ],
        requiredAbilities: ["solar-chrysanthemum", "salamander-skin"],
        rewards: [
          { label: "RESOURCE", value: "+20 max" },
          { label: "ABILITY", value: "Lantern Waltz" },
        ],
        dialogue: [
          { speaker: "Grandmother", text: "A lantern that dies alone was stolen, Yui. Follow the dark upstream." },
          { speaker: "Yui", text: "And when I find the thief?" },
          { speaker: "Grandmother", text: "You were always better at fireworks than forgiveness." },
        ],
      },
    ],
    stats: [
      { label: "BURST", value: 78 },
      { label: "RANGE", value: 81 },
      { label: "MOBILITY", value: 55 },
      { label: "DURABILITY", value: 62 },
    ],
  },
  {
    id: "ren",
    name: "Ren Kagemori",
    jp: "影森 レン",
    alias: "HOLLOW SHADE",
    element: "shadow",
    role: "Infiltrator · single-target eliminator",
    lore: "The ledger of the Kagemori house lists one living member. The city's underworld insists the list is correct — they just disagree on which side of it he stands.",
    portrait:
      "https://image.qwenlm.ai/generated-images/7c490f97-0e0a-427f-8e82-92cf0d4d7911/_result.png",
    palette: ["#b18cff", "#241a3d", "#0b0f1e", "#8f7bb8"],
    layers: [
      { name: "shadow_pool", tech: "projected decal · no light pass" },
      { name: "body_coat", tech: "packed atlas 1024² KTX2" },
      { name: "scarf_smoke", tech: "soft particles · 16-cap" },
      { name: "arms_wraps", tech: "IK-driven for takedowns" },
      { name: "umbra_blade", tech: "mesh sub-object · 340 tris" },
    ],
    animTable: [
      { clip: "idle", fps: 8, frames: 12, note: "scarf drifts on 2f hold" },
      { clip: "walk", fps: 12, frames: 16, note: "silent footfall timing" },
      { clip: "run", fps: 18, frames: 14, note: "low profile, coat trail" },
      { clip: "strike_kage", fps: 24, frames: 14, note: "impact freeze 1f" },
      { clip: "cloak", fps: 20, frames: 12, note: "dissolve via alpha ramp" },
      { clip: "death", fps: 14, frames: 18, note: "folds into the scarf" },
    ],
    abilities: [
      {
        key: "kageboshi",
        name: "Kageboshi",
        jp: "影星",
        type: "melee",
        damageType: "physical",
        damage: 38,
        cost: 12,
        cd: 2,
        animClip: "strike_kage",
        particle: "slash_arc",
        desc: "A raycast strike from the blade's origin. 1-frame impact freeze for weight.",
      },
      {
        key: "umbra-spike",
        name: "Umbra Spike",
        jp: "影棘",
        type: "projectile",
        damageType: "shadow",
        damage: 48,
        cost: 18,
        cd: 3.5,
        animClip: "cast_spike",
        particle: "spike_shadow",
        desc: "A hardened shadow thrown like a kunai. Passes through the first target it has already marked.",
      },
      {
        key: "void-snare",
        name: "Void Snare",
        jp: "虚ろの罠",
        type: "area_of_effect",
        damageType: "shadow",
        damage: 50,
        cost: 26,
        cd: 9,
        animClip: "cast_snare",
        particle: "snare_pool",
        desc: "A 3m well of dark that slows everything inside by 40% for 3s. Grid-partitioned tick.",
      },
      {
        key: "phantom-split",
        name: "Phantom Split",
        jp: "幻影分体",
        type: "summon",
        damageType: "shadow",
        damage: 30,
        cost: 35,
        cd: 14,
        animClip: "summon_clone",
        particle: "split_mist",
        desc: "One decoy, one real blade. The decoy inherits 30% damage and draws navmesh aggro.",
      },
      {
        key: "eclipse-requiem",
        name: "Eclipse Requiem",
        jp: "鎮魂・日蝕",
        type: "area_of_effect",
        damageType: "shadow",
        damage: 145,
        cost: 60,
        cd: 21,
        animClip: "ult_eclipse",
        particle: "eclipse_dome",
        desc: "The block goes dark for 1.8s. Everything inside answers to the ledger.",
      },
    ],
    missions: [
      {
        id: "m-ren-01",
        title: "The Quiet Ledger",
        giver: "Broker 'Sable'",
        district: "Staunton Island",
        status: "active",
        summary:
          "The exchange house on Bedford Point keeps two ledgers. One is for the tax office. Sable wants the other one, and wants no alarms on the way.",
        objectives: [
          { text: "Infiltrate the exchange house roof", type: "reach_location", done: true },
          { text: "Retrieve the black ledger", type: "collect", done: false },
          { text: "Exit with zero alarms raised", type: "stealth_bonus", done: false },
        ],
        requiredAbilities: ["kageboshi", "phantom-split"],
        rewards: [
          { label: "CASH", value: "$4,500" },
          { label: "ITEM", value: "Silenced Kit" },
        ],
        dialogue: [
          { speaker: "Sable", text: "Two ledgers, Kagemori. One for the tax man, one for the truth. Bring me the truth." },
          { speaker: "Ren", text: "And the guards?" },
          { speaker: "Sable", text: "Expensive furniture. Try not to break the furniture." },
        ],
      },
      {
        id: "m-ren-02",
        title: "Hollow Cathedral",
        giver: "A letter, unsigned",
        district: "Shoreside Vale",
        status: "available",
        summary:
          "An unfinished cathedral above the dam holds the last meeting of the Kagemori house. Someone has been setting the table for eleven years.",
        objectives: [
          { text: "Reach the cathedral undercroft", type: "reach_location", done: false },
          { text: "Read the eleven name plates", type: "interact", done: false },
          { text: "Decide who the twelfth chair is for", type: "choice", done: false },
        ],
        requiredAbilities: ["eclipse-requiem", "void-snare"],
        rewards: [
          { label: "HP", value: "+40" },
          { label: "LORE", value: "Kagemori Ledger, final page" },
        ],
        dialogue: [
          { speaker: "Letter", text: "The house never fell. It merely stopped meeting. Thursday. The cathedral knows you." },
          { speaker: "Ren", text: "Eleven chairs. Twelve shadows. Someone has been counting wrong for a long time." },
        ],
      },
    ],
    stats: [
      { label: "BURST", value: 70 },
      { label: "RANGE", value: 44 },
      { label: "MOBILITY", value: 90 },
      { label: "DURABILITY", value: 38 },
    ],
  },
];

/* ------------------------------- districts ------------------------------- */

export interface District {
  name: string;
  seed: string;
  mood: string;
  palette: string[];
  landmarks: string[];
  notes: string;
}

export const DISTRICTS: District[] = [
  {
    name: "Portland",
    seed: "SEED 0x9A31 · 42 BLOCKS · AVG H 14m",
    mood: "Industrial · docks, canneries, elevated rail",
    palette: ["#8a7360", "#6e655c", "#4a463f", "#b3a184"],
    landmarks: ["Callahan Pier", "Luigi's social club block", "Portland elevated rail loop"],
    notes: "Drab browns and greys per the original art direction. Streetlights + trashcans are camera-facing quads, 1 draw call each.",
  },
  {
    name: "Staunton Island",
    seed: "SEED 0x4C77 · 56 BLOCKS · AVG H 38m",
    mood: "Commercial · towers, neon, the police HQ",
    palette: ["#5b6672", "#39434e", "#232b33", "#7fa6c9"],
    landmarks: ["Calloway Tower", "Bedford Point exchange", "Old school hall plaza"],
    notes: "Tallest district — carries the LOD burden. Towers swap to low-poly beyond 180m for the 30–40% FPS recovery.",
  },
  {
    name: "Shoreside Vale",
    seed: "SEED 0x21E9 · 34 BLOCKS · AVG H 9m",
    mood: "Suburban · the airport, the dam, quiet streets",
    palette: ["#5c6b52", "#49544a", "#333d38", "#8fa07c"],
    landmarks: ["Francis Intl. approach", "Cochrane Dam face", "Cedar Grove cul-de-sacs"],
    notes: "Low skyline means long sightlines — fog plane at 260m culls the draw list before the hills do.",
  },
];

/* ------------------------------ asset tables ------------------------------ */

export const ASSET_TABLE = [
  {
    category: "3D Models",
    format: "glTF / GLB",
    technique: "Draco compression · poly reduction · LOD generation",
    rationale: "Minimizes download size and per-frame triangle workload on low-end GPUs.",
    chip: "#63c5ff",
  },
  {
    category: "Scene Textures",
    format: "KTX2 (Basis)",
    technique: "GPU-resident compression · mipmapping",
    rationale: "Textures stay compressed until the fragment shader samples them — a fraction of PNG/JPEG VRAM.",
    chip: "#63c5ff",
  },
  {
    category: "UI & Static Assets",
    format: "WebP",
    technique: "WebP compression · sprite sheets",
    rationale: "25–34% smaller than JPEG/PNG at equivalent SSIM for HUD plates, signage, menus.",
    chip: "#64dfa0",
  },
  {
    category: "Character Textures",
    format: "KTX2 (Basis)",
    technique: "Compression · packed 1024² atlases",
    rationale: "VRAM is the binding constraint for high-fidelity anime leads — pack every layer into one atlas.",
    chip: "#ffc15e",
  },
  {
    category: "Particle Effects",
    format: "KTX2 (Basis)",
    technique: "Compression · billboarding",
    rationale: "Explosions, jutsu, embers: dozens of tiny textures rendered as camera-facing quads.",
    chip: "#ff8a4b",
  },
  {
    category: "Audio",
    format: "OGG Vorbis",
    technique: "Preload only essentials · stream the rest",
    rationale: "Keeps the initial load and resident memory footprint inside the 4GB envelope.",
    chip: "#b18cff",
  },
];

export const STAT_TILES = [
  { big: "25–34%", label: "smaller than JPEG/PNG", sub: "WebP at equivalent SSIM — UI plates, signage, menu art", tone: "ok" },
  { big: "64MB", label: "VRAM for one 4096² PNG", sub: "Uncompressed on the GPU after decode — the silent killer", tone: "alert" },
  { big: "5–10×", label: "less VRAM with KTX2", sub: "Basis supercompression stays packed until sampling", tone: "cyan" },
  { big: "90–95%", label: "poly reduction via Draco", sub: "gltfpack / Draco with modifiers applied pre-export", tone: "cyan" },
  { big: "+30–40%", label: "FPS recovered by LODs", sub: "Auto-swap to low-poly at distance — Staunton first", tone: "ok" },
  { big: "16.6ms", label: "the whole frame budget", sub: "At 60 FPS, every system above shares this slice", tone: "amber" },
];

export const HIT_TABLE = [
  {
    type: "Single-target",
    method: "Raycast / bounding overlap",
    note: "Cast from the attack origin against the target's hitbox. Fast and precise for melee and directed strikes.",
    icon: "ray",
  },
  {
    type: "Projectile",
    method: "Swept-sphere vs. bounding volume",
    note: "Test the projectile's swept path each frame — prevents tunneling through fast targets at low framerates.",
    icon: "swept",
  },
  {
    type: "Area of Effect",
    method: "Sphere-radius check",
    note: "All entities inside the blast radius take damage. Constrained to a spatial-partition grid so we never scan the world.",
    icon: "aoe",
  },
  {
    type: "Persistent effect",
    method: "Continuous overlap check",
    note: "Burn zones and snares tick via overlap each frame; damage-over-time lives in its own update function.",
    icon: "dot",
  },
];

export const ENGINE_STEPS = [
  {
    step: "01",
    title: "Detach the canvas",
    body: "Create the <canvas> in main HTML, then immediately hand it to the worker with transferControlToOffscreen().",
  },
  {
    step: "02",
    title: "Boot the engine off-thread",
    body: "Inside the worker: new BABYLON.Engine(offscreenCanvas, true) — powerPreference 'default' so iOS Safari doesn't kill the tab.",
  },
  {
    step: "03",
    title: "Move the whole sim",
    body: "Object updates, physics, NPC navmesh AI and rendering all execute in the worker context. Main thread never blocks.",
  },
  {
    step: "04",
    title: "postMessage both ways",
    body: "Keyboard, gamepad and pointer events go in; camera + transform snapshots come back for the DOM HUD to mirror.",
  },
  {
    step: "05",
    title: "Composite for free",
    body: "The browser presents the OffscreenCanvas directly — no per-frame copies. Dispose every texture/geometry you retire.",
  },
];

export const ENGINE_PICKS = [
  {
    lib: "PixiJS",
    role: "2D batch renderer",
    target: "WebGL / WebGPU",
    use: "HUD, anime sprite animation, menu FX",
    why: "Batches thousands of sprites into a minimal number of draw calls.",
    tag: "RECOMMENDED",
  },
  {
    lib: "Babylon.js",
    role: "Full 3D engine",
    target: "WebGL2 / WebGPU",
    use: "Liberty-class city, physics, navmesh, camera",
    why: "First-class KTX2 + Draco support; worker-friendly engine boot.",
    tag: "RECOMMENDED",
  },
  {
    lib: "Three.js",
    role: "Flexible WebGL core",
    target: "WebGL2",
    use: "Alternative scene layer / post-FX",
    why: "Fine-grained control; AnimationMixer crossfades for character clips.",
    tag: "VIABLE",
  },
  {
    lib: "Spector.js",
    role: "WebGL profiler",
    target: "DEV ONLY",
    use: "Capture + inspect every GL call",
    why: "Finds the hot draw call that eats the 16.6ms budget.",
    tag: "TOOLING",
  },
];

export const TICKER_ITEMS = [
  "TARGET 50–60 FPS",
  "ENVELOPE ≤ 4GB RAM",
  "FRAME BUDGET 16.6ms",
  "RENDERER WEBGL2 → WEBGPU",
  "SIM THREAD: OFFSCREEN WORKER",
  "TEXTURES KTX2 / BASIS",
  "UI ART WEBP",
  "MESHES GLB + DRACO",
  "LOD SWAP ≥ 180m",
  "AUDIO OGG VORBIS",
  "DRAW CALLS < 60 / FRAME",
  "ATLAS 1024² PACKED",
];

export const REV_HISTORY = [
  { rev: "0.1", date: "W-12", note: "Initial prototype — synchronous main-thread loop. Dropped frames under any load. REJECTED.", status: "REJECTED" },
  { rev: "1.0", date: "W-08", note: "Asset pipeline defined: WebP / KTX2 / Draco. Worker architecture drafted.", status: "SUPERSEDED" },
  { rev: "2.0", date: "W-04", note: "Character layer decomposition + FSM adopted. Ability JSON schema locked.", status: "SUPERSEDED" },
  { rev: "2.4", date: "W-01", note: "Current set — narrative engine, pause freeze-frame shader, adaptive resolution.", status: "CURRENT" },
];

export const NAV_SECTIONS = [
  { id: "sheet-00", no: "00", label: "Overview" },
  { id: "sheet-01", no: "01", label: "Assets" },
  { id: "sheet-02", no: "02", label: "Engine" },
  { id: "sheet-03", no: "03", label: "World" },
  { id: "sheet-04", no: "04", label: "Character" },
  { id: "sheet-05", no: "05", label: "Combat" },
  { id: "sheet-06", no: "06", label: "Narrative" },
];
