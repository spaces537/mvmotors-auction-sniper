import { AuctionCar } from '@/types/auction';

// Mock data for demo + real scraping attempts

const MOCK_CARS: AuctionCar[] = [
  {
    id: 'demo-1',
    source: 'Autorola',
    title: 'BMW 320d M Sport',
    make: 'BMW',
    model: '320d',
    year: 2021,
    mileage: 45000,
    fuel: 'Diesel',
    transmission: 'Automatic',
    currentBid: 24500,
    auctionEnd: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
    imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400',
    link: 'https://autorola.be/demo',
    location: 'Antwerp',
  },
  {
    id: 'demo-2',
    source: 'BCA',
    title: 'Mercedes-Benz A180 AMG Line',
    make: 'Mercedes-Benz',
    model: 'A180',
    year: 2022,
    mileage: 28000,
    fuel: 'Benzine',
    transmission: 'Automatic',
    currentBid: 27800,
    buyNow: 31000,
    auctionEnd: new Date(Date.now() + 45 * 60 * 1000), // 45 minutes
    imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400',
    link: 'https://bca.be/demo',
    location: 'Brussels',
  },
  {
    id: 'demo-3',
    source: 'Autorola',
    title: 'Audi A4 Avant 35 TFSI',
    make: 'Audi',
    model: 'A4',
    year: 2020,
    mileage: 67000,
    fuel: 'Benzine',
    transmission: 'Automatic',
    currentBid: 22100,
    auctionEnd: new Date(Date.now() + 5 * 60 * 60 * 1000), // 5 hours
    imageUrl: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400',
    link: 'https://autorola.be/demo',
    location: 'Ghent',
  },
  {
    id: 'demo-4',
    source: 'Adesa',
    title: 'Volkswagen Golf 8 R-Line',
    make: 'Volkswagen',
    model: 'Golf',
    year: 2023,
    mileage: 12000,
    fuel: 'Benzine',
    transmission: 'DSG',
    currentBid: 29500,
    auctionEnd: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes - URGENT!
    imageUrl: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400',
    link: 'https://adesa.eu/demo',
    location: 'Liège',
  },
  {
    id: 'demo-5',
    source: 'BCA',
    title: 'Porsche Cayenne Coupe',
    make: 'Porsche',
    model: 'Cayenne',
    year: 2021,
    mileage: 35000,
    fuel: 'Hybride',
    transmission: 'Automatic',
    currentBid: 72000,
    buyNow: 79000,
    auctionEnd: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400',
    link: 'https://bca.be/demo',
    location: 'Antwerp',
  },
  {
    id: 'demo-6',
    source: 'Autorola',
    title: 'Renault Clio V TCe 100',
    make: 'Renault',
    model: 'Clio',
    year: 2022,
    mileage: 32000,
    fuel: 'Benzine',
    transmission: 'Manual',
    currentBid: 12800,
    auctionEnd: new Date(Date.now() + 8 * 60 * 1000), // 8 minutes - VERY URGENT!
    imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400',
    link: 'https://autorola.be/demo',
    location: 'Namur',
  },
  {
    id: 'demo-7',
    source: 'Adesa',
    title: 'Tesla Model 3 Long Range',
    make: 'Tesla',
    model: 'Model 3',
    year: 2023,
    mileage: 18000,
    fuel: 'Electric',
    transmission: 'Automatic',
    currentBid: 38500,
    auctionEnd: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours
    imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400',
    link: 'https://adesa.eu/demo',
    location: 'Brussels',
  },
  {
    id: 'demo-8',
    source: 'BCA',
    title: 'Peugeot 3008 GT',
    make: 'Peugeot',
    model: '3008',
    year: 2021,
    mileage: 52000,
    fuel: 'Diesel',
    transmission: 'Automatic',
    currentBid: 21500,
    auctionEnd: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours
    imageUrl: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400',
    link: 'https://bca.be/demo',
    location: 'Charleroi',
  },
];

// Try to scrape real data, fallback to mock
export async function getAllAuctions(): Promise<AuctionCar[]> {
  const allCars: AuctionCar[] = [];
  
  // For demo, use mock data
  // In production, you'd call the actual scrapers here
  allCars.push(...MOCK_CARS);
  
  // Try real Autorola scraping
  try {
    const response = await fetch('https://www.autorola.be/api/v2/vehicles/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      body: JSON.stringify({
        country: 'BE',
        limit: 20,
      }),
    });
    
    if (response.ok) {
      const data = await response.json();
      // Parse and add real cars
    }
  } catch (e) {
    // Fallback to mock data already added
  }
  
  return allCars;
}

export function getUniqueMakes(cars: AuctionCar[]): string[] {
  return [...new Set(cars.map(c => c.make))].sort();
}

export function getUniqueSources(cars: AuctionCar[]): string[] {
  return [...new Set(cars.map(c => c.source))].sort();
}
