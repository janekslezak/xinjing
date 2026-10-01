import { useCallback, useEffect, useRef, useState } from "react";

export interface SpeakOptions {
  /** called when the utterance finishes naturally (not on cancel) */
  onend?: () => void;
  /** called on utterance error */
  onerror?: () => void;
}

export interface UseSpeech {
  /** true when speechSynthesis exists */
  supported: boolean;
  /** true when a Chinese voice is installed */
  hasChineseVoice: boolean;
  /** currently speaking */
  speaking: boolean;
  /** speak Chinese text at rate (default 0.85) */
  speak: (text: string, rate?: number, opts?: SpeakOptions) => void;
  cancel: () => void;
}

function isTaiwanVoice(v: SpeechSynthesisVoice): boolean {
  const lang = v.lang.toLowerCase().replace("_", "-");
  return lang.startsWith("zh-tw") || v.name.toLowerCase().includes("taiwan");
}

/**
 * Strongly prefer a zh-TW (Taiwan) voice — the Heart Sutra is presented in
 * traditional characters; fall back to any zh voice, else null.
 */
function pickChineseVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const zh = voices.filter((v) => v.lang.toLowerCase().replace("_", "-").startsWith("zh"));
  if (zh.length === 0) return null;
  return zh.find(isTaiwanVoice) ?? zh[0];
}

/** Wrapper around window.speechSynthesis with zh-TW-preferred voice selection. */
export function useSpeech(): UseSpeech {
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  // retain the in-flight utterance: Chrome GCs unreferenced utterances,
  // which silently drops onend and would stall chant play-all
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [hasChineseVoice, setHasChineseVoice] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    if (!supported) return;
    const load = () => {
      const v = pickChineseVoice(window.speechSynthesis.getVoices());
      voiceRef.current = v;
      setHasChineseVoice(v !== null);
    };
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", load);
      window.speechSynthesis.cancel();
    };
  }, [supported]);

  const speak = useCallback(
    (text: string, rate = 0.85, opts: SpeakOptions = {}) => {
      if (!supported) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const voice = voiceRef.current;
      u.lang = voice ? voice.lang : "zh-TW";
      u.rate = Math.min(1.5, Math.max(0.5, rate));
      if (voice) u.voice = voice;
      u.onstart = () => setSpeaking(true);
      u.onend = () => {
        utteranceRef.current = null;
        setSpeaking(false);
        opts.onend?.();
      };
      u.onerror = () => {
        utteranceRef.current = null;
        setSpeaking(false);
        opts.onerror?.();
      };
      utteranceRef.current = u;
      window.speechSynthesis.speak(u);
    },
    [supported]
  );

  const cancel = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);

  return { supported, hasChineseVoice, speaking, speak, cancel };
}
