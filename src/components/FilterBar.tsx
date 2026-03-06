'use client';

import { Search, SlidersHorizontal } from 'lucide-react';
import { FilterOptions } from '@/types/auction';
import { useState } from 'react';

interface FilterBarProps {
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
  makes: string[];
  sources: string[];
}

export default function FilterBar({ filters, setFilters, makes, sources }: FilterBarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="bg-mv-gray rounded-xl p-4 mb-6 border border-mv-yellow/20">
      {/* Main filters */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search make, model..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="w-full bg-mv-black border border-mv-yellow/30 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:border-mv-yellow focus:outline-none"
            />
          </div>
        </div>

        {/* Make dropdown with clear option */}
        <div className="relative">
          <select
            value={filters.make}
            onChange={(e) => updateFilter('make', e.target.value)}
            className="bg-mv-black border border-mv-yellow/30 rounded-lg px-4 py-2.5 pr-8 text-white focus:border-mv-yellow focus:outline-none min-w-[150px] appearance-none"
          >
            <option value="">All Makes</option>
            {makes.map(make => (
              <option key={make} value={make}>{make}</option>
            ))}
          </select>
          {filters.make && (
            <button
              onClick={() => updateFilter('make', '')}
              className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              ✕
            </button>
          )}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            ▼
          </div>
        </div>

        {/* Source chips - clickable to toggle */}
        <div className="flex items-center gap-2 flex-wrap">
          {sources.map(source => (
            <button
              key={source}
              onClick={() => updateFilter('source', filters.source === source ? '' : source)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                filters.source === source
                  ? 'bg-mv-yellow text-mv-black'
                  : 'bg-mv-black border border-mv-yellow/30 text-gray-300 hover:border-mv-yellow hover:text-white'
              }`}
            >
              {source}
              {filters.source === source && (
                <span className="ml-1.5">✕</span>
              )}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split('-');
            updateFilter('sortBy', sortBy);
            updateFilter('sortOrder', sortOrder);
          }}
          className="bg-mv-black border border-mv-yellow/30 rounded-lg px-4 py-2.5 text-white focus:border-mv-yellow focus:outline-none"
        >
          <option value="endTime-asc">⏰ Ending Soon</option>
          <option value="endTime-desc">⏰ Ending Last</option>
          <option value="price-asc">💰 Price: Low → High</option>
          <option value="price-desc">💰 Price: High → Low</option>
          <option value="year-desc">📅 Year: Newest</option>
          <option value="year-asc">📅 Year: Oldest</option>
        </select>

        {/* Advanced toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`p-2.5 rounded-lg border transition-colors ${
            showAdvanced 
              ? 'bg-mv-yellow text-mv-black border-mv-yellow' 
              : 'bg-mv-black border-mv-yellow/30 text-mv-yellow hover:bg-mv-yellow/10'
          }`}
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-mv-yellow/20 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Min Price (€)</label>
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => updateFilter('minPrice', parseInt(e.target.value) || 0)}
              className="w-full bg-mv-black border border-mv-yellow/30 rounded-lg px-3 py-2 text-white focus:border-mv-yellow focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Max Price (€)</label>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => updateFilter('maxPrice', parseInt(e.target.value) || 999999)}
              className="w-full bg-mv-black border border-mv-yellow/30 rounded-lg px-3 py-2 text-white focus:border-mv-yellow focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Min Year</label>
            <input
              type="number"
              value={filters.minYear}
              onChange={(e) => updateFilter('minYear', parseInt(e.target.value) || 2010)}
              className="w-full bg-mv-black border border-mv-yellow/30 rounded-lg px-3 py-2 text-white focus:border-mv-yellow focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Max Year</label>
            <input
              type="number"
              value={filters.maxYear}
              onChange={(e) => updateFilter('maxYear', parseInt(e.target.value) || 2025)}
              className="w-full bg-mv-black border border-mv-yellow/30 rounded-lg px-3 py-2 text-white focus:border-mv-yellow focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
