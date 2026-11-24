import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="w-[180px] sm:w-[200px] flex flex-col items-center gap-3 p-3 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 animate-pulse">
      <div className="w-full h-[200px] bg-zinc-800/80 rounded-xl" />
      <div className="w-3/4 h-5 bg-zinc-800/80 rounded" />
      <div className="w-1/2 h-3 bg-zinc-800/50 rounded" />
    </div>
  );
};
