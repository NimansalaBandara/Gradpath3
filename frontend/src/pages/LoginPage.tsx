import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  EnvelopeIcon,
  LockClosedIcon,
  SparklesIcon,
  CheckCircleIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import AustraliaMap from '../components/AustraliaMap';

const PERKS = [
  'AI-powered course & scholarship matching',
  'Track every application in one place',
  'Discover funding you actually qualify for',
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition text-sm text-slate-800 placeholder-slate-300';

  return (
    <div className="min-h-screen flex">

      {/* ── Left dark panel ── */}
      <div className="hidden lg:flex flex-col w-[46%] bg-slate-900 relative overflow-hidden select-none">
        {/* Ambient glows */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/4" />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-amber-300/5 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />

        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        />

        <div className="relative flex flex-col flex-1 p-10">
          {/* Logo */}
          <Logo dark size="lg" />

          {/* Hero copy */}
          <div className="flex-1 flex flex-col justify-center py-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-400/15 border border-amber-400/25 rounded-full mb-5 w-fit">
              <SparklesIcon className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-amber-300 text-xs font-semibold tracking-wide">AI-Powered Postgrad Matching</span>
            </div>

            <h1 className="text-3xl font-black text-white leading-snug mb-4">
              Your path to<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
                Australia's best
              </span>{' '}
              universities
            </h1>

            <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-[280px]">
              GradPath matches your academic profile to the right Master's and PhD programs, then helps you get there.
            </p>

            <div className="space-y-3.5">
              {PERKS.map((perk) => (
                <div key={perk} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-400/20 border border-amber-400/30 flex items-center justify-center">
                    <CheckCircleIcon className="h-3 w-3 text-amber-400" />
                  </div>
                  <span className="text-slate-300 text-sm">{perk}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Australia map */}
          <div className="mt-auto opacity-50">
            <AustraliaMap className="w-full max-w-[200px] mx-auto" />
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center bg-white px-6 py-12 relative">
        {/* Subtle top decorative bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-yellow-300" />

        {/* Mobile logo */}
        <div className="lg:hidden mb-8">
          <Logo size="lg" />
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-slate-900 mb-1.5">Welcome back</h2>
            <p className="text-slate-500 text-sm">Sign in to continue your GradPath journey</p>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              <span className="flex-shrink-0 text-base leading-none mt-0.5">⚠</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className={inputClass}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className={inputClass}
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-500 hover:to-yellow-400 text-slate-900 font-bold rounded-xl transition-all shadow-md shadow-amber-200/60 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-700" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRightIcon className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 pt-6 border-t border-slate-100 space-y-3 text-center">
            <p className="text-sm text-slate-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-amber-600 font-semibold hover:text-amber-700 transition">
                Create one free →
              </Link>
            </p>
            <Link to="/" className="block text-xs text-slate-400 hover:text-slate-600 transition">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
