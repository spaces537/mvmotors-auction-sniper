#!/usr/bin/env python3
"""
Autorola Belgium scraper using Playwright directly
"""

import json
import re
from datetime import datetime, timedelta
from playwright.sync_api import sync_playwright

def scrape_autorola():
    """Scrape Autorola Belgium auction listings"""
    cars = []
    
    with sync_playwright() as p:
        # Launch browser with stealth settings
        browser = p.chromium.launch(
            headless=True,
            args=[
                '--disable-blink-features=AutomationControlled',
                '--no-sandbox',
                '--disable-dev-shm-usage',
            ]
        )
        
        context = browser.new_context(
            viewport={'width': 1920, 'height': 1080},
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            locale='nl-BE',
        )
        
        page = context.new_page()
        
        # Block unnecessary resources for speed
        page.route('**/*.{png,jpg,jpeg,gif,svg,ico,woff,woff2}', lambda route: route.abort())
        
        try:
            print("🔄 Loading Autorola Belgium...")
            page.goto('https://www.autorola.be/nl-be/zoeken', wait_until='domcontentloaded', timeout=30000)
            
            # Wait for Cloudflare challenge if needed
            page.wait_for_timeout(5000)
            
            # Check if we got through
            content = page.content()
            print(f"📄 Page loaded: {len(content)} chars")
            
            # Check for Cloudflare challenge
            if 'challenge' in content.lower() or 'ray id' in content.lower():
                print("⏳ Waiting for Cloudflare challenge...")
                page.wait_for_timeout(10000)
                content = page.content()
            
            # Save HTML for debugging
            with open('/root/clawd/auction-sniper/scraper/autorola_debug.html', 'w') as f:
                f.write(content)
            
            # Try to find vehicle data in various ways
            
            # 1. Look for JSON-LD structured data
            json_ld_scripts = page.locator('script[type="application/ld+json"]').all()
            for script in json_ld_scripts:
                try:
                    data = json.loads(script.inner_text())
                    if isinstance(data, list):
                        for item in data:
                            if item.get('@type') in ['Car', 'Vehicle', 'Product']:
                                cars.append(parse_json_ld(item))
                    elif data.get('@type') in ['Car', 'Vehicle', 'Product']:
                        cars.append(parse_json_ld(data))
                except Exception as e:
                    pass
            
            # 2. Look for __NEXT_DATA__ (Next.js apps)
            next_data = page.locator('#__NEXT_DATA__').all()
            if next_data:
                try:
                    data = json.loads(next_data[0].inner_text())
                    cars.extend(extract_from_next_data(data))
                except:
                    pass
            
            # 3. Look for inline JSON with vehicle data
            all_scripts = page.locator('script:not([src])').all()
            for script in all_scripts:
                try:
                    text = script.inner_text()
                    # Look for JSON objects with vehicle-like properties
                    matches = re.findall(r'\{[^{}]*"vehicles?"[^{}]*\}', text, re.IGNORECASE)
                    for match in matches:
                        try:
                            data = json.loads(match)
                            if 'vehicles' in data:
                                for v in data['vehicles']:
                                    cars.append(parse_vehicle_data(v))
                        except:
                            pass
                except:
                    pass
            
            # 4. Parse vehicle cards from HTML
            selectors = [
                '.vehicle-card',
                '.auction-item', 
                '[data-vehicle]',
                '.car-listing',
                '.search-result-item',
                'article.vehicle',
                '.vehicleCard',
            ]
            
            for selector in selectors:
                cards = page.locator(selector).all()
                if cards:
                    print(f"🎯 Found {len(cards)} elements with selector: {selector}")
                    for card in cards:
                        try:
                            car = parse_html_card(card)
                            if car:
                                cars.append(car)
                        except:
                            pass
            
            print(f"✅ Found {len(cars)} vehicles total")
            
        except Exception as e:
            print(f"❌ Error: {e}")
            
            # Save screenshot for debugging
            try:
                page.screenshot(path='/root/clawd/auction-sniper/scraper/autorola_error.png')
            except:
                pass
        
        finally:
            browser.close()
    
    return cars

def parse_json_ld(data):
    """Parse JSON-LD structured data"""
    return {
        'id': f"autorola-{data.get('sku', hash(data.get('name', '')))}",
        'source': 'Autorola',
        'title': data.get('name', ''),
        'make': extract_brand(data),
        'model': data.get('model', ''),
        'year': extract_year(data),
        'mileage': extract_mileage(data),
        'fuel': data.get('fuelType', 'Unknown'),
        'transmission': data.get('vehicleTransmission', 'Unknown'),
        'currentBid': extract_price(data),
        'auctionEnd': (datetime.now() + timedelta(hours=24)).isoformat(),
        'imageUrl': extract_image(data),
        'link': data.get('url', ''),
        'location': 'Belgium',
    }

