import { NextResponse } from 'next/server';
import { scrapeNotices, NU_URLS } from '@/lib/scraper';
import { db } from '@/lib/db';

export async function POST() {
  try {
    console.log('🔄 Initializing database and scraping notices...');
    
    // Check if database already has notices
    const existingNotices = await db.notice.count();
    if (existingNotices > 0) {
      return NextResponse.json({ 
        success: true, 
        message: `Database already initialized with ${existingNotices} notices`,
        notices: existingNotices
      });
    }
    
    // Scrape notices from NU website
    const notices = await scrapeNotices(NU_URLS.recent, 'Recent');
    
    if (notices && notices.length > 0) {
      // Save notices to database
      let savedCount = 0;
      
      for (const notice of notices) {
        try {
          await db.notice.create({
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
          savedCount++;
        } catch (error) {
          // Skip duplicates
          console.log('Skipping duplicate notice:', notice.title.substring(0, 50));
        }
      }
      
      console.log(`✅ Database initialized with ${savedCount} notices`);
      
      return NextResponse.json({ 
        success: true, 
        message: `Database initialized successfully with ${savedCount} notices`,
        notices: savedCount
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'No notices found to initialize database',
        notices: 0
      });
    }
    
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to initialize database'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const noticeCount = await db.notice.count();
    return NextResponse.json({ 
      success: true, 
      notices: noticeCount,
      message: `Database has ${noticeCount} notices`
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}