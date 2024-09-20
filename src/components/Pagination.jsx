"use client";

import { Pagination } from "flowbite-react";

const customTheme = {
  base: "",
  layout: {
    table: {
      base: "text-sm text-[#87CEEB] dark:text-[#87CEEB]",
    },
  },
  pages: {
    base: "xs:mt-0 mt-2 mb-4 inline-flex items-center -space-x-px",
    showIcon: "inline-flex",
    previous: {
      base: "ml-0 rounded-full w-9 bg-transparent py-2 px-3 leading-tight text-[#87CEEB] enabled:hover:bg-[#3A3B3F]",
      icon: "h-5", 
    },
    next: {
      base: "rounded-full w-9 bg-transparent py-2 px-3 leading-tight text-[#87CEEB] enabled:hover:bg-[#3A3B3F]",
      icon: "h-5 ",
    },
    selector: {
      base: "w-9 bg-transparent py-2 leading-tight text-[#87CEEB] enabled:hover:bg-[#3A3B3F] enabled:hover:rounded-full ",
      active: "bg-[#3A3B3F] rounded-full",
    },
  },
}

export function CustomPagination({ totalPages, currentPage, onPageChange }) {
  return (
    <div className="flex overflow-x-auto sm:justify-center items-center">
      <Pagination
        theme={customTheme}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        showIcons
        previousLabel=""
        nextLabel=""
      />
    </div>
  );
}
