import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🔍 Testing for October 2025 notices...');
    
    const response = await fetch('https://www.nu.ac.bd/recent-news-notice.php', {
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
      return NextResponse.json({
        error: `HTTP ${response.status}: ${response.statusText}`,
        success: false
      });
    }

    const html = await response.text();
    
    // Look for any October 2025 patterns
    const octoberPatterns = [
      // Standard pattern: pub_date_DDMMYYYY
      /pub_date_(\d{2})(10)(2025)\.pdf/g,
      // Alternative patterns that might exist
      /pub_date_(\d{1,2})[-_](10)[-_](2025)\.pdf/g,
      /pub_date_(\d{1,2})[-_](oct)[-_](2025)\.pdf/gi,
      // Any PDF with October 2025 in filename
      /[^"']*(?:10|oct)[^"']*2025[^"']*\.pdf/gi,
      // Any link containing October 2025 dates
      /(\d{1,2})[-/](10)[-/](2025)/g,
      /(\d{1,2})[-/](oct)[-/](2025)/gi
    ];
    
    const results = {
      octoberFindings: [] as any[],
      novemberCount: 0,
      totalPdfCount: 0
    };
    
    // Count total PDFs
    const allPdfs = html.match(/\.pdf/g) || [];
    results.totalPdfCount = allPdfs.length;
    
    // Count November 2025 for comparison
    const novemberMatches = html.match(/pub_date_(\d{2})(11)(2025)\.pdf/g) || [];
    results.novemberCount = novemberMatches.length;
    
    // Search for October patterns
    for (const pattern of octoberPatterns) {
      const matches = html.match(pattern);
      if (matches) {
        results.octoberFindings.push({
          pattern: pattern.toString(),
          matches: matches.slice(0, 10), // First 10 matches
          count: matches.length
        });
      }
    }
    
    // Also look for any 2025 dates in October range
    const tableMatch = html.match(/<table[^>]*>[\s\S]*?<\/table>/gi);
    if (tableMatch) {
      const table = tableMatch[0];
      const rowMatches = table.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || [];
      
      let octoberRows = 0;
      let novemberRows = 0;
      
      for (const row of rowMatches.slice(0, 100)) { // Check first 100 rows
        if (row.includes('pub_date_') && row.includes('2025')) {
          if (row.includes('10') && row.includes('2025')) {
            octoberRows++;
          }
          if (row.includes('11') && row.includes('2025')) {
            novemberRows++;
          }
        }
      }
      
      results.octoberFindings.push({
        pattern: 'Table row analysis',
        matches: [`${octoberRows} rows with October 2025 patterns`, `${novemberRows} rows with November 2025 patterns`],
        count: octoberRows
      });
    }

    return NextResponse.json({
      success: true,
      results,
      message: 'October 2025 search completed',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error testing October notices:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}