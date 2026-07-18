import { useQuery } from '@tanstack/react-query';
import {
  UserGroupIcon,
  SparklesIcon,
  BuildingLibraryIcon,
  BookOpenIcon,
  AcademicCapIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';
import { adminApi } from '../../lib/adminApi';

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: adminApi.stats,
  });

  const statCards = stats
    ? [
        {
          label: 'Total Students',
          value: stats.total_students,
          Icon: UserGroupIcon,
          bg: 'bg-blue-50',
          iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-500',
          textColor: 'text-blue-600',
        },
        {
          label: 'Premium Users',
          value: stats.premium_count,
          Icon: SparklesIcon,
          bg: 'bg-amber-50',
          iconBg: 'bg-gradient-to-br from-amber-400 to-yellow-300',
          textColor: 'text-amber-600',
        },
        {
          label: 'Universities',
          value: stats.total_universities,
          Icon: BuildingLibraryIcon,
          bg: 'bg-violet-50',
          iconBg: 'bg-gradient-to-br from-violet-500 to-purple-500',
          textColor: 'text-violet-600',
        },
        {
          label: 'Courses',
          value: stats.total_courses,
          Icon: BookOpenIcon,
          bg: 'bg-emerald-50',
          iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-400',
          textColor: 'text-emerald-600',
        },
        {
          label: 'Scholarships',
          value: stats.total_scholarships,
          Icon: AcademicCapIcon,
          bg: 'bg-rose-50',
          iconBg: 'bg-gradient-to-br from-rose-400 to-pink-500',
          textColor: 'text-rose-600',
        },
      ]
    : [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-800">Admin Dashboard</h1>
        <p className="text-slate-500 mt-1">Platform overview and key statistics.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {statCards.map(({ label, value, Icon, bg, iconBg, textColor }) => (
              <div key={label} className={`${bg} rounded-2xl p-5 shadow-sm`}>
                <div className={`${iconBg} p-2.5 rounded-xl shadow-sm w-fit mb-4`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">{label}</p>
              </div>
            ))}
          </div>

          {/* Most tracked courses */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="p-1.5 bg-amber-100 rounded-lg">
                <TrophyIcon className="h-4 w-4 text-amber-500" />
              </div>
              <h2 className="font-semibold text-slate-800">Most Tracked Courses</h2>
            </div>

            {stats && stats.most_tracked.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">
                No applications tracked yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left text-xs font-semibold text-slate-500 pb-3 pr-4">#</th>
                      <th className="text-left text-xs font-semibold text-slate-500 pb-3 pr-4">Course</th>
                      <th className="text-left text-xs font-semibold text-slate-500 pb-3 pr-4">University</th>
                      <th className="text-right text-xs font-semibold text-slate-500 pb-3">Students Tracking</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats?.most_tracked.map((row, i) => (
                      <tr key={row.course_id} className="border-b border-slate-50 last:border-0">
                        <td className="py-3 pr-4">
                          <span className={`text-xs font-bold ${i === 0 ? 'text-amber-500' : 'text-slate-400'}`}>
                            {i + 1}
                          </span>
                        </td>
                        <td className="py-3 pr-4 font-medium text-slate-700">{row.title}</td>
                        <td className="py-3 pr-4 text-slate-500">{row.university}</td>
                        <td className="py-3 text-right">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                            {row.tracker_count}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
