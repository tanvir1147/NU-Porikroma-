import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

interface Notice {
  id: string;
  title: string;
  postDate: string;
  link: string;
  category: string;
}

export async function GET(request: NextRequest) {
  try {
    const zai = await ZAI.create();
    
    // Directly scrape the NU recent notice page
    const realNotices = await scrapeNURecentNotices(zai);
    
    return NextResponse.json({ notices: realNotices });
  } catch (error) {
    console.error('Error fetching real notices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch real notices' },
      { status: 500 }
    );
  }
}

async function scrapeNURecentNotices(zai: any): Promise<Notice[]> {
  const notices: Notice[] = [];
  
  try {
    // Search for the actual NU recent notice page
    const searchResult = await zai.functions.invoke("web_search", {
      query: "site:nu.ac.bd recent-news-notice.php",
      num: 5
    });

    if (searchResult && searchResult.length > 0) {
      const nuPageUrl = searchResult[0].url;
      console.log('Found NU page:', nuPageUrl);
      
      // Now search for PDFs specifically on that page
      const pdfSearch = await zai.functions.invoke("web_search", {
        query: `site:nu.ac.bd/uploads/notices/ filetype:pdf 2025`,
        num: 20
      });

      for (const result of pdfSearch) {
        if (result.url && result.url.includes('.pdf') && result.url.includes('nu.ac.bd')) {
          const title = extractTitleFromUrl(result.url) || extractTitleFromSnippet(result.snippet);
          const postDate = extractDateFromUrl(result.url) || extractDateFromText(result.snippet) || new Date().toISOString().split('T')[0];
          
          notices.push({
            id: generateId(),
            title: title,
            postDate: postDate,
            link: result.url,
            category: extractCategory(title)
          });
        }
      }
    }

    // Also try direct search for NU notice PDFs
    const directPdfSearch = await zai.functions.invoke("web_search", {
      query: "site:nu.ac.bd \"notice_\" filetype:pdf 2025",
      num: 15
    });

    for (const result of directPdfSearch) {
      if (result.url && result.url.includes('.pdf') && result.url.includes('nu.ac.bd')) {
        // Avoid duplicates
        if (!notices.find(n => n.link === result.url)) {
          const title = extractTitleFromUrl(result.url) || extractTitleFromSnippet(result.snippet);
          const postDate = extractDateFromUrl(result.url) || extractDateFromText(result.snippet) || new Date().toISOString().split('T')[0];
          
          notices.push({
            id: generateId(),
            title: title,
            postDate: postDate,
            link: result.url,
            category: extractCategory(title)
          });
        }
      }
    }

    // Sort by date (newest first)
    notices.sort((a, b) => new Date(b.postDate).getTime() - new Date(a.postDate).getTime());

    console.log(`Found ${notices.length} real NU notices`);
    return notices;

  } catch (error) {
    console.error('Error scraping NU notices:', error);
    return [];
  }
}

function extractTitleFromUrl(url: string): string {
  // Extract title from URL like notice_5374_pub_date_07052025.pdf
  const match = url.match(/notice_(\d+)_/);
  if (match) {
    return `NU Notice #${match[1]}`;
  }
  
  // Try to extract from filename
  const filename = url.split('/').pop() || '';
  if (filename) {
    return filename.replace('.pdf', '').replace(/_/g, ' ');
  }
  
  return 'National University Notice';
}

function extractTitleFromSnippet(snippet: string): string {
  // Try to extract a meaningful title from the snippet
  const words = snippet.split(' ').slice(0, 8).join(' ');
  if (words.length > 10) {
    return words + '...';
  }
  return words || 'National University Notice';
}

function extractDateFromUrl(url: string): string | null {
  // Look for date patterns in URL like 07052025 (July 7, 2025)
  const dateMatch = url.match(/(\d{2})(\d{2})(\d{4})/);
  if (dateMatch) {
    const [, day, month, year] = dateMatch;
    return `${year}-${month}-${day}`;
  }
  
  // Look for year in URL
  const yearMatch = url.match(/20(2[3-9]|3[0-9])/);
  if (yearMatch) {
    return `${yearMatch[0]}-01-01`;
  }
  
  return null;
}

function extractDateFromText(text: string): string | null {
  // Look for date patterns like 2024-01-15, 15/01/2024, January 15, 2024
  const datePatterns = [
    /\d{4}-\d{2}-\d{2}/,
    /\d{2}\/\d{2}\/\d{4}/,
    /\d{1,2}\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}/i
  ];
  
  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[0];
    }
  }
  
  return null;
}

function extractCategory(title: string): string {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('exam') || titleLower.includes('result') || titleLower.includes('পরীক্ষা')) {
    return 'Exam Result';
  } else if (titleLower.includes('admission') || titleLower.includes('admit') || titleLower.includes('ভর্তি')) {
    return 'Admission';
  } else if (titleLower.includes('routine') || titleLower.includes('schedule') || titleLower.includes('রুটিন')) {
    return 'Routine';
  } else if (titleLower.includes('notice') || titleLower.includes('circular') || titleLower.includes('বিজ্ঞপ্তি')) {
    return 'Notice';
  } else {
    return 'General';
  }
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}