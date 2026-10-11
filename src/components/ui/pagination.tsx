export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  itemLabel = 'items',
  className = '',
}: PaginationProps) {
  const safeTotalPages = Math.max(1, totalPages);
  const startIndex = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate pagination items with smart ellipsis
  const getPageNumbers = (): (number | 'ellipsis-start' | 'ellipsis-end')[] => {
    if (safeTotalPages <= 7) {
      return Array.from({ length: safeTotalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, 'ellipsis-end', safeTotalPages];
    }

    if (currentPage >= safeTotalPages - 3) {
      return [
        1,
        'ellipsis-start',
        safeTotalPages - 4,
        safeTotalPages - 3,
        safeTotalPages - 2,
        safeTotalPages - 1,
        safeTotalPages,
      ];
    }

    return [
      1,
      'ellipsis-start',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      'ellipsis-end',
      safeTotalPages,
    ];
  };

  const pages = getPageNumbers();

  return (
    <div
      className={`p-3 border-t border-zinc-100 flex flex-col sm:flex-row justify-between items-center gap-3 bg-zinc-50/50 text-[11px] text-zinc-500 ${className}`}
    >
      {/* Left info summary */}
      <div>
        Showing{' '}
        <span className="font-semibold text-zinc-900">{startIndex}</span>
        {totalItems > 0 && startIndex !== endIndex && (
          <>
            –<span className="font-semibold text-zinc-900">{endIndex}</span>
          </>
        )}{' '}
        of <span className="font-semibold text-zinc-900">{totalItems}</span> {itemLabel}
      </div>

      {/* Right pagination controls */}
      <div className="flex items-center gap-1.5">
        {/* Previous button */}
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="inline-flex items-center justify-center px-2.5 h-7 rounded-[6px] text-[11px] font-medium text-zinc-700 bg-white border border-zinc-200/80 hover:bg-zinc-100 hover:text-zinc-900 active:bg-zinc-200 disabled:opacity-40 disabled:pointer-events-none disabled:hover:bg-white shadow-2xs transition-all cursor-pointer"
        >
          Previous
        </button>

        {/* Numbered Page Buttons */}
        <div className="flex items-center gap-1">
          {pages.map((item, idx) => {
            if (item === 'ellipsis-start' || item === 'ellipsis-end') {
              return (
                <span
                  key={`${item}-${idx}`}
                  className="min-w-6 h-7 flex items-center justify-center text-[11px] text-zinc-400 select-none"
                >
                  …
                </span>
              );
            }

            const pageNum = item as number;
            const isActive = pageNum === currentPage;

            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                aria-current={isActive ? 'page' : undefined}
                className={`min-w-7 h-7 px-2 rounded-[6px] text-[11px] flex items-center justify-center transition-all cursor-pointer ${isActive
                    ? 'bg-zinc-900 text-white font-semibold shadow-xs'
                    : 'text-zinc-600 bg-white border border-zinc-200/70 hover:bg-zinc-100 hover:text-zinc-900 hover:border-zinc-300 font-medium shadow-2xs'
                  }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next button */}
        <button
          type="button"
          onClick={() => onPageChange(Math.min(safeTotalPages, currentPage + 1))}
          disabled={currentPage >= safeTotalPages}
          className="inline-flex items-center justify-center px-2.5 h-7 rounded-[6px] text-[11px] font-medium text-zinc-700 bg-white border border-zinc-200/80 hover:bg-zinc-100 hover:text-zinc-900 active:bg-zinc-200 disabled:opacity-40 disabled:pointer-events-none disabled:hover:bg-white shadow-2xs transition-all cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
}
