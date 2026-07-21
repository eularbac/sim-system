// Original line-art illustration — a loose bouquet, in the app's rose/terracotta
// palette. Used as decorative art on auth screens and the dashboard hero.
export default function BouquetArt({ className = '', width = 180 }) {
  return (
    <svg
      width={width}
      viewBox="0 0 200 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* stems */}
      <path d="M100 220 L100 140" stroke="var(--color-sage-500)" strokeWidth="2" strokeLinecap="round" />
      <path d="M100 220 L78 150" stroke="var(--color-sage-500)" strokeWidth="2" strokeLinecap="round" />
      <path d="M100 220 L122 150" stroke="var(--color-sage-500)" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M88 190 Q80 180 84 168"
        stroke="var(--color-sage-400)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M112 195 Q122 185 118 172"
        stroke="var(--color-sage-400)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* large rose */}
      <g transform="translate(100,95)">
        <circle r="26" fill="var(--color-rose-300)" opacity="0.5" />
        <circle r="18" fill="var(--color-rose-400)" opacity="0.7" />
        <circle r="10" fill="var(--color-rose-600)" opacity="0.9" />
        <path
          d="M0 -26 Q10 -14 0 0 Q-10 -14 0 -26"
          fill="none"
          stroke="var(--color-rose-700)"
          strokeWidth="1"
          opacity="0.5"
        />
      </g>

      {/* terracotta bloom left */}
      <g transform="translate(70,120)">
        <circle r="16" fill="var(--color-terracotta-400)" opacity="0.55" />
        <circle r="8" fill="var(--color-terracotta-600)" opacity="0.85" />
      </g>

      {/* gold bloom right */}
      <g transform="translate(132,118)">
        <circle r="14" fill="var(--color-gold-400)" opacity="0.55" />
        <circle r="7" fill="var(--color-gold-500)" opacity="0.85" />
      </g>

      {/* small sprigs */}
      <g stroke="var(--color-sage-500)" strokeWidth="1.5" strokeLinecap="round">
        <path d="M60 130 l-10 -8" />
        <path d="M60 130 l-4 -12" />
        <path d="M142 128 l10 -8" />
        <path d="M142 128 l4 -12" />
      </g>

      {/* ribbon knot */}
      <path
        d="M86 150 Q100 158 114 150 L110 168 Q100 172 90 168 Z"
        fill="var(--color-rose-500)"
        opacity="0.85"
      />
    </svg>
  )
}
