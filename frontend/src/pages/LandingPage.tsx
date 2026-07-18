import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import AustraliaMap from '../components/AustraliaMap';
import AustraliaFlag from '../components/AustraliaFlag';
import { useInView } from '../hooks/useInView';
import { useCounter } from '../hooks/useCounter';
import {
  SparklesIcon,
  ClipboardDocumentListIcon,
  DocumentCheckIcon,
  AcademicCapIcon,
  StarIcon,
  ArrowRightIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

const FEATURES = [
  {
    Icon: SparklesIcon,
    title: 'AI University Matching',
    desc: 'Get personalised university and course suggestions powered by your academic profile.',
    gradient: 'from-violet-500 to-indigo-500',
    bg: 'bg-violet-50',
  },
  {
    Icon: ClipboardDocumentListIcon,
    title: 'Application Tracker',
    desc: 'Track every application from hope-to-apply through to accepted - in one place.',
    gradient: 'from-amber-400 to-yellow-300',
    bg: 'bg-amber-50',
  },
  {
    Icon: DocumentCheckIcon,
    title: 'Document Checklist',
    desc: 'Upload SOP, transcripts, and passport - never miss a required document again.',
    gradient: 'from-blue-500 to-sky-400',
    bg: 'bg-blue-50',
  },
  {
    Icon: AcademicCapIcon,
    title: 'Scholarship Finder',
    desc: 'Discover full-ride and partial scholarships matched to your field and goals.',
    gradient: 'from-emerald-500 to-teal-400',
    bg: 'bg-emerald-50',
  },
];

const TESTIMONIALS = [
  {
    quote: 'GradPath helped me find and track three PhD applications - I got into UNSW!',
    name: 'Priya R.',
    uni: 'UNSW Sydney',
    rating: 5,
    avatar: 'PR',
    color: 'from-violet-400 to-indigo-500',
  },
  {
    quote: 'The scholarship discovery feature alone is worth it. Saved me hours of research.',
    name: 'James L.',
    uni: 'University of Melbourne',
    rating: 5,
    avatar: 'JL',
    color: 'from-emerald-400 to-teal-500',
  },
  {
    quote: 'I had all my documents organised and submitted ahead of every deadline.',
    name: 'Aisha M.',
    uni: 'University of Sydney',
    rating: 5,
    avatar: 'AM',
    color: 'from-rose-400 to-pink-500',
  },
];

const PERKS = [
  'AI-matched universities & courses',
  'Full application status tracking',
  'Document upload & checklist',
  'Scholarship discovery',
  'Free to get started',
];

function StatCounter({ target, suffix, label, color }: { target: number; suffix: string; label: string; color: string }) {
  const { ref, inView } = useInView(0.3);
  const count = useCounter(target, 1800, inView);
  const display = target >= 1000 ? count.toLocaleString() : String(count);
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="text-center">
      <p className={`text-4xl font-black ${color}`}>{display}{suffix}</p>
      <p className="text-sm text-slate-400 mt-1 font-medium">{label}</p>
    </div>
  );
}

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={className}
      style={inView ? { animation: `fadeInUp 0.65s ease-out ${delay}ms both` } : { opacity: 0 }}
    >
      {children}
    </div>
  );
}

