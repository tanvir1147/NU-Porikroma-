import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pdfUrl = searchParams.get('url');
  
  if (!pdfUrl) {
    return NextResponse.json(
      { error: 'PDF URL is required' },
      { status: 400 }
    );
  }

  try {
    // Validate URL format
    let url: string;
    try {
      new URL(pdfUrl);
      url = pdfUrl;
    } catch (urlError) {
      // If URL is invalid, try prepending https://
      try {
        new URL(`https://${pdfUrl}`);
        url = `https://${pdfUrl}`;
      } catch (secondUrlError) {
        return NextResponse.json(
          { error: 'Invalid URL format' },
          { status: 400 }
        );
      }
    }

    // Fetch the PDF from the original URL
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
    }

    // Check if the response is actually a PDF
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/pdf')) {
      throw new Error(`URL does not point to a PDF file. Content-Type: ${contentType}`);
    }

    // Get the PDF content as buffer
    const pdfBuffer = await response.arrayBuffer();
    
    // Get filename from URL or generate one
    const urlParts = url.split('/');
    const filename = urlParts[urlParts.length - 1] || 'notice.pdf';
    
    // Return the PDF as a downloadable file
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Error downloading PDF:', error);
    return NextResponse.json(
      { 
        error: 'Failed to download PDF',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}