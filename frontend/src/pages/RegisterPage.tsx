import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  SparklesIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import AustraliaFlag from '../components/AustraliaFlag';

const BENEFITS = [
  { emoji: '🎓', title: 'Find your perfect program', desc: 'AI matches your profile to the right Master\'s and PhD courses' },
  { emoji: '💰', title: 'Discover scholarships', desc: 'Filter by type, field, and eligibility to find funding you qualify for' },
  { emoji: '📋', title: 'Track every application', desc: 'Manage status, deadlines, and documents in one clean dashboard' },
  { emoji: '🚀', title: 'Premium AI recommendations', desc: 'Upgrade for personalised university suggestions ranked just for you' },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ email: '', password: '', first_name: '', last_name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch {
      setError('Registration failed. This email may already be registered.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition text-sm text-slate-800 placeholder-slate-300';

  const nameInputClass =
    'w-full pl-9 pr-3 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition text-sm text-slate-800 placeholder-slate-300';

  return (
    <div className="min-h-screen flex">

      {/* ── Left dark panel ── */}
      <div className="hidden lg:flex flex-col w-[46%] bg-slate-900 relative overflow-hidden select-none">
        {/* Ambient glows */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/4" />

        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        />

        <div className="relative flex flex-col flex-1 p-10">
          <Logo dark size="lg" />

          {/* Hero copy */}
          <div className="flex-1 flex flex-col justify-center py-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-400/15 border border-amber-400/25 rounded-full mb-5 w-fit">
              <SparklesIcon className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-amber-300 text-xs font-semibold tracking-wide">Free to get started</span>
            </div>

            <h1 className="text-3xl font-black text-white leading-snug mb-4">
              Join students<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
                heading to Australia
              </span>
            </h1>

            <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-[280px]">
              Create your free account and get matched to universities, courses, and scholarships in minutes.
            </p>

            {/* Benefits list */}
            <div className="space-y-4">
              {BENEFITS.map((b) => (
                <div key={b.title} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-base">
                    {b.emoji}
                  </div>
                  <div>
                    <div className="text-white text-sm font-semibold">{b.title}</div>
                    <div className="text-slate-500 text-xs mt-0.5 leading-relaxed">{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Flag */}
          <div className="mt-auto opacity-80">
            <AustraliaFlag className="w-full max-w-[200px] mx-auto rounded-lg overflow-hidden shadow-2xl shadow-black/50" />
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center bg-white px-6 py-12 relative">
        {/* Decorative top bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-yellow-300" />

        {/* Mobile logo */}
        <div className="lg:hidden mb-8">
          <Logo size="lg" />
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-slate-900 mb-1.5">Create your account</h2>
            <p className="text-slate-500 text-sm">Start your postgrad journey — it's free</p>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              <span className="flex-shrink-0 text-base leading-none mt-0.5">⚠</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                  First name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={form.first_name}
                    onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))}
                    className={nameInputClass}
                    placeholder="Jane"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                  Last name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={form.last_name}
                    onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))}
                    className={nameInputClass}
                    placeholder="Smith"
                  />
                </div>
              </div>
            </div>

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
                  minLength={8}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className={inputClass}
                  placeholder="Min. 8 characters"
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
                  Creating account…
                </>
              ) : (
                <>
                  Create free account
                  <ArrowRightIcon className="h-4 w-4" />
                </>
              )}
            </button>

            <p className="text-xs text-slate-400 text-center">
              By registering you agree to use this app for educational purposes.
            </p>
          </form>

          {/* Footer links */}
          <div className="mt-5 pt-5 border-t border-slate-100 space-y-3 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="text-amber-600 font-semibold hover:text-amber-700 transition">
                Sign in →
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
