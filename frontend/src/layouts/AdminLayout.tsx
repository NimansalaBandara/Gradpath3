import { useState } from 'react';
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import {
  HomeIcon,
  BuildingLibraryIcon,
  AcademicCapIcon,
  UserGroupIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowLeftIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/admin',               label: 'Dashboard',     Icon: HomeIcon,             end: true },
  { to: '/admin/universities',  label: 'Universities',  Icon: BuildingLibraryIcon,  end: false },
  { to: '/admin/courses',       label: 'Courses',       Icon: BookOpenIcon,         end: false },
  { to: '/admin/scholarships',  label: 'Scholarships',  Icon: AcademicCapIcon,      end: false },
  { to: '/admin/users',         label: 'Users',         Icon: UserGroupIcon,        end: false },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { user, logout } = useAuth();

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
      isActive
        ? 'bg-primary text-gray-900 shadow-sm shadow-amber-400/30'
        : 'text-slate-400 hover:bg-white/10 hover:text-white'
    }`;

  return (
    <div className="flex flex-col h-full">
      {/* Logo + badge */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo dark />
          <span className="text-[10px] font-bold bg-amber-400/20 border border-amber-400/30 text-amber-400 px-1.5 py-0.5 rounded-md tracking-wide uppercase">
            Admin
          </span>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 lg:hidden">
            <XMarkIcon className="h-5 w-5 text-slate-400" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ to, label, Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={navClass} onClick={onClose}>
            <Icon className="h-5 w-5 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-white/10">
        <NavLink
          to="/dashboard"
          className="flex items-center gap-2 mb-3 px-4 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-white/10 hover:text-white transition"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Dashboard
        </NavLink>
        <div className="mb-3 px-3">
          <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          <p className="text-xs text-amber-400 font-semibold mt-0.5">Administrator</p>
        </div>
        <button
          onClick={logout}
          className="w-full text-left px-4 py-2 text-sm text-slate-500 hover:text-red-400 rounded-xl hover:bg-red-500/10 transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const { user, isLoading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-64 bg-slate-900 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="relative flex flex-col w-64 h-full bg-slate-900 shadow-xl">
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-slate-900 sticky top-0 z-20">
          <button onClick={() => setMobileOpen(true)} className="p-1 rounded-lg hover:bg-white/10">
            <Bars3Icon className="h-6 w-6 text-white" />
          </button>
          <Logo dark />
        </div>
        <div className="flex-1 p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
