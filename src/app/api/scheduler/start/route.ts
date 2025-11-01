import { NextRequest, NextResponse } from 'next/server';
import noticeScheduler from '@/lib/scheduler';

export async function POST() {
  try {
    noticeScheduler.start();
    
    return NextResponse.json({ 
      success: true, 
      message: 'NU Notice Scheduler started successfully. Will scrape every 4 hours and only add new notices.',
      status: noticeScheduler.getStatus(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error starting scheduler:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to start scheduler' },
      { status: 500 }
    );
  }
}