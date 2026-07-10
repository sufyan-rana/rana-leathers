// app/api/admin/settings/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Default settings
const defaultSettings = {
  siteName: 'RANA LEATHER\'S',
  siteDescription: 'Premium handcrafted leather products since 2010',
  storeEmail: 'info@ranaleathers.com',
  storePhone: '+92 300 1234567',
  storeAddress: 'Sialkot, Pakistan',
  storeHours: 'Monday-Saturday: 9AM - 6PM',
  currency: 'Rs.',
  shippingCost: 500,
  freeShippingThreshold: 5000,
  taxRate: 0,
  instagram: 'https://instagram.com/ranaleathers',
  facebook: 'https://facebook.com/ranaleathers',
  twitter: 'https://twitter.com/ranaleathers',
  youtube: 'https://youtube.com/ranaleathers',
};

// GET - Fetch settings
export async function GET() {
  try {
    // Try to get settings from database
    const result = await query('SELECT * FROM settings LIMIT 1');
    
    if (result.rows.length === 0) {
      // If no settings exist, create default settings
      await query(`
        INSERT INTO settings (key, value) 
        VALUES ('store_settings', $1)
      `, [JSON.stringify(defaultSettings)]);
      
      return NextResponse.json({ settings: defaultSettings });
    }
    
    const settings = result.rows[0].value;
    return NextResponse.json({ settings });
  } catch (error: any) {
    console.error('Error fetching settings:', error);
    // Return default settings if database fails
    return NextResponse.json({ settings: defaultSettings });
  }
}

// POST - Update settings
export async function POST(request: Request) {
  try {
    const settings = await request.json();
    
    // Create settings table if it doesn't exist
    await query(`
      CREATE TABLE IF NOT EXISTS settings (
        id SERIAL PRIMARY KEY,
        key TEXT UNIQUE NOT NULL,
        value JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Update or insert settings
    await query(`
      INSERT INTO settings (key, value, updated_at) 
      VALUES ('store_settings', $1, CURRENT_TIMESTAMP)
      ON CONFLICT (key) DO UPDATE 
      SET value = $1, updated_at = CURRENT_TIMESTAMP
    `, [JSON.stringify(settings)]);
    
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    console.error('Error saving settings:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}