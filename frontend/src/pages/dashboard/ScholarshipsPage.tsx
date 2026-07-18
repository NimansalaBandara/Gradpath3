import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { SparklesIcon, LockClosedIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import { catalogApi } from '../../lib/catalogApi';
import { scholarshipRecommendationsApi } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import SearchBar from '../../components/SearchBar';
import FilterChips from '../../components/FilterChips';
import ScholarshipCard from '../../components/ScholarshipCard';
import ScholarshipRecommendationCard from '../../components/ScholarshipRecommendationCard';
import Pagination from '../../components/Pagination';

const TYPE_OPTIONS = [
  { label: 'All Types', value: '' },
  { label: 'Full Scholarship', value: 'full' },
  { label: 'Partial', value: 'partial' },
  { label: 'Full Ride', value: 'full_ride' },
];

export default function ScholarshipsPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);

  const handleSearch = useCallback((v: string) => { setSearch(v); setPage(1); }, []);
  const handleType = useCallback((v: string) => { setType(v); setPage(1); }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['scholarships', search, type, page],
    queryFn: () => catalogApi.scholarships({
      search: search || undefined,
      type: type || undefined,
      page,
    }),
  });

  const { data: recommendations } = useQuery({
    queryKey: ['scholarship-recommendations'],
    queryFn: scholarshipRecommendationsApi.get,
    enabled: !!user?.is_premium,
    staleTime: 1000 * 60 * 60,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-text mb-1">Scholarships</h1>
      <p className="text-gray-500 mb-6">Discover funding opportunities for your postgraduate studies in Australia.</p>

      {/* ── AI Suggested section ── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <SparklesIcon className="h-4 w-4 text-amber-500" />
          <span className="text-sm font-semibold text-slate-700">Suggested For You</span>
          {user?.is_premium ? (
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">Premium</span>
          ) : (
            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-semibold">Premium only</span>
          )}
        </div>

        {!user?.is_premium ? (
          /* Locked state */
          <div className="relative rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <div className="p-4 space-y-3 filter blur-[3px] pointer-events-none select-none" aria-hidden>
              {[
                { name: 'Australia Awards Scholarship', type: 'Full Ride' },
                { name: 'UNSW Scientia PhD Scholarship', type: 'Full Ride' },
                { name: 'ANU Chancellor’s International Scholarship', type: 'Partial' },
              ].map((p) => (
                <div key={p.name} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <AcademicCapIcon className="h-4 w-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{p.name}</p>
                    <p className="text-xs text-slate-400">{p.type} match</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-[1px]">
              <div className="p-3 bg-slate-100 rounded-2xl mb-3">
                <LockClosedIcon className="h-6 w-6 text-slate-400" />
              </div>
              <p className="text-sm font-semibold text-slate-700 mb-1">AI Suggestions — Premium Feature</p>
              <p className="text-xs text-slate-500 mb-4 text-center max-w-[200px]">
                Upgrade to see scholarships matched to your profile
              </p>
              <Link
                to="/dashboard/upgrade"
                className="px-5 py-2 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-500 hover:to-yellow-400 text-slate-900 font-bold rounded-xl text-sm transition-all shadow-md shadow-amber-200/50"
              >
                Upgrade to Premium →
              </Link>
            </div>
          </div>
        ) : recommendations && recommendations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recommendations.map((rec) => <ScholarshipRecommendationCard key={rec.id} rec={rec} />)}
          </div>
        ) : (
          <p className="text-sm text-slate-400">
            No suggestions yet —{' '}
            <Link to="/dashboard/account" className="text-amber-600 font-semibold">
              complete your profile
            </Link>{' '}
            to get personalised matches.
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <SearchBar value={search} onChange={handleSearch} placeholder="Search scholarships…" className="flex-1" />
      </div>
      <FilterChips options={TYPE_OPTIONS} value={type} onChange={handleType} className="mb-6" />

      {isLoading && (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
        </div>
      )}

      {isError && (
        <div className="text-center py-16 text-red-500">Failed to load scholarships. Please try again.</div>
      )}

      {data && (
        <>
          <p className="text-sm text-gray-400 mb-4">{data.count} scholarship{data.count !== 1 ? 's' : ''} found</p>
          {data.results.length === 0 ? (
            <div className="text-center py-16 text-gray-400">No scholarships match your search.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {data.results.map(s => <ScholarshipCard key={s.id} scholarship={s} />)}
            </div>
          )}
          <Pagination page={page} count={data.count} onChange={setPage} />
        </>
      )}
    </div>
  );
}
