import { NextRequest, NextResponse } from 'next/server';
import { scrapeNotices, NU_URLS } from '@/lib/scraper';
import { db } from '@/lib/db';

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
    console.log('🔄 Fetching notices...');
    
    // First, try to get notices from database
    try {
      const dbNotices = await db.notice.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50
      });
      
      if (dbNotices.length > 0) {
        const formattedNotices = dbNotices.map((notice) => ({
          id: notice.id,
          title: notice.title,
          postDate: notice.postDate,
          link: notice.link,
          category: notice.category,
          course: notice.course,
          year: notice.year
        }));
        
        console.log(`✅ Retrieved ${formattedNotices.length} notices from database`);
        return NextResponse.json({ notices: formattedNotices });
      }
    } catch (dbError) {
      console.log('📝 Database not initialized, will scrape fresh data');
    }
    
    // If no database notices, scrape from website
    console.log('🔄 Scraping fresh notices from NU website...');
    const notices = await scrapeNotices(NU_URLS.recent, 'Recent');
    
    if (notices && notices.length > 0) {
      // Save to database and return
      const savedNotices: Notice[] = [];
      
      for (const notice of notices.slice(0, 50)) {
        try {
          const saved = await db.notice.create({
            data: {
              no: notice.no || Math.floor(Math.random() * 10000),
              title: notice.title,
              link: notice.link,
              postDate: notice.postDate,
              category: notice.category || 'General',
              course: notice.course || 'General',
              year: notice.year || 'N/A'
            }
          });
          
          savedNotices.push({
            id: saved.id,
            title: saved.title,
            postDate: saved.postDate,
            link: saved.link,
            category: saved.category,
            course: saved.course,
            year: saved.year
          });
        } catch (error) {
          // Skip duplicates
          console.log('Skipping duplicate notice');
        }
      }
      
      if (savedNotices.length > 0) {
        console.log(`✅ Scraped and saved ${savedNotices.length} notices`);
        return NextResponse.json({ notices: savedNotices });
      }
    }
    
    // If still no notices, return empty with helpful message
    console.log('⚠️ No notices found');
    return NextResponse.json({ 
      notices: [], 
      message: 'No notices found. The system will automatically check for new notices every 6 hours.',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error fetching notices:', error);
    
    return NextResponse.json({ 
      notices: [], 
      error: 'Failed to fetch notices',
      message: 'There was an error fetching notices. Please try again later.',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Removed fallback notices function - only show real data from NU website

