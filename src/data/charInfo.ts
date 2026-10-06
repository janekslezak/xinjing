/**
 * Per-character information for the 117 unique characters of the Heart Sutra
 * (Xuanzang's translation, traditional characters).
 *
 * Sources:
 *  - Pinyin: Unihan kMandarin (Unicode UCD), curated to the reading used in
 *    this sutra (e.g. 般 = bō as in 般若 bōrě, 舍 = shè as in 舍利子).
 *  - Glosses: condensed from Unihan kDefinition, with sutra-context notes
 *    for characters used in Sanskrit transliterations.
 *  - Radicals: Unihan kRSUnicode mapped to the Kangxi radical character and
 *    its standard English name.
 *  - Origin notes: curated; conservative composition facts only
 *    (pictograph / associative / semantic-phonetic analyses).
 */

export interface CharInfo {
  char: string;
  /** Hanyu pinyin, lowercase, tone marks (e.g. "guān") */
  pinyin: string;
  /** concise English meaning (a few words, semicolon-separated senses ok) */
  gloss: string;
  /** the character's radical (single CJK char) */
  radical: string;
  /** English gloss of the radical */
  radicalGloss: string;
  /** 1–2 sentence origin/composition note */
  origin: string;
}

export const CHAR_INFO: Record<string, CharInfo> = {
  "一": {"char": "一", "pinyin": "yī", "gloss": "one; a single", "radical": "一", "radicalGloss": "one", "origin": "Ideograph: a single horizontal stroke representing the number one."},
  "三": {"char": "三", "pinyin": "sān", "gloss": "three", "radical": "一", "radicalGloss": "one", "origin": "Ideograph: three horizontal strokes representing the number three."},
  "上": {"char": "上", "pinyin": "shàng", "gloss": "above, on top; superior", "radical": "一", "radicalGloss": "one", "origin": "Ideograph: a short stroke placed above a baseline to indicate 'above'."},
  "不": {"char": "不", "pinyin": "bù", "gloss": "no, not", "radical": "一", "radicalGloss": "one", "origin": "Found already on oracle bones as the negation; its original referent is disputed (often taken as a calyx or roots), borrowed early for 'not'."},
  "世": {"char": "世", "pinyin": "shì", "gloss": "generation; world, era", "radical": "一", "radicalGloss": "one", "origin": "Ideograph: three joined 十 (ten) signs — thirty years make one generation."},
  "中": {"char": "中", "pinyin": "zhōng", "gloss": "middle, center; within", "radical": "丨", "radicalGloss": "line", "origin": "Pictograph of a vertical line passing through the center of an enclosure, marking the middle."},
  "乃": {"char": "乃", "pinyin": "nǎi", "gloss": "then; namely, indeed", "radical": "丿", "radicalGloss": "slash", "origin": "Ancient graph of uncertain original referent, borrowed early as a function word meaning 'then, namely'."},
  "五": {"char": "五", "pinyin": "wǔ", "gloss": "five", "radical": "二", "radicalGloss": "two", "origin": "Ideograph: originally the crossed sign 㐅 set between upper and lower bars, denoting the number five."},
  "亦": {"char": "亦", "pinyin": "yì", "gloss": "also, too", "radical": "亠", "radicalGloss": "lid", "origin": "Ideograph: 大 (a person) with two dots marking the armpits — the original form of 腋 'armpit', later borrowed for 'also'."},
  "以": {"char": "以", "pinyin": "yǐ", "gloss": "by means of; in order to; therefore", "radical": "人", "radicalGloss": "person", "origin": "Oracle-bone graph of debated origin, possibly showing a person using an implement; borrowed as a grammatical function word."},
  "佛": {"char": "佛", "pinyin": "fó", "gloss": "Buddha; Buddhism", "radical": "人", "radicalGloss": "person", "origin": "Semantic-phonetic compound: 亻 (person) semantic + 弗 (fú) phonetic. Coined to render Sanskrit 'Buddha'."},
  "依": {"char": "依", "pinyin": "yī", "gloss": "rely on, depend on", "radical": "人", "radicalGloss": "person", "origin": "Semantic-phonetic compound: 亻 (person) semantic + 衣 (yī) phonetic."},
  "倒": {"char": "倒", "pinyin": "dǎo", "gloss": "topple, fall over; inverted", "radical": "人", "radicalGloss": "person", "origin": "Semantic-phonetic compound: 亻 (person) semantic + 到 (dào) phonetic; a later graph for a person toppling over."},
  "僧": {"char": "僧", "pinyin": "sēng", "gloss": "Buddhist monk (Sanskrit saṃgha)", "radical": "人", "radicalGloss": "person", "origin": "Semantic-phonetic compound: 亻 (person) semantic + 曾 (céng) phonetic. Coined to abbreviate the transliteration of Sanskrit saṃgha."},
  "切": {"char": "切", "pinyin": "qiè", "gloss": "cut; in 一切 (yīqiè): all, every", "radical": "刀", "radicalGloss": "knife", "origin": "Semantic-phonetic compound: 刀 (knife) semantic + 七 (qī) phonetic."},
  "利": {"char": "利", "pinyin": "lì", "gloss": "sharp; advantage, profit", "radical": "刀", "radicalGloss": "knife", "origin": "Associative compound: 刀 (knife) cutting 禾 (grain) at harvest — hence 'sharp' and 'profit'."},
  "即": {"char": "即", "pinyin": "jí", "gloss": "immediately; namely; precisely", "radical": "卩", "radicalGloss": "seal", "origin": "Associative compound: a kneeling figure 卩 beside a food vessel 皀 — approaching the meal, hence 'draw near, immediately'."},
  "厄": {"char": "厄", "pinyin": "è", "gloss": "distress, adversity, calamity", "radical": "厂", "radicalGloss": "cliff", "origin": "Composed of 厂 (cliff) over 卩 (a bent figure): a person trapped beneath a cliff — hardship."},
  "受": {"char": "受", "pinyin": "shòu", "gloss": "receive; bear; feeling (Skt. vedanā)", "radical": "又", "radicalGloss": "right hand", "origin": "Associative compound: one hand 爪 passes a vessel to another hand 又 below — giving and receiving."},
  "味": {"char": "味", "pinyin": "wèi", "gloss": "taste, flavor", "radical": "口", "radicalGloss": "mouth", "origin": "Semantic-phonetic compound: 口 (mouth) semantic + 未 (wèi) phonetic."},
  "咒": {"char": "咒", "pinyin": "zhòu", "gloss": "incantation, mantra, spell", "radical": "口", "radicalGloss": "mouth", "origin": "Built on doubled 口 (mouths): mouths intoning words of power; a variant of 呪."},
  "在": {"char": "在", "pinyin": "zài", "gloss": "be at, be present; exist", "radical": "土", "radicalGloss": "earth", "origin": "Semantic-phonetic compound: 土 (earth) semantic + 才 (cái) phonetic."},
  "垢": {"char": "垢", "pinyin": "gòu", "gloss": "dirt, filth; defilement", "radical": "土", "radicalGloss": "earth", "origin": "Semantic-phonetic compound: 土 (earth) semantic + 后 (hòu) phonetic."},
  "埵": {"char": "埵", "pinyin": "duǒ", "gloss": "clod of earth; in 薩埵 transliterates Skt. sattva ('being')", "radical": "土", "radicalGloss": "earth", "origin": "Semantic-phonetic compound: 土 (earth) semantic + 垂 (chuí) phonetic."},
  "增": {"char": "增", "pinyin": "zēng", "gloss": "increase, add to", "radical": "土", "radicalGloss": "earth", "origin": "Semantic-phonetic compound: 土 (earth) semantic + 曾 (zēng) phonetic — piling up earth."},
  "多": {"char": "多", "pinyin": "duō", "gloss": "much, many", "radical": "夕", "radicalGloss": "evening", "origin": "Associative compound: two stacked 夕 (pieces of dried meat) suggest abundance."},
  "夢": {"char": "夢", "pinyin": "mèng", "gloss": "dream", "radical": "夕", "radicalGloss": "evening", "origin": "Semantic-phonetic compound: 夕 (evening) semantic + an abbreviated 瞢 (méng) phonetic."},
  "大": {"char": "大", "pinyin": "dà", "gloss": "big, great", "radical": "大", "radicalGloss": "big", "origin": "Pictograph of a person standing with arms outstretched — as 'big' as a person can show."},
  "如": {"char": "如", "pinyin": "rú", "gloss": "as, like; if; thus", "radical": "女", "radicalGloss": "woman", "origin": "Composed of 女 (woman) and 口 (mouth); the Shuowen glosses it as 'to follow, comply'."},
  "婆": {"char": "婆", "pinyin": "pó", "gloss": "old woman; in 薩婆訶 transliterates Skt. -vāhā", "radical": "女", "radicalGloss": "woman", "origin": "Semantic-phonetic compound: 女 (woman) semantic + 波 (bō) phonetic."},
  "子": {"char": "子", "pinyin": "zǐ", "gloss": "child, son; noun suffix", "radical": "子", "radicalGloss": "child", "origin": "Pictograph of an infant with a large head and swaddled body, one arm waving."},
  "實": {"char": "實", "pinyin": "shí", "gloss": "real, solid; true", "radical": "宀", "radicalGloss": "roof", "origin": "Associative compound: 宀 (roof) over 貫 (a string of cowries, wealth) — a house filled with goods, hence 'solid, real'."},
  "度": {"char": "度", "pinyin": "dù", "gloss": "measure, degree; to cross over, deliver (beings)", "radical": "广", "radicalGloss": "shelter", "origin": "Semantic-phonetic compound: 又 (hand) semantic + abbreviated 庶 (shù) phonetic; the measuring hand gives 'measure, degree'."},
  "得": {"char": "得", "pinyin": "dé", "gloss": "obtain, gain, acquire", "radical": "彳", "radicalGloss": "step", "origin": "Associative compound: 彳 (go) with 貝 (cowry) taken in hand 又 — going out and coming back with valuables."},
  "復": {"char": "復", "pinyin": "fù", "gloss": "return; again, repeat", "radical": "彳", "radicalGloss": "step", "origin": "Semantic-phonetic compound: 彳 (step) semantic + 复 (fù) phonetic."},
  "心": {"char": "心", "pinyin": "xīn", "gloss": "heart; mind", "radical": "心", "radicalGloss": "heart", "origin": "Pictograph of the heart, showing the organ with its chambers."},
  "怖": {"char": "怖", "pinyin": "bù", "gloss": "fear, terror", "radical": "心", "radicalGloss": "heart", "origin": "Semantic-phonetic compound: 忄 (heart) semantic + 布 (bù) phonetic."},
  "恐": {"char": "恐", "pinyin": "kǒng", "gloss": "fear; be afraid", "radical": "心", "radicalGloss": "heart", "origin": "Semantic-phonetic compound: 心 (heart) semantic + 巩 (gǒng) phonetic."},
  "想": {"char": "想", "pinyin": "xiǎng", "gloss": "think; perception (Skt. saṃjñā)", "radical": "心", "radicalGloss": "heart", "origin": "Semantic-phonetic compound: 心 (heart/mind) semantic + 相 (xiāng) phonetic."},
  "意": {"char": "意", "pinyin": "yì", "gloss": "thought, intention; mind", "radical": "心", "radicalGloss": "heart", "origin": "Composed of 音 (sound) over 心 (heart/mind): the sound of the mind — thought, intent."},
  "所": {"char": "所", "pinyin": "suǒ", "gloss": "place; that which (nominalizing particle)", "radical": "戶", "radicalGloss": "door", "origin": "Semantic-phonetic compound: 斤 (axe) semantic + 戶 (hù) phonetic; originally the sound of hewing wood, borrowed for 'place'."},
  "提": {"char": "提", "pinyin": "tí", "gloss": "lift, hold up; in 菩提 transliterates Skt. bodhi", "radical": "手", "radicalGloss": "hand", "origin": "Semantic-phonetic compound: 扌 (hand) semantic + 是 (shì) phonetic."},
  "揭": {"char": "揭", "pinyin": "jiē", "gloss": "lift, raise; in the mantra transliterates Skt. gate ('gone')", "radical": "手", "radicalGloss": "hand", "origin": "Semantic-phonetic compound: 扌 (hand) semantic + 曷 (hé) phonetic."},
  "故": {"char": "故", "pinyin": "gù", "gloss": "cause, reason; therefore", "radical": "攵", "radicalGloss": "rap", "origin": "Semantic-phonetic compound: 攵 (to act, tap) semantic + 古 (gǔ) phonetic; 'what came before' gives 'cause' and 'therefore'."},
  "明": {"char": "明", "pinyin": "míng", "gloss": "bright, clear", "radical": "日", "radicalGloss": "sun", "origin": "Associative compound: 日 (sun) together with 月 (moon) — the two luminaries, 'bright'."},
  "是": {"char": "是", "pinyin": "shì", "gloss": "this; right; to be", "radical": "日", "radicalGloss": "sun", "origin": "Composed of 日 (sun) over 正 (straight, upright): upright as the sun at noon, hence 'right, this'."},
  "時": {"char": "時", "pinyin": "shí", "gloss": "time, season; when", "radical": "日", "radicalGloss": "sun", "origin": "Semantic-phonetic compound: 日 (sun) semantic + 寺 (sì) phonetic."},
  "智": {"char": "智", "pinyin": "zhì", "gloss": "wisdom, knowledge", "radical": "日", "radicalGloss": "sun", "origin": "Formed from 知 (to know) over 曰 (speech): knowledge that can be expressed — 'wisdom'."},
  "曰": {"char": "曰", "pinyin": "yuē", "gloss": "say; be called", "radical": "曰", "radicalGloss": "say", "origin": "Ideograph: 口 (mouth) with a short stroke at the top indicating words issuing forth — 'say'."},
  "有": {"char": "有", "pinyin": "yǒu", "gloss": "have; exist; there is", "radical": "月", "radicalGloss": "moon", "origin": "Associative compound: a hand 又 holding a piece of meat 月(肉) — possession."},
  "槃": {"char": "槃", "pinyin": "pán", "gloss": "tray, basin; in 涅槃 transliterates -vāṇa of nirvāṇa", "radical": "木", "radicalGloss": "tree", "origin": "Semantic-phonetic compound: 木 (wood) semantic + 般 (bān) phonetic."},
  "死": {"char": "死", "pinyin": "sǐ", "gloss": "die; death", "radical": "歹", "radicalGloss": "death", "origin": "Associative compound: 歹 (bare bones) beside 人 (person) — a person reduced to bones."},
  "法": {"char": "法", "pinyin": "fǎ", "gloss": "law, rule; the Dharma, teaching", "radical": "水", "radicalGloss": "water", "origin": "From the ancient form 灋: 水 (water, level as a standard) + 廌 (a beast said to gore the guilty) + 去 (remove) — 'law'."},
  "波": {"char": "波", "pinyin": "bō", "gloss": "wave; in 波羅蜜多 transliterates Skt. pā(ramitā)", "radical": "水", "radicalGloss": "water", "origin": "Semantic-phonetic compound: 氵 (water) semantic + 皮 (pí) phonetic."},
  "涅": {"char": "涅", "pinyin": "niè", "gloss": "black mud; in 涅槃 transliterates nir- of nirvāṇa", "radical": "水", "radicalGloss": "water", "origin": "Semantic-phonetic compound: 氵 (water) semantic + 圼 (niè) phonetic."},
  "淨": {"char": "淨", "pinyin": "jìng", "gloss": "pure, clean", "radical": "水", "radicalGloss": "water", "origin": "Semantic-phonetic compound: 氵 (water) semantic + 爭 (zhēng) phonetic."},
  "深": {"char": "深", "pinyin": "shēn", "gloss": "deep; profound", "radical": "水", "radicalGloss": "water", "origin": "Semantic-phonetic compound: 氵 (water) semantic + 罙 (shēn) phonetic."},
  "減": {"char": "減", "pinyin": "jiǎn", "gloss": "decrease, diminish", "radical": "水", "radicalGloss": "water", "origin": "Semantic-phonetic compound: 氵 (water) semantic + 咸 (xián) phonetic."},
  "滅": {"char": "滅", "pinyin": "miè", "gloss": "extinguish; cease; cessation (Skt. nirodha)", "radical": "水", "radicalGloss": "water", "origin": "Semantic-phonetic compound: 氵 (water) semantic + 烕 (miè) phonetic — water quenching fire."},
  "無": {"char": "無", "pinyin": "wú", "gloss": "not have; without; no", "radical": "火", "radicalGloss": "fire", "origin": "Originally a pictograph of a dancer holding ornaments (the parent of 舞); borrowed for the homophonous 'not have'."},
  "照": {"char": "照", "pinyin": "zhào", "gloss": "shine on, illuminate", "radical": "火", "radicalGloss": "fire", "origin": "Semantic-phonetic compound: 灬 (fire) semantic + 昭 (zhāo) phonetic."},
  "生": {"char": "生", "pinyin": "shēng", "gloss": "be born; arise; life", "radical": "生", "radicalGloss": "life", "origin": "Ideograph: a plant 屮 sprouting up out of the ground 土 — growth, birth."},
  "界": {"char": "界", "pinyin": "jiè", "gloss": "boundary; realm, world", "radical": "田", "radicalGloss": "field", "origin": "Semantic-phonetic compound: 田 (field) semantic + 介 (jiè) phonetic — the borders between fields."},
  "異": {"char": "異", "pinyin": "yì", "gloss": "different; other", "radical": "田", "radicalGloss": "field", "origin": "Oracle-bone graph of a figure raising both hands to set a mask over its face; extended to 'different, strange'."},
  "皆": {"char": "皆", "pinyin": "jiē", "gloss": "all, every", "radical": "白", "radicalGloss": "white", "origin": "Composed of 比 (together, side by side) with 白 (bái) as phonetic — 'all together'."},
  "盡": {"char": "盡", "pinyin": "jìn", "gloss": "exhaust, use up; come to an end", "radical": "皿", "radicalGloss": "dish", "origin": "Associative compound: a hand holding a brush 聿 (with 火) scrubbing a vessel 皿 clean — the vessel emptied, 'exhausted'."},
  "相": {"char": "相", "pinyin": "xiàng", "gloss": "appearance, mark; (xiāng) mutually", "radical": "目", "radicalGloss": "eye", "origin": "Associative compound: 目 (eye) examining 木 (a tree) — to inspect; extended to 'appearance' and 'mutually'."},
  "真": {"char": "真", "pinyin": "zhēn", "gloss": "true, real, genuine", "radical": "目", "radicalGloss": "eye", "origin": "A learned graph of complex makeup (Shuowen analyzes it via 匕 'change' over 目 with hidden parts); long used for 'true, genuine'."},
  "眼": {"char": "眼", "pinyin": "yǎn", "gloss": "eye", "radical": "目", "radicalGloss": "eye", "origin": "Semantic-phonetic compound: 目 (eye) semantic + 艮 (gèn) phonetic."},
  "知": {"char": "知", "pinyin": "zhī", "gloss": "know, understand", "radical": "矢", "radicalGloss": "arrow", "origin": "Composed of 矢 (arrow) with 口 (mouth): words flying straight as an arrow — ready knowledge."},
  "礙": {"char": "礙", "pinyin": "ài", "gloss": "obstruct, hinder; obstacle", "radical": "石", "radicalGloss": "stone", "origin": "Semantic-phonetic compound: 石 (stone) semantic + 疑 (yí) phonetic — a stone blocking the way."},
  "神": {"char": "神", "pinyin": "shén", "gloss": "spirit, deity; divine, spiritual", "radical": "示", "radicalGloss": "spirit", "origin": "Semantic-phonetic compound: 礻 (altar, spirit) semantic + 申 (shēn) phonetic."},
  "究": {"char": "究", "pinyin": "jiū", "gloss": "investigate thoroughly; ultimate", "radical": "穴", "radicalGloss": "cave", "origin": "Semantic-phonetic compound: 穴 (cave) semantic + 九 (jiǔ) phonetic — probing a cave to its end."},
  "空": {"char": "空", "pinyin": "kōng", "gloss": "empty, hollow; emptiness (Skt. śūnyatā)", "radical": "穴", "radicalGloss": "cave", "origin": "Semantic-phonetic compound: 穴 (cave, cavity) semantic + 工 (gōng) phonetic — a hollow cavity, 'empty'."},
  "竟": {"char": "竟", "pinyin": "jìng", "gloss": "finish, end; after all", "radical": "音", "radicalGloss": "sound", "origin": "Composed of 音 (music) over 人 (person): the music ends — 'conclude, in the end'."},
  "等": {"char": "等", "pinyin": "děng", "gloss": "rank, class; equal; and so forth", "radical": "竹", "radicalGloss": "bamboo", "origin": "Semantic-phonetic compound: 竹 (bamboo) semantic + 寺 (sì) phonetic; originally sorting bamboo slips into equal ranks."},
  "經": {"char": "經", "pinyin": "jīng", "gloss": "warp thread; classic, scripture (sūtra)", "radical": "糸", "radicalGloss": "silk", "origin": "Semantic-phonetic compound: 糸 (silk thread) semantic + 巠 (jīng) phonetic; the warp threads of a loom give 'constant norm, classic'."},
  "罣": {"char": "罣", "pinyin": "guà", "gloss": "hinder, obstruct; entangled (variant of 掛)", "radical": "罒", "radicalGloss": "net", "origin": "Semantic-phonetic compound: 罒 (net) semantic + 卦 (guà) phonetic — caught in a net, hence 'hindered'."},
  "羅": {"char": "羅", "pinyin": "luó", "gloss": "bird net; gauze; here transliterates Skt. syllable ra", "radical": "罒", "radicalGloss": "net", "origin": "Associative compound: 罒 (net) over 糸 (silk) and 隹 (bird) — a silk net for catching birds."},
  "老": {"char": "老", "pinyin": "lǎo", "gloss": "old, aged", "radical": "老", "radicalGloss": "old", "origin": "Pictograph of an aged person with long hair leaning on a staff."},
  "耨": {"char": "耨", "pinyin": "nòu", "gloss": "to hoe, weed; in 阿耨多羅 transliterates Skt. (an)uttara", "radical": "耒", "radicalGloss": "plow", "origin": "Semantic-phonetic compound: 耒 (plow) semantic + 辱 (rǔ) phonetic."},
  "耳": {"char": "耳", "pinyin": "ěr", "gloss": "ear", "radical": "耳", "radicalGloss": "ear", "origin": "Pictograph of an ear."},
  "聲": {"char": "聲", "pinyin": "shēng", "gloss": "sound, voice", "radical": "耳", "radicalGloss": "ear", "origin": "Semantic-phonetic compound: 耳 (ear) semantic + 殸 (qìng, 'musical stone') phonetic — what the ear hears."},
  "能": {"char": "能", "pinyin": "néng", "gloss": "be able; can; ability", "radical": "肉", "radicalGloss": "meat", "origin": "Originally a pictograph of a kind of bear (parent of 熊); borrowed for the homophonous 'able, can'."},
  "自": {"char": "自", "pinyin": "zì", "gloss": "self; from", "radical": "自", "radicalGloss": "self", "origin": "Pictograph of a nose; people point to their own nose to mean 'self', hence the borrowed sense."},
  "至": {"char": "至", "pinyin": "zhì", "gloss": "arrive, reach; utmost", "radical": "至", "radicalGloss": "arrive", "origin": "Ideograph: an arrow 矢 striking its mark on the ground 一 — 'arrive'."},
  "舌": {"char": "舌", "pinyin": "shé", "gloss": "tongue", "radical": "舌", "radicalGloss": "tongue", "origin": "Pictograph of a tongue protruding from a mouth 口."},
  "舍": {"char": "舍", "pinyin": "shè", "gloss": "house, dwelling; in 舍利子 transliterates Śāri(putra)", "radical": "舌", "radicalGloss": "tongue", "origin": "Pictograph of a building: roof 亼 over a walled base 口 — a lodging house, 'dwelling'."},
  "般": {"char": "般", "pinyin": "bō", "gloss": "sort, kind; in 般若 (bōrě) transliterates Skt. prajñā ('wisdom')", "radical": "舟", "radicalGloss": "boat", "origin": "Composed of 舟 (boat) with 殳 (to pole, drive): turning a boat — 'move about'; borrowed as a transliteration syllable."},
  "色": {"char": "色", "pinyin": "sè", "gloss": "color; form, matter (Skt. rūpa)", "radical": "色", "radicalGloss": "color", "origin": "Composed of 人 over 卩 (a kneeling figure) per the Shuowen; originally the color/expression of the face."},
  "若": {"char": "若", "pinyin": "rě (ruò)", "gloss": "if; like, as; in 般若 transliterates -jñā of prajñā", "radical": "艸", "radicalGloss": "grass", "origin": "Oracle-bone graph of a kneeling figure raising both hands to smooth the hair — 'compliant'; borrowed for 'if, like'."},
  "苦": {"char": "苦", "pinyin": "kǔ", "gloss": "bitter; suffering (Skt. duḥkha)", "radical": "艸", "radicalGloss": "grass", "origin": "Semantic-phonetic compound: 艹 (grass, plant) semantic + 古 (gǔ) phonetic; originally a bitter herb."},
  "菩": {"char": "菩", "pinyin": "pú", "gloss": "in 菩薩 transliterates Skt. bodhi ('awakening')", "radical": "艸", "radicalGloss": "grass", "origin": "Semantic-phonetic compound: 艹 (grass, plant) semantic + 咅 (pǒu) phonetic; used to transcribe Sanskrit."},
  "薩": {"char": "薩", "pinyin": "sà", "gloss": "in 菩薩 transliterates Skt. sattva ('being')", "radical": "艸", "radicalGloss": "grass", "origin": "Semantic-phonetic compound: 艹 (grass, plant) semantic + 產 (chǎn) phonetic; coined for Buddhist transliteration."},
  "藐": {"char": "藐", "pinyin": "miǎo", "gloss": "small, minute; disregard", "radical": "艸", "radicalGloss": "grass", "origin": "Semantic-phonetic compound: 艹 (grass, plant) semantic + 貌 (mào) phonetic; here in 三藐 it transcribes Skt. sam(yak)."},
  "蘊": {"char": "蘊", "pinyin": "yùn", "gloss": "gather, store; aggregate (Skt. skandha)", "radical": "艸", "radicalGloss": "grass", "origin": "Semantic-phonetic compound: 艹 (grass, plant) semantic + 縕 (yùn) phonetic — plants heaped and stored."},
  "虛": {"char": "虛", "pinyin": "xū", "gloss": "empty, void; false", "radical": "虍", "radicalGloss": "tiger", "origin": "Semantic-phonetic compound: 虍 (tiger) semantic + 丘 (qiū) phonetic; originally a great mound, extended to 'empty'."},
  "蜜": {"char": "蜜", "pinyin": "mì", "gloss": "honey; in 波羅蜜多 transliterates -mitā of pāramitā", "radical": "虫", "radicalGloss": "insect", "origin": "Semantic-phonetic compound: 虫 (insect, the bee) semantic + 宓 (mì) phonetic."},
  "行": {"char": "行", "pinyin": "xíng", "gloss": "walk, go; practice; volitional formations (Skt. saṃskāra)", "radical": "行", "radicalGloss": "walk", "origin": "Pictograph of a crossroads with four ways meeting — 'go, travel'."},
  "見": {"char": "見", "pinyin": "jiàn", "gloss": "see, perceive", "radical": "見", "radicalGloss": "see", "origin": "Associative compound: an eye 目 set atop a person 人 — the act of seeing."},
  "觀": {"char": "觀", "pinyin": "guān", "gloss": "observe, contemplate", "radical": "見", "radicalGloss": "see", "origin": "Semantic-phonetic compound: 見 (see) semantic + 雚 (guàn) phonetic — to look carefully, contemplate."},
  "觸": {"char": "觸", "pinyin": "chù", "gloss": "touch, contact", "radical": "角", "radicalGloss": "horn", "origin": "Semantic-phonetic compound: 角 (horn) semantic + 蜀 (shǔ) phonetic — an animal butting with its horn."},
  "訶": {"char": "訶", "pinyin": "hē", "gloss": "scold loudly; in 薩婆訶 transliterates -hā of svāhā", "radical": "言", "radicalGloss": "speech", "origin": "Semantic-phonetic compound: 言 (speech) semantic + 可 (kě) phonetic."},
  "說": {"char": "說", "pinyin": "shuō", "gloss": "speak, say; preach", "radical": "言", "radicalGloss": "speech", "origin": "Semantic-phonetic compound: 言 (speech) semantic + 兌 (duì) phonetic."},
  "諦": {"char": "諦", "pinyin": "dì", "gloss": "examine carefully; truth (Skt. satya)", "radical": "言", "radicalGloss": "speech", "origin": "Semantic-phonetic compound: 言 (speech) semantic + 帝 (dì) phonetic; in 揭諦 it transcribes Skt. gate."},
  "諸": {"char": "諸", "pinyin": "zhū", "gloss": "all, various; many", "radical": "言", "radicalGloss": "speech", "origin": "Semantic-phonetic compound: 言 (speech) semantic + 者 (zhě) phonetic."},
  "識": {"char": "識", "pinyin": "shí", "gloss": "recognize; consciousness (Skt. vijñāna)", "radical": "言", "radicalGloss": "speech", "origin": "Semantic-phonetic compound: 言 (speech) semantic + 戠 (zhí) phonetic."},
  "身": {"char": "身", "pinyin": "shēn", "gloss": "body; person", "radical": "身", "radicalGloss": "body", "origin": "Pictograph of a human torso with a prominent belly — the body."},
  "道": {"char": "道", "pinyin": "dào", "gloss": "road, path; the Way; the Path (Skt. mārga)", "radical": "辵", "radicalGloss": "walk", "origin": "Composed of 辵 (walk) with 首 (head): the head leads along the road — 'path, way'."},
  "遠": {"char": "遠", "pinyin": "yuǎn", "gloss": "distant, far", "radical": "辵", "radicalGloss": "walk", "origin": "Semantic-phonetic compound: 辶 (walk, movement) semantic + 袁 (yuán) phonetic."},
  "阿": {"char": "阿", "pinyin": "ā", "gloss": "slope of a hill; name prefix; transliterates Skt. a-", "radical": "阜", "radicalGloss": "mound", "origin": "Semantic-phonetic compound: 阝 (mound, hill) semantic + 可 (kě) phonetic."},
  "除": {"char": "除", "pinyin": "chú", "gloss": "remove, eliminate", "radical": "阜", "radicalGloss": "mound", "origin": "Semantic-phonetic compound: 阝 (mound, steps) semantic + 余 (yú) phonetic; originally palace steps, extended to 'remove'."},
  "集": {"char": "集", "pinyin": "jí", "gloss": "gather, assemble; origination (Skt. samudaya)", "radical": "隹", "radicalGloss": "bird", "origin": "Associative compound: birds 隹 perched together on a tree 木 — flocking, gathering."},
  "離": {"char": "離", "pinyin": "lí", "gloss": "leave; separate from", "radical": "隹", "radicalGloss": "bird", "origin": "Semantic-phonetic compound: 隹 (bird) semantic + 离 (lí) phonetic."},
  "顛": {"char": "顛", "pinyin": "diān", "gloss": "top of the head; topple, upside-down", "radical": "頁", "radicalGloss": "head", "origin": "Semantic-phonetic compound: 頁 (head) semantic + 真 (zhēn) phonetic — the crown of the head, hence 'topple'."},
  "香": {"char": "香", "pinyin": "xiāng", "gloss": "fragrant; incense", "radical": "香", "radicalGloss": "fragrant", "origin": "Composed of 黍 (millet) over 甘 (sweet): the sweet fragrance of ripening grain."},
  "鼻": {"char": "鼻", "pinyin": "bí", "gloss": "nose", "radical": "鼻", "radicalGloss": "nose", "origin": "Semantic-phonetic compound: 自 (nose) semantic + 畀 (bì) phonetic."},
};
