import { useLocation } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import SealLogo from "./SealLogo";
import { useAppSettings, updateSettings } from "@/components/settings/settings";

const TITLES: Array<[RegExp, string]> = [
  [/^\/$/, "Home"],
  [/^\/copy/, "Copy"],
  [/^\/recite/, "Recite"],
];

function pageFor(pathname: string): string | null {
  for (const [re, t] of TITLES) if (re.test(pathname)) return t;
  return null;
}

function systemPrefersDark(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

/** Quick light/dark toggle: light ⇄ dark; from auto, jump to the opposite of the effective theme. */
function ThemeToggle() {
  const { theme } = useAppSettings();
  const effectiveDark = theme === "dark" || (theme === "auto" && systemPrefersDark());

  const toggle = () => {
    if (theme === "light") updateSettings({ theme: "dark" });
    else if (theme === "dark") updateSettings({ theme: "light" });
    else updateSettings({ theme: effectiveDark ? "light" : "dark" });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={effectiveDark ? "Switch to light theme" : "Switch to dark theme"}
      className="flex h-11 w-11 items-center justify-center rounded-full text-ink-soft transition-colors active:bg-ink/5"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={effectiveDark ? "sun" : "moon"}
          initial={{ scale: 0.4, rotate: -90, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 0.4, rotate: 90, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="flex"
        >
          {effectiveDark ? <Sun size={19} /> : <Moon size={19} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

/** TOP APP BAR — 56px + safe-area-top, blurred paper bg, sticky in normal flow. */
export default function Navbar() {
  const { pathname } = useLocation();
  const page = pageFor(pathname);

  return (
    <header className="sticky top-0 z-50 border-b border-grid-line/50 bg-paper/85 pt-safe backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-[480px] items-center justify-between px-5">
        <h1 className="flex items-center gap-2.5">
          <motion.div
            initial={{ scale: 1.6, rotate: -8 }}
            animate={{ scale: 1, rotate: -3 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
          >
            <SealLogo size={30} />
          </motion.div>
          <motion.span
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex items-baseline gap-1.5 font-display text-[18px] font-bold text-ink"
          >
            Xinjing
            <span className="font-brush text-[15px] font-normal text-ink-soft">心經</span>
            {page && (
              <span className="ml-1 text-[14px] font-semibold text-ink-soft">— {page}</span>
            )}
          </motion.span>
        </h1>

        <div className="flex items-center gap-1">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
