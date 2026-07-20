import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { catalogApi } from '../../lib/catalogApi';
import SearchBar from '../../components/SearchBar';
import FilterChips from '../../components/FilterChips';
import ScholarshipCard from '../../components/ScholarshipCard';
import Pagination from '../../components/Pagination';

const TYPE_OPTIONS = [
  { label: 'All Types', value: '' },
  { label: 'Full Scholarship', value: 'full' },
  { label: 'Partial', value: 'partial' },
  { label: 'Full Ride', value: 'full_ride' },
];

export default function ScholarshipsPage() {
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

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-text mb-1">Scholarships</h1>
      <p className="text-gray-500 mb-6">Discover funding opportunities for your postgraduate studies in Australia.</p>

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
