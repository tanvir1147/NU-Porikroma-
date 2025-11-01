import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(request: NextRequest) {
  try {
    // Read the logo file from public directory
    const logoPath = join(process.cwd(), 'public', 'logo.png');
    const logoBuffer = await readFile(logoPath);

    // Return the image with proper headers
    return new NextResponse(logoBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Error serving logo:', error);
    return NextResponse.json(
      { error: 'Logo not found' },
      { status: 404 }
    );
  }
}

export async function HEAD(request: NextRequest) {
  // Handle HEAD requests (used by some crawlers)
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Access-Control-Allow-Origin': '*',
    },
  });
}