interface SealLogoProps {
  size?: number;
  className?: string;
}

/** Vermilion rounded-square seal stamp with white carved 心經 (Xinjing) glyphs, stacked vertically. */
export default function SealLogo({ size = 34, className = "" }: SealLogoProps) {
  return (
    <div
      className={`relative flex items-center justify-center rounded-[22%] bg-vermilion shadow-soft ${className}`}
      style={{ width: size, height: size }}
      aria-label="Xinjing 心經 seal logo"
      role="img"
    >
      {/* carved inner border */}
      <div className="absolute inset-[6%] rounded-[18%] border border-white/50" />
      <span
        className="flex flex-col items-center font-brush leading-[1.02] text-paper-raised"
        style={{ fontSize: size * 0.36, transform: "translateY(-2%)" }}
      >
        <span>心</span>
        <span>經</span>
      </span>
    </div>
  );
}
