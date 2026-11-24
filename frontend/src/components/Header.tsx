'use client';

import React, { useState } from 'react';
import { Menu, X, Plus, Search, Layers } from 'lucide-react';
import { Category } from '../types';

interface HeaderProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
  totalAnimalCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenAddAnimal: () => void;
  onOpenAddCategory: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  totalAnimalCount,
  searchQuery,
  onSearchChange,
  onOpenAddAnimal,
  onOpenAddCategory,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full flex flex-col gap-6 pt-8 pb-4">
      {/* Top action row */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Branding & Mobile Hamburger */}
        <div className="w-full md:w-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-black font-extrabold text-xl shadow-lg shadow-emerald-500/20">
              🐾
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Animal Vault
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-zinc-800 text-emerald-400 border border-zinc-700">
                  v2.0
                </span>
              </h1>
              <p className="text-xs text-zinc-400 hidden sm:block">
                NestJS • Neon Postgres • Cloudinary • Next.js
              </p>
            </div>
          </div>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Center: Search Bar */}
        <div className="w-full md:w-72 relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search animals..."
            className="w-full pl-10 pr-4 py-2 rounded-full bg-zinc-900/90 border border-zinc-800 text-sm text-white placeholder-zinc-500 outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/40 transition"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-zinc-300"
            >
              ✕
            </button>
          )}
        </div>

        {/* Right: Add Buttons */}
        <div className="w-full md:w-auto flex items-center gap-2.5 justify-end">
          <button
            onClick={onOpenAddAnimal}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-5 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm transition shadow-lg shadow-emerald-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Add Animal
          </button>
          <button
            onClick={onOpenAddCategory}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-white font-medium text-sm transition active:scale-95"
          >
            <Layers className="w-3.5 h-3.5 text-zinc-400" />
            Add Category
          </button>
        </div>
      </div>

      {/* Desktop Category Filter Pills */}
      <div className="hidden md:flex items-center gap-2.5 flex-wrap overflow-x-auto pb-2 scrollbar-none">
        {/* 'All' Category Tab */}
        <button
          onClick={() => onSelectCategory('all')}
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            selectedCategoryId === 'all'
              ? 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400 shadow-md shadow-emerald-950/30 font-semibold'
              : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700'
          }`}
        >
          All
          <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-zinc-800/80 text-zinc-300">
            {totalAnimalCount}
          </span>
        </button>

        {/* Dynamic Category Tabs */}
        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                isSelected
                  ? 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400 shadow-md shadow-emerald-950/30 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {cat.name}
              {cat._count?.animals !== undefined && (
                <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-zinc-800/80 text-zinc-300">
                  {cat._count.animals}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Mobile Category Dropdown / Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden flex flex-col gap-2 p-3 rounded-2xl bg-zinc-900 border border-zinc-800 animate-fadeIn">
          <p className="text-xs uppercase font-medium text-zinc-400 px-2 py-1">Filter Categories</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                onSelectCategory('all');
                setMobileMenuOpen(false);
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-medium ${
                selectedCategoryId === 'all'
                  ? 'bg-emerald-500 text-black font-semibold'
                  : 'bg-zinc-800 text-zinc-300'
              }`}
            >
              All ({totalAnimalCount})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  setMobileMenuOpen(false);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-medium ${
                  selectedCategoryId === cat.id
                    ? 'bg-emerald-500 text-black font-semibold'
                    : 'bg-zinc-800 text-zinc-300'
                }`}
              >
                {cat.name} {cat._count?.animals !== undefined ? `(${cat._count.animals})` : ''}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
