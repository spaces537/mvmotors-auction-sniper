'use client';

import { Car, Clock, Zap, Building2 } from 'lucide-react';

interface StatsBarProps {
  totalCars: number;
  filteredCars: number;
  urgentCount: number;
  sources: string[];
}

export default function StatsBar({ totalCars, filteredCars, urgentCount, sources }: StatsBarProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-mv-gray rounded-xl p-4 border border-mv-yellow/20">
        <div className="flex items-center gap-3">
          <div className="bg-mv-yellow/20 p-2 rounded-lg">
            <Car className="w-5 h-5 text-mv-yellow" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{totalCars}</p>
            <p className="text-xs text-gray-400">Total Auctions</p>
          </div>
        </div>
      </div>

      <div className="bg-mv-gray rounded-xl p-4 border border-mv-yellow/20">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500/20 p-2 rounded-lg">
            <Car className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{filteredCars}</p>
            <p className="text-xs text-gray-400">Matching Filters</p>
          </div>
        </div>
      </div>

      <div className="bg-mv-gray rounded-xl p-4 border border-red-500/30">
        <div className="flex items-center gap-3">
          <div className="bg-red-500/20 p-2 rounded-lg">
            <Clock className="w-5 h-5 text-red-400 animate-pulse" />
          </div>
          <div>
            <p className="text-2xl font-bold text-red-400">{urgentCount}</p>
            <p className="text-xs text-gray-400">Ending Soon (&lt;30m)</p>
          </div>
        </div>
      </div>

      <div className="bg-mv-gray rounded-xl p-4 border border-mv-yellow/20">
        <div className="flex items-center gap-3">
          <div className="bg-green-500/20 p-2 rounded-lg">
            <Building2 className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{sources.length}</p>
            <p className="text-xs text-gray-400">Sources Active</p>
          </div>
        </div>
      </div>
    </div>
  );
}
