import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { SparklesIcon, LockClosedIcon, BuildingLibraryIcon } from '@heroicons/react/24/outline';
import { catalogApi } from '../../lib/catalogApi';
import { recommendationsApi } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import SearchBar from '../../components/SearchBar';
import FilterChips from '../../components/FilterChips';
import UniversityCard from '../../components/UniversityCard';
import Pagination from '../../components/Pagination';

const CITY_OPTIONS = [
  { label: 'All Cities', value: '' },
  { label: 'Sydney', value: 'Sydney' },
  { label: 'Melbourne', value: 'Melbourne' },
  { label: 'Brisbane', value: 'Brisbane' },
  { label: 'Canberra', value: 'Canberra' },
  { label: 'Perth', value: 'Perth' },
  { label: 'Adelaide', value: 'Adelaide' },
];

export default function UniversitiesPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [page, setPage] = useState(1);

  const handleSearch = useCallback((v: string) => { setSearch(v); setPage(1); }, []);
  const handleCity = useCallback((v: string) => { setCity(v); setPage(1); }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['universities', search, city, page],
    queryFn: () => catalogApi.universities({ search: search || undefined, city: city || undefined, page }),
  });

  const { data: recommendations } = useQuery({
    queryKey: ['recommendations'],
    queryFn: recommendationsApi.get,
    enabled: !!user?.is_premium,
    staleTime: 1000 * 60 * 60,
  });

  // Unique universities from AI recommendations
  const suggestedUnis = recommendations
    ? [...new Map(recommendations.map((r) => [r.university, r])).values()]
    : [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Universities</h1>
      <p className="text-slate-500 mb-6">Explore Australian universities and their postgraduate programs.</p>

      {/* ── AI Suggested section ── */}
      <div className="mb-6">
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
            {/* Blurred placeholder rows */}
            <div className="p-4 space-y-3 filter blur-[3px] pointer-events-none select-none" aria-hidden>
              {[
                { name: 'University of Melbourne', city: 'Melbourne', field: 'Computer Science' },
                { name: 'University of Sydney', city: 'Sydney', field: 'Engineering' },
                { name: 'Australian National University', city: 'Canberra', field: 'Data Science' },
              ].map((p) => (
                <div key={p.name} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <BuildingLibraryIcon className="h-4 w-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{p.name}</p>
                    <p className="text-xs text-slate-400">{p.city} · {p.field} match</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Lock overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-[1px]">
              <div className="p-3 bg-slate-100 rounded-2xl mb-3">
                <LockClosedIcon className="h-6 w-6 text-slate-400" />
              </div>
              <p className="text-sm font-semibold text-slate-700 mb-1">AI Suggestions  Premium Feature</p>
              <p className="text-xs text-slate-500 mb-4 text-center max-w-[200px]">
                Upgrade to see universities matched to your profile
              </p>
              <Link
                to="/dashboard/upgrade"
                className="px-5 py-2 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-500 hover:to-yellow-400 text-slate-900 font-bold rounded-xl text-sm transition-all shadow-md shadow-amber-200/50"
              >
                Upgrade to Premium →
              </Link>
            </div>
          </div>
        ) : suggestedUnis.length > 0 ? (
          /* Premium: show suggested university chips */
          <div className="flex flex-wrap gap-2.5">
            {suggestedUnis.map((rec) => (
              <div
                key={rec.university}
                className="flex items-center gap-2 px-3.5 py-2 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100 transition-colors"
              >
                <SparklesIcon className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
                <span className="text-sm font-semibold text-slate-800">{rec.university}</span>
                <span className="text-xs text-amber-600 font-medium">{rec.match_score}% match</span>
              </div>
            ))}
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

      {/* ── Search & Filter ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <SearchBar value={search} onChange={handleSearch} placeholder="Search universities…" className="flex-1" />
      </div>
      <FilterChips options={CITY_OPTIONS} value={city} onChange={handleCity} className="mb-6" />

      {isLoading && (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
        </div>
      )}

      {isError && (
        <div className="text-center py-16 text-red-500">Failed to load universities. Please try again.</div>
      )}

      {data && (
        <>
          <p className="text-sm text-slate-400 mb-4">
            {data.count} universit{data.count !== 1 ? 'ies' : 'y'} found
          </p>
          {data.results.length === 0 ? (
            <div className="text-center py-16 text-slate-400">No universities match your search.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {data.results.map((uni) => <UniversityCard key={uni.id} uni={uni} />)}
            </div>
          )}
          <Pagination page={page} count={data.count} onChange={setPage} />
        </>
      )}
    </div>
  );
}
