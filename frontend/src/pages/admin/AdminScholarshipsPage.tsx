import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { adminApi } from '../../lib/adminApi';
import CrudModal from '../../components/admin/CrudModal';
import type { Scholarship } from '../../types/api';

type FormData = {
  name: string;
  type: 'full' | 'partial' | 'full_ride';
  amount: string;
  eligibility: string;
  deadline: string;
  link: string;
  university: string;
};

const EMPTY: FormData = {
  name: '', type: 'partial', amount: '', eligibility: '', deadline: '', link: '', university: '',
};

function toFormData(s: Scholarship): FormData {
  return {
    name: s.name,
    type: s.type,
    amount: s.amount != null ? String(s.amount) : '',
    eligibility: s.eligibility ?? '',
    deadline: s.deadline ?? '',
    link: s.link ?? '',
    university: s.university != null ? String(s.university) : '',
  };
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  'w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition bg-slate-50 focus:bg-white';

const TYPE_LABELS: Record<string, string> = {
  full: 'Full',
  partial: 'Partial',
  full_ride: 'Full Ride',
};

const TYPE_COLORS: Record<string, string> = {
  full: 'bg-green-100 text-green-700',
  full_ride: 'bg-emerald-100 text-emerald-700',
  partial: 'bg-blue-100 text-blue-700',
};

export default function AdminScholarshipsPage() {
  const queryClient = useQueryClient();
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [editing, setEditing] = useState<Scholarship | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data: scholarshipData, isLoading } = useQuery({
    queryKey: ['admin-scholarships'],
    queryFn: adminApi.scholarships.list,
  });
  const { data: uniData } = useQuery({
    queryKey: ['admin-universities'],
    queryFn: adminApi.universities.list,
  });
  const scholarships = scholarshipData?.results ?? [];
  const universities = uniData?.results ?? [];

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-scholarships'] });
    queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
  };

  const createMutation = useMutation({
    mutationFn: adminApi.scholarships.create,
    onSuccess: () => { invalidate(); setModal(null); },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Scholarship> }) =>
      adminApi.scholarships.update(id, data),
    onSuccess: () => { invalidate(); setModal(null); },
  });
  const deleteMutation = useMutation({
    mutationFn: adminApi.scholarships.remove,
    onSuccess: () => { invalidate(); setDeleteId(null); },
  });

  function openAdd() { setForm(EMPTY); setModal('add'); }
  function openEdit(s: Scholarship) { setEditing(s); setForm(toFormData(s)); setModal('edit'); }

  function handleSave() {
    const payload: Partial<Scholarship> = {
      name: form.name,
      type: form.type,
      amount: form.amount !== '' ? Number(form.amount) : undefined,
      eligibility: form.eligibility,
      deadline: form.deadline || undefined,
      link: form.link,
      university: form.university !== '' ? Number(form.university) : undefined,
    };
    if (modal === 'edit' && editing) {
      updateMutation.mutate({ id: editing.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  }

  const saving = createMutation.isPending || updateMutation.isPending;
  const uniName = (id: number | null | undefined) =>
    id ? (universities.find(u => u.id === id)?.name ?? `#${id}`) : '—';

  const formEl = (
    <>
      <Field label="Scholarship Name *">
        <input className={inputCls} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Type">
          <select className={inputCls} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as FormData['type'] }))}>
            <option value="partial">Partial</option>
            <option value="full">Full</option>
            <option value="full_ride">Full Ride</option>
          </select>
        </Field>
        <Field label="Amount (AUD)">
          <input type="number" className={inputCls} value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
        </Field>
      </div>
      <Field label="University (optional)">
        <select className={inputCls} value={form.university} onChange={e => setForm(f => ({ ...f, university: e.target.value }))}>
          <option value="">Any / Not tied to a university</option>
          {universities.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
      </Field>
      <Field label="Deadline">
        <input type="date" className={inputCls} value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} />
      </Field>
      <Field label="Link">
        <input className={inputCls} placeholder="https://…" value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} />
      </Field>
      <Field label="Eligibility">
        <textarea rows={3} className={inputCls} value={form.eligibility} onChange={e => setForm(f => ({ ...f, eligibility: e.target.value }))} />
      </Field>
    </>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Scholarships</h1>
          <p className="text-slate-500 mt-0.5 text-sm">{scholarships.length} scholarships in the catalog.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-500 hover:to-yellow-400 text-slate-900 font-bold rounded-xl text-sm transition-all shadow-sm shadow-amber-200/50"
        >
          <PlusIcon className="h-4 w-4" />
          Add Scholarship
        </button>
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
                  <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">Scholarship</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Type</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Amount</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">University</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Deadline</th>
                  <th className="text-right text-xs font-semibold text-slate-500 px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {scholarships.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-slate-400 py-12">No scholarships yet.</td>
                  </tr>
                ) : (
                  scholarships.map((s) => (
                    <tr key={s.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition">
                      <td className="px-5 py-3.5 font-medium text-slate-800 max-w-[200px] truncate">{s.name}</td>
                      <td className="px-4 py-3.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${TYPE_COLORS[s.type] ?? 'bg-slate-100 text-slate-600'}`}>
                          {TYPE_LABELS[s.type] ?? s.type}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-500">
                        {s.amount ? `A$${Number(s.amount).toLocaleString()}` : '—'}
                      </td>
                      <td className="px-4 py-3.5 text-slate-500">{uniName(s.university as number | null)}</td>
                      <td className="px-4 py-3.5 text-slate-500 text-xs">
                        {s.deadline ? new Date(s.deadline).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(s)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 transition"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(s.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <CrudModal
        open={modal !== null}
        title={modal === 'edit' ? 'Edit Scholarship' : 'Add Scholarship'}
        onClose={() => setModal(null)}
        onSave={handleSave}
        saving={saving}
      >
        {formEl}
      </CrudModal>

      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="font-bold text-slate-800 mb-2">Delete Scholarship?</h3>
            <p className="text-sm text-slate-500 mb-5">This cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl transition">Cancel</button>
              <button
                onClick={() => deleteMutation.mutate(deleteId!)}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition disabled:opacity-60"
              >
                {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
