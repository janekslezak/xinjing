import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode, TouchEvent as ReactTouchEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import HanziWriter from "hanzi-writer";
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Pause,
  Play,
  RotateCcw,
  Volume2,
} from "lucide-react";
import TianGrid from "@/components/TianGrid";
import Chip from "@/components/Chip";
import Toast from "@/components/Toast";
import { useSpeech } from "@/hooks/useSpeech";
import { useAppSettings } from "@/components/settings/settings";
import { CHAR_INFO } from "@/data/charInfo";
import {
  SUTRA_CHARS,
  SUTRA_LINES,
  SUTRA_TITLE_ZH,
  SUTRA_TITLE_EN,
  TOTAL_CHARS,
  VARIANT_FALLBACK,
} from "@/data/sutra";

const INDEX_KEY = "xinjing:copy-index";
const VIEWED_KEY = "xinjing:viewed";
const MASTERED_KEY = "xinjing:mastered";
const NO_VOICE_MSG =
  "No Chinese voice found — install a Chinese (Taiwan) voice in system settings";

function cssVar(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function loadCharJson(c: string): Promise<any> {
  return fetch(`${import.meta.env.BASE_URL}hanzidata/${encodeURIComponent(c)}.json`).then((r) => {
    if (!r.ok) throw new Error(`no stroke data for ${c}`);
    return r.json();
  });
}

function readCharSet(key: string): Set<string> {
  try {
    const raw = localStorage.getItem(key);
    const arr: unknown = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(arr) ? (arr as string[]) : []);
  } catch {
    return new Set();
  }
}

function markViewed(c: string): Set<string> {
  const set = readCharSet(VIEWED_KEY);
  if (!set.has(c)) {
    set.add(c);
    try {
      localStorage.setItem(VIEWED_KEY, JSON.stringify(Array.from(set)));
    } catch {
      /* ignore */
    }
  }
  return set;
}

function markMastered(c: string): Set<string> {
  const set = readCharSet(MASTERED_KEY);
  if (!set.has(c)) {
    set.add(c);
    try {
      localStorage.setItem(MASTERED_KEY, JSON.stringify(Array.from(set)));
    } catch {
      /* ignore */
    }
  }
  return set;
}

function clampIndex(v: number): number {
  return Math.max(0, Math.min(TOTAL_CHARS - 1, v));
}

function initialIndex(): number {
  try {
    const raw = localStorage.getItem(INDEX_KEY);
    const n = raw ? Number.parseInt(raw, 10) : 0;
    return Number.isFinite(n) ? clampIndex(n) : 0;
  } catch {
    return 0;
  }
}

/** Render `text` with the `occ`-th occurrence of `char` highlighted in vermilion. */
function renderHighlighted(text: string, char: string, occ: number): ReactNode[] {
  const parts: ReactNode[] = [];
  let seen = 0;
  let start = 0;
  let key = 0;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === char) {
      if (seen === occ) {
        if (i > start) parts.push(<span key={key++}>{text.slice(start, i)}</span>);
        parts.push(
          <span key={key++} className="font-bold text-vermilion">
            {char}
          </span>
        );
        start = i + 1;
      }
      seen++;
    }
  }
  if (start <= text.length) parts.push(<span key={key++}>{text.slice(start)}</span>);
  return parts;
}

type LoadState = "loading" | "ready" | "error";
type CopyMode = "study" | "practice";

