import PageSizeSelect from "./PageSizeSelect";
export default function TablePagination({ page, pageSize, total, onPageChange, onPageSizeChange }: { page: number; pageSize: number; total: number; onPageChange: (page: number) => void; onPageSizeChange: (size: number) => void }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  return <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e7ecea] px-4 py-3 text-xs text-[#718097]">
    <span aria-live="polite">Showing {total ? (page - 1) * pageSize + 1 : 0}�{Math.min(page * pageSize, total)} of {total}</span>
    <nav aria-label="Table pagination" className="flex flex-wrap items-center gap-2">
      <PageSizeSelect value={pageSize} onChange={onPageSizeChange} />
      <button type="button" aria-label="Previous page" disabled={page <= 1} onClick={() => onPageChange(page - 1)} className="rounded border px-3 py-2 disabled:opacity-40">Previous</button>
      <span>Page {page} of {pages}</span>
      <button type="button" aria-label="Next page" disabled={page >= pages} onClick={() => onPageChange(page + 1)} className="rounded border px-3 py-2 disabled:opacity-40">Next</button>
    </nav>
  </footer>;
}
