import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, Repeat, Volume2 } from "lucide-react";
import Chip from "@/components/Chip";
import Toast from "@/components/Toast";
import { useSpeech } from "@/hooks/useSpeech";
import {
  SUTRA_LINES,
  SUTRA_TITLE_ZH,
  SUTRA_TITLE_EN,
  SUTRA_ATTRIBUTION_ZH,
  SUTRA_ATTRIBUTION_EN,
} from "@/data/sutra";

const RATE_KEY = "xinjing:chant-rate";
const RATES = [0.5, 0.7, 0.85, 1, 1.25] as const;
const LINE_GAP_MS = 600;
const NO_VOICE_MSG =
  "No Chinese voice found — install a Chinese (Taiwan) voice in system settings";

function initialRate(): number {
  try {
    const raw = localStorage.getItem(RATE_KEY);
    const n = raw ? Number.parseFloat(raw) : 0.85;
    return RATES.includes(n as (typeof RATES)[number]) ? n : 0.85;
  } catch {
    return 0.85;
  }
}

export default function Chant() {
  const { supported, hasChineseVoice, speak, cancel } = useSpeech();
  const [rate, setRate] = useState<number>(initialRate);
  const [loop, setLoop] = useState(false);
  const [playingAll, setPlayingAll] = useState(false);
  /** -1 = title, 0..34 = line index, null = idle */
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const tokenRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const rateRef = useRef(rate);
  const loopRef = useRef(loop);
  const lineRefs = useRef(new Map<number, HTMLElement>());
  rateRef.current = rate;
  loopRef.current = loop;

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // persist rate
  useEffect(() => {
    try {
      localStorage.setItem(RATE_KEY, String(rate));
    } catch {
      /* ignore */
    }
  }, [rate]);

  const speakAt = useCallback(
    (i: number) => {
      const token = ++tokenRef.current;
      clearTimer();
      const text = i === -1 ? SUTRA_TITLE_ZH : SUTRA_LINES[i].zh;
      setActiveLine(i);
      speak(text, rateRef.current, {
        onend: () => {
          if (tokenRef.current !== token) return;
          if (i >= SUTRA_LINES.length - 1) {
            if (loopRef.current) {
              timerRef.current = window.setTimeout(() => {
                if (tokenRef.current === token) speakAt(-1);
              }, LINE_GAP_MS);
            } else {
              setPlayingAll(false);
              setActiveLine(null);
            }
            return;
          }
          // auto-advance is always on during play-all
          timerRef.current = window.setTimeout(() => {
            if (tokenRef.current === token) speakAt(i + 1);
          }, LINE_GAP_MS);
        },
        onerror: () => {
          if (tokenRef.current !== token) return;
          setPlayingAll(false);
        },
      });
    },
    [speak, clearTimer]
  );

  const pauseAll = useCallback(() => {
    tokenRef.current += 1;
    clearTimer();
    cancel();
    setPlayingAll(false);
  }, [cancel, clearTimer]);

  const togglePlayAll = () => {
    if (playingAll) {
      pauseAll();
      return;
    }
    if (!supported || !hasChineseVoice) {
      setToast(NO_VOICE_MSG);
      return;
    }
    setPlayingAll(true);
    speakAt(activeLine ?? -1);
  };

  const speakOne = (i: number) => {
    // stop any play-all, then speak just this line
    tokenRef.current += 1;
    clearTimer();
    setPlayingAll(false);
    if (!supported || !hasChineseVoice) {
      setToast(NO_VOICE_MSG);
      return;
    }
    setActiveLine(i === -1 ? null : i);
    speak(i === -1 ? SUTRA_TITLE_ZH : SUTRA_LINES[i].zh, rateRef.current, {
      onend: () => setActiveLine(null),
    });
  };

  // scroll the active line into view — only during play-all; per-line
  // single play must not yank the scroll position
  useEffect(() => {
    if (!playingAll || activeLine === null || activeLine < 0) return;
    lineRefs.current.get(activeLine)?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [activeLine, playingAll]);

  // stable dismisser — an inline closure would reset Toast's auto-dismiss
  // timer on every render
  const dismissToast = useCallback(() => setToast(null), []);

  // cancel everything on unmount
  useEffect(
    () => () => {
      tokenRef.current += 1;
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      cancel();
    },
    [cancel]
  );

  return (
    <div className="flex flex-col gap-4 pt-5">
      {/* header card */}
      <section className="rounded-[20px] bg-paper-raised px-5 py-6 text-center shadow-soft">
        <h1 className="font-brush text-[34px] leading-tight text-ink">{SUTRA_TITLE_ZH}</h1>
        <p className="mt-1.5 text-[13px] font-semibold text-ink-soft">{SUTRA_TITLE_EN}</p>
        <p className="mt-2 text-[12px] text-ink-faint">
          <span className="font-cjk">{SUTRA_ATTRIBUTION_ZH}</span>
          <span className="mx-1.5">·</span>
          {SUTRA_ATTRIBUTION_EN}
        </p>
      </section>

      {/* sticky controls bar */}
      <div className="sticky top-[calc(56px+env(safe-area-inset-top))] z-40 -mx-5 border-y border-grid-line/50 bg-paper/90 px-5 py-2.5 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={togglePlayAll}
            aria-label={playingAll ? "Pause chant" : "Play full sutra"}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-vermilion text-paper-raised shadow-soft transition-all active:scale-90"
          >
            {playingAll ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
          </button>
          <div className="no-scrollbar flex flex-1 items-center gap-1.5 overflow-x-auto">
            {RATES.map((r) => (
              <Chip
                key={r}
                label={`${r}×`}
                selected={rate === r}
                onClick={() => setRate(r)}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setLoop((v) => !v)}
            aria-label={loop ? "Disable loop" : "Enable loop"}
            aria-pressed={loop}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-all active:scale-90 ${
              loop ? "bg-vermilion/15 text-vermilion" : "text-ink-faint"
            }`}
          >
            <Repeat size={18} />
          </button>
        </div>
        {playingAll && activeLine !== null && (
          <p className="mt-1.5 text-center text-[12px] font-bold text-vermilion">
            {activeLine === -1 ? "Title" : `Line ${activeLine + 1} / ${SUTRA_LINES.length}`}
          </p>
        )}
      </div>

      {/* lines */}
      <ol className="flex flex-col gap-2.5">
        {SUTRA_LINES.map((line, i) => {
          const active = activeLine === i;
          return (
            <li key={i}>
              <div
                ref={(el) => {
                  if (el) lineRefs.current.set(i, el);
                  else lineRefs.current.delete(i);
                }}
                className={`flex items-start gap-3 rounded-[16px] px-4 py-3.5 transition-colors duration-200 ${
                  active
                    ? "bg-vermilion/[0.08] shadow-[inset_3px_0_0_0_var(--vermilion)]"
                    : "bg-paper-raised shadow-soft"
                }`}
              >
                <span
                  className={`mt-1 w-6 shrink-0 text-right font-display text-[13px] font-bold ${
                    active ? "text-vermilion" : "text-ink-faint"
                  }`}
                >
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-cjk text-[22px] leading-8 text-ink">{line.zh}</p>
                  <p className="mt-1 text-[13px] leading-snug text-ink-soft">{line.en}</p>
                </div>
                <button
                  type="button"
                  onClick={() => speakOne(i)}
                  aria-label={`Listen to line ${i + 1}`}
                  className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all active:scale-90 ${
                    active ? "text-vermilion" : "text-ink-faint hover:text-ink"
                  }`}
                >
                  <Volume2 size={18} />
                </button>
              </div>
            </li>
          );
        })}
      </ol>

      <Toast message={toast} onDismiss={dismissToast} />
    </div>
  );
}
