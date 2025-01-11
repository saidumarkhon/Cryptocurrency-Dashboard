import React from 'react';

// Skeleton loader component for the table rows
const TableSkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="px-2 py-4">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        <div className="h-2 bg-gray-300 rounded w-20"></div>
      </div>
    </td>
    <td className="px-2 py-4">
      <div className="h-2 bg-gray-300 rounded w-16"></div>
    </td>
    <td className="px-2 py-4">
      <div className="h-2 bg-gray-300 rounded w-12"></div>
    </td>
    {/* Hide Market Cap cell on small screens */}
    <td className="hidden sm:table-cell px-2 py-4">
      <div className="h-2 bg-gray-300 rounded w-24"></div>
    </td>
  </tr>
);

const TableSkeleton = ({ rows = 10 }) => (
  <div className='w-full flex justify-center'>
    <table className="min-w-full text-left text-sm text-transparent dark:text-gray-400">
      <thead className="text-xs uppercase text-white bg-sky-300 dark:bg-gray-700">
        <tr>
          <th className="px-2 py-3 sm:px-4 md:px-6">Coin</th>
          <th className="px-2 py-3 sm:px-4 md:px-6">Price</th>
          <th className="px-2 py-3 sm:px-4 md:px-6">24h Change</th>
          {/* Hide Market Cap header on small screens */}
          <th className="hidden sm:table-cell px-2 py-3 sm:px-4 md:px-6">Market Cap</th> 
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, index) => (
          <TableSkeletonRow key={index} />
        ))}
      </tbody>
    </table>
  </div>
);

export default TableSkeleton;
