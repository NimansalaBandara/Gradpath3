import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import {
  ClipboardDocumentListIcon,
  DocumentCheckIcon,
  AcademicCapIcon,
  SparklesIcon,
  ArrowRightIcon,
  CalendarDaysIcon,
  BuildingLibraryIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { trackerApi, documentsApi, recommendationsApi } from '../../lib/api';
import type { AIRecommendation } from '../../types/api';

// ── AI recommendation card ──────────────────────────────────────────────────
function RecommendationCard({ rec }: { rec: AIRecommendation }) {
  const navigate = useNavigate();
  const levelLabel = rec.level === 'masters' ? "Master's" : 'PhD';
  const levelColor = rec.level === 'masters'
    ? 'bg-blue-100 text-blue-700'
    : 'bg-violet-100 text-violet-700';

  return (
    <div
      onClick={() => navigate(`/dashboard/universities/${rec.university_id}/courses/${rec.course_id}`)}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-800 text-sm leading-snug">{rec.title}</p>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
            <BuildingLibraryIcon className="h-3 w-3 flex-shrink-0" />
            {rec.university}
          </p>
        </div>
        <span className={`flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${levelColor}`}>
          {levelLabel}
        </span>
      </div>

      {/* Match score bar */}
      <div className="mb-2.5">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-slate-400">Match score</span>
          <span className="text-xs font-bold text-amber-600">{rec.match_score}%</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full transition-all duration-700"
            style={{ width: `${rec.match_score}%` }}
          />
        </div>
      </div>

      <p className="text-xs text-slate-500 italic leading-relaxed line-clamp-2">{rec.match_reason}</p>
    </div>
  );
}

// ── Skeleton shimmer card ───────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 animate-pulse">
      <div className="flex gap-3 mb-3">
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-200 rounded w-3/4" />
          <div className="h-3 bg-slate-100 rounded w-1/2" />
        </div>
        <div className="h-6 w-16 bg-slate-100 rounded-full" />
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full mb-3" />
      <div className="space-y-1.5">
        <div className="h-3 bg-slate-100 rounded w-full" />
        <div className="h-3 bg-slate-100 rounded w-2/3" />
      </div>
    </div>
  );
}

