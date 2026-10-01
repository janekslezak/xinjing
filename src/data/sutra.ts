/** Heart Sutra (Prajñāpāramitā Hṛdaya), Xuanzang's Chinese translation (traditional characters). */

export interface SutraLine {
  zh: string;
  en: string;
}

export const SUTRA_TITLE_ZH = "般若波羅蜜多心經";
export const SUTRA_TITLE_EN = "The Heart of Perfect Wisdom Sutra (Prajñāpāramitā Hṛdaya)";
export const SUTRA_ATTRIBUTION_ZH = "唐三藏法師玄奘譯";
export const SUTRA_ATTRIBUTION_EN = "Translated into Chinese by Xuanzang";

export const SUTRA_LINES: SutraLine[] = [
  { zh: "觀自在菩薩", en: "Avalokiteshvara, the Bodhisattva of Contemplation," },
  { zh: "行深般若波羅蜜多時", en: "while moving in the deep course of perfect wisdom," },
  { zh: "照見五蘊皆空", en: "clearly saw that the five aggregates are all empty," },
  { zh: "度一切苦厄", en: "and passed beyond all suffering and distress." },
  { zh: "舍利子", en: "Śāriputra!" },
  { zh: "色不異空，空不異色", en: "Form is not other than emptiness; emptiness is not other than form." },
  { zh: "色即是空，空即是色", en: "Form is exactly emptiness; emptiness is exactly form." },
  { zh: "受想行識，亦復如是", en: "So it is with feeling, perception, volition, and consciousness." },
  { zh: "舍利子，是諸法空相", en: "Śāriputra, all things are marked by emptiness:" },
  { zh: "不生不滅", en: "they do not arise, they do not cease;" },
  { zh: "不垢不淨", en: "they are not defiled, they are not pure;" },
  { zh: "不增不減", en: "they do not increase, they do not decrease." },
  { zh: "是故空中無色，無受想行識", en: "So in emptiness there is no form, no feeling, perception, volition, or consciousness;" },
  { zh: "無眼耳鼻舌身意", en: "no eye, ear, nose, tongue, body, or mind;" },
  { zh: "無色聲香味觸法", en: "no sight, sound, smell, taste, touch, or object of mind;" },
  { zh: "無眼界，乃至無意識界", en: "no realm of the eye — up to no realm of mental consciousness;" },
  { zh: "無無明，亦無無明盡", en: "no ignorance, and no end of ignorance;" },
  { zh: "乃至無老死，亦無老死盡", en: "up to no old age and death, and no end of old age and death." },
  { zh: "無苦集滅道", en: "There is no suffering, no origin, no cessation, no path;" },
  { zh: "無智亦無得", en: "no wisdom, and nothing to attain." },
  { zh: "以無所得故，菩提薩埵", en: "With nothing to attain, the bodhisattva" },
  { zh: "依般若波羅蜜多故，心無罣礙", en: "relies on perfect wisdom, and the mind is without hindrance;" },
  { zh: "無罣礙故，無有恐怖", en: "without hindrance, there is no fear;" },
  { zh: "遠離顛倒夢想，究竟涅槃", en: "leaving upside-down dream-thinking far behind — final nirvāṇa." },
  { zh: "三世諸佛", en: "All buddhas of the three times" },
  { zh: "依般若波羅蜜多故", en: "rely on perfect wisdom" },
  { zh: "得阿耨多羅三藐三菩提", en: "and attain anuttara-samyak-saṃbodhi — unsurpassed, complete, perfect awakening." },
  { zh: "故知般若波羅蜜多", en: "So know that perfect wisdom" },
  { zh: "是大神咒，是大明咒", en: "is the great mantra of power, the great mantra of light," },
  { zh: "是無上咒，是無等等咒", en: "the supreme mantra, the mantra without equal," },
  { zh: "能除一切苦，真實不虛", en: "which clears away all suffering — true, not false." },
  { zh: "故說般若波羅蜜多咒", en: "So the mantra of perfect wisdom is spoken." },
  { zh: "即說咒曰", en: "Hear the mantra:" },
  { zh: "揭諦揭諦，波羅揭諦", en: "Gate, gate, pāragate —" },
  { zh: "波羅僧揭諦，菩提薩婆訶", en: "pārasaṃgate, bodhi svāhā! (Gone, gone, gone beyond, gone completely beyond — awakening, all hail!)" },
];

/* --------------------------- derived character data --------------------------- */

const CJK_RE = /[\u4e00-\u9fff]/;

export interface SutraChar {
  char: string;
  /** index into SUTRA_LINES; -1 for the 8 title characters */
  lineIndex: number;
}

function extractHanzi(text: string): string[] {
  return Array.from(text).filter((c) => CJK_RE.test(c));
}

/** Every CJK ideograph in reading order: 8 title chars first (lineIndex -1), then each line. */
export const SUTRA_CHARS: SutraChar[] = [
  ...extractHanzi(SUTRA_TITLE_ZH).map((char) => ({ char, lineIndex: -1 })),
  ...SUTRA_LINES.flatMap((line, lineIndex) =>
    extractHanzi(line.zh).map((char) => ({ char, lineIndex }))
  ),
];

/** Sorted unique characters across title + body (117). */
export const UNIQUE_CHARS: string[] = Array.from(
  new Set(SUTRA_CHARS.map((c) => c.char))
).sort();

/**
 * hanzi-writer-data has no entry for 罣 — show stroke order of its common
 * variant 掛 instead (with a note in the UI).
 */
export const VARIANT_FALLBACK: Record<string, string> = { "罣": "掛" };

/** 268 = 8 title chars + 260 body hanzi. */
export const TOTAL_CHARS = SUTRA_CHARS.length;

/** Body hanzi only (excludes the 8 title characters) — should be 260. */
export const BODY_CHAR_COUNT = SUTRA_CHARS.filter((c) => c.lineIndex >= 0).length;

// Dev-time sanity assertions (thrown at module load if the data ever drifts).
if (import.meta.env?.DEV) {
  if (TOTAL_CHARS !== 268) {
    throw new Error(`sutra data: expected 268 total chars, got ${TOTAL_CHARS}`);
  }
  if (BODY_CHAR_COUNT !== 260) {
    throw new Error(`sutra data: expected 260 body chars, got ${BODY_CHAR_COUNT}`);
  }
  if (UNIQUE_CHARS.length !== 117) {
    throw new Error(`sutra data: expected 117 unique chars, got ${UNIQUE_CHARS.length}`);
  }
}
