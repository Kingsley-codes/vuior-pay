import { ChevronLeft, ChevronRight } from "lucide-react";
import PageSizeSelect from "./PageSizeSelect";
export default function TablePagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  label,
}: {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  label?: string;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const pageNumbers = [...new Set([1, pages, page - 1, page, page + 1])]
    .filter((number) => number > 0 && number <= pages)
    .sort((a, b) => a - b);
  return (
    <footer className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 text-sm text-slate-500 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-6">
      <span aria-live="polite">
        Showing {total ? (page - 1) * pageSize + 1 : 0} to{" "}
        {Math.min(page * pageSize, total)} of {total}
        {label ? ` ${label}` : ""}
      </span>
      <nav
        aria-label={label ? `${label} pagination` : "Table pagination"}
        className="flex gap-1"
      >
        <button
          type="button"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="grid size-8 place-items-center rounded border disabled:opacity-40"
        >
          <ChevronLeft size={16} />
        </button>
        {pageNumbers.map((number) => (
          <button
            key={number}
            type="button"
            aria-label={`Page ${number}`}
            aria-current={number === page ? "page" : undefined}
            onClick={() => onPageChange(number)}
            className={`grid size-8 place-items-center rounded ${number === page ? "bg-emerald-600 text-white" : "border"}`}
          >
            {number}
          </button>
        ))}
        <button
          type="button"
          aria-label="Next page"
          disabled={page >= pages}
          onClick={() => onPageChange(page + 1)}
          className="grid size-8 place-items-center rounded border disabled:opacity-40"
        >
          <ChevronRight size={16} />
        </button>
      </nav>
      <PageSizeSelect value={pageSize} onChange={onPageSizeChange} />
    </footer>
  );
}
