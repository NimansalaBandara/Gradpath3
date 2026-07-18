import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SparklesIcon, UserIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { adminApi } from '../../lib/adminApi';
import type { AdminUser } from '../../types/api';

function RoleBadge({ role }: { role: AdminUser['role'] }) {
  return role === 'admin' ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-100 text-violet-700">
      <ShieldCheckIcon className="h-3 w-3" />
      Admin
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
      <UserIcon className="h-3 w-3" />
      Student
    </span>
  );
}

function PremiumToggle({ user, onToggle, loading }: {
  user: AdminUser;
  onToggle: () => void;
  loading: boolean;
}) {
  return (
    <button
      onClick={onToggle}
      disabled={loading}
      title={user.is_premium ? 'Click to remove premium' : 'Click to grant premium'}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
        user.is_premium
          ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
      } disabled:opacity-50`}
    >
      <SparklesIcon className="h-3 w-3" />
      {user.is_premium ? 'Premium' : 'Free'}
    </button>
  );
}

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: adminApi.users.list,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { role?: 'student' | 'admin'; is_premium?: boolean } }) =>
      adminApi.users.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.email.toLowerCase().includes(q) ||
      `${u.first_name} ${u.last_name}`.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Users</h1>
          <p className="text-slate-500 mt-0.5 text-sm">Manage student accounts and premium status.</p>
        </div>
        <span className="text-sm text-slate-400">{users.length} total</span>
      </div>

      {/* Search */}
      <div className="mb-5">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          className="w-full max-w-sm px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">Name</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Email</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Role</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Plan</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Joined</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-slate-400 py-12">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((u) => (
                    <tr key={u.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition">
                      <td className="px-5 py-3.5 font-medium text-slate-800 whitespace-nowrap">
                        {u.first_name} {u.last_name}
                      </td>
                      <td className="px-4 py-3.5 text-slate-500">{u.email}</td>
                      <td className="px-4 py-3.5">
                        <RoleBadge role={u.role} />
                      </td>
                      <td className="px-4 py-3.5">
                        <PremiumToggle
                          user={u}
                          loading={updateMutation.isPending}
                          onToggle={() =>
                            updateMutation.mutate({ id: u.id, data: { is_premium: !u.is_premium } })
                          }
                        />
                      </td>
                      <td className="px-4 py-3.5 text-slate-400 text-xs">
                        {new Date(u.date_joined).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3.5">
                        <select
                          value={u.role}
                          onChange={(e) =>
                            updateMutation.mutate({
                              id: u.id,
                              data: { role: e.target.value as 'student' | 'admin' },
                            })
                          }
                          disabled={updateMutation.isPending}
                          className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white text-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-400/50"
                        >
                          <option value="student">Student</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
