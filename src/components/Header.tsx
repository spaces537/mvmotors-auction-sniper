'use client';

import { Bell, RefreshCw, Search } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface HeaderProps {
  urgentCount: number;
  onAlertsClick: () => void;
  onRefresh: () => void;
  lastUpdate: Date;
}

export default function Header({ urgentCount, onAlertsClick, onRefresh, lastUpdate }: HeaderProps) {
  return (
    <header className="bg-mv-black/80 backdrop-blur-sm border-b border-mv-yellow/20 sticky top-0 z-30">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Page title */}
          <div>
            <h2 className="text-xl font-bold text-white">Auction Dashboard</h2>
            <p className="text-xs text-gray-500">
              Updated {formatDistanceToNow(lastUpdate, { addSuffix: true })}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Urgent badge - only show if > 0 */}
            {urgentCount > 0 && (
              <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/50 px-3 py-1.5 rounded-lg">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                <span className="text-red-400 text-sm font-medium">{urgentCount} ending soon</span>
              </div>
            )}

            {/* Refresh */}
            <button
              onClick={onRefresh}
              className="p-2 rounded-lg bg-mv-gray hover:bg-mv-yellow/20 transition-colors"
              title="Refresh data"
            >
              <RefreshCw className="w-5 h-5 text-mv-yellow" />
            </button>

            {/* Alerts */}
            <button
              onClick={onAlertsClick}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-mv-yellow text-mv-black font-semibold hover:bg-mv-gold transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span>Alerts</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
