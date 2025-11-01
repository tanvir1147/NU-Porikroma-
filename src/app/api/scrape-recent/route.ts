import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { scrapeNotices, NU_URLS } from '@/lib/scraper';
import noticeScheduler from '@/lib/scheduler';

export async function POST() {
  try {
    console.log('🚀 Starting manual scrape of recent news...');
    
    // Use the scheduler's scrapeRecentOnly method for consistency
    const result = await noticeScheduler.scrapeRecentOnly();
    
    return NextResponse.json({ 
      success: true, 
      message: `Scraped ${result.totalProcessed} notices from recent news. Added ${result.totalNewNotices} new notices. The scheduler runs automatically every 4 hours.`,
      totalNotices: result.totalProcessed,
      newNotices: result.totalNewNotices,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Manual scraping error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to scrape recent notices' },
      { status: 500 }
    );
  }
}