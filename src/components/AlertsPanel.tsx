'use client';

import { useState, useEffect } from 'react';
import { X, Bell, Plus, Trash2 } from 'lucide-react';
import { AuctionCar, Alert } from '@/types/auction';

interface AlertsPanelProps {
  onClose: () => void;
  cars: AuctionCar[];
}

export default function AlertsPanel({ onClose, cars }: AlertsPanelProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [newAlert, setNewAlert] = useState({ make: '', model: '', maxPrice: 50000 });
  const [matchingCars, setMatchingCars] = useState<AuctionCar[]>([]);

  // Load alerts from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('auction-alerts');
    if (saved) setAlerts(JSON.parse(saved));
  }, []);

  // Save alerts to localStorage
  useEffect(() => {
    localStorage.setItem('auction-alerts', JSON.stringify(alerts));
  }, [alerts]);

  // Find matching cars
  useEffect(() => {
    const matches: AuctionCar[] = [];
    for (const alert of alerts.filter(a => a.enabled)) {
      for (const car of cars) {
        if (
          (!alert.make || car.make.toLowerCase().includes(alert.make.toLowerCase())) &&
          (!alert.model || car.model.toLowerCase().includes(alert.model.toLowerCase())) &&
          car.currentBid <= alert.maxPrice
        ) {
          if (!matches.find(m => m.id === car.id)) {
            matches.push(car);
          }
        }
      }
    }
    setMatchingCars(matches);
  }, [alerts, cars]);

  const addAlert = () => {
    if (newAlert.make || newAlert.model) {
      setAlerts([
        ...alerts,
        {
          id: Date.now().toString(),
          make: newAlert.make,
          model: newAlert.model,
          maxPrice: newAlert.maxPrice,
          enabled: true,
        },
      ]);
      setNewAlert({ make: '', model: '', maxPrice: 50000 });
    }
  };

  const toggleAlert = (id: string) => {
    setAlerts(alerts.map(a => 
      a.id === id ? { ...a, enabled: !a.enabled } : a
    ));
  };

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
      <div className="bg-mv-black w-full max-w-md h-full overflow-y-auto border-l border-mv-yellow/30">
        {/* Header */}
        <div className="sticky top-0 bg-mv-black border-b border-mv-yellow/30 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-mv-yellow" />
            <h2 className="text-lg font-bold text-white">Price Alerts</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-mv-gray rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-4">
          {/* New alert form */}
          <div className="bg-mv-gray rounded-xl p-4 mb-6 border border-mv-yellow/20">
            <h3 className="text-sm font-semibold text-mv-yellow mb-3">Create New Alert</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Make (e.g., BMW)"
                value={newAlert.make}
                onChange={(e) => setNewAlert({ ...newAlert, make: e.target.value })}
                className="w-full bg-mv-black border border-mv-yellow/30 rounded-lg px-3 py-2 text-white placeholder-gray-500"
              />
              <input
                type="text"
                placeholder="Model (optional)"
                value={newAlert.model}
                onChange={(e) => setNewAlert({ ...newAlert, model: e.target.value })}
                className="w-full bg-mv-black border border-mv-yellow/30 rounded-lg px-3 py-2 text-white placeholder-gray-500"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Max Price"
                  value={newAlert.maxPrice}
                  onChange={(e) => setNewAlert({ ...newAlert, maxPrice: parseInt(e.target.value) || 0 })}
                  className="flex-1 bg-mv-black border border-mv-yellow/30 rounded-lg px-3 py-2 text-white"
                />
                <button
                  onClick={addAlert}
                  className="bg-mv-yellow text-mv-black px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-mv-gold"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Active alerts */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-3">Active Alerts ({alerts.length})</h3>
            {alerts.length === 0 ? (
              <p className="text-gray-500 text-sm">No alerts configured</p>
            ) : (
              <div className="space-y-2">
                {alerts.map(alert => (
                  <div
                    key={alert.id}
                    className={`bg-mv-gray rounded-lg p-3 flex items-center justify-between border ${
                      alert.enabled ? 'border-mv-yellow/30' : 'border-gray-700 opacity-50'
                    }`}
                  >
                    <div>
                      <p className="text-white font-medium">
                        {alert.make || 'Any'} {alert.model}
                      </p>
                      <p className="text-sm text-gray-400">
                        Max: €{alert.maxPrice.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleAlert(alert.id)}
                        className={`px-3 py-1 rounded text-xs font-medium ${
                          alert.enabled
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}
                      >
                        {alert.enabled ? 'ON' : 'OFF'}
                      </button>
                      <button
                        onClick={() => deleteAlert(alert.id)}
                        className="p-1 text-red-400 hover:bg-red-500/20 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Matching cars */}
          {matchingCars.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-2">
                <Bell className="w-4 h-4 animate-pulse" />
                Matching Cars ({matchingCars.length})
              </h3>
              <div className="space-y-2">
                {matchingCars.slice(0, 5).map(car => (
                  <a
                    key={car.id}
                    href={car.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-green-500/10 border border-green-500/30 rounded-lg p-3 hover:bg-green-500/20 transition-colors"
                  >
                    <p className="text-white font-medium truncate">{car.title}</p>
                    <p className="text-sm text-green-400">
                      €{car.currentBid.toLocaleString()} • {car.source}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
