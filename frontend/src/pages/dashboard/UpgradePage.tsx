import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SparklesIcon,
  CheckCircleIcon,
  LockClosedIcon,
  CreditCardIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { billingApi } from '../../lib/api';

const FREE_FEATURES = [
  { label: 'Browse all universities & courses', included: true },
  { label: 'Application tracker', included: true },
  { label: 'Document checklist', included: true },
  { label: 'Scholarship search', included: true },
  { label: 'AI course recommendations', included: false },
  { label: 'AI-suggested universities', included: false },
  { label: 'Personalised match scores', included: false },
];

const PREMIUM_FEATURES = [
  { label: 'Everything in Free', included: true },
  { label: 'AI course recommendations', included: true },
  { label: 'AI-suggested universities', included: true },
  { label: 'Personalised match scores & reasons', included: true },
  { label: 'Priority profile matching', included: true },
];

export default function UpgradePage() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Mock card form state (cosmetic only)
  const [card, setCard] = useState({ name: '', number: '', expiry: '', cvc: '' });

  async function handleActivate(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const updatedUser = await billingApi.activate();
      // Sync AuthContext with the updated user returned from backend
      await refreshUser();
      // If refreshUser doesn't pick up the new value fast enough, the
      // backend returned it directly — either way navigate to success.
      void updatedUser;
      navigate('/payment/success');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (user?.is_premium) {
    return (
      <div className="max-w-xl">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 p-8 text-white shadow-xl shadow-emerald-200/50">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-x-1/3 -translate-y-1/3" />
          <div className="relative flex items-start gap-4">
            <div className="p-3 bg-white/20 rounded-2xl">
              <SparklesIcon className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xl font-black mb-1">You're already Premium! ✓</p>
              <p className="text-emerald-100 text-sm">
                You have full access to AI recommendations, suggested universities, and personalised match scores.
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="mt-5 px-5 py-2 bg-white text-emerald-700 font-bold rounded-xl text-sm hover:bg-emerald-50 transition"
              >
                Go to Dashboard →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-7 mb-8 text-white">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-violet-500/10 rounded-full blur-2xl" />
        <div className="relative flex items-center gap-4">
          <div className="p-3 bg-amber-400/20 rounded-2xl border border-amber-400/30">
            <SparklesIcon className="h-7 w-7 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black">Unlock GradPath Premium</h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Get AI-powered recommendations personalised to your academic profile.
            </p>
          </div>
        </div>
      </div>

      {/* Plan comparison */}
      <div className="grid sm:grid-cols-2 gap-5 mb-8">
        {/* Free */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="mb-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Free</p>
            <p className="text-3xl font-black text-slate-900">USD$0</p>
            <p className="text-xs text-slate-400 mt-0.5">Forever free</p>
          </div>
          <div className="space-y-2.5">
            {FREE_FEATURES.map((f) => (
              <div key={f.label} className="flex items-center gap-2.5">
                {f.included ? (
                  <CheckCircleIcon className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                ) : (
                  <XCircleIcon className="h-4 w-4 text-slate-300 flex-shrink-0" />
                )}
                <span className={`text-sm ${f.included ? 'text-slate-700' : 'text-slate-400'}`}>
                  {f.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Premium */}
        <div className="bg-white rounded-2xl border-2 border-amber-400 p-6 shadow-lg shadow-amber-100/50 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-900 text-xs font-bold px-4 py-1 rounded-full shadow-sm">
            Most Popular
          </div>
          <div className="mb-4">
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">Premium</p>
            <p className="text-3xl font-black text-slate-900">USD$9.99</p>
            <p className="text-xs text-slate-400 mt-0.5">One-time · demo mode</p>
          </div>
          <div className="space-y-2.5">
            {PREMIUM_FEATURES.map((f) => (
              <div key={f.label} className="flex items-center gap-2.5">
                <CheckCircleIcon className="h-4 w-4 text-amber-500 flex-shrink-0" />
                <span className="text-sm text-slate-700">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mock payment form */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="p-2 bg-amber-50 rounded-xl">
            <CreditCardIcon className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800 text-sm">Payment Details</h2>
            <p className="text-xs text-slate-400">Demo mode - no real charge will be made</p>
          </div>
          <div className="ml-auto flex gap-1.5">
            {['VISA', 'MC', 'AMEX'].map((b) => (
              <span key={b} className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded">
                {b}
              </span>
            ))}
          </div>
        </div>

        <form onSubmit={handleActivate} className="space-y-4">
          {/* Name on card */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
              Name on Card
            </label>
            <input
              type="text"
              value={card.name}
              onChange={(e) => setCard((c) => ({ ...c, name: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition text-sm"
              placeholder="Jane Smith"
            />
          </div>

          {/* Card number */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
              Card Number
            </label>
            <div className="relative">
              <LockClosedIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={card.number}
                onChange={(e) => setCard((c) => ({ ...c, number: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition text-sm font-mono"
                placeholder="4242 4242 4242 4242"
                maxLength={19}
              />
            </div>
          </div>

          {/* Expiry + CVC */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                Expiry Date
              </label>
              <input
                type="text"
                value={card.expiry}
                onChange={(e) => setCard((c) => ({ ...c, expiry: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition text-sm"
                placeholder="MM / YY"
                maxLength={7}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                CVC
              </label>
              <input
                type="text"
                value={card.cvc}
                onChange={(e) => setCard((c) => ({ ...c, cvc: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition text-sm"
                placeholder="123"
                maxLength={4}
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-rose-500 font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-500 hover:to-yellow-400 text-slate-900 font-bold rounded-xl transition-all shadow-md shadow-amber-200/60 disabled:opacity-60 mt-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-700" />
                Processing…
              </>
            ) : (
              <>
                <SparklesIcon className="h-4 w-4" />
                Activate Premium - USD$9.99
              </>
            )}
          </button>

          <p className="text-xs text-slate-400 text-center">
            🔒 Demo mode - this is a simulated payment. No real charge is made.
          </p>
        </form>
      </div>
    </div>
  );
}
