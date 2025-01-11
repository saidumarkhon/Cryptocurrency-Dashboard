import React from 'react';

const SingleCoinSkeleton = () => {
  return (
    <div className="flex flex-col lg:flex-row p-4 relative overflow-hidden">
      {/* Left section */}
      <div className="w-full lg:w-2/5 pr-4 text-white border-b-2 lg:border-r-2 lg:border-b-0 border-gray-700/30 px-5 pb-8">
        {/* Coin image skeleton with subtle gradient */}
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full m-auto shadow-lg" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
        </div>
        
        {/* Coin name skeleton */}
        <div className="relative mt-6">
          <div className="h-8 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg w-48 mx-auto" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
        </div>
        
        {/* Stats skeletons */}
        <div className="space-y-6 mt-8">
          {/* Rank */}
          <div className="flex items-center gap-3">
            <div className="w-20 h-5 bg-gradient-to-r from-gray-700 to-gray-600 rounded-md" />
            <div className="flex-1 h-5 bg-gradient-to-r from-gray-700 to-gray-600 rounded-md max-w-[120px]" />
          </div>
          
          {/* Price */}
          <div className="flex items-center gap-3">
            <div className="w-24 h-5 bg-gradient-to-r from-gray-700 to-gray-600 rounded-md" />
            <div className="flex-1 h-5 bg-gradient-to-r from-gray-700 to-gray-600 rounded-md max-w-[160px]" />
          </div>
          
          {/* Market Cap */}
          <div className="flex items-center gap-3">
            <div className="w-24 h-5 bg-gradient-to-r from-gray-700 to-gray-600 rounded-md" />
            <div className="flex-1 h-5 bg-gradient-to-r from-gray-700 to-gray-600 rounded-md max-w-[180px]" />
          </div>
        </div>
      </div>

      {/* Right section */}
      <div className="w-full lg:w-3/5 px-4 mt-8 lg:mt-0">
        {/* Chart title skeleton */}
        <div className="relative mb-6">
          <div className="h-7 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg w-64" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
        </div>
        
        {/* Chart skeleton with gradient overlay */}
        <div className="relative">
          <div className="h-[300px] bg-gradient-to-br from-gray-700 to-gray-600 rounded-lg shadow-lg" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
        </div>
        
        {/* Timeframe buttons skeleton */}
        <div className="mt-6 flex flex-wrap gap-3 justify-center lg:justify-start">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="relative">
              <div className="w-28 h-9 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg shadow-md" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
            </div>
          ))}
        </div>
      </div>


    </div>
  );
};

export default SingleCoinSkeleton;