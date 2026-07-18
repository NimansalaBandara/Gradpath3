import { SparklesIcon } from '@heroicons/react/24/outline';
import type { AIScholarshipRecommendation } from '../types/api';
import ScholarshipCard from './ScholarshipCard';

export default function ScholarshipRecommendationCard({ rec }: { rec: AIScholarshipRecommendation }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 px-1">
        <SparklesIcon className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full transition-all duration-700"
            style={{ width: `${rec.match_score}%` }}
          />
        </div>
        <span className="text-xs font-bold text-amber-600 flex-shrink-0">{rec.match_score}% match</span>
      </div>
      <p className="text-xs text-slate-500 italic leading-relaxed px-1 line-clamp-2">{rec.match_reason}</p>
      <ScholarshipCard scholarship={rec} />
    </div>
  );
}
