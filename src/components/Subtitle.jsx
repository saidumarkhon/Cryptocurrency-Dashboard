import React from 'react';

export default function Subtitle({ subtitle }) {
  return (
    <div className="flex justify-center p-4 md:p-6 lg:p-8">
      <h1 className="text-white text-center text-xl md:text-2xl lg:text-3xl font-semibold">
        {subtitle}
      </h1>
    </div>
  );
}

