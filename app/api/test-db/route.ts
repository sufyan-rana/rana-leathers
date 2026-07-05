// app/api/test-db/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    if (!process.env.POSTGRES_URL) {
      return NextResponse.json({ 
        success: false, 
        error: 'POSTGRES_URL environment variable is not set' 
      }, { status: 500 });
    }

    const result = await query('SELECT NOW() as current_time, 1 as connected');
    
    return NextResponse.json({ 
      success: true, 
      message: '✅ Database connected successfully!',
      data: result.rows[0]
    });
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}