// app/api/setup/route.ts
import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    // Create tables
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        price INTEGER NOT NULL,
        original_price INTEGER,
        description TEXT,
        category TEXT NOT NULL,
        image_url TEXT,
        rating DECIMAL(3,2) DEFAULT 0,
        in_stock BOOLEAN DEFAULT TRUE,
        features TEXT[],
        sizes TEXT[],
        colors TEXT[],
        slug TEXT UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS cart_items (
        id SERIAL PRIMARY KEY,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        quantity INTEGER DEFAULT 1,
        size TEXT,
        color TEXT,
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, product_id)
      )
    `;

    // Insert sample products
    await sql`
      INSERT INTO products (name, price, original_price, description, category, image_url, rating, features, sizes, colors, slug)
      VALUES 
      ('Premium Leather Jacket', 29999, 44999, 'Handcrafted from full-grain buffalo leather.', 'jackets', '/images/products/jacket.jpg', 4.8, ARRAY['Full-grain buffalo leather', 'YKK zippers'], ARRAY['S', 'M', 'L', 'XL'], ARRAY['Brown', 'Black'], 'premium-leather-jacket'),
      ('Handcrafted Tote Bag', 15999, NULL, 'Elegant tote bag from soft full-grain cowhide.', 'bags', '/images/products/bag.jpg', 4.9, ARRAY['Full-grain cowhide', 'Cotton lining'], ARRAY['One Size'], ARRAY['Brown', 'Tan', 'Black'], 'handcrafted-tote-bag'),
      ('Classic Leather Belt', 3999, 5999, 'Timeless belt with premium brass buckle.', 'belts', '/images/products/belt.jpg', 4.7, ARRAY['Full-grain leather', 'Brass buckle'], ARRAY['30', '32', '34', '36', '38'], ARRAY['Brown', 'Black'], 'classic-leather-belt'),
      ('Minimalist Wallet', 2499, 3999, 'Slim RFID-blocking wallet.', 'wallets', '/images/products/wallet.jpg', 4.9, ARRAY['Vegetable-tanned leather', 'RFID blocking'], ARRAY['One Size'], ARRAY['Brown', 'Black', 'Tan'], 'minimalist-wallet'),
      ('Leather Chelsea Boots', 18999, 27999, 'Classic Chelsea boots with elastic panels.', 'shoes', '/images/products/boots.jpg', 4.8, ARRAY['Pull-up leather', 'Elastic panels'], ARRAY['39', '40', '41', '42', '43'], ARRAY['Brown', 'Black'], 'leather-chelsea-boots'),
      ('Leather Backpack', 12999, NULL, 'Versatile backpack with laptop compartment.', 'bags', '/images/products/backpack.jpg', 4.8, ARRAY['Soft leather', 'Laptop sleeve'], ARRAY['One Size'], ARRAY['Brown', 'Black', 'Tan'], 'leather-backpack')
      ON CONFLICT (slug) DO NOTHING
    `;

    return NextResponse.json({ 
      success: true, 
      message: '✅ Database setup completed successfully!'
    });
  } catch (error: any) {
    console.error('Setup error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}