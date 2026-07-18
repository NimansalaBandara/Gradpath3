import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SparklesIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

export default function PaymentSuccessPage() {
  const { refreshUser } = useAuth();

  useEffect(() => {
    // Ensure AuthContext has the latest is_premium = true
    refreshUser().catch(() => {});
  }, [refreshUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />

      {/* Floating dots (CSS confetti) */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-amber-400/40 animate-bounce"
          style={{
            width: `${6 + (i % 4) * 4}px`,
            height: `${6 + (i % 4) * 4}px`,
            top: `${10 + (i * 7) % 80}%`,
            left: `${5 + (i * 8) % 90}%`,
            animationDelay: `${(i * 0.15).toFixed(2)}s`,
            animationDuration: `${1.2 + (i % 3) * 0.4}s`,
          }}
        />
      ))}

      <div className="relative text-center max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo dark size="lg" />
        </div>

        {/* Success icon */}
        <div className="relative inline-flex mb-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
            <CheckCircleIcon className="h-12 w-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center shadow-lg">
            <SparklesIcon className="h-4 w-4 text-slate-900" />
          </div>
        </div>

        <h1 className="text-3xl font-black text-white mb-3">
          Payment Successful!
        </h1>
        <p className="text-slate-300 text-lg leading-relaxed mb-2">
          Welcome to <span className="text-amber-400 font-bold">GradPath Premium</span>.
        </p>
        <p className="text-slate-400 text-sm mb-8">
          You now have full access to AI-powered course recommendations, suggested universities, and personalised match scores.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/dashboard"
            className="flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-500 hover:to-yellow-400 text-slate-900 font-bold rounded-2xl transition-all shadow-lg shadow-amber-400/30"
          >
            <SparklesIcon className="h-4 w-4" />
            Go to Dashboard →
          </Link>
        </div>

        <p className="mt-6 text-xs text-slate-500">
          Your AI recommendations are ready. Check your dashboard to see your matches.
        </p>
      </div>
    </div>
  );
}
