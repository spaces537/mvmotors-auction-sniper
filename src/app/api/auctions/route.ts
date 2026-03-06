import { NextResponse } from 'next/server';
import { getAllAuctions } from '@/lib/scrapers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const cars = await getAllAuctions();
    
    return NextResponse.json({
      cars,
      timestamp: new Date().toISOString(),
      count: cars.length,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch auctions' },
      { status: 500 }
    );
  }
}
