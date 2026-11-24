import React from 'react';

export const SkeletonCard: React.FC<{ index?: number }> = ({ index = 0 }) => {
  return (
    <div
      className="w-[180px] sm:w-[220px] flex flex-col rounded-2xl overflow-hidden bg-zinc-900/40 border border-zinc-800/40 animate-fadeIn"
      style={{ animationDelay: `${index * 0.06}s` }}
    >
      {/* Image placeholder */}
      <div className="w-full h-[200px] sm:h-[220px] animate-shimmer" />

      {/* Info bar placeholder */}
      <div className="px-3.5 py-3 space-y-2 bg-zinc-900/80 border-t border-zinc-800/50">
        <div className="h-4 w-4/5 rounded-md animate-shimmer" />
        <div className="h-2.5 w-2/5 rounded-md animate-shimmer" />
      </div>
    </div>
  );
};
