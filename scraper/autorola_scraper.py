#!/usr/bin/env python3
"""
Autorola Belgium scraper using scrapling to bypass Cloudflare
"""

import json
import re
from datetime import datetime, timedelta
from scrapling import Fetcher, StealthyFetcher, PlayWrightFetcher

# Try stealth approach first
fetcher = StealthyFetcher(auto_match=True)

def scrape_autorola():
    """Scrape Autorola Belgium auction listings"""
    cars = []
    
    try:
        # Use PlayWright for JS-rendered content
        pw_fetcher = PlayWrightFetcher(auto_match=True)
        
        # Navigate to search page
        page = pw_fetcher.fetch(
            'https://www.autorola.be/nl-be/zoeken',
            headless=True,
            wait_selector='.vehicle-card, .search-results, [data-testid="vehicle"]',
            timeout=30000
        )
        
        print(f"Page status: {page.status}")
        print(f"Page length: {len(page.html_content)} chars")
        
        # Find vehicle cards/listings
        # Autorola typically uses structured data or JSON in script tags
        scripts = page.css('script[type="application/ld+json"]')
        for script in scripts:
            try:
                data = json.loads(script.text)
                if isinstance(data, list):
                    for item in data:
                        if item.get('@type') == 'Car' or item.get('@type') == 'Vehicle':
                            cars.append(parse_autorola_json(item))
                elif data.get('@type') in ['Car', 'Vehicle']:
                    cars.append(parse_autorola_json(data))
            except:
                pass
        
        # Also try extracting from __NEXT_DATA__ or similar
        next_data = page.css('script#__NEXT_DATA__')
        if next_data:
            try:
                data = json.loads(next_data[0].text)
                vehicles = extract_vehicles_from_nextdata(data)
                cars.extend(vehicles)
            except:
                pass
        
        # Fallback: parse vehicle cards directly
        vehicle_cards = page.css('.vehicle-card, .auction-item, [data-vehicle-id], .car-listing')
        for card in vehicle_cards:
            car = parse_vehicle_card(card)
            if car:
                cars.append(car)
        
        print(f"Found {len(cars)} vehicles")
        
    except Exception as e:
        print(f"Error scraping Autorola: {e}")
        
        # Fallback: try regular fetch
        try:
            response = fetcher.fetch('https://www.autorola.be/nl-be/zoeken')
            print(f"Fallback status: {response.status}")
        except Exception as e2:
            print(f"Fallback also failed: {e2}")
    
    return cars

def parse_autorola_json(data):
    """Parse structured JSON data from Autorola"""
    return {
        'id': f"autorola-{data.get('sku', data.get('identifier', 'unknown'))}",
        'source': 'Autorola',
        'title': data.get('name', ''),
        'make': data.get('brand', {}).get('name', '') if isinstance(data.get('brand'), dict) else data.get('brand', ''),
        'model': data.get('model', ''),
        'year': int(data.get('productionDate', data.get('vehicleModelDate', '2020'))[:4]) if data.get('productionDate') or data.get('vehicleModelDate') else 2020,
        'mileage': int(data.get('mileageFromOdometer', {}).get('value', 0)) if isinstance(data.get('mileageFromOdometer'), dict) else 0,
        'fuel': data.get('fuelType', 'Unknown'),
        'transmission': data.get('vehicleTransmission', 'Unknown'),
        'currentBid': float(data.get('offers', {}).get('price', 0)) if isinstance(data.get('offers'), dict) else 0,
        'auctionEnd': (datetime.now() + timedelta(hours=24)).isoformat(),
        'imageUrl': data.get('image', [''])[0] if isinstance(data.get('image'), list) else data.get('image', ''),
        'link': data.get('url', ''),
        'location': 'Belgium',
    }

def parse_vehicle_card(card):
    """Parse a vehicle card HTML element"""
    try:
        title_el = card.css('.title, .vehicle-title, h2, h3')[0] if card.css('.title, .vehicle-title, h2, h3') else None
        price_el = card.css('.price, .current-bid, .auction-price')[0] if card.css('.price, .current-bid, .auction-price') else None
        
        if not title_el:
            return None
        
        title = title_el.text.strip()
        
        # Extract price
        price = 0
        if price_el:
            price_text = price_el.text.strip()
            price_match = re.search(r'[\d.,]+', price_text.replace('.', '').replace(',', ''))
            if price_match:
                price = float(price_match.group())
        
        # Try to extract make/model from title
        parts = title.split()
        make = parts[0] if parts else 'Unknown'
        model = ' '.join(parts[1:3]) if len(parts) > 1 else ''
        
        return {
            'id': f"autorola-{hash(title)}",
            'source': 'Autorola',
            'title': title,
            'make': make,
            'model': model,
            'year': 2020,
            'mileage': 0,
            'fuel': 'Unknown',
            'transmission': 'Unknown',
            'currentBid': price,
            'auctionEnd': (datetime.now() + timedelta(hours=24)).isoformat(),
            'imageUrl': '',
            'link': card.css('a')[0].attrib.get('href', '') if card.css('a') else '',
            'location': 'Belgium',
        }
    except:
        return None

def extract_vehicles_from_nextdata(data):
    """Extract vehicles from Next.js __NEXT_DATA__"""
    vehicles = []
    
    def search(obj, depth=0):
        if depth > 10:
            return
        if isinstance(obj, dict):
            if 'vehicles' in obj:
                for v in obj['vehicles']:
                    vehicles.append(parse_autorola_json(v))
            if 'auctions' in obj:
                for v in obj['auctions']:
                    vehicles.append(parse_autorola_json(v))
            for v in obj.values():
                search(v, depth + 1)
        elif isinstance(obj, list):
            for item in obj:
                search(item, depth + 1)
    
    search(data)
    return vehicles

if __name__ == '__main__':
    print("🚗 Scraping Autorola Belgium...")
    cars = scrape_autorola()
    
    # Save results
    with open('/root/clawd/auction-sniper/scraper/autorola_results.json', 'w') as f:
        json.dump(cars, f, indent=2, default=str)
    
    print(f"\n✅ Saved {len(cars)} vehicles to autorola_results.json")
    
    # Print first few
    for car in cars[:5]:
        print(f"  - {car['title']}: €{car['currentBid']}")
