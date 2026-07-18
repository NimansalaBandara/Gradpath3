import { useNavigate } from 'react-router-dom';
import { MapPinIcon, AcademicCapIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import type { University } from '../types/api';

const CITY_COLORS: Record<string, string> = {
  Melbourne: 'from-blue-500 to-indigo-500',
  Sydney: 'from-sky-400 to-cyan-500',
  Brisbane: 'from-orange-400 to-amber-500',
  Canberra: 'from-teal-500 to-emerald-500',
  Perth: 'from-violet-500 to-purple-500',
  Adelaide: 'from-rose-400 to-pink-500',
};

function getGradient(city: string) {
  return CITY_COLORS[city] ?? 'from-amber-400 to-yellow-300';
}

export default function UniversityCard({ uni }: { uni: University }) {
  const navigate = useNavigate();
  const gradient = getGradient(uni.city);

  return (
    <div
      onClick={() => navigate(`/dashboard/universities/${uni.id}`)}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer overflow-hidden group"
    >
      {/* Coloured header strip */}
      <div className={`h-2 w-full bg-gradient-to-r ${gradient}`} />

      <div className="p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-slate-800 text-sm leading-snug">{uni.name}</h3>
          {uni.world_ranking && (
            <span className="flex-shrink-0 text-xs font-bold bg-amber-100 text-amber-700 px-2.5 py-0.5 rounded-full">
              #{uni.world_ranking}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <MapPinIcon className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
          <span>{uni.city}, {uni.country}</span>
        </div>

        {uni.description && (
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{uni.description}</p>
        )}

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <AcademicCapIcon className="h-3.5 w-3.5 text-slate-400" />
            {uni.course_count} course{uni.course_count !== 1 ? 's' : ''}
          </div>
          <span className="flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-2 transition-all">
            View courses
            <ArrowRightIcon className="h-3 w-3" />
          </span>
        </div>
      </div>
    </div>
  );
}
