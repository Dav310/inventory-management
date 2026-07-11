import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, currentPage + 2);

      if (currentPage <= 3) {
        end = 5;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - 4;
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-5 pt-4 border-t border-slate-100 bg-white">
      <div className="text-xs font-semibold text-slate-500">
        Showing <span className="font-bold text-slate-800">{totalItems === 0 ? 0 : startIndex + 1}</span> to{" "}
        <span className="font-bold text-slate-800">{endIndex}</span> of{" "}
        <span className="font-bold text-slate-800">{totalItems}</span> entries
      </div>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
            currentPage === 1
              ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed"
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-[0.98]"
          }`}
        >
          Previous
        </button>

        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 flex items-center justify-center text-xs font-bold rounded-lg border transition-all cursor-pointer ${
              currentPage === page
                ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-[0.98]"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
            currentPage === totalPages
              ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed"
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-[0.98]"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};
