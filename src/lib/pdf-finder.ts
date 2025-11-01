import ZAI from 'z-ai-web-dev-sdk';

export async function findRealPDFUrl(noticeTitle: string, noticeNo: number, postDate: string): Promise<string> {
  try {
    const zai = await ZAI.create();
    
    const searchPrompt = `
    I need to find the actual PDF download URL for this National University Bangladesh notice:
    
    Notice Details:
    - Title: ${noticeTitle}
    - Notice Number: ${noticeNo}
    - Post Date: ${postDate}
    
    Please search the National University Bangladesh website (nu.ac.bd) to find the actual PDF file for this notice.
    
    Common NU PDF URL patterns include:
    - https://www.nu.ac.bd/notices/[notice-number].pdf
    - https://www.nu.ac.bd/notices/notice-[date].pdf
    - https://nu.ac.bd/notices/[year]/[notice-number].pdf
    - https://www.nu.ac.bd/wp-content/uploads/[year]/[month]/[filename].pdf
    
    Please return the most likely working PDF URL. If you cannot find the exact PDF, return the most plausible URL based on NU's naming patterns.
    
    Return only the URL, nothing else.
    `;
    
    const result = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert at finding PDF URLs on university websites. Return only the URL, no additional text.'
        },
        {
          role: 'user',
          content: searchPrompt
        }
      ],
      temperature: 0.1,
      max_tokens: 200
    });

    const content = result.choices[0]?.message?.content?.trim();
    
    if (content && content.startsWith('http')) {
      return content;
    }
    
    // Fallback to generated patterns
    return generatePDFUrl(noticeNo, postDate);
    
  } catch (error) {
    console.error('Error finding PDF URL:', error);
    return generatePDFUrl(noticeNo, postDate);
  }
}

function generatePDFUrl(noticeNo: number, postDate: string): string {
  const dateParts = postDate.split('-');
  if (dateParts.length === 3) {
    const [day, month, year] = dateParts;
    
    // Most likely patterns based on NU website structure
    const patterns = [
      `https://www.nu.ac.bd/notices/${noticeNo}.pdf`,
      `https://www.nu.ac.bd/notices/notice-${day}-${month}-${year}.pdf`,
      `https://www.nu.ac.bd/notices/${year}${month}${day}.pdf`,
      `https://nu.ac.bd/notices/${noticeNo}.pdf`,
      `https://nu.ac.bd/notices/notice-${noticeNo}.pdf`,
      `https://www.nu.ac.bd/wp-content/uploads/${year}/${month}/notice-${noticeNo}.pdf`
    ];
    
    return patterns[0]; // Return most likely pattern
  }
  
  return `https://www.nu.ac.bd/notices/${noticeNo}.pdf`;
}

export async function validatePDFUrl(url: string): Promise<boolean> {
  try {
    // Note: Due to CORS restrictions, we can't directly check PDF URLs from the client
    // This is a server-side function that would need to be called from an API route
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok && response.headers.get('content-type')?.includes('pdf') || false;
  } catch (error) {
    return false;
  }
}