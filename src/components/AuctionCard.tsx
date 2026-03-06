'use client';

import { useState, useEffect } from 'react';
import { AuctionCar } from '@/types/auction';
import { Clock, MapPin, Fuel, Calendar, Gauge, ExternalLink, Zap } from 'lucide-react';

interface AuctionCardProps {
  car: AuctionCar;
}

function formatCountdown(ms: number): { text: string; urgent: boolean; veryUrgent: boolean } {
  if (ms <= 0) return { text: 'ENDED', urgent: true, veryUrgent: true };
  
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const veryUrgent = minutes < 10;
  const urgent = minutes < 30;

  if (days > 0) {
    return { text: `${days}d ${hours % 24}h`, urgent: false, veryUrgent: false };
  }
  if (hours > 0) {
    return { text: `${hours}h ${minutes % 60}m`, urgent, veryUrgent };
  }
  if (minutes > 0) {
    return { text: `${minutes}m ${seconds % 60}s`, urgent, veryUrgent };
  }
  return { text: `${seconds}s`, urgent: true, veryUrgent: true };
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('nl-BE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(price);
}

export default function AuctionCard({ car }: AuctionCardProps) {
  const [countdown, setCountdown] = useState(formatCountdown(0));

  useEffect(() => {
    const update = () => {
      const remaining = new Date(car.auctionEnd).getTime() - Date.now();
      setCountdown(formatCountdown(remaining));
    };
    
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [car.auctionEnd]);

  return (
    <div className={`auction-card bg-mv-gray rounded-xl overflow-hidden border ${
      countdown.veryUrgent 
        ? 'border-red-500 shadow-lg shadow-red-500/20' 
        : countdown.urgent 
          ? 'border-orange-500/50' 
          : 'border-mv-yellow/20'
    }`}>
      {/* Image */}
      <div className="relative h-48 bg-mv-black">
        <img
          src={car.imageUrl}
          alt={car.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400';
          }}
        />
        
        {/* Source badge */}
        <span className="absolute top-2 left-2 bg-mv-black/80 text-mv-yellow text-xs px-2 py-1 rounded-md">
          {car.source}
        </span>

        {/* Countdown badge */}
        <div className={`absolute top-2 right-2 px-2 py-1 rounded-md flex items-center gap-1 ${
          countdown.veryUrgent 
            ? 'bg-red-500 animate-pulse-urgent' 
            : countdown.urgent 
              ? 'bg-orange-500' 
              : 'bg-mv-black/80'
        }`}>
          <Clock className="w-3 h-3" />
          <span className="text-xs font-mono font-bold">{countdown.text}</span>
        </div>

        {/* Buy Now badge */}
        {car.buyNow && (
          <div className="absolute bottom-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Buy Now: {formatPrice(car.buyNow)}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-white text-lg truncate mb-2">{car.title}</h3>
        
        {/* Details grid */}
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-400 mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{car.year}</span>
          </div>
          <div className="flex items-center gap-1">
            <Gauge className="w-4 h-4" />
            <span>{car.mileage.toLocaleString()} km</span>
          </div>
          <div className="flex items-center gap-1">
            <Fuel className="w-4 h-4" />
            <span>{car.fuel}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{car.location}</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-mv-yellow/20">
          <div>
            <p className="text-xs text-gray-500">Current Bid</p>
            <p className="text-xl font-bold text-mv-yellow">{formatPrice(car.currentBid)}</p>
          </div>
          
          <a
            href={car.link}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-mv-yellow text-mv-black px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-mv-gold transition-colors"
          >
            View
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
