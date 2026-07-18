export default function Logo({ size = 'md', dark = false }: { size?: 'sm' | 'md' | 'lg'; dark?: boolean }) {
  const h = size === 'sm' ? 32 : size === 'lg' ? 48 : 38;

  return (
    <div className="flex items-center gap-2 select-none">
      <svg width={h} height={h} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lgGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFC107" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>
        {/* Badge background */}
        <rect x="0" y="0" width="40" height="40" rx="10" fill="url(#lgGrad)" />
        {/* Mortarboard flat board */}
        <polygon points="20,8 34,14 20,20 6,14" fill="white" />
        {/* Cap body */}
        <rect x="14.5" y="14" width="11" height="8" rx="1.5" fill="white" opacity="0.85" />
        {/* Tassel string */}
        <line x1="34" y1="14" x2="34" y2="22" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="34" cy="23.5" r="1.8" fill="white" />
        {/* Path upward arrow */}
        <path d="M15,33 L20,27 L25,33" stroke="#92400E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <line x1="20" y1="27" x2="20" y2="35" stroke="#92400E" strokeWidth="2" strokeLinecap="round" />
      </svg>

      <span className={`font-black tracking-tight leading-none ${
        size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-[1.15rem]'
      }`}>
        <span className={dark ? 'text-white' : 'text-slate-900'}>Grad</span>
        <span className="text-amber-400">Path</span>
      </span>
    </div>
  );
}
