import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { adminApi } from '../../lib/adminApi';
import CrudModal from '../../components/admin/CrudModal';
import type { Course } from '../../types/api';

type FormData = {
  title: string;
  university: string;
  level: 'masters' | 'phd';
  field: string;
  duration: string;
  tuition_fee: string;
  requirements: string;
  description: string;
  application_url: string;
  deadline: string;
};

const EMPTY: FormData = {
  title: '', university: '', level: 'masters', field: '',
  duration: '', tuition_fee: '', requirements: '', description: '', application_url: '',
  deadline: '',
};

function toFormData(c: Course): FormData {
  return {
    title: c.title,
    university: String(c.university),
    level: c.level,
    field: c.field ?? '',
    duration: c.duration ?? '',
    tuition_fee: c.tuition_fee != null ? String(c.tuition_fee) : '',
    requirements: c.requirements ?? '',
    description: c.description ?? '',
    application_url: c.application_url ?? '',
    deadline: c.deadline ?? '',
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

export default function AdminCoursesPage() {
  const queryClient = useQueryClient();
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [editing, setEditing] = useState<Course | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data: courseData, isLoading } = useQuery({
    queryKey: ['admin-courses'],
    queryFn: adminApi.courses.list,
  });
  const { data: uniData } = useQuery({
    queryKey: ['admin-universities'],
    queryFn: adminApi.universities.list,
  });
  const courses = courseData?.results ?? [];
  const universities = uniData?.results ?? [];

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
    queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
  };

  const createMutation = useMutation({
    mutationFn: adminApi.courses.create,
    onSuccess: () => { invalidate(); setModal(null); },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Course> }) =>
      adminApi.courses.update(id, data),
    onSuccess: () => { invalidate(); setModal(null); },
  });
  const deleteMutation = useMutation({
    mutationFn: adminApi.courses.remove,
    onSuccess: () => { invalidate(); setDeleteId(null); },
  });

  function openAdd() { setForm(EMPTY); setModal('add'); }
  function openEdit(c: Course) { setEditing(c); setForm(toFormData(c)); setModal('edit'); }

  function handleSave() {
    const payload = {
      ...form,
      university: Number(form.university),
      tuition_fee: form.tuition_fee !== '' ? Number(form.tuition_fee) : null,
      deadline: form.deadline || null,
    };
    if (modal === 'edit' && editing) {
      updateMutation.mutate({ id: editing.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  }

  const saving = createMutation.isPending || updateMutation.isPending;

  const uniName = (id: number | string) =>
    universities.find(u => u.id === Number(id))?.name ?? String(id);

  const levelBadge = (level: string) => (
    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
      level === 'phd' ? 'bg-violet-100 text-violet-700' : 'bg-blue-100 text-blue-700'
    }`}>
      {level === 'phd' ? 'PhD' : "Master's"}
    </span>
  );

  const formEl = (
    <>
      <Field label="Course Title *">
        <input className={inputCls} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
      </Field>
      <Field label="University *">
        <select className={inputCls} value={form.university} onChange={e => setForm(f => ({ ...f, university: e.target.value }))}>
          <option value="">Select university…</option>
          {universities.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Level">
          <select className={inputCls} value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value as 'masters' | 'phd' }))}>
            <option value="masters">Master's</option>
            <option value="phd">PhD</option>
          </select>
        </Field>
        <Field label="Field">
          <input className={inputCls} value={form.field} onChange={e => setForm(f => ({ ...f, field: e.target.value }))} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Duration">
          <input className={inputCls} placeholder="e.g. 2 years" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} />
        </Field>
        <Field label="Tuition Fee (AUD)">
          <input type="number" className={inputCls} value={form.tuition_fee} onChange={e => setForm(f => ({ ...f, tuition_fee: e.target.value }))} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Application URL">
          <input className={inputCls} value={form.application_url} onChange={e => setForm(f => ({ ...f, application_url: e.target.value }))} />
        </Field>
        <Field label="Application Deadline">
          <input type="date" className={inputCls} value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} />
        </Field>
      </div>
      <Field label="Requirements">
        <textarea rows={2} className={inputCls} value={form.requirements} onChange={e => setForm(f => ({ ...f, requirements: e.target.value }))} />
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
          <h1 className="text-2xl font-black text-slate-800">Courses</h1>
          <p className="text-slate-500 mt-0.5 text-sm">{courses.length} courses in the catalog.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-500 hover:to-yellow-400 text-slate-900 font-bold rounded-xl text-sm transition-all shadow-sm shadow-amber-200/50"
        >
          <PlusIcon className="h-4 w-4" />
          Add Course
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
                  <th className="text-left text-xs font-semibold text-slate-500 px-5 py-3">Course</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">University</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Level</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Field</th>
                  <th className="text-left text-xs font-semibold text-slate-500 px-4 py-3">Fee</th>
                  <th className="text-right text-xs font-semibold text-slate-500 px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-slate-400 py-12">No courses yet.</td>
                  </tr>
                ) : (
                  courses.map((c) => (
                    <tr key={c.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition">
                      <td className="px-5 py-3.5 font-medium text-slate-800 max-w-[220px] truncate">{c.title}</td>
                      <td className="px-4 py-3.5 text-slate-500 max-w-[160px] truncate">{uniName(c.university)}</td>
                      <td className="px-4 py-3.5">{levelBadge(c.level)}</td>
                      <td className="px-4 py-3.5 text-slate-500">{c.field}</td>
                      <td className="px-4 py-3.5 text-slate-500">
                        {c.tuition_fee ? `A$${Number(c.tuition_fee).toLocaleString()}` : '—'}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(c)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 transition"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(c.id)}
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
        title={modal === 'edit' ? 'Edit Course' : 'Add Course'}
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
            <h3 className="font-bold text-slate-800 mb-2">Delete Course?</h3>
            <p className="text-sm text-slate-500 mb-5">Removing this course will also remove it from all student trackers. Cannot be undone.</p>
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
