import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for your notices (based on your actual Supabase table structure)
export interface SupabaseNotice {
  id: string
  title: string
  link: string
  post_date: string
  category?: string
  pdf_url?: string
  is_featured: boolean
  created_at: string
  updated_at: string
  content?: string
  section?: string
  is_important: boolean
  is_active: boolean
  source?: string
  author?: string
  image_url?: string
  published_at?: string
}

// Helper function to get notices from Supabase
export async function getNoticesFromSupabase(limit: number = 50) {
  try {
    console.log('🔍 Attempting to fetch notices from Supabase...');
    
    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('❌ Supabase error:', error)
      return []
    }

    console.log(`✅ Fetched ${data?.length || 0} notices from Supabase`);
    return data || []
  } catch (error) {
    console.error('❌ Error fetching from Supabase:', error)
    return []
  }
}

// Helper function to format Supabase notices for the website
export function formatSupabaseNotices(notices: SupabaseNotice[]) {
  return notices.map((notice) => ({
    id: notice.id,
    title: notice.title,
    postDate: formatPostDate(notice.post_date),
    link: notice.pdf_url || notice.link, // Use pdf_url if available, fallback to link
    category: notice.category || notice.section || 'General',
    course: extractCourse(notice.title),
    year: extractYear(notice.title)
  }))
}

// Helper function to format post date
function formatPostDate(dateString: string): string {
  try {
    // If it's already in "October 28, 2025" format, convert to DD-MM-YYYY
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    }
    return dateString; // Return as-is if can't parse
  } catch {
    return dateString;
  }
}

// Helper function to extract course from title
function extractCourse(title: string): string {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('অনার্স') || titleLower.includes('honours') || titleLower.includes('hon')) {
    return 'Honours';
  }
  if (titleLower.includes('ডিগ্রী') || titleLower.includes('degree')) {
    return 'Degree';
  }
  if (titleLower.includes('মাস্টার্স') || titleLower.includes('masters')) {
    return 'Masters';
  }
  
  return 'General';
}

// Helper function to extract year from title
function extractYear(title: string): string {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('১ম') || titleLower.includes('1st') || titleLower.includes('first')) {
    return '1st Year';
  }
  if (titleLower.includes('২য়') || titleLower.includes('2nd') || titleLower.includes('second')) {
    return '2nd Year';
  }
  if (titleLower.includes('৩য়') || titleLower.includes('3rd') || titleLower.includes('third')) {
    return '3rd Year';
  }
  if (titleLower.includes('৪র্থ') || titleLower.includes('4th') || titleLower.includes('final')) {
    return 'Final Year';
  }
  
  return 'N/A';
}