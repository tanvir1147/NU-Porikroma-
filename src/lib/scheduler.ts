import { scrapeNotices, NU_URLS } from './scraper';
import { db } from './db';

class NoticeScheduler {
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;

  start() {
    if (this.isRunning) {
      console.log('Scheduler is already running');
      return;
    }

    console.log('Starting NU Notice Scheduler - will scrape every 4 hours');
    
    // Scrape immediately on start
    this.scrapeAllNotices();
    
    // Then scrape every 4 hours (4 * 60 * 60 * 1000 milliseconds)
    this.intervalId = setInterval(() => {
      this.scrapeAllNotices();
    }, 4 * 60 * 60 * 1000);
    
    this.isRunning = true;
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('NU Notice Scheduler stopped');
  }

  async scrapeAllNotices() {
    try {
      console.log('🔄 Starting scheduled scrape of recent NU notices...');
      
      const categories = ['Recent'];
      const urls = [NU_URLS.recent];
      
      let totalNewNotices = 0;
      let totalProcessed = 0;

      for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        const url = urls[i];
        
        try {
          console.log(`📋 Scraping ${category} notices from ${url}`);
          
          const notices = await scrapeNotices(url, category);
          totalProcessed += notices.length;
          
          // Batch check for existing notices to improve performance
          const existingLinks = new Set();
          if (notices.length > 0) {
            const links = notices.map(notice => notice.link);
            const existingNotices = await db.notice.findMany({
              where: { link: { in: links } },
              select: { link: true }
            });
            
            existingNotices.forEach(notice => existingLinks.add(notice.link));
          }

          // Process only new notices
          for (const notice of notices) {
            // Check if notice already exists
            if (!existingLinks.has(notice.link)) {
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
              console.log(`✅ New notice added: ${notice.title.substring(0, 50)}...`);
            }
          }
          
          console.log(`✅ ${category}: Processed ${notices.length} notices, ${totalNewNotices} new`);
          
        } catch (error) {
          console.error(`❌ Error scraping ${category}:`, error);
        }
      }

      console.log(`🎉 Scheduled scrape completed: ${totalNewNotices} new notices out of ${totalProcessed} processed`);
      
      // Log summary
      if (totalNewNotices > 0) {
        console.log(`📢 Database updated with ${totalNewNotices} new NU notices`);
      } else {
        console.log(`📊 No new notices found. Database already up to date.`);
      }
      
    } catch (error) {
      console.error('❌ Scheduled scraping failed:', error);
    }
  }

  async scrapeRecentOnly() {
    try {
      console.log('🔄 Starting recent news scrape (October & November 2025 notices only)...');
      
      const category = 'Recent';
      const url = NU_URLS.recent;
      
      const notices = await scrapeNotices(url, category);
      let totalNewNotices = 0;
      
      // Batch check for existing notices to improve performance
      const existingLinks = new Set();
      if (notices.length > 0) {
        const links = notices.map(notice => notice.link);
        const existingNotices = await db.notice.findMany({
          where: { link: { in: links } },
          select: { link: true }
        });
        
        existingNotices.forEach(notice => existingLinks.add(notice.link));
      }

      // Process only new notices
      for (const notice of notices) {
        if (!existingLinks.has(notice.link)) {
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

      console.log(`✅ Recent news scrape completed: ${totalNewNotices} new notices`);
      return { totalNewNotices, totalProcessed: notices.length };
      
    } catch (error) {
      console.error('❌ Recent news scraping failed:', error);
      return { totalNewNotices: 0, totalProcessed: 0 };
    }
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      nextScrape: this.isRunning ? new Date(Date.now() + 4 * 60 * 60 * 1000) : null
    };
  }
}

// Create singleton instance
const noticeScheduler = new NoticeScheduler();

export default noticeScheduler;