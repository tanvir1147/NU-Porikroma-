import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Fetch recent notices from the database
    const notices = await db.notice.findMany({
      orderBy: {
        postDate: 'desc',
      },
      take: 50, // Limit to 50 most recent notices
    });

    // Format the date for RSS
    const formatDate = (date: Date) => {
      return new Date(date).toUTCString();
    };

    // Get the current date for the lastBuildDate
    const now = new Date();

    // Build the RSS XML
    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>NU Porikroma - National University Bangladesh Notices</title>
    <description>Official National University Bangladesh notice management system. Get real-time updates on exam schedules, results, admission notices, and academic announcements.</description>
    <link>https://nu-porikroma.vercel.app</link>
    <language>en-US</language>
    <lastBuildDate>${formatDate(now)}</lastBuildDate>
    <atom:link href="https://nu-porikroma.vercel.app/api/rss" rel="self" type="application/rss+xml" />
    ${notices.map(notice => `
    <item>
      <title><![CDATA[${notice.title}]]></title>
      <description><![CDATA[${notice.category} - Posted on ${new Date(notice.postDate).toLocaleDateString()}]]></description>
      <link>${notice.link}</link>
      <guid>${notice.id}</guid>
      <pubDate>${formatDate(new Date(notice.postDate))}</pubDate>
    </item>
    `).join('')}
  </channel>
</rss>`;

    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('RSS feed generation error:', error);
    return new NextResponse('Error generating RSS feed', { status: 500 });
  }
}