export default function LandingPage() {
  const { ref: featRef, inView: featInView } = useInView();
  const { ref: testRef, inView: testInView } = useInView();

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* ── Sticky header ── */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Logo />
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition">
              Sign in
            </Link>
            <Link to="/register" className="text-sm font-semibold bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-500 hover:to-yellow-400 text-slate-900 px-4 py-1.5 rounded-xl shadow-sm shadow-amber-200 transition">
              Get started free
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-0 lg:pt-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left copy */}
            <div className="text-white text-center lg:text-left pb-16">
              <div
                className="animate-float inline-flex items-center gap-2 px-3 py-1.5 bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-semibold rounded-full mb-6"
              >
                <SparklesIcon className="h-3.5 w-3.5" />
                AI-powered postgrad matching
              </div>

              <h1
                className="text-4xl sm:text-5xl lg:text-[3.25rem] font-black leading-tight mb-5 animate-fade-in-up"
                style={{ animationDelay: '100ms' }}
              >
                Your path to a{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
                  Master's or PhD
                </span>
                <br />in Australia
              </h1>

              <p
                className="text-slate-300 text-lg leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0 animate-fade-in-up"
                style={{ animationDelay: '250ms' }}
              >
                GradPath matches your academic profile to the right universities, tracks your applications, and surfaces the scholarships you deserve.
              </p>

              {/* Perks list */}
              <ul
                className="space-y-2 mb-8 text-sm text-slate-300 animate-fade-in-up max-w-xs mx-auto lg:mx-0"
                style={{ animationDelay: '350ms' }}
              >
                {PERKS.map(p => (
                  <li key={p} className="flex items-center gap-2">
                    <CheckCircleIcon className="h-4 w-4 text-amber-400 flex-shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>

              <div
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 animate-fade-in-up"
                style={{ animationDelay: '450ms' }}
              >
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-500 hover:to-yellow-400 text-slate-900 font-bold rounded-2xl shadow-lg shadow-amber-400/30 transition text-base"
                >
                  Start for free
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
                <Link to="/login" className="px-8 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-2xl transition text-base">
                  Sign in
                </Link>
              </div>
            </div>

            {/* Right — Australia illustration */}
            <div className="hidden lg:flex flex-col items-center justify-center gap-6 pb-10">
              {/* Flag */}
              <div className="w-full max-w-[260px]">
                <AustraliaFlag className="w-full rounded-xl shadow-xl shadow-black/40 border border-white/10" />
                <p className="text-xs text-slate-400 text-center mt-2 font-medium tracking-wide uppercase">Australia</p>
              </div>
              {/* Map */}
              <div className="relative w-full max-w-[280px]">
                <div className="absolute inset-0 bg-amber-400/5 rounded-3xl blur-xl" />
                <AustraliaMap className="relative w-full drop-shadow-lg" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 py-10">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-3 gap-8">
          <StatCounter target={10} suffix="+" label="Top Universities" color="text-amber-400" />
          <StatCounter target={29} suffix="+" label="Courses Listed" color="text-violet-400" />
          <StatCounter target={20} suffix="+" label="Scholarships" color="text-emerald-400" />
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <FadeIn className="text-center mb-14">
            <span className="inline-block px-3 py-1 bg-violet-100 text-violet-600 text-xs font-semibold rounded-full mb-3">Features</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-800 mb-3">Everything you need</h2>
            <p className="text-slate-500 max-w-xl mx-auto">One platform to go from research to acceptance letter.</p>
          </FadeIn>

          <div
            ref={featRef as React.RefObject<HTMLDivElement>}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {FEATURES.map(({ Icon, title, desc, gradient, bg }, i) => (
              <div
                key={title}
                className={`${bg} rounded-2xl p-6 border border-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all`}
                style={featInView ? { animation: `fadeInUp 0.6s ease-out ${i * 100}ms both` } : { opacity: 0 }}
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-5 shadow-sm`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <FadeIn className="text-center mb-14">
            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-600 text-xs font-semibold rounded-full mb-3">How it works</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-800">Three steps to your dream degree</h2>
          </FadeIn>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Build your profile', desc: 'Enter your GPA, field, IELTS, and goals. Takes two minutes.', color: 'text-amber-500', bg: 'bg-amber-50 border-amber-100' },
              { step: '02', title: 'Get matched', desc: 'AI ranks universities and courses that fit your exact profile.', color: 'text-violet-500', bg: 'bg-violet-50 border-violet-100' },
              { step: '03', title: 'Track & apply', desc: 'Manage applications, upload documents, and hit every deadline.', color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-100' },
            ].map(({ step, title, desc, color, bg }, i) => (
              <FadeIn key={step} delay={i * 150} className={`rounded-2xl border p-6 ${bg}`}>
                <p className={`text-4xl font-black ${color} mb-3`}>{step}</p>
                <h3 className="font-bold text-slate-800 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <FadeIn className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-white/10 text-slate-300 text-xs font-semibold rounded-full mb-3">Testimonials</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">Trusted by students across Australia</h2>
          </FadeIn>

          <div
            ref={testRef as React.RefObject<HTMLDivElement>}
            className="grid sm:grid-cols-3 gap-6"
          >
            {TESTIMONIALS.map(({ quote, name, uni, rating, avatar, color }, i) => (
              <div
                key={name}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
                style={testInView ? { animation: `fadeInUp 0.6s ease-out ${i * 120}ms both` } : { opacity: 0 }}
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: rating }).map((_, j) => (
                    <StarSolid key={j} className="h-4 w-4 text-amber-400" />
                  ))}
                  {Array.from({ length: 5 - rating }).map((_, j) => (
                    <StarIcon key={j} className="h-4 w-4 text-slate-600" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-5 italic">"{quote}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
                    {avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{name}</p>
                    <p className="text-xs text-slate-400">{uni}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative bg-gradient-to-br from-amber-400 via-yellow-300 to-amber-400 overflow-hidden py-24">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 0%, transparent 50%), radial-gradient(circle at 80% 50%, white 0%, transparent 50%)' }} />
        <FadeIn className="relative max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">Ready to start your journey?</h2>
          <p className="text-slate-700 mb-8 text-lg">Join thousands of students already using GradPath to find their perfect postgrad program.</p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-10 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-xl transition text-base"
          >
            Get started  it's free
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </FadeIn>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-slate-900 border-t border-slate-800 py-10 text-center">
        <div className="flex justify-center mb-4">
          <Logo dark />
        </div>
        <p className="text-sm text-slate-500">© {new Date().getFullYear()} GradPath. Helping students reach Australian universities.</p>
        <div className="flex items-center justify-center gap-6 mt-4">
          <Link to="/login" className="text-xs text-slate-500 hover:text-slate-300 transition">Sign in</Link>
          <Link to="/register" className="text-xs text-slate-500 hover:text-slate-300 transition">Register</Link>
        </div>
      </footer>
    </div>
  );
}
