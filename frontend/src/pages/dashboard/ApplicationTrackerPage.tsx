import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusIcon, TrashIcon, XMarkIcon, MagnifyingGlassIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { trackerApi, getErrorDetail } from '../../lib/api';
import { catalogApi } from '../../lib/catalogApi';
import { useAuth } from '../../context/AuthContext';
import type { ApplicationTracker, TrackerStatus } from '../../types/api';

const FREE_TRACKER_LIMIT = 5;

const STATUS_OPTIONS: { value: TrackerStatus; label: string; color: string }[] = [
  { value: 'hope_to_apply', label: 'Hope to Apply', color: 'bg-slate-100 text-slate-600' },
  { value: 'not_yet', label: 'Not Yet Started', color: 'bg-slate-100 text-slate-500' },
  { value: 'applied', label: 'Applied', color: 'bg-blue-100 text-blue-700' },
  { value: 'interviewed', label: 'Interviewed', color: 'bg-violet-100 text-violet-700' },
  { value: 'rejected', label: 'Rejected', color: 'bg-rose-100 text-rose-700' },
  { value: 'accepted', label: 'Accepted', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'waitlisted', label: 'Waitlisted', color: 'bg-amber-100 text-amber-700' },
];

function statusColor(status: TrackerStatus) {
  return STATUS_OPTIONS.find((s) => s.value === status)?.color ?? 'bg-gray-100 text-gray-600';
}

function statusLabel(status: TrackerStatus) {
  return STATUS_OPTIONS.find((s) => s.value === status)?.label ?? status;
}

