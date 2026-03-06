export interface AuctionCar {
  id: string;
  source: string;
  title: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  fuel: string;
  transmission: string;
  currentBid: number;
  buyNow?: number;
  auctionEnd: Date;
  imageUrl: string;
  link: string;
  location: string;
}

export interface FilterOptions {
  search: string;
  make: string;
  minPrice: number;
  maxPrice: number;
  minYear: number;
  maxYear: number;
  source: string;
  sortBy: 'price' | 'endTime' | 'year';
  sortOrder: 'asc' | 'desc';
}

export interface Alert {
  id: string;
  make?: string;
  model?: string;
  maxPrice: number;
  enabled: boolean;
}
