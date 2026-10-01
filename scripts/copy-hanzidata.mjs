#!/usr/bin/env node
/**
 * Extract the unique hanzi used by src/data/sutra.ts (plus variant fallback
 * targets) and copy stroke-order JSON from node_modules/hanzi-writer-data
 * into public/hanzidata/. Falls back to the jsDelivr CDN for any missing file.
 */
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sutraSrc = readFileSync(path.join(root, "src/data/sutra.ts"), "utf8");
const CJK_RE = /[\u4e00-\u9fff]/;

// Extract hanzi from the sutra data only (title + line zh strings), not from
// comments/attribution — that yields exactly the 117 unique sutra characters.
const unique = new Set();
const zhStrings = [
  ...sutraSrc.matchAll(/^export const SUTRA_TITLE_ZH = "([^"]+)";$/m),
  ...sutraSrc.matchAll(/\{ zh: "([^"]+)"/g),
];
for (const m of zhStrings) {
  for (const ch of m[1]) {
    if (CJK_RE.test(ch)) unique.add(ch);
  }
}
// variant fallback targets (must exist even when the source char does not)
const VARIANT_FALLBACK = { "罣": "掛" };
for (const target of Object.values(VARIANT_FALLBACK)) unique.add(target);

const dataDir = path.join(root, "node_modules/hanzi-writer-data");
const outDir = path.join(root, "public/hanzidata");
mkdirSync(outDir, { recursive: true });

// verify package layout: flat <char>.json files
if (!existsSync(path.join(dataDir, "心.json"))) {
  console.error("unexpected hanzi-writer-data layout: 心.json not found at package root");
  console.error("sample entries:", readdirSync(dataDir).slice(0, 10));
  process.exit(1);
}

const missing = [];
let copied = 0;
for (const ch of [...unique].sort()) {
  const src = path.join(dataDir, `${ch}.json`);
  const dest = path.join(outDir, `${ch}.json`);
  if (existsSync(src)) {
    copyFileSync(src, dest);
    copied++;
  } else if (!existsSync(dest)) {
    // CDN fallback
    try {
      execFileSync("curl", [
        "-sf",
        `https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0.1/${encodeURIComponent(ch)}.json`,
        "-o",
        dest,
      ]);
      copied++;
      console.log(`cdn fallback ok: ${ch}`);
    } catch {
      missing.push(ch);
    }
  } else {
    copied++;
  }
}

// prune stale files that are not part of the expected set
for (const f of readdirSync(outDir)) {
  if (f.endsWith(".json") && !unique.has(f.slice(0, -5))) {
    rmSync(path.join(outDir, f));
    console.log(`pruned stale: ${f}`);
  }
}

console.log(`unique chars incl. fallback targets: ${unique.size}`);
console.log(`copied/present: ${copied}`);
console.log(`missing: ${missing.length ? missing.join(" ") : "(none)"}`);
process.exit(missing.length ? 1 : 0);