export default function Copy() {
  const [index, setIndex] = useState<number>(initialIndex);
  const [mode, setMode] = useState<CopyMode>("study");
  const [outlineOn, setOutlineOn] = useState(true);
  const [gridOn, setGridOn] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [strokeCount, setStrokeCount] = useState<number | null>(null);
  const [quizMistakes, setQuizMistakes] = useState(0);
  const [fallbackNote, setFallbackNote] = useState<string | null>(null);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [jumpEditing, setJumpEditing] = useState(false);
  const [jumpValue, setJumpValue] = useState("");
  const [viewed, setViewed] = useState<Set<string>>(() => readCharSet(VIEWED_KEY));
  const [mastered, setMastered] = useState<Set<string>>(() => readCharSet(MASTERED_KEY));
  const [toast, setToast] = useState<string | null>(null);
  const [size, setSize] = useState(() =>
    typeof window === "undefined" ? 320 : Math.min(320, window.innerWidth - 64)
  );
  const reduceMotion = useReducedMotion();

  const writerRef = useRef<HanziWriter | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const jumpCancelRef = useRef(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const modeRef = useRef(mode);
  modeRef.current = mode;

  const { supported, hasChineseVoice, speak } = useSpeech();
  const settings = useAppSettings();
  const speechRate = settings.speechRate ?? 0.85;

  const { char, lineIndex } = SUTRA_CHARS[index];
  const info = CHAR_INFO[char];

  // occurrence index of this char within its line (for highlighting)
  const occurrence = useMemo(() => {
    let n = 0;
    for (let i = 0; i < index; i++) {
      if (SUTRA_CHARS[i].lineIndex === lineIndex && SUTRA_CHARS[i].char === char) n++;
    }
    return n;
  }, [index, char, lineIndex]);

  // persist position + mark char as viewed
  useEffect(() => {
    try {
      localStorage.setItem(INDEX_KEY, String(index));
    } catch {
      /* ignore */
    }
    setViewed(markViewed(char));
  }, [index, char]);

  // responsive canvas size
  useEffect(() => {
    const onResize = () => setSize(Math.min(320, window.innerWidth - 64));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // create / recreate the writer on character, mode or outline change
  useEffect(() => {
    const el = canvasRef.current;
    if (!el || size <= 0) return;
    el.innerHTML = "";
    setLoadState("loading");
    setStrokeCount(null);
    setFallbackNote(null);
    let stale = false;

    const writer = HanziWriter.create(el, char, {
      width: size,
      height: size,
      padding: 8,
      showOutline: outlineOn,
      strokeAnimationSpeed: 1,
      delayBetweenStrokes: 180,
      strokeColor: cssVar("--ink", "#26221B"),
      outlineColor: cssVar("--ink-faint", "#9A9182"),
      highlightColor: cssVar("--vermilion", "#C8442C"),
      charDataLoader: (c, onLoad, onError) => {
        // stroke count from the loaded char data (medians length)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handle = (data: any, viaVariant: boolean) => {
          if (!stale) {
            if (Array.isArray(data?.medians)) setStrokeCount(data.medians.length);
            if (viaVariant) {
              setFallbackNote(`Stroke order shown for variant ${VARIANT_FALLBACK[c]}`);
            }
          }
          onLoad(data);
        };
        loadCharJson(c)
          .then((data) => handle(data, false))
          .catch(() => {
            const variant = VARIANT_FALLBACK[c];
            if (!variant) {
              onError(new Error(`no stroke data for ${c}`));
              return;
            }
            loadCharJson(variant)
              .then((data) => handle(data, true))
              .catch(onError);
          });
      },
    });
    writerRef.current = writer;

    writer
      .getCharacterData()
      .then((data) => {
        if (stale || writerRef.current !== writer) return;
        const count = data && Array.isArray(data.strokes) ? data.strokes.length : 0;
        if (count <= 0) {
          setLoadState("error");
          return;
        }
        setLoadState("ready");
      })
      .catch(() => {
        if (stale || writerRef.current !== writer) return;
        setLoadState("error");
      });

    return () => {
      stale = true;
      writerRef.current = null;
      // cancel the quiz AND the loop's rAF chain BEFORE detaching the SVG,
      // otherwise loopCharacterAnimation() re-queues frames forever on a
      // dead node and an active quiz keeps listening on removed elements
      writer.pauseAnimation();
      writer.cancelQuiz();
      el.innerHTML = "";
    };
  }, [char, size, outlineOn, mode]);

  // quiz completion: judge only here, from totalMistakes
  const handleQuizComplete = (totalMistakes: number) => {
    if (totalMistakes === 0 && !outlineOn) {
      setMastered(markMastered(char));
      setToast(`❤ ${char} mastered — flawless!`);
    } else if (totalMistakes === 0) {
      setToast(`Flawless! Turn off the outline to master ${char}.`);
    } else {
      setToast(
        `${totalMistakes} ${totalMistakes === 1 ? "mistake" : "mistakes"} — retry ${char} to master it`
      );
    }
  };

  const startQuiz = () => {
    const w = writerRef.current;
    if (!w) return;
    setQuizMistakes(0);
    w.quiz({
      onMistake: (d) => setQuizMistakes(d.totalMistakes),
      onCorrectStroke: () => {},
      onComplete: (s) => handleQuizComplete(s.totalMistakes),
    });
  };

  // mode behaviour without recreating the writer — the writer is recreated
  // per mode above, so this effect only fires on ready transitions (and on
  // play/pause toggles in study mode); mode comes from a ref so practice
  // quizzes are never double-started or started mid-load
  // NOTE: hanzi-writer v3 has no public cancelAnimation() (v2 API); any new
  // same-scope animation cancels the running loop chain internally, so
  // pauseAnimation() + showCharacter() is the equivalent stop-and-show.
  useEffect(() => {
    const w = writerRef.current;
    if (!w || loadState !== "ready") return;
    if (modeRef.current === "practice") {
      w.pauseAnimation();
      startQuiz();
      return;
    }
    if (playing) {
      w.loopCharacterAnimation();
    } else {
      w.pauseAnimation();
      w.showCharacter();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, loadState]);

  const go = useCallback(
    (delta: number) => setIndex((i) => clampIndex(i + delta)),
    []
  );

  // swipe navigation (study mode only — in practice mode the canvas captures
  // stroke tracing). Handlers are attached only in study mode; the same flags
  // as the keyboard handler (sheet open / jump input editing) also gate the
  // gesture. Swipe left → next char, right → previous, matching reading
  // direction; navigation goes through go()/clampIndex so persistence and
  // viewed-marking fire exactly as with the buttons.
  const handleCanvasTouchStart = (e: ReactTouchEvent) => {
    if (mode !== "study" || sheetOpen || jumpEditing) return;
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  };

  const handleCanvasTouchEnd = (e: ReactTouchEvent) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start || mode !== "study" || sheetOpen || jumpEditing) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) >= 48 && Math.abs(dx) > 1.5 * Math.abs(dy)) {
      go(dx < 0 ? 1 : -1);
    }
  };

  // keyboard navigation — arrows are disabled while the jump sheet (modal)
  // is open or the jump-to-character input is being edited (its ArrowLeft/
  // ArrowRight belong to the input); Escape closes the sheet
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (sheetOpen) setSheetOpen(false);
        return;
      }
      if (sheetOpen || jumpEditing) return;
      if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, sheetOpen, jumpEditing]);

  const retry = () => {
    const w = writerRef.current;
    if (mode === "practice") {
      // v3 pattern: cancel the active quiz, then start a fresh one
      if (!w || loadState !== "ready") return;
      w.cancelQuiz();
      startQuiz();
      return;
    }
    setPlaying(true);
    if (!w || loadState !== "ready") return;
    w.pauseAnimation();
    w.loopCharacterAnimation();
  };

  const pronounce = () => {
    if (!supported || !hasChineseVoice) {
      setToast(NO_VOICE_MSG);
      return;
    }
    speak(char, speechRate);
  };

  // stable dismisser — an inline closure would reset Toast's auto-dismiss
  // timer on every render
  const dismissToast = useCallback(() => setToast(null), []);

  const jumpTo = (i: number) => {
    setIndex(clampIndex(i));
    setSheetOpen(false);
  };

  // manual jump-to-character: open the inline input prefilled with the
  // current position; commit on Enter/blur, cancel on Escape/empty/invalid
  const openJump = () => {
    jumpCancelRef.current = false;
    setJumpValue(String(index + 1));
    setJumpEditing(true);
  };

  const commitJump = () => {
    setJumpEditing(false);
    if (jumpCancelRef.current) {
      jumpCancelRef.current = false;
      return;
    }
    const n = Number.parseInt(jumpValue, 10);
    if (!Number.isFinite(n)) return;
    // same index setter as normal navigation → persists + marks viewed
    setIndex(clampIndex(n - 1));
  };

  const contextZh = lineIndex === -1 ? SUTRA_TITLE_ZH : SUTRA_LINES[lineIndex].zh;
  const contextEn = lineIndex === -1 ? SUTRA_TITLE_EN : SUTRA_LINES[lineIndex].en;

  const spring = reduceMotion
    ? { duration: 0.15 }
    : { type: "spring" as const, stiffness: 260, damping: 26 };

  return (
    <div className="flex flex-col gap-4 pt-5">
      {/* header: position + pronounce + progress bar */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {jumpEditing ? (
              <span className="flex items-baseline gap-1 font-display text-[15px] font-bold text-ink">
                <input
                  ref={(el) => {
                    if (el) {
                      el.focus();
                      el.select();
                    }
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  aria-label="Jump to character number"
                  value={jumpValue}
                  onChange={(e) => setJumpValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.currentTarget.blur();
                    } else if (e.key === "Escape") {
                      jumpCancelRef.current = true;
                      e.currentTarget.blur();
                    }
                  }}
                  onBlur={commitJump}
                  className="w-16 rounded-md border-b-2 border-vermilion bg-transparent text-center font-display text-[15px] font-bold text-ink outline-none"
                />
                <span className="text-ink-faint">/ {TOTAL_CHARS}</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={openJump}
                aria-label="Jump to character number"
                className="-mx-1 rounded-md px-1 font-display text-[15px] font-bold text-ink transition-all hover:bg-ink/5 active:scale-95"
              >
                {index + 1} <span className="text-ink-faint">/ {TOTAL_CHARS}</span>
              </button>
            )}
            <button
              type="button"
              onClick={pronounce}
              aria-label={`Pronounce ${char}`}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink-faint transition-all hover:text-ink active:scale-90"
            >
              <Volume2 size={18} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            {mode === "practice" && loadState === "ready" && (
              <span className="rounded-full border border-grid-line/70 bg-paper-raised px-3 py-1 text-[12px] font-bold text-vermilion">
                {quizMistakes} {quizMistakes === 1 ? "mistake" : "mistakes"}
              </span>
            )}
            {strokeCount !== null && loadState !== "error" && (
              <span className="rounded-full border border-grid-line/70 bg-paper-raised px-3 py-1 text-[12px] font-bold text-ink-soft">
                {strokeCount} strokes
              </span>
            )}
          </div>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-grid-line/50">
          <motion.div
            className="h-full rounded-full bg-vermilion"
            initial={false}
            animate={{ width: `${((index + 1) / TOTAL_CHARS) * 100}%` }}
            transition={{ duration: 0.25 }}
          />
        </div>
      </div>

      {/* mode toggle */}
      <div className="flex items-center justify-center gap-2">
        <Chip label="Study" selected={mode === "study"} onClick={() => setMode("study")} />
        <Chip
          label="Practice"
          tone="jade"
          selected={mode === "practice"}
          onClick={() => setMode("practice")}
        />
      </div>

      {/* canvas */}
      <div className="flex flex-col items-center">
        <div
          className="relative rounded-[24px] bg-paper-raised px-5 shadow-soft"
          onTouchStart={mode === "study" ? handleCanvasTouchStart : undefined}
          onTouchEnd={mode === "study" ? handleCanvasTouchEnd : undefined}
        >
          <div className="relative" style={{ width: size, height: size }}>
            <TianGrid
              className={`absolute inset-0 h-full w-full transition-opacity duration-200 ${
                gridOn ? "opacity-60" : "opacity-0"
              }`}
            />
            <div ref={canvasRef} className="absolute inset-0" />
            {loadState === "error" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <span className="font-cjk text-ink" style={{ fontSize: size * 0.6, lineHeight: 1 }}>
                  {char}
                </span>
                <span className="text-[12px] font-semibold text-ink-faint">
                  Stroke data unavailable
                </span>
              </div>
            )}
          </div>
          {mode === "study" && index > 0 && (
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute left-1 top-1/2 text-ink-faint/50"
              style={{ y: "-50%" }}
              animate={{ x: [0, -4, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronLeft size={18} />
            </motion.span>
          )}
          {mode === "study" && index < TOTAL_CHARS - 1 && (
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute right-1 top-1/2 text-ink-faint/50"
              style={{ y: "-50%" }}
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronRight size={18} />
            </motion.span>
          )}
        </div>
        {fallbackNote && (
          <p className="mt-2 rounded-full bg-gold/10 px-3 py-1 text-[12px] font-semibold text-gold">
            {fallbackNote}
          </p>
        )}
      </div>

      {/* primary controls */}
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={index === 0}
          aria-label="Previous character"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-paper-raised text-ink shadow-soft transition-all active:scale-90 disabled:opacity-40"
        >
          <ChevronLeft size={22} />
        </button>
        {mode === "study" && (
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause animation" : "Play animation"}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-vermilion text-paper-raised shadow-soft transition-all active:scale-90"
          >
            {playing ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
          </button>
        )}
        <button
          type="button"
          onClick={retry}
          aria-label={mode === "practice" ? "Retry quiz" : "Replay stroke animation"}
          className={`flex items-center justify-center rounded-full shadow-soft transition-all active:scale-90 ${
            mode === "practice"
              ? "h-14 w-14 bg-vermilion text-paper-raised"
              : "h-12 w-12 bg-paper-raised text-ink"
          }`}
        >
          <RotateCcw size={19} />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          disabled={index === TOTAL_CHARS - 1}
          aria-label="Next character"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-paper-raised text-ink shadow-soft transition-all active:scale-90 disabled:opacity-40"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      {/* secondary controls */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Chip label="Outline" selected={outlineOn} onClick={() => setOutlineOn((v) => !v)} />
        <Chip label="Grid" selected={gridOn} onClick={() => setGridOn((v) => !v)} />
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="flex h-9 items-center gap-1.5 rounded-full border border-grid-line bg-transparent px-4 text-[13px] font-bold uppercase tracking-[0.04em] text-ink-soft transition-all hover:border-vermilion/50 active:scale-95"
        >
          <LayoutGrid size={15} />
          All characters
        </button>
      </div>

      {/* context card */}
      <div className="rounded-[20px] bg-paper-raised px-5 py-4 shadow-soft">
        <p className="font-cjk text-[18px] leading-8 text-ink">
          {renderHighlighted(contextZh, char, occurrence)}
        </p>
        <p className="mt-1.5 text-[13px] leading-snug text-ink-soft">{contextEn}</p>
        {lineIndex === -1 && (
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
            Sutra title
          </p>
        )}
      </div>

      {/* character details card */}
      {info && (
        <div className="overflow-hidden rounded-[20px] bg-paper-raised shadow-soft">
          <div className="flex items-baseline gap-3 border-b border-grid-line/50 px-5 py-3">
            <span className="w-16 shrink-0 text-[11px] font-bold uppercase tracking-wide text-ink-faint">
              Pinyin
            </span>
            <span className="text-[15px] font-semibold italic text-wash-blue">{info.pinyin}</span>
          </div>
          <div className="flex items-baseline gap-3 border-b border-grid-line/50 px-5 py-3">
            <span className="w-16 shrink-0 text-[11px] font-bold uppercase tracking-wide text-ink-faint">
              Meaning
            </span>
            <span className="text-[14px] leading-snug text-ink">{info.gloss}</span>
          </div>
          <div className="flex items-baseline gap-3 border-b border-grid-line/50 px-5 py-3">
            <span className="w-16 shrink-0 text-[11px] font-bold uppercase tracking-wide text-ink-faint">
              Radical
            </span>
            <span className="text-[14px] text-ink">
              <span className="font-cjk">{info.radical}</span> {info.radicalGloss}
            </span>
          </div>
          <div className="px-5 py-3">
            <p className="text-[13px] leading-snug text-ink-soft">{info.origin}</p>
          </div>
        </div>
      )}

      {/* all-characters bottom sheet */}
      <AnimatePresence>
        {sheetOpen && (
          <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="All characters">
            <motion.button
              type="button"
              aria-label="Close character list"
              onClick={() => setSheetOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0.1 : 0.2 }}
              className="absolute inset-0 bg-ink/40"
            />
            <motion.div
              initial={{ y: reduceMotion ? 0 : "100%", opacity: reduceMotion ? 0 : 1 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: reduceMotion ? 0 : "100%", opacity: reduceMotion ? 0 : 1 }}
              transition={spring}
              className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-[480px]"
            >
              <div className="max-h-[70dvh] overflow-hidden rounded-t-3xl border-t border-grid-line/60 bg-paper-raised shadow-lift">
                <div className="px-6 pb-2 pt-4">
                  <div aria-hidden="true" className="mx-auto mb-3 h-1 w-10 rounded-full bg-grid-line" />
                  <h2 className="font-display text-[17px] font-bold text-ink">
                    All characters
                    <span className="ml-2 text-[13px] font-semibold text-ink-faint">
                      {TOTAL_CHARS} in reading order
                    </span>
                  </h2>
                </div>
                <div className="max-h-[calc(70dvh-64px)] overflow-y-auto px-5 pb-[calc(env(safe-area-inset-bottom)+20px)]">
                  <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-7">
                    {SUTRA_CHARS.map((sc, i) => {
                      const isCurrent = i === index;
                      const seen = viewed.has(sc.char);
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => jumpTo(i)}
                          aria-label={`Character ${sc.char}, position ${i + 1}`}
                          className={`relative flex aspect-square items-center justify-center overflow-hidden rounded-lg transition-all active:scale-95 ${
                            isCurrent
                              ? "ring-2 ring-vermilion ring-offset-1 ring-offset-paper-raised"
                              : ""
                          } ${seen ? "opacity-100" : "opacity-40"}`}
                        >
                          <TianGrid className="absolute inset-0 h-full w-full" strokeWidth={1.2} />
                          <span className="relative font-cjk text-[20px] leading-none text-ink">
                            {sc.char}
                          </span>
                          {mastered.has(sc.char) && (
                            <span
                              aria-hidden="true"
                              className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-jade"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Toast message={toast} onDismiss={dismissToast} />
    </div>
  );
}
