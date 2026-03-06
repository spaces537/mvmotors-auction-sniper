'use client';

import { Home, Car, Bell, Settings, Filter, Clock, TrendingUp } from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  urgentCount: number;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'auctions', label: 'Auctions', icon: Car },
  { id: 'urgent', label: 'Ending Soon', icon: Clock },
  { id: 'alerts', label: 'Alerts', icon: Bell },
  { id: 'filters', label: 'Saved Filters', icon: Filter },
  { id: 'analytics', label: 'Analytics', icon: TrendingUp },
];

export default function Sidebar({ activeSection, onSectionChange, urgentCount }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-mv-black border-r border-mv-yellow/20 z-40 flex flex-col">
      {/* Logo */}
      <div 
        className="p-4 border-b border-mv-yellow/20 cursor-pointer hover:bg-mv-gray/50 transition-colors"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <div className="flex items-center gap-3">
          <div className="bg-mv-yellow p-2 rounded-lg">
            <span className="text-mv-black font-black text-lg">MV</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-mv-yellow">
              MV<span className="text-white">Motors</span>
            </h1>
            <p className="text-xs text-gray-500">Auction Sniper</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeSection === item.id
                ? 'bg-mv-yellow text-mv-black font-semibold'
                : 'text-gray-400 hover:text-white hover:bg-mv-gray'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
            {item.id === 'urgent' && urgentCount > 0 && (
              <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-bold ${
                activeSection === item.id
                  ? 'bg-mv-black text-mv-yellow'
                  : 'bg-red-500 text-white'
              }`}>
                {urgentCount}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-mv-yellow/20">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-mv-gray transition-all">
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </button>
        
        <div className="mt-4 p-3 bg-mv-gray/50 rounded-lg">
          <p className="text-xs text-gray-500">Data refreshes every</p>
          <p className="text-sm text-mv-yellow font-semibold">30 seconds</p>
        </div>
      </div>
    </aside>
  );
}
