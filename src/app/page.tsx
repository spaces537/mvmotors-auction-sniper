'use client';

import { useState, useEffect, useMemo } from 'react';
import { AuctionCar, FilterOptions } from '@/types/auction';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import FilterBar from '@/components/FilterBar';
import AuctionGrid from '@/components/AuctionGrid';
import AlertsPanel from '@/components/AlertsPanel';
import StatsBar from '@/components/StatsBar';

export default function Home() {
  const [cars, setCars] = useState<AuctionCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [showAlerts, setShowAlerts] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    make: '',
    minPrice: 0,
    maxPrice: 999999,
    minYear: 2015,
    maxYear: 2025,
    source: '',
    sortBy: 'endTime',
    sortOrder: 'asc',
  });

  // Fetch auctions
  const fetchAuctions = async () => {
    try {
      const res = await fetch('/api/auctions');
      const data = await res.json();
      setCars(data.cars);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to fetch auctions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions();
    // Refresh every 30 seconds
    const interval = setInterval(fetchAuctions, 30000);
    return () => clearInterval(interval);
  }, []);

  // Filter and sort cars
  const filteredCars = useMemo(() => {
    let result = [...cars];

    // Search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(car => 
        car.title.toLowerCase().includes(search) ||
        car.make.toLowerCase().includes(search) ||
        car.model.toLowerCase().includes(search)
      );
    }

    // Make filter
    if (filters.make) {
      result = result.filter(car => car.make === filters.make);
    }

    // Source filter
    if (filters.source) {
      result = result.filter(car => car.source === filters.source);
    }

    // Price filter
    result = result.filter(car => 
      car.currentBid >= filters.minPrice && car.currentBid <= filters.maxPrice
    );

    // Year filter
    result = result.filter(car => 
      car.year >= filters.minYear && car.year <= filters.maxYear
    );

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (filters.sortBy) {
        case 'price':
          comparison = a.currentBid - b.currentBid;
          break;
        case 'endTime':
          comparison = new Date(a.auctionEnd).getTime() - new Date(b.auctionEnd).getTime();
          break;
        case 'year':
          comparison = a.year - b.year;
          break;
      }
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [cars, filters]);

  // Get unique makes and sources for filters
  const uniqueMakes = useMemo(() => 
    [...new Set(cars.map(c => c.make))].sort(), [cars]
  );
  
  const uniqueSources = useMemo(() => 
    [...new Set(cars.map(c => c.source))].sort(), [cars]
  );

  // Count urgent auctions (< 30 min)
  const urgentCount = useMemo(() => 
    cars.filter(c => new Date(c.auctionEnd).getTime() - Date.now() < 30 * 60 * 1000).length,
    [cars]
  );

  // Handle section changes
  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    if (section === 'alerts') {
      setShowAlerts(true);
    } else if (section === 'urgent') {
      // Filter to urgent only
      setFilters({ ...filters, sortBy: 'endTime', sortOrder: 'asc' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-mv-dark">
      {/* Sidebar */}
      <Sidebar 
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        urgentCount={urgentCount}
      />

      {/* Main content - offset by sidebar width */}
      <div className="ml-64">
        <Header 
          urgentCount={urgentCount}
          onAlertsClick={() => setShowAlerts(!showAlerts)}
          onRefresh={fetchAuctions}
          lastUpdate={lastUpdate}
        />
        
        <div className="container mx-auto px-6 py-6 max-w-7xl">
          <StatsBar 
            totalCars={cars.length}
            filteredCars={filteredCars.length}
            urgentCount={urgentCount}
            sources={uniqueSources}
          />
          
          <FilterBar 
            filters={filters}
            setFilters={setFilters}
            makes={uniqueMakes}
            sources={uniqueSources}
          />
          
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-mv-yellow border-t-transparent"></div>
            </div>
          ) : (
            <AuctionGrid cars={filteredCars} />
          )}
        </div>
      </div>

      {showAlerts && (
        <AlertsPanel 
          onClose={() => setShowAlerts(false)}
          cars={cars}
        />
      )}
    </main>
  );
}
