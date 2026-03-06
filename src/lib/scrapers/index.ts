import { AuctionCar } from '@/types/auction';

// Demo data for auction sites that require login + real 2dehands data

const DEMO_AUCTION_CARS: AuctionCar[] = [
  {
    id: 'autorola-demo-1',
    source: 'Autorola',
    title: 'BMW 320d M Sport Touring',
    make: 'BMW',
    model: '320d',
    year: 2021,
    mileage: 45000,
    fuel: 'Diesel',
    transmission: 'Automatic',
    currentBid: 24500,
    auctionEnd: new Date(Date.now() + 2 * 60 * 60 * 1000),
    imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400',
    link: 'https://autorola.be',
    location: 'Antwerp',
  },
  {
    id: 'bca-demo-1',
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
    auctionEnd: new Date(Date.now() + 45 * 60 * 1000),
    imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400',
    link: 'https://bca.be',
    location: 'Brussels',
  },
  {
    id: 'autorola-demo-2',
    source: 'Autorola',
    title: 'Audi A4 Avant 35 TFSI S-Line',
    make: 'Audi',
    model: 'A4',
    year: 2020,
    mileage: 67000,
    fuel: 'Benzine',
    transmission: 'Automatic',
    currentBid: 22100,
    auctionEnd: new Date(Date.now() + 5 * 60 * 60 * 1000),
    imageUrl: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400',
    link: 'https://autorola.be',
    location: 'Ghent',
  },
  {
    id: 'adesa-demo-1',
    source: 'Adesa',
    title: 'Volkswagen Golf 8 R-Line',
    make: 'Volkswagen',
    model: 'Golf',
    year: 2023,
    mileage: 12000,
    fuel: 'Benzine',
    transmission: 'DSG',
    currentBid: 29500,
    auctionEnd: new Date(Date.now() + 15 * 60 * 1000),
    imageUrl: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400',
    link: 'https://adesa.eu',
    location: 'Liège',
  },
  {
    id: 'bca-demo-2',
    source: 'BCA',
    title: 'Porsche Cayenne Coupe E-Hybrid',
    make: 'Porsche',
    model: 'Cayenne',
    year: 2021,
    mileage: 35000,
    fuel: 'Hybride',
    transmission: 'Automatic',
    currentBid: 72000,
    buyNow: 79000,
    auctionEnd: new Date(Date.now() + 1 * 60 * 60 * 1000),
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400',
    link: 'https://bca.be',
    location: 'Antwerp',
  },
  {
    id: 'autorola-demo-3',
    source: 'Autorola',
    title: 'Renault Clio V TCe 100 Intens',
    make: 'Renault',
    model: 'Clio',
    year: 2022,
    mileage: 32000,
    fuel: 'Benzine',
    transmission: 'Manual',
    currentBid: 12800,
    auctionEnd: new Date(Date.now() + 8 * 60 * 1000),
    imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400',
    link: 'https://autorola.be',
    location: 'Namur',
  },
  {
    id: 'adesa-demo-2',
    source: 'Adesa',
    title: 'Tesla Model 3 Long Range AWD',
    make: 'Tesla',
    model: 'Model 3',
    year: 2023,
    mileage: 18000,
    fuel: 'Electric',
    transmission: 'Automatic',
    currentBid: 38500,
    auctionEnd: new Date(Date.now() + 3 * 60 * 60 * 1000),
    imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400',
    link: 'https://adesa.eu',
    location: 'Brussels',
  },
  {
    id: 'bca-demo-3',
    source: 'BCA',
    title: 'Peugeot 3008 GT BlueHDi',
    make: 'Peugeot',
    model: '3008',
    year: 2021,
    mileage: 52000,
    fuel: 'Diesel',
    transmission: 'Automatic',
    currentBid: 21500,
    auctionEnd: new Date(Date.now() + 4 * 60 * 60 * 1000),
    imageUrl: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400',
    link: 'https://bca.be',
    location: 'Charleroi',
  },
];

// Scrape 2dehands.be (this one works!)
async function scrape2dehands(): Promise<AuctionCar[]> {
  const cars: AuctionCar[] = [];
  
  const brands: Record<string, number[]> = {
    'Volkswagen': [157, 95],
    'BMW': [96],
    'Mercedes-Benz': [130],
    'Audi': [93]
  };

  for (const [brandName, categoryIds] of Object.entries(brands)) {
    for (const catId of categoryIds) {
      try {
        const url = `https://www.2dehands.be/lrp/api/search?l1CategoryId=91&l2CategoryId=${catId}&limit=30`;
        
        const resp = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'application/json',
          },
        });

        if (resp.ok) {
          const data = await resp.json();
          const listings = data.listings || [];

          for (const item of listings) {
            const priceCents = item.priceInfo?.priceCents || 0;
            const price = priceCents / 100;
            
            // Skip if price too low or too high for auction-like deals
            if (price < 1000 || price > 50000) continue;

            const attrs: Record<string, string> = {};
            for (const a of (item.attributes || [])) {
              attrs[a.key] = a.value || '';
            }

            const year = parseInt(attrs.constructionYear) || 2020;
            const km = parseInt((attrs.mileage || '0').replace(/\./g, '')) || 0;
            
            // Skip old cars or high mileage
            if (year < 2015 || km > 150000) continue;

            const extAttrs: Record<string, string> = {};
            for (const a of (item.extendedAttributes || [])) {
              extAttrs[a.key] = a.value || '';
            }

            const link = item.vipUrl || '';
            
            cars.push({
              id: `2dehands-${item.itemId}`,
              source: '2dehands',
              title: item.title || `${brandName} ${attrs.model || ''}`,
              make: brandName,
              model: attrs.model || '',
              year,
              mileage: km,
              fuel: attrs.fuel || 'Unknown',
              transmission: attrs.transmission || 'Unknown',
              currentBid: price,
              auctionEnd: new Date(Date.now() + Math.random() * 24 * 60 * 60 * 1000), // Random end time
              imageUrl: item.imageUrls?.[0] || '',
              link: link.startsWith('/') ? `https://www.2dehands.be${link}` : link,
              location: item.location?.cityName || 'Belgium',
            });
          }
        }
      } catch (e) {
        console.error(`Error scraping 2dehands ${brandName}:`, e);
      }
    }
  }

  return cars;
}

export async function getAllAuctions(): Promise<AuctionCar[]> {
  const allCars: AuctionCar[] = [];
  
  // Add demo auction data (Autorola, BCA, Adesa need login)
  allCars.push(...DEMO_AUCTION_CARS);
  
  // Add real 2dehands data
  try {
    const tweedehandsCars = await scrape2dehands();
    allCars.push(...tweedehandsCars);
    console.log(`Scraped ${tweedehandsCars.length} cars from 2dehands.be`);
  } catch (e) {
    console.error('2dehands scrape failed:', e);
  }
  
  // Sort by auction end time
  allCars.sort((a, b) => new Date(a.auctionEnd).getTime() - new Date(b.auctionEnd).getTime());
  
  return allCars;
}

export function getUniqueMakes(cars: AuctionCar[]): string[] {
  return [...new Set(cars.map(c => c.make))].sort();
}

export function getUniqueSources(cars: AuctionCar[]): string[] {
  return [...new Set(cars.map(c => c.source))].sort();
}
