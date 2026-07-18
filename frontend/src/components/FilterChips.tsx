interface Option {
  label: string;
  value: string;
}

interface FilterChipsProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function FilterChips({ options, value, onChange, className = '' }: FilterChipsProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
            value === opt.value
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-brand-text'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
