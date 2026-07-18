import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeftIcon,
  ClockIcon,
  CurrencyDollarIcon,
  AcademicCapIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  CalendarDaysIcon,
  MapPinIcon,
  TrophyIcon,
  ChevronRightIcon,
  CheckBadgeIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { catalogApi } from '../../lib/catalogApi';
import { trackerApi } from '../../lib/api';
import CourseCard from '../../components/CourseCard';
import ScholarshipCard from '../../components/ScholarshipCard';

// Splits a free-text requirements blob into scannable bullet points.
function splitRequirements(text: string): string[] {
  const bySentence = text
    .split(/(?<=[.;])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 3);
  if (bySentence.length > 1) return bySentence;

  // No sentence punctuation (e.g. a single comma-separated line) — split on commas instead.
  const byComma = text.split(',').map(s => s.trim()).filter(s => s.length > 2);
  return byComma.length > 1 ? byComma : bySentence;
}

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

  const uniId = Number(id ?? course?.university?.id);

  const { data: similarData } = useQuery({
    queryKey: ['similar-courses', course?.field, course?.id],
    queryFn: () => catalogApi.courses({ field: course!.field }),
    enabled: !!course,
  });

  const { data: scholarshipsData } = useQuery({
    queryKey: ['university-scholarships', uniId],
    queryFn: () => catalogApi.scholarships({ university: uniId }),
    enabled: !!uniId,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  if (!course) return <div className="text-center py-16 text-gray-400">Course not found.</div>;

  const isPhd = course.level === 'phd';
  const fee = course.tuition_fee
    ? `A$${Number(course.tuition_fee).toLocaleString()}/yr`
    : 'Fee waived';
  const deadlineLabel = course.deadline
    ? new Date(course.deadline).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Check university website';
  const requirementBullets = course.requirements ? splitRequirements(course.requirements) : [];
  const similarCourses = (similarData?.results ?? []).filter(c => c.id !== course.id).slice(0, 3);
  const scholarships = (scholarshipsData?.results ?? []).slice(0, 3);

  const KEY_FACTS = [
    { icon: AcademicCapIcon, label: 'Level', value: isPhd ? 'PhD' : "Master's" },
    { icon: ClockIcon, label: 'Duration', value: course.duration || '—' },
    { icon: CurrencyDollarIcon, label: 'Tuition Fee', value: fee },
    { icon: CalendarDaysIcon, label: 'Application Deadline', value: deadlineLabel },
    { icon: MapPinIcon, label: 'Location', value: [course.university?.city, course.university?.country].filter(Boolean).join(', ') || '—' },
    { icon: TrophyIcon, label: 'University Ranking', value: course.university?.world_ranking ? `#${course.university.world_ranking} World` : 'Not ranked' },
  ];

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-slate-400 mb-4 flex-wrap">
        <Link to="/dashboard/universities" className="hover:text-primary transition-colors">Universities</Link>
        <ChevronRightIcon className="h-3.5 w-3.5" />
        <Link to={`/dashboard/universities/${uniId}`} className="hover:text-primary transition-colors">
          {course.university?.name}
        </Link>
        <ChevronRightIcon className="h-3.5 w-3.5" />
        <span className="text-slate-600 font-medium truncate max-w-[220px] sm:max-w-none">{course.title}</span>
      </nav>

      <button
        onClick={() => navigate(`/dashboard/universities/${uniId}`)}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-text mb-4 transition-colors"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to {course.university?.name ?? 'University'}
      </button>

      {/* Hero */}
      <div className={`relative rounded-3xl overflow-hidden mb-6 ${isPhd ? 'bg-gradient-to-br from-violet-600 via-purple-600 to-violet-700' : 'bg-gradient-to-br from-blue-600 via-sky-600 to-blue-700'}`}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 15% 30%, white 0%, transparent 45%), radial-gradient(circle at 85% 70%, white 0%, transparent 45%)' }} />
        <div className="relative p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm">
              {isPhd ? 'PhD' : "Master's Degree"}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm">
              {course.field}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-3 max-w-2xl">{course.title}</h1>
          <button
            onClick={() => navigate(`/dashboard/universities/${uniId}`)}
            className="text-sm sm:text-base text-white/90 font-semibold hover:underline"
          >
            {course.university?.name}
          </button>
          <span className="text-sm text-white/60 ml-1.5">· {course.university?.city}, {course.university?.country}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Description */}
          {course.description && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-semibold text-brand-text mb-3">About this course</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{course.description}</p>
            </div>
          )}

          {/* Requirements */}
          {requirementBullets.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-semibold text-brand-text mb-4">Entry requirements</h2>
              <ul className="space-y-2.5">
                {requirementBullets.map((r, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600 leading-relaxed">
                    <CheckBadgeIcon className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Scholarships at this university */}
          {scholarships.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <SparklesIcon className="h-4 w-4 text-amber-500" />
                <h2 className="font-semibold text-brand-text">Scholarships at {course.university?.name}</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {scholarships.map(s => <ScholarshipCard key={s.id} scholarship={s} />)}
              </div>
            </div>
          )}

          {/* Similar courses */}
          {similarCourses.length > 0 && (
            <div>
              <h2 className="font-semibold text-brand-text mb-3">Similar courses in {course.field}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {similarCourses.map(c => <CourseCard key={c.id} course={c} />)}
              </div>
            </div>
          )}
        </div>

        {/* Sticky sidebar */}
        <div className="lg:sticky lg:top-6 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-brand-text mb-4">Key facts</h3>
            <div className="space-y-4">
              {KEY_FACTS.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-amber-50 flex-shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">{label}</p>
                    <p className="text-sm font-semibold text-brand-text">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
            <button
              onClick={() => !tracked && trackMutation.mutate(course.id)}
              disabled={tracked || trackMutation.isPending}
              className={`flex items-center justify-center gap-2 w-full py-3 font-semibold rounded-2xl transition-colors text-sm border-2 ${
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
              className="flex items-center justify-center gap-2 w-full py-3 bg-primary hover:bg-primary-deep text-white font-semibold rounded-2xl transition-colors text-sm shadow-sm shadow-amber-200"
            >
              Apply Now →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
