const CITIES = [
  { name: 'Sydney',    x: 176, y: 144, major: true },
  { name: 'Melbourne', x: 148, y: 163, major: true },
  { name: 'Brisbane',  x: 179, y: 116, major: true },
  { name: 'Perth',     x: 17,  y: 147, major: true },
  { name: 'Adelaide',  x: 113, y: 158, major: false },
  { name: 'Darwin',    x: 78,  y: 10,  major: false },
  { name: 'Canberra',  x: 162, y: 153, major: false },
  { name: 'Hobart',    x: 155, y: 185, major: false },
];

export default function AustraliaMap({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 210 200"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFC107" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#FFC107" stopOpacity="0" />
        </radialGradient>
        <filter id="cityGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Subtle background glow */}
      <ellipse cx="105" cy="100" rx="90" ry="80" fill="url(#mapGlow)" />

      {/* Australia mainland outline — simplified but recognizable clockwise path */}
      <path
        d="
          M 5,62
          C 5,50 10,38 20,30
          C 28,22 38,18 50,16
          C 60,14 70,12 80,10
          L 86,8
          C 88,5 92,3 96,5
          L 100,3
          C 108,0 115,5 118,12
          L 121,8
          C 126,5 130,8 133,13
          C 140,10 148,15 152,23
          L 157,17
          C 162,14 166,20 164,27
          L 167,38
          C 168,52 170,65 170,80
          C 172,95 175,110 178,123
          C 180,134 181,142 178,152
          C 175,160 168,167 158,170
          C 148,174 136,174 126,172
          C 114,169 102,165 91,162
          C 78,159 65,156 52,153
          C 40,150 28,145 18,136
          C 10,128 5,116 3,103
          C 1,89 2,75 5,62
          Z
        "
        fill="#1e293b"
        stroke="#FFC107"
        strokeWidth="1.2"
        strokeLinejoin="round"
        opacity="0.9"
      />

      {/* Gulf of Carpentaria indent */}
      <path
        d="M 86,8 C 86,25 92,35 100,40 C 108,35 114,25 118,12"
        fill="#0f172a"
        stroke="#FFC107"
        strokeWidth="1"
        opacity="0.8"
      />

      {/* Tasmania */}
      <ellipse cx="155" cy="183" rx="8" ry="6" fill="#1e293b" stroke="#FFC107" strokeWidth="1" opacity="0.9" />

      {/* City dots */}
      {CITIES.map(({ name, x, y, major }) => (
        <g key={name} filter="url(#cityGlow)">
          {/* Outer pulse ring */}
          <circle cx={x} cy={y} r={major ? 5 : 3.5} fill="#FFC107" opacity="0.2" />
          {/* Inner dot */}
          <circle cx={x} cy={y} r={major ? 2.8 : 1.8} fill="#FFC107" opacity="0.9" />
        </g>
      ))}

      {/* City labels — only major */}
      {CITIES.filter(c => c.major).map(({ name, x, y }) => {
        const offsetX = name === 'Perth' ? 8 : name === 'Darwin' ? 7 : -2;
        const offsetY = name === 'Sydney' || name === 'Brisbane' ? -6 : name === 'Melbourne' ? 10 : -6;
        return (
          <text
            key={name}
            x={x + offsetX}
            y={y + offsetY}
            fontSize="7"
            fill="#FCD34D"
            fontFamily="sans-serif"
            fontWeight="600"
            textAnchor={name === 'Perth' || name === 'Darwin' ? 'start' : 'middle'}
            opacity="0.9"
          >
            {name}
          </text>
        );
      })}

      {/* Connecting lines between major cities (flight paths) */}
      {[
        ['Sydney', 'Melbourne'],
        ['Sydney', 'Brisbane'],
        ['Melbourne', 'Adelaide'],
        ['Adelaide', 'Perth'],
      ].map(([a, b]) => {
        const ca = CITIES.find(c => c.name === a)!;
        const cb = CITIES.find(c => c.name === b)!;
        const mx = (ca.x + cb.x) / 2;
        const my = (ca.y + cb.y) / 2 - 15;
        return (
          <path
            key={`${a}-${b}`}
            d={`M ${ca.x},${ca.y} Q ${mx},${my} ${cb.x},${cb.y}`}
            stroke="#FFC107"
            strokeWidth="0.6"
            strokeDasharray="3,3"
            fill="none"
            opacity="0.35"
          />
        );
      })}
    </svg>
  );
}
