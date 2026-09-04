export default function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1 border-t border-neutral-100 px-5 py-3">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="rounded-lg px-3 py-1.5 text-xs font-semibold text-neutral-500 transition-colors hover:bg-brand-50 hover:text-brand-700 disabled:opacity-30 disabled:hover:bg-transparent"
      >
        이전
      </button>
      <span className="px-2 text-xs font-medium text-neutral-400">
        {page} / {totalPages}
      </span>
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        className="rounded-lg px-3 py-1.5 text-xs font-semibold text-neutral-500 transition-colors hover:bg-brand-50 hover:text-brand-700 disabled:opacity-30 disabled:hover:bg-transparent"
      >
        다음
      </button>
    </div>
  );
}
