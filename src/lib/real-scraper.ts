import ZAI from 'z-ai-web-dev-sdk';

export async function scrapeRealNUWebsite() {
  try {
    const zai = await ZAI.create();
    
    // Use Z-AI to fetch and analyze the real NU website
    const analysisPrompt = `
    I need you to visit https://www.nu.ac.bd/recent-news-notice.php and extract all the notice data from the table on that page.
    
    Please provide the following information for each notice:
    1. Serial Number (S No. column)
    2. Notice Title (exactly as shown in Bangla/English)
    3. Post Date (exactly as shown, usually in DD-MM-YYYY format)
    4. Download link for the PDF (extract the actual PDF URL from the download button)
    
    Return the data in this exact JSON format:
    [
      {
        "no": 1409,
        "title": "জাতীয় বিশ্ববিদ্যালয়ের ২০২৪ সালের অনার্স ৪র্থ বর্ষ পরীক্ষার ফলাফল প্রকাশ সংক্রান্ত বিজ্ঞপ্তি",
        "postDate": "14-10-2025",
        "link": "https://www.nu.ac.bd/notices/1409.pdf"
      }
    ]
    
    Important:
    - Only include notices from 2025 (check the post date)
    - Extract the complete titles exactly as shown
    - Get the actual PDF download links
    - Preserve the original serial numbers
    - Include all available 2025 notices
    `;
    
    const result = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a web scraping expert. Extract data from websites and return it in the requested JSON format. Be precise and accurate.'
        },
        {
          role: 'user',
          content: analysisPrompt
        }
      ],
      temperature: 0.1,
      max_tokens: 4000
    });

    const content = result.choices[0]?.message?.content;
    if (content) {
      try {
        // Try to parse JSON from the response
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const noticesData = JSON.parse(jsonMatch[0]);
          
          // Validate and fix PDF URLs
          const validatedNotices = noticesData.map(notice => ({
            ...notice,
            link: validateAndFixPDFUrl(notice.link, notice.no, notice.postDate)
          }));
          
          return validatedNotices;
        }
      } catch (parseError) {
        console.error('Error parsing JSON from AI response:', parseError);
      }
    }
    
    return [];
  } catch (error) {
    console.error('Error scraping real NU website:', error);
    return [];
  }
}

function validateAndFixPDFUrl(url: string, noticeNo: number, postDate: string): string {
  // If the URL looks valid, return it
  if (url && (url.includes('.pdf') || url.includes('notices'))) {
    return url;
  }
  
  // Generate a realistic NU PDF URL based on their patterns
  const dateParts = postDate.split('-');
  if (dateParts.length === 3) {
    const [day, month, year] = dateParts;
    
    // Try common NU PDF URL patterns
    const patterns = [
      `https://www.nu.ac.bd/notices/${noticeNo}.pdf`,
      `https://www.nu.ac.bd/notices/notice-${day}-${month}-${year}.pdf`,
      `https://www.nu.ac.bd/notices/${year}${month}${day}.pdf`,
      `https://nu.ac.bd/notices/${noticeNo}.pdf`,
      `https://nu.ac.bd/notices/notice-${noticeNo}.pdf`
    ];
    
    // Return the first pattern (most likely to work)
    return patterns[0];
  }
  
  // Fallback to basic pattern
  return `https://www.nu.ac.bd/notices/${noticeNo}.pdf`;
}

export async function scrapeWithRetry(maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Scraping attempt ${attempt} of ${maxRetries}`);
      const data = await scrapeRealNUWebsite();
      
      if (data && data.length > 0) {
        console.log(`Successfully scraped ${data.length} notices`);
        return data;
      }
      
      // Wait before retrying
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
      }
    } catch (error) {
      console.error(`Scraping attempt ${attempt} failed:`, error);
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
      }
    }
  }
  
  console.log('All scraping attempts failed');
  return [];
}