// Removed Z-AI dependency for more reliable scraping

// Keyword mapping for categorization
const COURSE_KEYWORDS = {
  'Honours': ['অনার্স', 'Honours', "Hon's"],
  'Degree Pass': ['ডিগ্রী', 'Degree', 'B.A', 'BSS', 'B.Sc', 'B.Com'],
  'Masters': ['মাস্টার্স', 'Masters', 'M.A', 'MSS', 'MBA'],
  'Professional': ['প্রফেশনাল', 'Professional', 'LLB', 'CSE', 'B.Ed', 'BBA', 'MCSE']
};

const YEAR_KEYWORDS = {
  '1st Year': ['১ম বর্ষ', 'প্রথম বর্ষ', '1st Year', 'First Year'],
  '2nd Year': ['২য় বর্ষ', 'দ্বিতীয় বর্ষ', '2nd Year', 'Second Year'],
  '3rd Year': ['৩য় বর্ষ', 'তৃতীয় বর্ষ', '3rd Year', 'Third Year'],
  '4th / Final Year': ['৪র্থ বর্ষ', 'Final', '4th Year', 'Final Year']
};

export function categorizeNotice(title: string) {
  let course = 'General';
  let year = 'N/A';

  // Find course
  for (const [courseName, keywords] of Object.entries(COURSE_KEYWORDS)) {
    if (keywords.some(keyword => title.toLowerCase().includes(keyword.toLowerCase()))) {
      course = courseName;
      break;
    }
  }

  // Find year
  for (const [yearName, keywords] of Object.entries(YEAR_KEYWORDS)) {
    if (keywords.some(keyword => title.toLowerCase().includes(keyword.toLowerCase()))) {
      year = yearName;
      break;
    }
  }

  return { course, year };
}

function filterRecentNotices(notices: any[]) {
  // Target November (month 11) and October (month 10) of 2025
  const targetYear = 2025;
  const targetMonths = [9, 10]; // October = 9, November = 10 (0-indexed)
  
  // Calculate 60 days ago from today
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
  
  console.log(`Filtering notices for November and October 2025 only (excluding notices older than 60 days)`);
  
  return notices.filter(notice => {
    try {
      // Parse the date from DD-MM-YYYY format
      const dateParts = notice.postDate.split('-');
      if (dateParts.length !== 3) return false;
      
      const day = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]) - 1; // JavaScript months are 0-indexed (October = 9, November = 10)
      const year = parseInt(dateParts[2]);
      
      // Create notice date
      const noticeDate = new Date(year, month, day);
      
      // Check if notice is older than 60 days
      if (noticeDate < sixtyDaysAgo) {
        console.log(`🗑️ Excluding old notice (${notice.postDate}): ${notice.title.substring(0, 50)}...`);
        return false;
      }
      
      // Only include notices from 2025
      if (year !== targetYear) return false;
      
      // Check if the notice is from October or November 2025
      const isTargetMonth = targetMonths.includes(month);
      
      if (isTargetMonth) {
        const monthName = month === 9 ? 'October' : month === 10 ? 'November' : 'Unknown';
        console.log(`✅ Including ${monthName} 2025 notice: ${notice.title.substring(0, 50)}... (${day}-${month + 1}-${year})`);
      }
      
      return isTargetMonth;
    } catch (error) {
      console.warn('Error parsing date for notice:', notice.postDate, error);
      return false;
    }
  });
}

export async function scrapeNotices(url: string, category: string) {
  try {
    console.log(`Starting to scrape ${url} for category: ${category}`);
    
    // Only scrape from the recent news notice page
    if (!url.includes('recent-news-notice.php')) {
      console.log(`Skipping non-recent-news URL: ${url}`);
      return [];
    }
    
    // Use direct HTTP scraping for more reliability
    const notices = await scrapeNUWebsiteDirectly(url, category);
    
    if (notices && notices.length > 0) {
      // Filter notices to only include October and November 2025
      const filteredNotices = filterRecentNotices(notices);
      console.log(`Successfully scraped ${filteredNotices.length} notices from NU website (October & November 2025 only)`);
      return filteredNotices.slice(0, 50); // Limit to 50 notices
    }
    
    console.log('⚠️ No October/November 2025 notices found on NU website - returning empty array');
    return []; // Return empty array instead of fake data
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    // Return empty array instead of fake data
    return [];
  }
}

