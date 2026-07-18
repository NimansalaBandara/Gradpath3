// Stylised Australia feature card — replaces the previous broken SVG flag

function Star({ cx, cy, r, n = 5 }: { cx: number; cy: number; r: number; n?: number }) {
  const pts: string[] = [];
  for (let i = 0; i < n * 2; i++) {
    const a = (i * Math.PI) / n - Math.PI / 2;
    const rad = i % 2 === 0 ? r : r * 0.42;
    pts.push(`${cx + rad * Math.cos(a)},${cy + rad * Math.sin(a)}`);
  }
  return <polygon points={pts.join(' ')} fill="white" />;
}

export default function AustraliaFlag({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 120"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="flagBg" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#012D8A" />
          <stop offset="100%" stopColor="#001660" />
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFC107" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#FFC107" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background */}
      <rect width="240" height="120" fill="url(#flagBg)" />
      <ellipse cx="120" cy="60" rx="110" ry="55" fill="url(#glow)" />

      {/* ── Union Jack canton (top-left 80×60) ── */}
      {/* Layer 1: White saltire (St Andrew) */}
      <line x1="0" y1="0"  x2="80" y2="60" stroke="white" strokeWidth="14" />
      <line x1="80" y1="0" x2="0"  y2="60" stroke="white" strokeWidth="14" />

      {/* Layer 2: Red saltire counterchanged (St Patrick) — offset per real flag */}
      {/* Top-left triangle: red below the ↘ diagonal */}
      <polygon points="0,0 0,8 36,60 44,60" fill="#CC0000" />
      {/* Bottom-right triangle: red above the ↘ diagonal */}
      <polygon points="80,60 80,52 44,0 36,0" fill="#CC0000" />
      {/* Top-right triangle: red below the ↙ diagonal */}
      <polygon points="80,0 80,8 44,60 36,60" fill="#CC0000" />
      {/* Bottom-left triangle: red above the ↙ diagonal */}
      <polygon points="0,60 0,52 36,0 44,0" fill="#CC0000" />

      {/* Layer 3: White cross fimbriation (St George) */}
      <rect x="0"  y="24" width="80" height="12" fill="white" />
      <rect x="34" y="0"  width="12" height="60" fill="white" />

      {/* Layer 4: Red cross (St George) */}
      <rect x="0"  y="26" width="80" height="8"  fill="#CC0000" />
      <rect x="36" y="0"  width="8"  height="60" fill="#CC0000" />

      {/* ── Commonwealth Star (7-pt) below canton ── */}
      <Star cx="20" cy="90" r="11" n={7} />

      {/* ── Southern Cross ── */}
      {/* Alpha Crucis — 7-pt, largest */}
      <Star cx="196" cy="92" r="9"   n={7} />
      {/* Beta Crucis — 7-pt */}
      <Star cx="172" cy="62" r="8"   n={7} />
      {/* Gamma Crucis — 7-pt */}
      <Star cx="200" cy="46" r="7"   n={7} />
      {/* Delta Crucis — 7-pt */}
      <Star cx="220" cy="70" r="6.5" n={7} />
      {/* Epsilon Crucis — 5-pt, small */}
      <Star cx="210" cy="58" r="4"   n={5} />

      {/* Thin horizontal divider between canton and rest (subtle) */}
      <line x1="0" y1="60" x2="80" y2="60" stroke="white" strokeWidth="0.3" opacity="0.2" />
      <line x1="80" y1="0" x2="80" y2="60" stroke="white" strokeWidth="0.3" opacity="0.2" />
    </svg>
  );
}
