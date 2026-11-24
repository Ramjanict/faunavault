'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Trash2, AlertCircle, ExternalLink } from 'lucide-react';
import { Animal } from '../types';

interface AnimalCardProps {
  animal: Animal;
  onDelete: (id: string) => Promise<void>;
  index: number;
}

export const AnimalCard: React.FC<AnimalCardProps> = ({ animal, onDelete, index }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

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
    <div
      className="card-glow group relative w-[180px] sm:w-[220px] flex flex-col gap-0 rounded-2xl overflow-hidden bg-zinc-900/50 border border-zinc-800/60 animate-fadeIn"
      style={{ animationDelay: `${index * 0.04}s` }}
    >
      {/* ── Image Container ── */}
      <div className="relative w-full h-[200px] sm:h-[220px] overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-950">
        {/* Shimmer until loaded */}
        {!imageLoaded && animal.imageUrl && (
          <div className="absolute inset-0 animate-shimmer rounded-none" />
        )}

        {animal.imageUrl ? (
          <Image
            src={animal.imageUrl}
            alt={animal.name}
            fill
            sizes="(max-width: 768px) 180px, 220px"
            className={`object-contain p-3 transition-all duration-700 ${
              imageLoaded
                ? 'opacity-100 scale-100 group-hover:scale-110'
                : 'opacity-0 scale-95'
            }`}
            onLoad={() => setImageLoaded(true)}
            priority={index < 6}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-700">
            <span className="text-3xl">🐾</span>
          </div>
        )}

        {/* Category Badge - Floating */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className="inline-flex items-center text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-emerald-300 border border-emerald-500/20 shadow-lg">
            {animal.category?.name || 'Unknown'}
          </span>
        </div>

        {/* Action Buttons - Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
            <a
              href={animal.imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white transition btn-press"
              title="View full image"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={(e) => { e.stopPropagation(); setShowConfirm(true); }}
              className="p-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-rose-500/80 text-white transition btn-press"
              title="Delete animal"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Info Bar ── */}
      <div className="px-3.5 py-3 bg-zinc-900/80 border-t border-zinc-800/50">
        <h3 className="font-semibold text-[13px] tracking-wide uppercase text-zinc-100 truncate leading-tight">
          {animal.name}
        </h3>
        <p className="text-[10px] text-zinc-600 mt-0.5 tracking-wider">
          {new Date(animal.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* ── Delete Confirmation Overlay ── */}
      {showConfirm && (
        <div className="absolute inset-0 z-20 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-5 text-center gap-3 animate-fadeInScale">
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20">
            <AlertCircle className="w-7 h-7 text-rose-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-100">Delete this animal?</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">{animal.name} will be removed</p>
          </div>
          <div className="flex gap-2 mt-1 w-full">
            <button
              onClick={() => setShowConfirm(false)}
              className="flex-1 px-3 py-2 text-xs rounded-xl glass-light hover:bg-zinc-800 text-zinc-300 font-medium btn-press"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 px-3 py-2 text-xs rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold btn-press disabled:opacity-50"
            >
              {isDeleting ? (
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Deleting
                </span>
              ) : 'Delete'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
