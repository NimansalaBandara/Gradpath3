import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { adminApi } from '../../lib/adminApi';
import CrudModal from '../../components/admin/CrudModal';
import type { University } from '../../types/api';

type FormData = {
  name: string;
  city: string;
  country: string;
  world_ranking: string;
  description: string;
  website_url: string;
  logo_url: string;
};

const EMPTY: FormData = {
  name: '', city: '', country: 'Australia', world_ranking: '',
  description: '', website_url: '', logo_url: '',
};

function toFormData(u: University): FormData {
  return {
    name: u.name,
    city: u.city ?? '',
    country: u.country ?? 'Australia',
    world_ranking: u.world_ranking != null ? String(u.world_ranking) : '',
    description: u.description ?? '',
    website_url: u.website_url ?? '',
    logo_url: u.logo_url ?? '',
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

export default function AdminUniversitiesPage() {
  const queryClient = useQueryClient();
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [editing, setEditing] = useState<University | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-universities'],
    queryFn: adminApi.universities.list,
  });
  const universities = data?.results ?? [];

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-universities'] });
    queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
  };

  const createMutation = useMutation({
    mutationFn: adminApi.universities.create,
    onSuccess: () => { invalidate(); setModal(null); },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<University> }) =>
      adminApi.universities.update(id, data),
    onSuccess: () => { invalidate(); setModal(null); },
  });
  const deleteMutation = useMutation({
    mutationFn: adminApi.universities.remove,
    onSuccess: () => { invalidate(); setDeleteId(null); },
  });

  function openAdd() { setForm(EMPTY); setModal('add'); }
  function openEdit(u: University) { setEditing(u); setForm(toFormData(u)); setModal('edit'); }

  function handleSave() {
    const payload = {
      ...form,
      world_ranking: form.world_ranking !== '' ? Number(form.world_ranking) : null,
    };
    if (modal === 'edit' && editing) {
      updateMutation.mutate({ id: editing.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  }

  const saving = createMutation.isPending || updateMutation.isPending;
  const formEl = (
    <>
      <Field label="University Name *">
        <input className={inputCls} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="City">
          <input className={inputCls} value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
        </Field>
        <Field label="Country">
          <input className={inputCls} value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} />
        </Field>
      </div>
      <Field label="World Ranking">
        <input type="number" className={inputCls} value={form.world_ranking} onChange={e => setForm(f => ({ ...f, world_ranking: e.target.value }))} />
      </Field>
      <Field label="Website URL">
        <input className={inputCls} value={form.website_url} onChange={e => setForm(f => ({ ...f, website_url: e.target.value }))} />
      </Field>
      <Field label="Logo URL">
        <input className={inputCls} value={form.logo_url} onChange={e => setForm(f => ({ ...f, logo_url: e.target.value }))} />
      </Field>
      <Field label="Description">
        <textarea rows={3} className={inputCls} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
      </Field>
    </>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Universities</h1>
          <p className="text-slate-500 mt-0.5 text-sm">{universities.length} universities in the catalog.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-500 hover:to-yellow-400 text-slate-900 font-bold rounded-xl text-sm transition-all shadow-sm shadow-amber-200/50"
        >
          <PlusIcon className="h-4 w-4" />
          Add University
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
                  <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">University</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">City</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Country</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Ranking</th>
                  <th className="text-right text-xs font-semibold text-slate-500 px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {universities.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-slate-400 py-12">No universities yet.</td>
                  </tr>
                ) : (
                  universities.map((u) => (
                    <tr key={u.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition">
                      <td className="px-5 py-3.5 font-medium text-slate-800">{u.name}</td>
                      <td className="px-4 py-3.5 text-slate-500">{u.city}</td>
                      <td className="px-4 py-3.5 text-slate-500">{u.country}</td>
                      <td className="px-4 py-3.5 text-slate-500">
                        {u.world_ranking ? `#${u.world_ranking}` : '—'}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(u)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 transition"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(u.id)}
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
        title={modal === 'edit' ? 'Edit University' : 'Add University'}
        onClose={() => setModal(null)}
        onSave={handleSave}
        saving={saving}
      >
        {formEl}
      </CrudModal>

      {/* Delete confirm */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="font-bold text-slate-800 mb-2">Delete University?</h3>
            <p className="text-sm text-slate-500 mb-5">This will also remove all associated courses. This action cannot be undone.</p>
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
