import { useState } from 'react';
import {
  UserCircleIcon,
  AcademicCapIcon,
  EnvelopeIcon,
  IdentificationIcon,
  GlobeAltIcon,
  ChartBarIcon,
  CalendarIcon,
  LanguageIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { profileApi } from '../../lib/api';

function ProfileAvatar({ firstName, lastName }: { firstName: string; lastName: string }) {
  const initials = `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase() || '?';
  return (
    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-300 flex items-center justify-center text-2xl font-bold text-slate-900 shadow-lg shadow-amber-200 flex-shrink-0">
      {initials}
    </div>
  );
}

function SectionHeader({ icon: Icon, label, color }: { icon: React.ElementType; label: string; color: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className={`p-2 rounded-xl ${color}`}>
        <Icon className="h-4 w-4 text-white" />
      </div>
      <h2 className="font-bold text-slate-700 text-sm uppercase tracking-wider">{label}</h2>
    </div>
  );
}

function Field({ label, icon: Icon, children }: { label: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1.5">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </label>
      {children}
    </div>
  );
}

export default function MyAccountPage() {
  const { user, refreshUser } = useAuth();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const profile = user?.student_profile;

  const [form, setForm] = useState({
    first_name: user?.first_name ?? '',
    last_name: user?.last_name ?? '',
    field_of_study: profile?.field_of_study ?? '',
    current_degree: profile?.current_degree ?? '',
    gpa: profile?.gpa ?? '',
    graduation_year: profile?.graduation_year?.toString() ?? '',
    target_level: profile?.target_level ?? '',
    ielts_score: profile?.ielts_score ?? '',
    gre_score: profile?.gre_score?.toString() ?? '',
    work_experience_years: profile?.work_experience_years?.toString() ?? '',
    preferred_intake: profile?.preferred_intake ?? '',
    bio: profile?.bio ?? '',
    country_of_origin: profile?.country_of_origin ?? '',
  });

  // Profile completion score
  const fields = [
    form.first_name, form.last_name, form.field_of_study, form.current_degree,
    form.gpa, form.graduation_year, form.target_level, form.country_of_origin,
  ];
  const completionPct = Math.round((fields.filter(Boolean).length / fields.length) * 100);

  function handle(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setSaved(false);
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError('');
    try {
      await profileApi.update({
        first_name: form.first_name,
        last_name: form.last_name,
        field_of_study: form.field_of_study,
        current_degree: form.current_degree,
        gpa: form.gpa ? (form.gpa as string) : null,
        graduation_year: form.graduation_year ? parseInt(form.graduation_year) : null,
        target_level: (form.target_level as '' | 'masters' | 'phd') || '',
        ielts_score: form.ielts_score ? (form.ielts_score as string) : null,
        gre_score: form.gre_score ? parseInt(form.gre_score) : null,
        work_experience_years: form.work_experience_years ? parseInt(form.work_experience_years) : null,
        preferred_intake: form.preferred_intake,
        bio: form.bio,
        country_of_origin: form.country_of_origin,
      });
      await refreshUser();
      setSaved(true);
    } catch {
      setError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    'w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all bg-white placeholder-slate-300';

  return (
    <div className="max-w-2xl">
      {/* Profile header card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 p-6 mb-6 text-white">
        {/* Decorative glow */}
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl" />

        <div className="relative flex items-start gap-5">
          <ProfileAvatar firstName={form.first_name} lastName={form.last_name} />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold">
              {form.first_name || form.last_name
                ? `${form.first_name} ${form.last_name}`.trim()
                : 'Your Profile'}
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">{user?.email}</p>
            {form.field_of_study && (
              <span className="inline-block mt-2 text-xs font-medium bg-primary/20 text-amber-300 px-2.5 py-0.5 rounded-full">
                {form.field_of_study}
              </span>
            )}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-slate-400">Profile completion</span>
                <span className="text-xs font-bold text-amber-300">{completionPct}%</span>
              </div>
              <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full transition-all duration-700"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Personal Info */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <SectionHeader icon={UserCircleIcon} label="Personal Info" color="bg-gradient-to-br from-blue-500 to-indigo-500" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="First Name" icon={IdentificationIcon}>
              <input
                type="text"
                value={form.first_name}
                onChange={(e) => handle('first_name', e.target.value)}
                className={inputClass}
                placeholder="First name"
              />
            </Field>
            <Field label="Last Name" icon={IdentificationIcon}>
              <input
                type="text"
                value={form.last_name}
                onChange={(e) => handle('last_name', e.target.value)}
                className={inputClass}
                placeholder="Last name"
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Email Address" icon={EnvelopeIcon}>
                <input
                  type="email"
                  value={user?.email ?? ''}
                  readOnly
                  className={`${inputClass} bg-slate-50 text-slate-400 cursor-not-allowed`}
                />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Country of Origin" icon={GlobeAltIcon}>
                <input
                  type="text"
                  value={form.country_of_origin}
                  onChange={(e) => handle('country_of_origin', e.target.value)}
                  className={inputClass}
                  placeholder="e.g. Sri Lanka"
                />
              </Field>
            </div>
          </div>
        </section>

        {/* Academic Profile */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <SectionHeader icon={AcademicCapIcon} label="Academic Profile" color="bg-gradient-to-br from-violet-500 to-purple-600" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Field of Study" icon={AcademicCapIcon}>
              <input
                type="text"
                value={form.field_of_study}
                onChange={(e) => handle('field_of_study', e.target.value)}
                className={inputClass}
                placeholder="e.g. Computer Science"
              />
            </Field>
            <Field label="Current Degree" icon={IdentificationIcon}>
              <input
                type="text"
                value={form.current_degree}
                onChange={(e) => handle('current_degree', e.target.value)}
                className={inputClass}
                placeholder="e.g. Bachelor of Engineering"
              />
            </Field>
            <Field label="GPA" icon={ChartBarIcon}>
              <input
                type="number"
                step="0.01"
                min="0"
                max="4"
                value={form.gpa}
                onChange={(e) => handle('gpa', e.target.value)}
                className={inputClass}
                placeholder="e.g. 3.75"
              />
            </Field>
            <Field label="Graduation Year" icon={CalendarIcon}>
              <input
                type="number"
                min="2000"
                max="2030"
                value={form.graduation_year}
                onChange={(e) => handle('graduation_year', e.target.value)}
                className={inputClass}
                placeholder="e.g. 2025"
              />
            </Field>
            <Field label="Target Level" icon={AcademicCapIcon}>
              <select
                value={form.target_level}
                onChange={(e) => handle('target_level', e.target.value)}
                className={inputClass}
              >
                <option value="">Not specified</option>
                <option value="masters">Master's Degree</option>
                <option value="phd">PhD</option>
              </select>
            </Field>
            <Field label="Preferred Intake" icon={CalendarIcon}>
              <input
                type="text"
                value={form.preferred_intake}
                onChange={(e) => handle('preferred_intake', e.target.value)}
                className={inputClass}
                placeholder="e.g. Semester 1, 2026"
              />
            </Field>
          </div>
        </section>

        {/* Test Scores */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <SectionHeader icon={ChartBarIcon} label="Test Scores & Experience" color="bg-gradient-to-br from-emerald-500 to-teal-500" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="IELTS Score" icon={LanguageIcon}>
              <input
                type="number"
                step="0.5"
                min="0"
                max="9"
                value={form.ielts_score}
                onChange={(e) => handle('ielts_score', e.target.value)}
                className={inputClass}
                placeholder="e.g. 7.5"
              />
            </Field>
            <Field label="GRE Score" icon={ChartBarIcon}>
              <input
                type="number"
                min="260"
                max="340"
                value={form.gre_score}
                onChange={(e) => handle('gre_score', e.target.value)}
                className={inputClass}
                placeholder="e.g. 320"
              />
            </Field>
            <Field label="Work Experience (yrs)" icon={BriefcaseIcon}>
              <input
                type="number"
                min="0"
                max="50"
                value={form.work_experience_years}
                onChange={(e) => handle('work_experience_years', e.target.value)}
                className={inputClass}
                placeholder="e.g. 2"
              />
            </Field>
          </div>
        </section>

        {/* Bio */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <SectionHeader icon={DocumentTextIcon} label="Personal Statement" color="bg-gradient-to-br from-rose-400 to-pink-500" />
          <textarea
            rows={4}
            value={form.bio}
            onChange={(e) => handle('bio', e.target.value)}
            className={`${inputClass} resize-none`}
            placeholder="A short description about yourself, your goals, and why you want to study in Australia…"
          />
        </section>

        {/* Save bar */}
        <div className="flex items-center gap-4 py-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-500 hover:to-yellow-400 text-slate-900 font-bold px-7 py-3 rounded-xl transition-all shadow-md shadow-amber-200/50 disabled:opacity-60"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-700" />
                Saving…
              </>
            ) : 'Save Changes'}
          </button>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-semibold">
              <CheckCircleIcon className="h-4 w-4" />
              Profile saved!
            </span>
          )}
          {error && (
            <span className="text-sm text-rose-500 font-medium">{error}</span>
          )}
        </div>
      </form>
    </div>
  );
}
