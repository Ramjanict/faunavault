'use client';

import React, { useState } from 'react';
import { Menu, X, Plus, Search, Layers, PawPrint, Sparkles } from 'lucide-react';
import { Category } from '../types';
import CommonSelect, { SelectOption } from './ui/CommonSelect';

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

  const mobileCategoryOptions: SelectOption<string>[] = [
    { label: `All Categories (${totalAnimalCount})`, value: 'all' },
    ...categories.map((c) => ({
      label: `${c.name}${c._count?.animals !== undefined ? ` (${c._count.animals})` : ''}`,
      value: c.id,
    })),
  ];

  return (
    <header className="relative z-30 w-full flex flex-col gap-5 pt-6 pb-2">
      {/* ── Top Navigation Bar ── */}
      <nav className="glass rounded-2xl px-4 sm:px-6 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4 animate-fadeIn">
        {/* Left: Brand */}
        <div className="w-full md:w-auto flex items-center justify-between">
          <div className="flex items-center gap-3.5 group cursor-default">
            {/* Animated Logo */}
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-400 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:shadow-emerald-500/40 transition-shadow duration-500">
                <PawPrint className="w-5 h-5 text-black stroke-[2.5]" />
              </div>
              {/* Orbiting dot */}
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#030303] animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                FaunaVault
                <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-300 border border-emerald-500/20">
                  v2.0
                </span>
              </h1>
              <p className="text-[11px] text-zinc-500 tracking-wide hidden sm:block">
                NestJS · Neon Postgres · Cloudinary · Next.js
              </p>
            </div>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl glass-light text-zinc-400 hover:text-white transition btn-press"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Center: Search */}
        <div className="w-full md:w-80 relative group">
          <Search className="w-4 h-4 text-zinc-500 group-focus-within:text-emerald-400 absolute left-4 top-1/2 -translate-y-1/2 transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search animals..."
            className="w-full pl-11 pr-10 py-2.5 rounded-xl bg-white/[0.04] border border-zinc-800/80 hover:border-zinc-700 focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/15 text-sm text-white placeholder-zinc-600 outline-none transition-all duration-300"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right: Action Buttons */}
        <div className="w-full md:w-auto flex items-center gap-2.5 justify-end">
          <button
            onClick={onOpenAddAnimal}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-semibold text-sm transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 btn-press"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Add Animal
          </button>
          <button
            onClick={onOpenAddCategory}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl glass-light hover:bg-white/[0.08] text-zinc-200 font-medium text-sm transition-all duration-300 btn-press"
          >
            <Layers className="w-3.5 h-3.5 text-zinc-400" />
            Category
          </button>
        </div>
      </nav>

      {/* ── Stats Ribbon ── */}
      <div className="flex items-center gap-4 px-2 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <Sparkles className="w-3 h-3 text-emerald-500/60" />
          <span className="font-medium text-zinc-400">{totalAnimalCount}</span> animals
        </div>
        <div className="w-px h-3 bg-zinc-800" />
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <Layers className="w-3 h-3 text-indigo-500/60" />
          <span className="font-medium text-zinc-400">{categories.length}</span> categories
        </div>
      </div>

      {/* ── Desktop Category Filter Pills ── */}
      <div className="hidden md:flex items-center gap-2 flex-wrap overflow-x-auto pb-1 scrollbar-none animate-fadeIn" style={{ animationDelay: '0.15s' }}>
        {/* All Tab */}
        <button
          onClick={() => onSelectCategory('all')}
          className={`group flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 btn-press ${
            selectedCategoryId === 'all'
              ? 'bg-gradient-to-r from-emerald-500/15 to-teal-500/10 text-emerald-300 ring-1 ring-emerald-500/40 shadow-md shadow-emerald-950/20'
              : 'text-zinc-500 hover:text-zinc-200 bg-white/[0.02] border border-zinc-800/50 hover:border-zinc-700/80 hover:bg-white/[0.04]'
          }`}
        >
          All
          <span className={`text-[11px] tabular-nums font-semibold px-1.5 py-0.5 rounded-md ${
            selectedCategoryId === 'all'
              ? 'bg-emerald-500/20 text-emerald-300'
              : 'bg-zinc-800/60 text-zinc-500 group-hover:text-zinc-400'
          }`}>
            {totalAnimalCount}
          </span>
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`group flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 btn-press ${
                isSelected
                  ? 'bg-gradient-to-r from-emerald-500/15 to-teal-500/10 text-emerald-300 ring-1 ring-emerald-500/40 shadow-md shadow-emerald-950/20'
                  : 'text-zinc-500 hover:text-zinc-200 bg-white/[0.02] border border-zinc-800/50 hover:border-zinc-700/80 hover:bg-white/[0.04]'
              }`}
            >
              {cat.name}
              {cat._count?.animals !== undefined && (
                <span className={`text-[11px] tabular-nums font-semibold px-1.5 py-0.5 rounded-md ${
                  isSelected
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-zinc-800/60 text-zinc-500 group-hover:text-zinc-400'
                }`}>
                  {cat._count.animals}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Mobile Category Drawer ── */}
      {mobileMenuOpen && (
        <div className="md:hidden glass rounded-2xl p-4 flex flex-col gap-3 animate-fadeInScale">
          <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 px-1">
            Filter by Category
          </p>
          <CommonSelect
            value={selectedCategoryId}
            item={mobileCategoryOptions}
            w="100%"
            onValueChange={(val) => {
              onSelectCategory(val);
              setMobileMenuOpen(false);
            }}
            placeholder="Select a category"
            className="w-full"
          />
        </div>
      )}
    </header>
  );
};
