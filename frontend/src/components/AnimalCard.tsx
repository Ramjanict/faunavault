'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Trash2, AlertCircle } from 'lucide-react';
import { Animal } from '../types';

interface AnimalCardProps {
  animal: Animal;
  onDelete: (id: string) => Promise<void>;
}

export const AnimalCard: React.FC<AnimalCardProps> = ({ animal, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(animal.id);
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="group relative w-[180px] sm:w-[210px] flex flex-col items-center gap-2.5 p-3 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-950/20">
      {/* Category Badge */}
      <span className="self-start text-[11px] font-medium tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        {animal.category?.name || 'Uncategorized'}
      </span>

      {/* Image Container */}
      <div className="relative w-full h-[190px] rounded-xl overflow-hidden bg-[#0a0a0a] border border-zinc-800/60 flex items-center justify-center">
        {animal.imageUrl ? (
          <Image
            src={animal.imageUrl}
            alt={animal.name}
            fill
            sizes="(max-width: 768px) 180px, 210px"
            className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            priority={false}
          />
        ) : (
          <div className="text-zinc-600 text-xs">No image</div>
        )}

        {/* Delete action button on hover */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setShowConfirm(true)}
            className="p-1.5 rounded-lg bg-black/70 hover:bg-rose-500 text-zinc-400 hover:text-white transition-colors backdrop-blur-sm"
            title="Delete animal"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Animal Name */}
      <h3 className="font-semibold text-sm tracking-wider uppercase text-zinc-100 text-center truncate w-full px-1">
        {animal.name}
      </h3>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="absolute inset-0 z-20 bg-black/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-3 text-center gap-2 animate-fadeIn">
          <AlertCircle className="w-6 h-6 text-rose-400" />
          <p className="text-xs text-zinc-300">Delete {animal.name}?</p>
          <div className="flex gap-2 mt-1">
            <button
              onClick={() => setShowConfirm(false)}
              className="px-2.5 py-1 text-xs rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-2.5 py-1 text-xs rounded-md bg-rose-600 hover:bg-rose-500 text-white font-medium"
            >
              {isDeleting ? '...' : 'Delete'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
