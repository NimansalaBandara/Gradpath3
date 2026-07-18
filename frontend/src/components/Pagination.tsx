import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface PaginationProps {
  page: number;
  count: number;
  pageSize?: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, count, pageSize = 20, onChange }: PaginationProps) {
  const totalPages = Math.ceil(count / pageSize);
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3 mt-8">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="p-2 rounded-xl border border-gray-200 hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </button>
      <span className="text-sm text-gray-600">
        Page <span className="font-semibold text-brand-text">{page}</span> of {totalPages}
      </span>
      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        className="p-2 rounded-xl border border-gray-200 hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        <ChevronRightIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
