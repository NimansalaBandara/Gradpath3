import { Link } from 'react-router-dom';
import { XCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import Logo from '../components/Logo';

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>

        <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto mb-5">
          <XCircleIcon className="h-10 w-10 text-slate-400" />
        </div>

        <h1 className="text-2xl font-black text-slate-900 mb-2">Payment cancelled</h1>
        <p className="text-slate-500 text-sm mb-8">
          No charge was made. You can upgrade to Premium any time from your dashboard.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            to="/dashboard/upgrade"
            className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-500 hover:to-yellow-400 text-slate-900 font-bold rounded-xl transition-all shadow-md shadow-amber-200/60"
          >
            Try again →
          </Link>
          <Link
            to="/dashboard"
            className="flex items-center justify-center gap-2 py-3 text-sm text-slate-500 hover:text-slate-700 transition"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
