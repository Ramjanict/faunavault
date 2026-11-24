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
import { ImageOff, PlusCircle } from 'lucide-react';

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Modals
  const [isAddAnimalOpen, setIsAddAnimalOpen] = useState<boolean>(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState<boolean>(false);

  // Fetch all categories
  const fetchCategories = useCallback(async () => {
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (err: any) {
      console.error('Failed to load categories:', err);
    }
  }, []);

  // Fetch animals with current filter
  const fetchAnimals = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getAnimals(selectedCategoryId, searchQuery);
      setAnimals(data);
    } catch (err: any) {
      toast.error('Unable to connect to NestJS backend');
      console.error('Failed to load animals:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategoryId, searchQuery]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchAnimals();
  }, [fetchAnimals]);

  // Handle adding a new category
  const handleAddCategory = async (name: string) => {
    const newCategory = await api.createCategory(name);
    toast.success(`Category "${newCategory.name}" created!`);
    await fetchCategories();
  };

  // Handle uploading a new animal
  const handleAddAnimal = async ({
    name,
    categoryId,
    file,
  }: {
    name: string;
    categoryId: string;
    file: File;
  }) => {
    const newAnimal = await api.createAnimal({ name, categoryId, file });
    toast.success(`Animal "${newAnimal.name}" uploaded to Cloudinary!`);
    await Promise.all([fetchCategories(), fetchAnimals()]);
  };

  // Handle deleting an animal
  const handleDeleteAnimal = async (id: string) => {
    try {
      await api.deleteAnimal(id);
      toast.success('Animal deleted successfully');
      setAnimals((prev) => prev.filter((a) => a.id !== id));
      await fetchCategories();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete animal');
    }
  };

  // Total count across all categories
  const totalCount = categories.reduce(
    (acc, cat) => acc + (cat._count?.animals || 0),
    0
  );

  return (
    <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col pb-16">
      {/* Navigation and Category Bar */}
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

      {/* Animal Cards Gallery Grid */}
      <section className="flex-1 mt-6">
        {loading ? (
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 py-8">
            {Array.from({ length: 10 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        ) : animals.length > 0 ? (
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 py-8">
            {animals.map((animal) => (
              <AnimalCard
                key={animal.id}
                animal={animal}
                onDelete={handleDeleteAnimal}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4 animate-fadeIn">
            <div className="p-4 rounded-3xl bg-zinc-900 border border-zinc-800 text-zinc-500">
              <ImageOff className="w-10 h-10" />
            </div>
            <div className="max-w-md">
              <h3 className="text-lg font-semibold text-zinc-200">No animals found</h3>
              <p className="text-sm text-zinc-400 mt-1">
                {searchQuery
                  ? `No animals match "${searchQuery}". Try a different search.`
                  : 'There are no animals in this category yet. Click the button below to upload one!'}
              </p>
            </div>
            <button
              onClick={() => setIsAddAnimalOpen(true)}
              className="mt-2 flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm transition shadow-lg shadow-emerald-500/20"
            >
              <PlusCircle className="w-4 h-4" />
              Add Animal Now
            </button>
          </div>
        )}
      </section>

      {/* Add Animal Modal */}
      <AddAnimalModal
        isOpen={isAddAnimalOpen}
        categories={categories}
        onClose={() => setIsAddAnimalOpen(false)}
        onSubmit={handleAddAnimal}
      />

      {/* Add Category Modal */}
      <AddCategoryModal
        isOpen={isAddCategoryOpen}
        onClose={() => setIsAddCategoryOpen(false)}
        onSubmit={handleAddCategory}
      />
    </main>
  );
}
