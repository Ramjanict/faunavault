'use client';

import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Header } from '../components/Header';
import { AnimalCard } from '../components/AnimalCard';
import { SkeletonCard } from '../components/SkeletonCard';
import { AddAnimalModal } from '../components/AddAnimalModal';
import { AddCategoryModal } from '../components/AddCategoryModal';
import { api } from '../services/api';
import { Category, Animal } from '../types';
import { PawPrint, PlusCircle, SearchX, Inbox } from 'lucide-react';

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [isAddAnimalOpen, setIsAddAnimalOpen] = useState<boolean>(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState<boolean>(false);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (err: any) {
      console.error('Failed to load categories:', err);
    }
  }, []);

  const fetchAnimals = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getAnimals(selectedCategoryId, searchQuery);
      setAnimals(data);
    } catch (err: any) {
      toast.error('Unable to connect to backend');
      console.error('Failed to load animals:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategoryId, searchQuery]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);
  useEffect(() => { fetchAnimals(); }, [fetchAnimals]);

  const handleAddCategory = async (name: string) => {
    const newCategory = await api.createCategory(name);
    toast.success(`Category "${newCategory.name}" created!`);
    await fetchCategories();
  };

  const handleAddAnimal = async ({ name, categoryId, file }: { name: string; categoryId: string; file: File }) => {
    const newAnimal = await api.createAnimal({ name, categoryId, file });
    toast.success(`"${newAnimal.name}" added successfully!`);
    await Promise.all([fetchCategories(), fetchAnimals()]);
  };

  const handleDeleteAnimal = async (id: string) => {
    try {
      await api.deleteAnimal(id);
      toast.success('Animal removed');
      setAnimals((prev) => prev.filter((a) => a.id !== id));
      await fetchCategories();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  const totalCount = categories.reduce((acc, cat) => acc + (cat._count?.animals || 0), 0);

  return (
    <main className="relative min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col pb-20">
      <Header
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
        totalAnimalCount={totalCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenAddAnimal={() => setIsAddAnimalOpen(true)}
        onOpenAddCategory={() => setIsAddCategoryOpen(true)}
      />

      {/* ── Gallery Section ── */}
      <section className="flex-1 mt-4">
        {loading ? (
          /* ── Loading Skeletons ── */
          <div className="flex flex-wrap items-start justify-center gap-5 sm:gap-6 py-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <SkeletonCard key={idx} index={idx} />
            ))}
          </div>
        ) : animals.length > 0 ? (
          /* ── Animal Grid ── */
          <div className="flex flex-wrap items-start justify-center gap-5 sm:gap-6 py-6">
            {animals.map((animal, idx) => (
              <AnimalCard
                key={animal.id}
                animal={animal}
                onDelete={handleDeleteAnimal}
                index={idx}
              />
            ))}
          </div>
        ) : (
          /* ── Empty State ── */
          <div className="flex flex-col items-center justify-center py-24 text-center gap-5 animate-fadeIn">
            <div className="relative">
              <div className="p-6 rounded-3xl glass animate-pulseGlow">
                {searchQuery ? (
                  <SearchX className="w-12 h-12 text-zinc-600" />
                ) : (
                  <PawPrint className="w-12 h-12 text-zinc-600" />
                )}
              </div>
              {/* Decorative ring */}
              <div className="absolute inset-0 rounded-3xl border border-zinc-800/40 scale-[1.15] opacity-50" />
            </div>
            <div className="max-w-sm">
              <h3 className="text-lg font-bold text-zinc-200">
                {searchQuery ? 'No results found' : 'No animals yet'}
              </h3>
              <p className="text-sm text-zinc-500 mt-1.5 leading-relaxed">
                {searchQuery
                  ? `Nothing matches "${searchQuery}". Try a different search term.`
                  : 'Your collection is empty. Start by adding your first animal with an image!'}
              </p>
            </div>
            {!searchQuery && (
              <button
                onClick={() => setIsAddAnimalOpen(true)}
                className="mt-2 flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-bold text-sm transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 btn-press"
              >
                <PlusCircle className="w-4.5 h-4.5" />
                Add Your First Animal
              </button>
            )}
          </div>
        )}
      </section>

      {/* ── Footer ── */}
      <footer className="mt-auto pt-10 pb-6 flex items-center justify-center">
        <p className="text-[11px] text-zinc-700 tracking-wider">
          Built with <span className="text-emerald-600">NestJS</span> · <span className="text-cyan-600">Next.js</span> · <span className="text-indigo-600">Neon</span> · <span className="text-orange-600">Cloudinary</span>
        </p>
      </footer>

      {/* ── Modals ── */}
      <AddAnimalModal
        isOpen={isAddAnimalOpen}
        categories={categories}
        onClose={() => setIsAddAnimalOpen(false)}
        onSubmit={handleAddAnimal}
      />
      <AddCategoryModal
        isOpen={isAddCategoryOpen}
        onClose={() => setIsAddCategoryOpen(false)}
        onSubmit={handleAddCategory}
      />
    </main>
  );
}
