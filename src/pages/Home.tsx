import { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { Brush, AudioLines, ChevronRight } from "lucide-react";
import ProgressRing from "@/components/ProgressRing";
import {
  SUTRA_LINES,
  SUTRA_ATTRIBUTION_ZH,
  TOTAL_CHARS,
  UNIQUE_CHARS,
} from "@/data/sutra";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const VIEWED_KEY = "xinjing:viewed";
const MASTERED_KEY = "xinjing:mastered";

function readCharSet(key: string): Set<string> {
  try {
    const raw = localStorage.getItem(key);
    const arr: unknown = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(arr) ? (arr as string[]) : []);
  } catch {
    return new Set();
  }
}

function StatChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-grid-line/70 bg-paper-raised px-3.5 py-1.5 text-[12px] font-bold text-ink-soft shadow-xs">
      {children}
    </span>
  );
}

export default function Home() {
  const [viewed, setViewed] = useState<Set<string>>(() => readCharSet(VIEWED_KEY));
  const [mastered, setMastered] = useState<Set<string>>(() => readCharSet(MASTERED_KEY));

  // refresh when returning from /copy (same-tab navigation keeps state)
  useEffect(() => {
    const onFocus = () => {
      setViewed(readCharSet(VIEWED_KEY));
      setMastered(readCharSet(MASTERED_KEY));
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const explored = UNIQUE_CHARS.filter((c) => viewed.has(c)).length;
  const masteredCount = UNIQUE_CHARS.filter((c) => mastered.has(c)).length;
  const progress = explored / UNIQUE_CHARS.length;

  return (
    <div className="flex flex-col gap-5 pt-6">
      {/* hero */}
      <motion.section
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: EASE }}
        className="flex flex-col items-center pb-2 pt-14 text-center"
      >
        <h1 className="mt-4 flex items-baseline gap-2 font-display text-[34px] font-bold leading-none text-ink">
          Xinjing
          <span className="font-brush text-[26px] font-normal text-vermilion">心經</span>
        </h1>
        <p className="mt-2.5 max-w-[300px] text-[14px] leading-relaxed text-ink-soft">
          Practice tool to learn and write the Heart Sutra
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <StatChip>{TOTAL_CHARS} characters</StatChip>
          <StatChip>{SUTRA_LINES.length} lines</StatChip>
          <StatChip>Xuanzang translation</StatChip>
        </div>
      </motion.section>

      {/* progress card */}
      <motion.section
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, delay: 0.08, ease: EASE }}
      >
        <Link
          to="/copy"
          className="flex items-center gap-4 rounded-[20px] bg-paper-raised p-5 shadow-soft transition-transform active:scale-[0.98]"
        >
          <ProgressRing value={progress} size={84} strokeWidth={8} tone="vermilion">
            <span className="font-display text-[18px] font-bold text-ink">
              {Math.round(progress * 100)}
              <span className="text-[12px]">%</span>
            </span>
          </ProgressRing>
          <div className="min-w-0 flex-1">
            <p className="font-display text-[17px] font-bold text-ink">
              {explored} / {UNIQUE_CHARS.length}
            </p>
            <p className="mt-0.5 text-[13px] text-ink-soft">characters explored</p>
            <p className="mt-0.5 text-[12px] text-ink-faint">
              <span className="font-bold text-jade">{masteredCount}</span> mastered
            </p>
            <p className="mt-1 text-[12px] text-ink-faint">
              Every unique character you've viewed in Copy practice
            </p>
          </div>
          <ChevronRight size={20} className="shrink-0 text-ink-faint" />
        </Link>
      </motion.section>

      {/* entry cards */}
      <motion.section
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, delay: 0.16, ease: EASE }}
        className="flex flex-col gap-3"
      >
        <Link
          to="/copy"
          className="group flex items-center gap-4 rounded-[20px] bg-paper-raised p-5 shadow-soft transition-transform active:scale-[0.98]"
        >
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-vermilion/10 text-vermilion">
            <Brush size={26} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-baseline gap-2 font-display text-[18px] font-bold text-ink">
              Copy
              <span className="font-brush text-[16px] font-normal text-ink-soft">臨摹</span>
            </span>
            <span className="mt-1 block text-[13px] leading-snug text-ink-soft">
              Watch every stroke and copy each character by hand
            </span>
          </span>
          <ChevronRight size={20} className="shrink-0 text-ink-faint" />
        </Link>

        <Link
          to="/recite"
          className="group flex items-center gap-4 rounded-[20px] bg-paper-raised p-5 shadow-soft transition-transform active:scale-[0.98]"
        >
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-jade/10 text-jade">
            <AudioLines size={26} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-baseline gap-2 font-display text-[18px] font-bold text-ink">
              Recite
              <span className="font-brush text-[16px] font-normal text-ink-soft">誦讀</span>
            </span>
            <span className="mt-1 block text-[13px] leading-snug text-ink-soft">
              Listen at your own pace and follow along
            </span>
          </span>
          <ChevronRight size={20} className="shrink-0 text-ink-faint" />
        </Link>
      </motion.section>

      {/* about card */}
      <motion.section
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, delay: 0.24, ease: EASE }}
        className="rounded-[20px] bg-paper-raised px-5 py-4 text-center shadow-soft"
      >
        <p className="font-cjk text-[14px] font-semibold text-ink">{SUTRA_ATTRIBUTION_ZH}</p>
        <p className="mt-1 text-[12px] text-ink-faint">
          Xuanzang's translation — 260 characters in traditional characters.
        </p>
      </motion.section>
    </div>
  );
}
