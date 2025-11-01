import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pdfUrl = searchParams.get('url');

  if (!pdfUrl) {
    return NextResponse.json({ error: 'PDF URL is required' }, { status: 400 });
  }

  try {
    // Validate URL format
    let url: URL;
    try {
      url = new URL(pdfUrl);
    } catch (urlError) {
      // If URL is invalid, try prepending https://
      try {
        url = new URL(`https://${pdfUrl}`);
      } catch (secondUrlError) {
        return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
      }
    }
    
    // Allow PDF files from nu.ac.bd domain, but also allow other domains with warning
    const isNuDomain = url.hostname.includes('nu.ac.bd');
    
    // For non-NU domains, we'll still allow the redirect but with a warning in logs
    if (!isNuDomain) {
      console.warn(`PDF redirect requested for non-NU domain: ${url.hostname}`);
    }

    // Fetch PDF headers to validate it's a PDF
    const response = await fetch(url.toString(), { method: 'HEAD' });
    
    if (!response.ok) {
      return NextResponse.json({ error: 'PDF not found' }, { status: 404 });
    }

    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/pdf')) {
      return NextResponse.json({ 
        error: 'Invalid PDF file', 
        details: `Content-Type: ${contentType}` 
      }, { status: 400 });
    }

    // Return the PDF URL with proper headers for embedding
    return NextResponse.redirect(url.toString(), 307);
    
  } catch (error) {
    console.error('PDF redirect error:', error);
    return NextResponse.json({ 
      error: 'Failed to process PDF',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}