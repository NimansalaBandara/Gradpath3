import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeftIcon, GlobeAltIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { catalogApi } from '../../lib/catalogApi';
import FilterChips from '../../components/FilterChips';
import SearchBar from '../../components/SearchBar';
import CourseCard from '../../components/CourseCard';

const LEVEL_OPTIONS = [
  { label: 'All', value: '' },
  { label: "Master's", value: 'masters' },
  { label: 'PhD', value: 'phd' },
];

export default function UniversityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [level, setLevel] = useState('');
  const [search, setSearch] = useState('');

  const handleSearch = useCallback((v: string) => setSearch(v), []);

  const { data: uni, isLoading: uniLoading } = useQuery({
    queryKey: ['university', id],
    queryFn: () => catalogApi.university(Number(id)),
    enabled: !!id,
  });

  const { data: coursesData, isLoading: coursesLoading } = useQuery({
    queryKey: ['courses', id, level, search],
    queryFn: () => catalogApi.courses({
      university: Number(id),
      level: level || undefined,
      search: search || undefined,
    }),
    enabled: !!id,
  });

  if (uniLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  if (!uni) return <div className="text-center py-16 text-gray-400">University not found.</div>;

  return (
    <div>
      <button
        onClick={() => navigate('/dashboard/universities')}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-text mb-6 transition-colors"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to Universities
      </button>

      {/* University header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-brand-text">{uni.name}</h1>
              {uni.world_ranking && (
                <span className="text-sm font-bold bg-amber-100 text-amber-700 px-2.5 py-0.5 rounded-full">
                  #{uni.world_ranking} world
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
              <MapPinIcon className="h-4 w-4" />
              {uni.city}, {uni.country}
            </div>
            {uni.description && <p className="text-sm text-gray-600">{uni.description}</p>}
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-50">
          <a
            href={uni.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline"
          >
            <GlobeAltIcon className="h-4 w-4" />
            Visit university website
          </a>
        </div>
      </div>

      {/* Courses */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-brand-text">Courses</h2>
        <SearchBar value={search} onChange={handleSearch} placeholder="Search courses…" className="sm:w-64" />
      </div>
      <FilterChips options={LEVEL_OPTIONS} value={level} onChange={setLevel} className="mb-5" />

      {coursesLoading && (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      )}

      {coursesData && (
        <>
          {coursesData.results.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No courses match your filters.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {coursesData.results.map(course => <CourseCard key={course.id} course={course} />)}
            </div>
          )}
        </>
      )}
    </div>
  );
}
