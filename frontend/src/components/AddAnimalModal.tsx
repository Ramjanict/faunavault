'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, UploadCloud, Sparkles, ImageIcon, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Category } from '../types';
import CommonSelect, { SelectOption } from './ui/CommonSelect';

interface AddAnimalModalProps {
  isOpen: boolean;
  categories: Category[];
  onClose: () => void;
  onSubmit: (data: { name: string; categoryId: string; file: File }) => Promise<void>;
}

export const AddAnimalModal: React.FC<AddAnimalModalProps> = ({
  isOpen,
  categories,
  onClose,
  onSubmit,
}) => {
  const [animalName, setAnimalName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categoryOptions: SelectOption<string>[] = categories.map((cat) => ({
    label: cat.name,
    value: cat.id,
  }));

  useEffect(() => {
    if (categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId]);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = animalName.trim();
    if (!trimmed) { toast.error('Please provide an animal name'); return; }
    if (!categoryId) { toast.error('Please select a category'); return; }
    if (!selectedFile) { toast.error('Please upload an image'); return; }

    try {
      setLoading(true);
      await onSubmit({ name: trimmed, categoryId, file: selectedFile });
      setAnimalName(''); setSelectedFile(null); setPreviewUrl(null);
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload animal');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg glass rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/40 max-h-[90vh] overflow-y-auto animate-fadeInScale"
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
          <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/15 to-teal-500/10 border border-emerald-500/20">
            <Sparkles className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Add New Animal</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Upload to Cloudinary CDN</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Animal Name */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
              Animal Name
            </label>
            <input
              type="text"
              value={animalName}
              onChange={(e) => setAnimalName(e.target.value)}
              placeholder="e.g. Royal Bengal Tiger"
              required
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-zinc-800/80 hover:border-zinc-700 focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/15 text-sm text-white placeholder-zinc-600 outline-none transition-all duration-300"
            />
          </div>

          {/* Category Select */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
              Category
            </label>
            <CommonSelect
              value={categoryId}
              item={categoryOptions}
              w="100%"
              onValueChange={(val) => setCategoryId(val)}
              disabled={loading}
              placeholder="Select a category"
              className="w-full"
            />
          </div>

          {/* Image Upload Zone */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
              Image
            </label>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`w-full min-h-[180px] p-4 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer flex flex-col items-center justify-center group ${
                dragOver
                  ? 'border-emerald-400/60 bg-emerald-500/[0.06] scale-[1.01]'
                  : previewUrl
                    ? 'border-emerald-500/30 bg-emerald-500/[0.03]'
                    : 'border-zinc-800/60 bg-white/[0.02] hover:border-zinc-700/80 hover:bg-white/[0.04]'
              }`}
            >
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

              {previewUrl ? (
                <div className="relative w-full flex flex-col items-center gap-3">
                  <div className="relative w-full h-[140px] flex items-center justify-center">
                    <img src={previewUrl} alt="Preview" className="max-h-full max-w-full object-contain rounded-xl shadow-lg" />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="font-medium">{selectedFile?.name}</span>
                  </div>
                  <span className="text-[10px] text-zinc-600 group-hover:text-zinc-400 transition">Click to change</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 text-zinc-500 group-hover:text-zinc-400 transition">
                  <div className="p-4 rounded-2xl bg-zinc-800/50 group-hover:bg-zinc-800 transition">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-zinc-300">
                      {dragOver ? 'Drop it here!' : 'Click to browse or drag & drop'}
                    </p>
                    <p className="text-[11px] text-zinc-600 mt-1">PNG, JPG, WEBP, GIF up to 10MB</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-bold text-sm transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 btn-press disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Uploading to Cloudinary...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Create Animal
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
