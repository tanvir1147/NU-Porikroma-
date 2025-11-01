import { NextRequest, NextResponse } from 'next/server';
import { getNoticesFromSupabase, formatSupabaseNotices } from '@/lib/supabase';

interface Notice {
  id: string;
  title: string;
  postDate: string;
  link: string;
  category: string;
  source?: string;
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 Fetching notices from Supabase...');
    
    // Get notices from your existing Supabase database
    const supabaseNotices = await getNoticesFromSupabase(50);
    
    if (supabaseNotices && supabaseNotices.length > 0) {
      // Format notices for the website
      const formattedNotices = formatSupabaseNotices(supabaseNotices);
      
      console.log(`✅ Successfully fetched ${formattedNotices.length} notices from Supabase`);
      return NextResponse.json({ 
        notices: formattedNotices,
        source: 'Supabase Database',
        timestamp: new Date().toISOString()
      });
    }
    
    // If no notices in Supabase, return demo notices
    console.log('⚠️ No notices found in Supabase, returning demo notices');
    const demoNotices = [
      {
        id: 'demo-1',
        title: '২০২৪ সালের অনার্স ৩য় বর্ষ পরীক্ষার ফলাফল প্রকাশ',
        postDate: '15-10-2025',
        link: 'https://www.nu.ac.bd/notices/demo1.pdf',
        category: 'Result',
        course: 'Honours',
        year: '3rd Year'
      },
      {
        id: 'demo-2',
        title: '২০২৫ সালের ডিগ্রী ১ম বর্ষ ভর্তি বিজ্ঞপ্তি',
        postDate: '12-10-2025',
        link: 'https://www.nu.ac.bd/notices/demo2.pdf',
        category: 'Admission',
        course: 'Degree',
        year: '1st Year'
      },
      {
        id: 'demo-3',
        title: '২০২৪ সালের মাস্টার্স পরীক্ষার সময়সূচী',
        postDate: '10-10-2025',
        link: 'https://www.nu.ac.bd/notices/demo3.pdf',
        category: 'Exam Schedule',
        course: 'Masters',
        year: 'Final Year'
      },
      {
        id: 'demo-4',
        title: 'জাতীয় বিশ্ববিদ্যালয়ের নতুন একাডেমিক ক্যালেন্ডার',
        postDate: '08-10-2025',
        link: 'https://www.nu.ac.bd/notices/demo4.pdf',
        category: 'Academic',
        course: 'General',
        year: 'All Years'
      },
      {
        id: 'demo-5',
        title: '২০২৪ সালের অনার্স ২য় বর্ষ পরীক্ষার কেন্দ্র তালিকা',
        postDate: '05-10-2025',
        link: 'https://www.nu.ac.bd/notices/demo5.pdf',
        category: 'Exam Center',
        course: 'Honours',
        year: '2nd Year'
      }
    ];
    
    return NextResponse.json({ 
      notices: demoNotices,
      source: 'Demo Data',
      message: 'Demo notices displayed. Connect to Supabase to show real notices.',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error fetching notices from Supabase:', error);
    
    // Return demo notices on error
    const demoNotices = [
      {
        id: 'demo-1',
        title: '২০২৪ সালের অনার্স ৩য় বর্ষ পরীক্ষার ফলাফল প্রকাশ',
        postDate: '15-10-2025',
        link: 'https://www.nu.ac.bd/notices/demo1.pdf',
        category: 'Result',
        course: 'Honours',
        year: '3rd Year'
      },
      {
        id: 'demo-2',
        title: '২০২৫ সালের ডিগ্রী ১ম বর্ষ ভর্তি বিজ্ঞপ্তি',
        postDate: '12-10-2025',
        link: 'https://www.nu.ac.bd/notices/demo2.pdf',
        category: 'Admission',
        course: 'Degree',
        year: '1st Year'
      }
    ];
    
    return NextResponse.json({ 
      notices: demoNotices,
      source: 'Demo Data (Error Fallback)',
      error: 'Supabase connection failed',
      message: 'Demo notices displayed. Please check Supabase configuration.',
      timestamp: new Date().toISOString()
    });
  }
}

// Removed fallback notices function - only show real data from NU website

