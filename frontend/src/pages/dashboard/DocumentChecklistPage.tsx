import { useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowUpTrayIcon,
  TrashIcon,
  CheckCircleIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';
import { documentsApi } from '../../lib/api';
import type { DocType, DocumentItem } from '../../types/api';

const DOC_TYPES: { type: DocType; label: string; description: string; color: string; iconBg: string }[] = [
  { type: 'sop', label: 'Statement of Purpose', description: 'Personal statement explaining your goals', color: 'from-violet-500 to-indigo-400', iconBg: 'bg-violet-100 text-violet-600' },
  { type: 'transcript', label: 'Academic Transcript', description: 'Official university transcripts', color: 'from-blue-500 to-sky-400', iconBg: 'bg-blue-100 text-blue-600' },
  { type: 'cv', label: 'CV / Resume', description: 'Up-to-date curriculum vitae', color: 'from-emerald-500 to-teal-400', iconBg: 'bg-emerald-100 text-emerald-600' },
  { type: 'passport', label: 'Passport', description: 'Valid passport copy', color: 'from-amber-400 to-yellow-300', iconBg: 'bg-amber-100 text-amber-600' },
  { type: 'visa', label: 'Visa Documents', description: 'Student visa or visa application materials', color: 'from-rose-400 to-pink-400', iconBg: 'bg-rose-100 text-rose-600' },
  { type: 'other', label: 'Other Documents', description: 'Any additional supporting documents', color: 'from-slate-400 to-slate-300', iconBg: 'bg-slate-100 text-slate-500' },
];

function DocTypeCard({
  docType,
  label,
  description,
  color,
  iconBg,
  items,
}: {
  docType: DocType;
  label: string;
  description: string;
  color: string;
  iconBg: string;
  items: DocumentItem[];
}) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useMutation({
    mutationFn: (file: File) => {
      const fd = new FormData();
      fd.append('doc_type', docType);
      fd.append('file', file);
      return documentsApi.upload(fd);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['documents'] }),
  });

  const toggleMutation = useMutation({
    mutationFn: (item: DocumentItem) =>
      documentsApi.updateStatus(item.id, item.status === 'complete' ? 'pending' : 'complete'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['documents'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => documentsApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['documents'] }),
  });

  const allComplete = items.length > 0 && items.every((i) => i.status === 'complete');

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all hover:shadow-md ${
      allComplete ? 'border-emerald-200' : 'border-slate-100'
    }`}>
      {/* Coloured top strip */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${allComplete ? 'from-emerald-400 to-teal-400' : color}`} />

      <div className="p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${allComplete ? 'bg-emerald-100' : iconBg.split(' ')[0]}`}>
            <DocumentTextIcon className={`h-5 w-5 ${allComplete ? 'text-emerald-600' : iconBg.split(' ')[1]}`} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 text-sm">{label}</h3>
            <p className="text-xs text-slate-400">{description}</p>
          </div>
        </div>
        {allComplete && <CheckCircleSolid className="h-5 w-5 text-emerald-500 shrink-0" />}
      </div>

      {items.length === 0 && (
        <p className="text-xs text-slate-400 mb-3 pl-1">No files uploaded yet</p>
      )}

      {items.length > 0 && (
        <ul className="space-y-2 mb-3">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2">
              <button
                onClick={() => toggleMutation.mutate(item)}
                disabled={toggleMutation.isPending}
                className="shrink-0"
                title={item.status === 'complete' ? 'Mark as pending' : 'Mark as complete'}
              >
                {item.status === 'complete' ? (
                  <CheckCircleSolid className="h-4 w-4 text-emerald-500" />
                ) : (
                  <CheckCircleIcon className="h-4 w-4 text-slate-300 hover:text-emerald-400 transition-colors" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                {item.file_url ? (
                  <a
                    href={item.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline truncate block"
                    title={item.file_url}
                  >
                    {item.file_url.split('/').pop() ?? 'View file'}
                  </a>
                ) : (
                  <span className="text-xs text-slate-400">No file</span>
                )}
                <span className="text-xs text-slate-300">
                  {new Date(item.uploaded_at).toLocaleDateString()}
                </span>
              </div>
              <button
                onClick={() => deleteMutation.mutate(item.id)}
                disabled={deleteMutation.isPending}
                className="p-1 text-slate-400 hover:text-rose-500 transition-colors shrink-0"
              >
                <TrashIcon className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-2">
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              uploadMutation.mutate(file);
              e.target.value = '';
            }
          }}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadMutation.isPending}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 border border-slate-200 hover:border-primary/40 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {uploadMutation.isPending ? (
            <div className="animate-spin rounded-full h-3 w-3 border-b border-primary" />
          ) : (
            <ArrowUpTrayIcon className="h-3.5 w-3.5" />
          )}
          Upload file
        </button>
      </div>
      </div>
    </div>
  );
}

export default function DocumentChecklistPage() {
  const { data: items, isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: documentsApi.list,
  });

  const uploadedCount = DOC_TYPES.filter((dt) => {
    const typeItems = items?.filter((i) => i.doc_type === dt.type) ?? [];
    return typeItems.length > 0;
  }).length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Document Checklist</h1>
      <p className="text-slate-500 mb-2">Upload and track all documents required for your applications.</p>

      {!isLoading && (
        <div className="flex items-center gap-2 mb-6">
          <div className="h-2.5 flex-1 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full transition-all duration-700"
              style={{ width: `${(uploadedCount / DOC_TYPES.length) * 100}%` }}
            />
          </div>
          <span className="text-xs font-medium text-gray-500 whitespace-nowrap">
            {uploadedCount} / {DOC_TYPES.length} types uploaded
          </span>
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
        </div>
      )}

      {!isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DOC_TYPES.map((dt) => (
            <DocTypeCard
              key={dt.type}
              docType={dt.type}
              label={dt.label}
              description={dt.description}
              color={dt.color}
              iconBg={dt.iconBg}
              items={items?.filter((i) => i.doc_type === dt.type) ?? []}
            />
          ))}
        </div>
      )}
    </div>
  );
}
