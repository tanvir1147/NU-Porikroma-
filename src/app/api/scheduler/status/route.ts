import { NextRequest, NextResponse } from 'next/server';
import noticeScheduler from '@/lib/scheduler';

export async function GET() {
  try {
    const status = noticeScheduler.getStatus();
    
    return NextResponse.json({ 
      success: true, 
      status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting scheduler status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get scheduler status' },
      { status: 500 }
    );
  }
}