def parse_vehicle_data(data):
    """Parse generic vehicle JSON data"""
    return {
        'id': f"autorola-{data.get('id', hash(str(data)))}",
        'source': 'Autorola',
        'title': data.get('title', data.get('name', '')),
        'make': data.get('make', data.get('brand', 'Unknown')),
        'model': data.get('model', ''),
        'year': int(data.get('year', data.get('registrationYear', 2020))),
        'mileage': int(data.get('mileage', data.get('km', 0))),
        'fuel': data.get('fuel', data.get('fuelType', 'Unknown')),
        'transmission': data.get('transmission', 'Unknown'),
        'currentBid': float(data.get('price', data.get('currentBid', 0))),
        'auctionEnd': (datetime.now() + timedelta(hours=24)).isoformat(),
        'imageUrl': data.get('image', data.get('imageUrl', '')),
        'link': data.get('url', data.get('link', '')),
        'location': data.get('location', 'Belgium'),
    }

def parse_html_card(card):
    """Parse a vehicle card HTML element"""
    try:
        # Try to get title
        title = ''
        for sel in ['h2', 'h3', '.title', '.vehicle-title', '[class*="title"]']:
            el = card.locator(sel).first
            if el.count():
                title = el.inner_text().strip()
                break
        
        if not title:
            return None
        
        # Get price
        price = 0
        for sel in ['.price', '[class*="price"]', '[class*="bid"]']:
            el = card.locator(sel).first
            if el.count():
                price_text = el.inner_text()
                match = re.search(r'[\d.,]+', price_text.replace('.', '').replace(',', '.'))
                if match:
                    price = float(match.group())
                break
        
        # Get link
        link = ''
        a = card.locator('a').first
        if a.count():
            link = a.get_attribute('href') or ''
            if link.startswith('/'):
                link = f"https://www.autorola.be{link}"
        
        # Extract make/model from title
        parts = title.split()
        make = parts[0] if parts else 'Unknown'
        model = ' '.join(parts[1:3]) if len(parts) > 1 else ''
        
        return {
            'id': f"autorola-{hash(title)}",
            'source': 'Autorola',
            'title': title,
            'make': make,
            'model': model,
            'year': 2022,
            'mileage': 0,
            'fuel': 'Unknown',
            'transmission': 'Unknown',
            'currentBid': price,
            'auctionEnd': (datetime.now() + timedelta(hours=24)).isoformat(),
            'imageUrl': '',
            'link': link,
            'location': 'Belgium',
        }
    except Exception as e:
        print(f"Card parse error: {e}")
        return None

def extract_brand(data):
    brand = data.get('brand', data.get('manufacturer', ''))
    if isinstance(brand, dict):
        return brand.get('name', '')
    return str(brand)

def extract_year(data):
    for key in ['productionDate', 'vehicleModelDate', 'dateVehicleFirstRegistered', 'year']:
        val = data.get(key)
        if val:
            match = re.search(r'(\d{4})', str(val))
            if match:
                return int(match.group(1))
    return 2020

def extract_mileage(data):
    mileage = data.get('mileageFromOdometer', data.get('mileage', 0))
    if isinstance(mileage, dict):
        return int(mileage.get('value', 0))
    return int(mileage) if mileage else 0

def extract_price(data):
    offers = data.get('offers', {})
    if isinstance(offers, dict):
        return float(offers.get('price', 0))
    return 0

def extract_image(data):
    image = data.get('image', '')
    if isinstance(image, list):
        return image[0] if image else ''
    return image

def extract_from_next_data(data, depth=0):
    """Recursively extract vehicles from Next.js data"""
    if depth > 10:
        return []
    
    vehicles = []
    
    if isinstance(data, dict):
        # Check for vehicle arrays
        for key in ['vehicles', 'auctions', 'items', 'results', 'cars']:
            if key in data and isinstance(data[key], list):
                for item in data[key]:
                    if isinstance(item, dict) and ('make' in item or 'brand' in item or 'title' in item):
                        vehicles.append(parse_vehicle_data(item))
        
        # Recurse into nested objects
        for value in data.values():
            vehicles.extend(extract_from_next_data(value, depth + 1))
    
    elif isinstance(data, list):
        for item in data:
            vehicles.extend(extract_from_next_data(item, depth + 1))
    
    return vehicles

if __name__ == '__main__':
    print("🚗 Scraping Autorola Belgium with Playwright...")
    cars = scrape_autorola()
    
    # Save results
    output_path = '/root/clawd/auction-sniper/scraper/autorola_results.json'
    with open(output_path, 'w') as f:
        json.dump(cars, f, indent=2, default=str)
    
    print(f"\n💾 Saved {len(cars)} vehicles to {output_path}")
    
    # Print summary
    for car in cars[:5]:
        print(f"  - {car['title']}: €{car['currentBid']}")
