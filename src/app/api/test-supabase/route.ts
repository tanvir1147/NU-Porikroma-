import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('🔍 Testing Supabase connection...');
    
    // Test connection and get table info
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (tablesError) {
      console.log('Trying direct notices query...');
      
      // Try common table names
      const tableNames = ['notices', 'nu_notices', 'notice', 'notifications'];
      let foundData = null;
      let foundTable = null;
      
      for (const tableName of tableNames) {
        try {
          const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .limit(1);
          
          if (!error && data) {
            foundData = data;
            foundTable = tableName;
            break;
          }
        } catch (e) {
          continue;
        }
      }
      
      if (foundData && foundTable) {
        return NextResponse.json({
          success: true,
          message: `Found table: ${foundTable}`,
          tableStructure: foundData[0] ? Object.keys(foundData[0]) : [],
          sampleData: foundData[0] || null,
          totalRecords: foundData.length
        });
      }
      
      return NextResponse.json({
        success: false,
        error: 'Could not find notices table',
        message: 'Please check table name or permissions'
      });
    }
    
    return NextResponse.json({
      success: true,
      tables: tables?.map(t => t.table_name) || [],
      message: 'Supabase connection successful'
    });
    
  } catch (error) {
    console.error('❌ Supabase test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to connect to Supabase'
    }, { status: 500 });
  }
}