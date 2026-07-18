import { CalendarIcon, BuildingLibraryIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import type { Scholarship } from '../types/api';

const TYPE_CONFIG: Record<string, { label: string; badge: string; accent: string; icon: string }> = {
  full: {
    label: 'Full Scholarship',
    badge: 'bg-emerald-100 text-emerald-700',
    accent: 'from-emerald-400 to-teal-400',
    icon: 'bg-emerald-100 text-emerald-600',
  },
  partial: {
    label: 'Partial',
    badge: 'bg-blue-100 text-blue-700',
    accent: 'from-blue-400 to-indigo-400',
    icon: 'bg-blue-100 text-blue-600',
  },
  full_ride: {
    label: 'Full Ride',
    badge: 'bg-amber-100 text-amber-700',
    accent: 'from-amber-400 to-yellow-300',
    icon: 'bg-amber-100 text-amber-600',
  },
};

export default function ScholarshipCard({ scholarship }: { scholarship: Scholarship }) {
  const config = TYPE_CONFIG[scholarship.type] ?? {
    label: scholarship.type,
    badge: 'bg-gray-100 text-gray-700',
    accent: 'from-gray-400 to-gray-300',
    icon: 'bg-gray-100 text-gray-600',
  };
  const amount = scholarship.amount ? `A$${Number(scholarship.amount).toLocaleString()}` : null;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all overflow-hidden flex flex-col">
      {/* Coloured top strip */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${config.accent}`} />

      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-slate-800 text-sm leading-snug">{scholarship.name}</h3>
          <span className={`flex-shrink-0 text-xs font-semibold px-2.5 py-0.5 rounded-full ${config.badge}`}>
            {config.label}
          </span>
        </div>

        {amount && (
          <div className="flex items-center gap-1.5">
            <CurrencyDollarIcon className={`h-4 w-4 ${config.icon.split(' ')[1]}`} />
            <span className="text-xl font-bold text-slate-800">{amount}</span>
          </div>
        )}

        <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{scholarship.eligibility}</p>

        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-auto pt-3 border-t border-slate-50">
          {scholarship.deadline && (
            <span className="flex items-center gap-1">
              <CalendarIcon className="h-3.5 w-3.5" />
              {new Date(scholarship.deadline).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          )}
          {scholarship.university_name && (
            <span className="flex items-center gap-1">
              <BuildingLibraryIcon className="h-3.5 w-3.5" />
              {scholarship.university_name}
            </span>
          )}
        </div>

        <a
          href={scholarship.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className={`mt-1 text-center py-2 rounded-xl text-sm font-semibold bg-gradient-to-r ${config.accent} text-white hover:opacity-90 transition-opacity shadow-sm`}
        >
          Learn more →
        </a>
      </div>
    </div>
  );
}
