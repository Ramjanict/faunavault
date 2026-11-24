'use client';

import React, { useState, useEffect } from 'react';
import { X, FolderPlus } from 'lucide-react';
import toast from 'react-hot-toast';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
}

export const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = categoryName.trim();
    if (!trimmed) { toast.error('Please provide a category name'); return; }

    try {
      setLoading(true);
      await onSubmit(trimmed);
      setCategoryName('');
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md glass rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/40 animate-fadeInScale"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/[0.06] text-zinc-500 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-7">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500/15 to-purple-500/10 border border-indigo-500/20">
            <FolderPlus className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">New Category</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Classify your animal collection</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
              Category Name
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="e.g. Amphibian, Reptile, Mammal"
              required
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-zinc-800/80 hover:border-zinc-700 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/15 text-sm text-white placeholder-zinc-600 outline-none transition-all duration-300"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-bold text-sm transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 btn-press disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <FolderPlus className="w-4 h-4" />
                Create Category
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
