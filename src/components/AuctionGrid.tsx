'use client';

import { AuctionCar } from '@/types/auction';
import AuctionCard from './AuctionCard';

interface AuctionGridProps {
  cars: AuctionCar[];
}

export default function AuctionGrid({ cars }: AuctionGridProps) {
  if (cars.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">No auctions found matching your filters</p>
        <p className="text-gray-500 text-sm mt-2">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {cars.map((car) => (
        <AuctionCard key={car.id} car={car} />
      ))}
    </div>
  );
}
