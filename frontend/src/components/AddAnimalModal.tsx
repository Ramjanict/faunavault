'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, UploadCloud, Image as ImageIcon, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { Category } from '../types';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file (PNG, JPG, WEBP, etc.)');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please drop a valid image file');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = animalName.trim();
    if (!trimmed) {
      toast.error('Please provide an animal name');
      return;
    }
    if (!categoryId) {
      toast.error('Please select a category');
      return;
    }
    if (!selectedFile) {
      toast.error('Please upload an image for the animal');
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        name: trimmed,
        categoryId,
        file: selectedFile,
      });
      // Reset form
      setAnimalName('');
      setSelectedFile(null);
      setPreviewUrl(null);
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload animal');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white capitalize">Add Animal</h2>
            <p className="text-xs text-zinc-400">Upload animal with Cloudinary & Neon DB</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Animal Name */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5 uppercase tracking-wider">
              Animal Name
            </label>
            <input
              type="text"
              value={animalName}
              onChange={(e) => setAnimalName(e.target.value)}
              placeholder="e.g. Royal Bengal Tiger, Bald Eagle"
              required
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl bg-zinc-800/80 border border-zinc-700/60 text-white placeholder-zinc-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition text-sm"
            />
          </div>

          {/* Category Select */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5 uppercase tracking-wider">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl bg-zinc-800/80 border border-zinc-700/60 text-white outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition text-sm cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-zinc-900 text-white">
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload Zone */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5 uppercase tracking-wider">
              Animal Image (Cloudinary)
            </label>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="w-full min-h-[160px] p-4 rounded-2xl border-2 border-dashed border-zinc-700/80 hover:border-emerald-500/60 bg-zinc-800/40 hover:bg-zinc-800/70 transition flex flex-col items-center justify-center cursor-pointer text-center relative group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {previewUrl ? (
                <div className="relative w-full h-[140px] flex items-center justify-center">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-full max-w-full object-contain rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition">
                    <span className="text-xs text-white font-medium bg-zinc-900/80 px-3 py-1.5 rounded-full">
                      Change Image
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-zinc-400">
                  <div className="p-3 rounded-full bg-zinc-800 text-zinc-300">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-medium text-zinc-200">
                    Click to browse or drag and drop image
                  </p>
                  <p className="text-[11px] text-zinc-500">PNG, JPG, WEBP, GIF up to 10MB</p>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-3 py-3.5 px-4 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Uploading to Cloudinary...
              </>
            ) : (
              'Create Animal'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
