import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClockIcon, CurrencyDollarIcon, PlusCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Course } from '../types/api';
import { trackerApi } from '../lib/api';

export default function CourseCard({ course }: { course: Course }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [added, setAdded] = useState(false);

  const fee = course.tuition_fee
    ? `A$${Number(course.tuition_fee).toLocaleString()}/yr`
    : 'Fee waived';

  const isPhd = course.level === 'phd';

  const addMutation = useMutation({
    mutationFn: () => trackerApi.add({ course_id: course.id }),
    onSuccess: () => { setAdded(true); queryClient.invalidateQueries({ queryKey: ['tracker'] }); },
    onError: () => setAdded(true),
  });

  return (
    <div
      onClick={() => navigate(`/dashboard/universities/${course.university_id ?? course.university?.id}/courses/${course.id}`)}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer overflow-hidden group"
    >
      {/* Level-coded strip */}
      <div className={`h-1.5 w-full ${isPhd ? 'bg-gradient-to-r from-violet-500 to-purple-400' : 'bg-gradient-to-r from-blue-500 to-sky-400'}`} />

      <div className="p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-slate-800 text-sm leading-snug">{course.title}</h3>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              isPhd ? 'bg-violet-100 text-violet-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {isPhd ? 'PhD' : "Master's"}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); if (!added) addMutation.mutate(); }}
              disabled={added || addMutation.isPending}
              title={added ? 'Added to tracker' : 'Add to Application Tracker'}
              className={`p-1 rounded-lg transition-colors ${
                added ? 'text-emerald-500 cursor-default' : 'text-slate-300 hover:text-primary hover:bg-amber-50'
              }`}
            >
              {added ? (
                <CheckCircleIcon className="h-4 w-4" />
              ) : addMutation.isPending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b border-primary" />
              ) : (
                <PlusCircleIcon className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <span className="inline-block self-start text-xs font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded-lg">
          {course.field}
        </span>

        <div className="flex items-center gap-4 text-xs text-slate-500 mt-auto pt-3 border-t border-slate-50">
          <span className="flex items-center gap-1">
            <ClockIcon className="h-3.5 w-3.5 text-slate-400" />
            {course.duration}
          </span>
          <span className="flex items-center gap-1">
            <CurrencyDollarIcon className="h-3.5 w-3.5 text-slate-400" />
            {fee}
          </span>
        </div>
      </div>
    </div>
  );
}
