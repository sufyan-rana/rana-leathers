// app/api/test-db/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query('SELECT NOW() as current_time, 1 as connected');
    return NextResponse.json({ 
      success: true, 
      message: '✅ Database connected!',
      data: result.rows[0]
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}