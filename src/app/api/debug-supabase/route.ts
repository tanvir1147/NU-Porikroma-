import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('🔍 Debug: Testing Supabase connection...');
    
    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    console.log('Environment check:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey,
      urlPreview: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'missing'
    });
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        success: false,
        error: 'Missing environment variables',
        details: {
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseKey
        }
      });
    }
    
    // Test basic connection
    const { data, error, count } = await supabase
      .from('notices')
      .select('*', { count: 'exact' })
      .eq('is_active', true)
      .limit(5);
    
    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json({
        success: false,
        error: error.message,
        details: error
      });
    }
    
    return NextResponse.json({
      success: true,
      totalCount: count,
      sampleCount: data?.length || 0,
      sampleData: data?.slice(0, 2) || [],
      message: 'Supabase connection working'
    });
    
  } catch (error) {
    console.error('❌ Debug error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}