// ── Main page ───────────────────────────────────────────────────────────────
export default function DashboardHome() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: trackerEntries } = useQuery({
    queryKey: ['tracker'],
    queryFn: trackerApi.list,
  });

  const { data: documents } = useQuery({
    queryKey: ['documents'],
    queryFn: documentsApi.list,
  });

  const {
    data: recommendations,
    isLoading: recsLoading,
    isError: recsError,
  } = useQuery({
    queryKey: ['recommendations'],
    queryFn: recommendationsApi.get,
    enabled: !!user?.is_premium,
    staleTime: 1000 * 60 * 60, // 1 hour client-side stale
  });

  const completeDocs = documents?.filter((d) => d.status === 'complete').length ?? 0;
  const upcomingDeadlines = trackerEntries
    ?.filter((e) => e.deadline)
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
    .slice(0, 3) ?? [];

  const statCards = [
    {
      label: 'Applications Tracked',
      value: trackerEntries?.length ?? 0,
      sub: 'courses added',
      Icon: ClipboardDocumentListIcon,
      bg: 'bg-amber-50',
      iconBg: 'bg-gradient-to-br from-amber-400 to-yellow-300',
      textColor: 'text-amber-600',
      route: '/dashboard/tracker',
    },
    {
      label: 'Documents Uploaded',
      value: documents?.length ?? 0,
      sub: `${completeDocs} marked complete`,
      Icon: DocumentCheckIcon,
      bg: 'bg-violet-50',
      iconBg: 'bg-gradient-to-br from-violet-500 to-indigo-400',
      textColor: 'text-violet-600',
      route: '/dashboard/documents',
    },
    {
      label: 'Scholarships',
      value: '20+',
      sub: 'available for you',
      Icon: AcademicCapIcon,
      bg: 'bg-emerald-50',
      iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-400',
      textColor: 'text-emerald-600',
      route: '/dashboard/scholarships',
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Welcome back,{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-400">
            {user?.first_name || 'Student'}
          </span>{' '}
          👋
        </h1>
        <p className="text-slate-500 mt-1">Here's an overview of your application journey.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {statCards.map(({ label, value, sub, Icon, iconBg, bg, textColor, route }) => (
          <button
            key={label}
            onClick={() => navigate(route)}
            className={`${bg} rounded-2xl p-6 text-left hover:scale-[1.02] transition-all shadow-sm hover:shadow-md group`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`${iconBg} p-2.5 rounded-xl shadow-sm`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <ArrowRightIcon className="h-4 w-4 text-slate-300 group-hover:text-slate-400 transition-colors mt-1" />
            </div>
            <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
            <p className="text-sm font-medium text-slate-700 mt-1">{label}</p>
            <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
          </button>
        ))}
      </div>

      {/* AI Recommendations (premium) */}
      {user?.is_premium ? (
        <div className="mb-8">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="p-1.5 bg-amber-100 rounded-lg">
              <SparklesIcon className="h-4 w-4 text-amber-500" />
            </div>
            <h2 className="font-semibold text-slate-800">AI-Recommended Courses</h2>
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">Premium</span>
          </div>

          {recsLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <SkeletonCard /><SkeletonCard /><SkeletonCard />
            </div>
          )}

          {recsError && (
            <div className="rounded-2xl bg-rose-50 border border-rose-100 px-5 py-4 text-sm text-rose-500">
              Couldn't load recommendations. Please refresh the page.
            </div>
          )}

          {recommendations && recommendations.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.map((rec) => (
                <RecommendationCard key={rec.course_id} rec={rec} />
              ))}
            </div>
          )}

          {recommendations && recommendations.length === 0 && (
            <div className="rounded-2xl bg-slate-50 border border-slate-100 px-5 py-6 text-sm text-slate-500 text-center">
              No recommendations yet.{' '}
              <Link to="/dashboard/account" className="text-amber-600 font-semibold">
                Complete your profile
              </Link>{' '}
              with your field of study and target level to get personalised matches.
            </div>
          )}
        </div>
      ) : (
        /* Premium upgrade banner */
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 mb-8 text-white">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 80% 50%, #FFC107 0%, transparent 60%)',
          }} />
          <div className="relative flex items-start gap-4">
            <div className="p-2.5 bg-amber-400/20 rounded-xl">
              <LockClosedIcon className="h-6 w-6 text-amber-400" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-lg">Unlock AI-Powered Recommendations</p>
              <p className="text-sm text-slate-300 mt-1">
                Get personalised university and course matches based on your academic profile  ranked just for you.
              </p>
              <button
                onClick={() => navigate('/dashboard/upgrade')}
                className="mt-4 px-5 py-2 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-500 hover:to-yellow-400 text-slate-900 font-semibold rounded-xl text-sm transition-all shadow-lg shadow-amber-400/20"
              >
                Upgrade to Premium →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming deadlines */}
      {upcomingDeadlines.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-rose-100 rounded-lg">
              <CalendarDaysIcon className="h-4 w-4 text-rose-500" />
            </div>
            <h2 className="font-semibold text-slate-800">Upcoming Deadlines</h2>
          </div>
          <div className="space-y-3">
            {upcomingDeadlines.map((entry) => {
              const daysLeft = Math.ceil(
                (new Date(entry.deadline!).getTime() - Date.now()) / 86400000
              );
              const urgent = daysLeft <= 30;
              return (
                <div
                  key={entry.id}
                  className="flex items-center justify-between gap-4 py-2 border-b border-slate-50 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-700">{entry.course.title}</p>
                    <p className="text-xs text-slate-400">{entry.course.university.name}</p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
                      urgent ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {daysLeft <= 0 ? 'Overdue' : `${daysLeft}d left`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
