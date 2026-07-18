import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeftIcon, ClockIcon, CurrencyDollarIcon, AcademicCapIcon, DocumentTextIcon, ClipboardDocumentListIcon, CheckCircleIcon, CalendarDaysIcon, MapPinIcon, TrophyIcon } from '@heroicons/react/24/outline';
import { catalogApi } from '../../lib/catalogApi';
import { trackerApi } from '../../lib/api';

export default function CourseDetailPage() {
  const { id, courseId } = useParams<{ id: string; courseId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tracked, setTracked] = useState(false);

  const trackMutation = useMutation({
    mutationFn: (cId: number) => trackerApi.add({ course_id: cId }),
    onSuccess: () => {
      setTracked(true);
      queryClient.invalidateQueries({ queryKey: ['tracker'] });
    },
    onError: () => setTracked(true), // already tracked
  });

  const { data: course, isLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => catalogApi.course(Number(courseId)),
    enabled: !!courseId,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  if (!course) return <div className="text-center py-16 text-gray-400">Course not found.</div>;

  const uniId = id ?? course.university?.id;
  const fee = course.tuition_fee
    ? `A$${Number(course.tuition_fee).toLocaleString()} per year`
    : 'Tuition fee waived (research degree)';

  return (
    <div className="max-w-3xl">
      <button
        onClick={() => navigate(`/dashboard/universities/${uniId}`)}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-text mb-6 transition-colors"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to {course.university?.name ?? 'University'}
      </button>

      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            course.level === 'phd' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
          }`}>
            {course.level === 'phd' ? 'PhD' : "Master's Degree"}
          </span>
          <span className="text-sm text-gray-400">{course.field}</span>
        </div>
        <h1 className="text-2xl font-bold text-brand-text mb-1">{course.title}</h1>
        <button
          onClick={() => navigate(`/dashboard/universities/${uniId}`)}
          className="text-sm text-primary hover:underline font-medium"
        >
          {course.university?.name}
        </button>
        <span className="text-sm text-gray-400 ml-1">· {course.university?.city}</span>
      </div>

      {/* Detail cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {[
          { icon: ClockIcon, label: 'Duration', value: course.duration || '—' },
          { icon: CurrencyDollarIcon, label: 'Tuition Fee', value: fee },
          { icon: AcademicCapIcon, label: 'Level', value: course.level === 'phd' ? 'PhD' : "Master's" },
          { icon: DocumentTextIcon, label: 'Field', value: course.field || '—' },
          {
            icon: CalendarDaysIcon,
            label: 'Application Deadline',
            value: course.deadline
              ? new Date(course.deadline).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
              : 'Check university website',
          },
          {
            icon: MapPinIcon,
            label: 'Location',
            value: [course.university?.city, course.university?.country].filter(Boolean).join(', ') || '—',
          },
          {
            icon: TrophyIcon,
            label: 'University Ranking',
            value: course.university?.world_ranking ? `#${course.university.world_ranking} World` : 'Not ranked',
          },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <Icon className="h-4 w-4 text-primary" />
              <span className="text-xs text-gray-400 font-medium">{label}</span>
            </div>
            <p className="text-sm font-semibold text-brand-text">{value}</p>
          </div>
        ))}
      </div>

      {/* Description */}
      {course.description && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
          <h2 className="font-semibold text-brand-text mb-3">About this course</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{course.description}</p>
        </div>
      )}

      {/* Requirements */}
      {course.requirements && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h2 className="font-semibold text-brand-text mb-3">Entry requirements</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{course.requirements}</p>
        </div>
      )}

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => !tracked && trackMutation.mutate(course.id)}
          disabled={tracked || trackMutation.isPending}
          className={`flex items-center justify-center gap-2 flex-1 py-3.5 font-semibold rounded-2xl transition-colors text-base border-2 ${
            tracked
              ? 'border-green-400 text-green-600 bg-green-50 cursor-default'
              : 'border-primary text-primary hover:bg-amber-50'
          }`}
        >
          {tracked ? (
            <>
              <CheckCircleIcon className="h-5 w-5" />
              Added to Tracker
            </>
          ) : trackMutation.isPending ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
              Adding…
            </>
          ) : (
            <>
              <ClipboardDocumentListIcon className="h-5 w-5" />
              Add to Tracker
            </>
          )}
        </button>
        <a
          href={course.application_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 flex-1 py-3.5 bg-primary hover:bg-primary-deep text-white font-semibold rounded-2xl transition-colors text-base shadow-sm shadow-amber-200"
        >
          Apply at {course.university?.name} →
        </a>
      </div>
    </div>
  );
}
