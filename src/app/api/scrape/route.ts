import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { scrapeNotices, NU_URLS } from '@/lib/scraper';

export async function POST() {
  try {
    const categories = ['Recent', 'Examination', 'Admission'];
    const urls = [NU_URLS.recent, NU_URLS.examination, NU_URLS.admission];
    
    let totalNewNotices = 0;

    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      const url = urls[i];
      
      const notices = await scrapeNotices(url, category);
      
      for (const notice of notices) {
        // Check if notice already exists
        const existingNotice = await db.notice.findUnique({
          where: { link: notice.link }
        });

        if (!existingNotice) {
          await db.notice.create({
            data: {
              no: notice.no,
              title: notice.title,
              link: notice.link,
              postDate: notice.postDate,
              category: notice.category,
              course: notice.course,
              year: notice.year
            }
          });
          totalNewNotices++;
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Scraped successfully. Added ${totalNewNotices} new notices.` 
    });
  } catch (error) {
    console.error('Scraping error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to scrape notices' },
      { status: 500 }
    );
  }
}