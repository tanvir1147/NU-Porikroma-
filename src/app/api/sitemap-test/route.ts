import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'https://nu-porikroma.vercel.app';
    
    // Test sitemap accessibility
    const sitemapUrl = `${baseUrl}/sitemap.xml`;
    
    let sitemapStatus = 'Unknown';
    let sitemapContent = '';
    
    try {
      const sitemapResponse = await fetch(sitemapUrl);
      sitemapStatus = `${sitemapResponse.status} ${sitemapResponse.statusText}`;
      
      if (sitemapResponse.ok) {
        sitemapContent = await sitemapResponse.text();
      }
    } catch (fetchError) {
      sitemapStatus = `Fetch Error: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}`;
    }
    
    const testResults = {
      timestamp: new Date().toISOString(),
      baseUrl,
      sitemapUrl,
      sitemapStatus,
      sitemapContentLength: sitemapContent.length,
      sitemapPreview: sitemapContent.substring(0, 500) + (sitemapContent.length > 500 ? '...' : ''),
      headers: {
        'user-agent': request.headers.get('user-agent'),
        'host': request.headers.get('host'),
        'x-forwarded-for': request.headers.get('x-forwarded-for'),
      },
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL_URL: process.env.VERCEL_URL,
      }
    };
    
    return NextResponse.json(testResults, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Sitemap test failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}