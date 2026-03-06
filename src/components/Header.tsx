'use client';

import { Bell, RefreshCw, Zap } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface HeaderProps {
  urgentCount: number;
  onAlertsClick: () => void;
  onRefresh: () => void;
  lastUpdate: Date;
}

export default function Header({ urgentCount, onAlertsClick, onRefresh, lastUpdate }: HeaderProps) {
  return (
    <header className="bg-mv-black border-b border-mv-yellow/30 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-mv-yellow p-2 rounded-lg">
              <Zap className="w-8 h-8 text-mv-black" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-mv-yellow">
                MV<span className="text-white">Motors</span>
              </h1>
              <p className="text-xs text-gray-400">Auction Sniper</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Last update */}
            <span className="text-sm text-gray-400 hidden md:block">
              Updated {formatDistanceToNow(lastUpdate, { addSuffix: true })}
            </span>

            {/* Refresh */}
            <button
              onClick={onRefresh}
              className="p-2 rounded-lg bg-mv-gray hover:bg-mv-yellow/20 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5 text-mv-yellow" />
            </button>

            {/* Alerts */}
            <button
              onClick={onAlertsClick}
              className="relative p-2 rounded-lg bg-mv-gray hover:bg-mv-yellow/20 transition-colors"
              title="Alerts"
            >
              <Bell className="w-5 h-5 text-mv-yellow" />
            </button>
            
            {/* Urgent badge - only show if > 0 */}
            {urgentCount > 0 && (
              <div className="flex items-center gap-1 bg-red-500/20 border border-red-500/50 px-2 py-1 rounded-lg">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                <span className="text-red-400 text-sm font-medium">{urgentCount} urgent</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
