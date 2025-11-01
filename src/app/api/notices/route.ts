import { NextRequest, NextResponse } from 'next/server';
import { scrapeNotices, NU_URLS } from '@/lib/scraper';

interface Notice {
  id: string;
  title: string;
  postDate: string;
  link: string;
  category: string;
  source?: string;
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 Fetching notices from NU website...');
    
    // Use our improved scraper - only scrape recent news
    const allNotices: Notice[] = [];
    
    try {
      console.log('🔄 Scraping recent news from NU website...');
      const notices = await scrapeNotices(NU_URLS.recent, 'Recent');
      
      // Convert to the expected format
      const formattedNotices = notices.map((notice, index) => ({
        id: `nu-${notice.no || index}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: notice.title,
        postDate: notice.postDate,
        link: notice.link,
        category: notice.category,
        source: 'Recent News & Notice'
      }));
      
      allNotices.push(...formattedNotices);
      console.log(`✅ Processed ${formattedNotices.length} recent notices`);
    } catch (error) {
      console.error('❌ Error scraping recent news:', error);
    }
    
    // If we got notices, return them
    if (allNotices.length > 0) {
      console.log(`✅ Successfully fetched ${allNotices.length} notices`);
      return NextResponse.json({ notices: allNotices });
    }
    
    // If no notices were scraped, return empty array with message
    console.log('⚠️ No October/November 2025 notices found on NU website');
    return NextResponse.json({ 
      notices: [], 
      message: 'No notices found for October and November 2025. The NU website may not have published any notices for these months yet.',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error fetching notices:', error);
    
    // Return error message instead of fake data
    return NextResponse.json({ 
      notices: [], 
      error: 'Failed to scrape notices from NU website',
      message: 'There was an error accessing the NU website. Please try again later.',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Removed fallback notices function - only show real data from NU website

