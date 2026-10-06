/**
 * Validates src/data/charInfo.ts against the sutra text:
 *  - exactly 117 entries
 *  - key set === unique CJK chars of SUTRA_TITLE_ZH + all zh: lines in sutra.ts
 *  - every CharInfo field non-empty; entry.char === key
 *  - pinyin is lowercase with tone marks (optional alternate reading in parens)
 *
 * Run: node scripts/check-charinfo.mjs
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sutraSrc = readFileSync(join(root, "src/data/sutra.ts"), "utf8");
const infoSrc = readFileSync(join(root, "src/data/charInfo.ts"), "utf8");

/* Recompute the canonical unique-character set from sutra.ts. */
const CJK_RE = /[\u4e00-\u9fff]/;
const title = sutraSrc.match(/SUTRA_TITLE_ZH = "([^"]+)"/)[1];
const zhLines = [...sutraSrc.matchAll(/zh: "([^"]+)"/g)].map((m) => m[1]);
const sutraChars = new Set(
  [...title, ...zhLines.join("")].filter((c) => CJK_RE.test(c))
);

/* Import CHAR_INFO by transforming the TS module to plain JS. */
const js = infoSrc
  .replace(/export interface CharInfo \{[\s\S]*?\n\}/, "")
  .replace(/: Record<string, CharInfo>/, "");
const mod = await import(
  `data:text/javascript;charset=utf-8,${encodeURIComponent(js)}`
);
const CHAR_INFO = mod.CHAR_INFO;

const keys = Object.keys(CHAR_INFO);
const errors = [];
const ok = (cond, msg) => {
  if (!cond) errors.push(msg);
};

ok(keys.length === 117, `expected 117 entries, got ${keys.length}`);
ok(
  sutraChars.size === 117,
  `sutra.ts unique char count is ${sutraChars.size}, expected 117`
);

const missing = [...sutraChars].filter((c) => !(c in CHAR_INFO));
const extra = keys.filter((k) => !sutraChars.has(k));
ok(missing.length === 0, `missing chars: ${missing.join(" ")}`);
ok(extra.length === 0, `extra chars: ${extra.join(" ")}`);

const PINYIN_RE =
  /^[a-züāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]+( \([a-züāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]+\))?$/;
const RADICAL_RE = /^[\u4e00-\u9fff\u2f00-\u2fdf]$/u;

for (const [key, e] of Object.entries(CHAR_INFO)) {
  ok(e.char === key, `${key}: entry.char is "${e.char}"`);
  for (const field of ["pinyin", "gloss", "radical", "radicalGloss", "origin"]) {
    ok(
      typeof e[field] === "string" && e[field].trim().length > 0,
      `${key}: field "${field}" is empty`
    );
  }
  ok(PINYIN_RE.test(e.pinyin), `${key}: pinyin "${e.pinyin}" fails sanity regex`);
  ok(RADICAL_RE.test(e.radical), `${key}: radical "${e.radical}" is not a single CJK char`);
}

if (errors.length > 0) {
  console.error(`FAIL (${errors.length} problem(s)):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(`PASS: ${keys.length} entries`);
console.log(`  sutra unique chars: ${sutraChars.size} (key set identical)`);
console.log(`  all fields non-empty; pinyin/radical sanity checks OK`);