async function scrapeNUWebsiteDirectly(url: string, category: string) {
  try {
    console.log(`Fetching ${url}...`);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      }
    });

    if (!response.ok) {
      console.log(`HTTP error: ${response.status} ${response.statusText}`);
      return [];
    }

    const html = await response.text();
    console.log(`Received HTML content (${html.length} characters)`);
    
    return parseNoticesFromHTML(html, category);
  } catch (error) {
    console.error('Direct scraping error:', error);
    return [];
  }
}

function parseNoticesFromHTML(html: string, category: string) {
  const notices: any[] = [];
  
  try {
    console.log('🔍 Parsing HTML content for October & November 2025 notices...');
    
    // Look for the main table containing notices
    const tableMatch = html.match(/<table[^>]*>[\s\S]*?<\/table>/gi);
    if (!tableMatch) {
      console.log('❌ No table found in HTML');
      return [];
    }
    
    console.log(`📋 Found ${tableMatch.length} table(s) in HTML`);
    
    // Process each table
    for (const table of tableMatch) {
      // Extract table rows
      const rowMatches = table.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi);
      if (!rowMatches) continue;
      
      console.log(`📝 Processing ${rowMatches.length} rows in table`);
      
      let octoberCount = 0;
      let novemberCount = 0;
      
      for (const row of rowMatches) {
        try {
          // Look for PDF links with specific date patterns in filename
          // Pattern: pub_date_DDMMYYYY where YYYY=2025 and MM=10 or 11
          const pdfLinkMatch = row.match(/<a[^>]+href=["']([^"']*pub_date_(\d{2})(\d{2})(2025)\.pdf)["'][^>]*>([^<]*)<\/a>/i);
          if (!pdfLinkMatch) continue;
          
          const link = pdfLinkMatch[1];
          const day = pdfLinkMatch[2];
          const month = pdfLinkMatch[3];
          const year = pdfLinkMatch[4];
          let title = pdfLinkMatch[5].replace(/<[^>]*>/g, '').trim();
          
          // Only process October (10) and November (11) 2025
          if (month !== '10' && month !== '11') continue;
          
          // Count the months we're finding
          if (month === '10') octoberCount++;
          if (month === '11') novemberCount++;
          
          // Skip if title is too short or empty
          if (!title || title.length < 10) continue;
          
          // Format date as DD-MM-YYYY
          const postDate = `${day}-${month}-${year}`;
          
          // Extract notice number from filename or title
          const filenameNoMatch = link.match(/notice_(\d+)_/);
          const titleNoMatch = title.match(/(\d+)/);
          const no = filenameNoMatch ? parseInt(filenameNoMatch[1]) : 
                     titleNoMatch ? parseInt(titleNoMatch[1]) : 
                     Math.floor(Math.random() * 1000) + 1500;
          
          // Ensure absolute URL
          const absoluteLink = link.startsWith('http') ? link : `https://www.nu.ac.bd/${link.startsWith('/') ? link.slice(1) : link}`;
          
          const { course, year: courseYear } = categorizeNotice(title);
          
          notices.push({
            no,
            title,
            link: absoluteLink,
            postDate,
            category,
            course,
            year: courseYear
          });
          
          const monthName = month === '10' ? 'October' : 'November';
          console.log(`✅ Found ${monthName} 2025 notice: ${title.substring(0, 50)}... (${postDate})`);
          
        } catch (rowError) {
          console.warn('Error processing table row:', rowError);
        }
      }
      
      console.log(`📊 Found ${octoberCount} October 2025 PDF links and ${novemberCount} November 2025 PDF links in table`);
    }
    
    // Remove duplicates based on link
    const uniqueNotices = notices.filter((notice: any, index: number, self: any[]) => 
      index === self.findIndex((n: any) => n.link === notice.link)
    );
    
    // Sort by date (newest first)
    uniqueNotices.sort((a, b) => {
      const dateA = new Date(a.postDate.split('-').reverse().join('-'));
      const dateB = new Date(b.postDate.split('-').reverse().join('-'));
      return dateB.getTime() - dateA.getTime();
    });
    
    console.log(`📊 Extracted ${uniqueNotices.length} unique October/November 2025 notices from NU website`);
    return uniqueNotices;
    
  } catch (error) {
    console.error('❌ Error parsing HTML:', error);
    return [];
  }
}

// Removed normalizeDateFormat function - dates are now extracted directly from PDF filenames



// Removed fake fallback notices - only show real data from NU website

export const NU_URLS = {
  recent: 'https://www.nu.ac.bd/recent-news-notice.php'
};