function AddCourseModal({ onClose, onAdd }: { onClose: () => void; onAdd: (courseId: number, deadline: string | null) => void }) {
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['course-search', search],
    queryFn: () => catalogApi.courses({ search: search || undefined }),
    enabled: search.length > 0,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-semibold text-brand-text text-lg">Track a Course</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <XMarkIcon className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <div className="p-5">
          <div className="relative mb-4">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              ref={inputRef}
              autoFocus
              type="text"
              placeholder="Search courses by title…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
            />
          </div>

          {isLoading && (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
            </div>
          )}

          {search.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-6">Start typing to search for courses</p>
          )}

          {data && data.results.length === 0 && search.length > 0 && (
            <p className="text-sm text-gray-400 text-center py-6">No courses found for "{search}"</p>
          )}

          {data && data.results.length > 0 && (
            <ul className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
              {data.results.map((course) => (
                <li key={course.id}>
                  <button
                    onClick={() => { onAdd(course.id, course.deadline ?? null); onClose(); }}
                    className="w-full text-left px-3 py-3 hover:bg-amber-50 rounded-xl transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-brand-text">{course.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {course.university_name ?? course.university?.name}
                          {(course.university_city ?? course.university?.city) && ` · ${course.university_city ?? course.university?.city}`}
                        </p>
                      </div>
                      <span className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${
                        course.level === 'phd' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {course.level === 'phd' ? 'PhD' : "Master's"}
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function TrackerRow({ entry }: { entry: ApplicationTracker }) {
  const queryClient = useQueryClient();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const updateMutation = useMutation({
    mutationFn: (data: { status?: TrackerStatus; notes?: string; deadline?: string | null }) =>
      trackerApi.update(entry.id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tracker'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: () => trackerApi.remove(entry.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tracker'] }),
  });

  return (
    <tr className="hover:bg-amber-50/20 transition-colors">
      <td className="px-4 py-3">
        <p className="text-sm font-semibold text-slate-800">{entry.course.title}</p>
        <p className="text-xs text-slate-400 mt-0.5">{entry.course.university.name} · {entry.course.university.city}</p>
      </td>
      <td className="px-4 py-3">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
          entry.course.level === 'phd' ? 'bg-violet-100 text-violet-700' : 'bg-blue-100 text-blue-700'
        }`}>
          {entry.course.level === 'phd' ? 'PhD' : "Master's"}
        </span>
      </td>
      <td className="px-4 py-3">
        <select
          value={entry.status}
          onChange={(e) => updateMutation.mutate({ status: e.target.value as TrackerStatus })}
          className={`text-xs font-semibold px-2 py-1 rounded-lg border-0 cursor-pointer focus:ring-2 focus:ring-primary/40 ${statusColor(entry.status)}`}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </td>
      <td className="px-4 py-3">
        <input
          type="date"
          value={entry.deadline ?? ''}
          onChange={(e) => updateMutation.mutate({ deadline: e.target.value || null })}
          className="text-xs text-gray-600 border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </td>
      <td className="px-4 py-3 max-w-[180px]">
        <input
          type="text"
          placeholder="Add notes…"
          defaultValue={entry.notes}
          onBlur={(e) => {
            if (e.target.value !== entry.notes) {
              updateMutation.mutate({ notes: e.target.value });
            }
          }}
          className="w-full text-xs text-gray-600 border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder-gray-300"
        />
      </td>
      <td className="px-4 py-3">
        {confirmDelete ? (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
              className="text-xs font-semibold text-white bg-red-500 hover:bg-red-600 px-2.5 py-1 rounded-lg transition-colors disabled:opacity-60"
            >
              {deleteMutation.isPending ? '…' : 'Yes'}
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              No
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        )}
      </td>
    </tr>
  );
}

export default function ApplicationTrackerPage() {
  const [showModal, setShowModal] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: entries, isLoading } = useQuery({
    queryKey: ['tracker'],
    queryFn: trackerApi.list,
  });

  const atLimit = !user?.is_premium && (entries?.length ?? 0) >= FREE_TRACKER_LIMIT;

  const addMutation = useMutation({
    mutationFn: ({ courseId, deadline }: { courseId: number; deadline: string | null }) =>
      trackerApi.add({ course_id: courseId, deadline: deadline ?? undefined }),
    onSuccess: () => {
      setAddError(null);
      queryClient.invalidateQueries({ queryKey: ['tracker'] });
    },
    onError: (error) => setAddError(getErrorDetail(error, 'Could not add this course. Please try again.')),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Application Tracker</h1>
          <p className="text-slate-500 mt-1">Keep track of your postgraduate applications and their progress.</p>
        </div>
        {atLimit ? (
          <Link
            to="/dashboard/upgrade"
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-500 hover:to-yellow-400 text-slate-900 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-amber-200"
          >
            <LockClosedIcon className="h-4 w-4" />
            Upgrade to track more
          </Link>
        ) : (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-500 hover:to-yellow-400 text-slate-900 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-amber-200"
          >
            <PlusIcon className="h-4 w-4" />
            Track a Course
          </button>
        )}
      </div>

      {addError && (
        <div className="mt-4 flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          <span className="flex-shrink-0 text-base leading-none mt-0.5">⚠</span>
          {addError}
        </div>
      )}

      {!user?.is_premium && !isLoading && (
        <div className="flex items-center gap-2 mt-4 mb-2">
          <div className="h-2 flex-1 max-w-[220px] bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full transition-all duration-700"
              style={{ width: `${Math.min((entries?.length ?? 0) / FREE_TRACKER_LIMIT, 1) * 100}%` }}
            />
          </div>
          <span className="text-xs font-medium text-gray-500 whitespace-nowrap">
            {entries?.length ?? 0} / {FREE_TRACKER_LIMIT} courses tracked · Free plan
          </span>
        </div>
      )}

      <div className="mb-6" />

      {isLoading && (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
        </div>
      )}

      {entries && entries.length === 0 && (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📋</div>
          <h2 className="text-lg font-semibold text-brand-text mb-2">No applications tracked yet</h2>
          <p className="text-gray-400 mb-6 text-sm">Add a course to start tracking your applications.</p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-deep text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            Track a Course
          </button>
        </div>
      )}

      {entries && entries.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Status summary */}
          <div className="flex flex-wrap gap-2 p-4 bg-slate-50/50 border-b border-slate-100">
            {STATUS_OPTIONS.map((opt) => {
              const count = entries.filter((e) => e.status === opt.value).length;
              if (count === 0) return null;
              return (
                <span key={opt.value} className={`text-xs font-semibold px-2.5 py-1 rounded-full ${opt.color}`}>
                  {opt.label} · {count}
                </span>
              );
            })}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-slate-400 font-semibold uppercase tracking-wide border-b border-slate-100 bg-slate-50/30">
                  <th className="px-4 py-3 text-left">Course</th>
                  <th className="px-4 py-3 text-left">Level</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Deadline</th>
                  <th className="px-4 py-3 text-left">Notes</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {entries.map((entry) => (
                  <TrackerRow key={entry.id} entry={entry} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <AddCourseModal
          onClose={() => setShowModal(false)}
          onAdd={(courseId, deadline) => addMutation.mutate({ courseId, deadline })}
        />
      )}
    </div>
  );
}
