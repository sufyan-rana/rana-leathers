// app/api/admin/products/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query(`
      SELECT id, name, price, original_price, category, image_url, in_stock, slug
      FROM products 
      ORDER BY id DESC
    `);
    return NextResponse.json({ products: result.rows });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, price, description, category, image_url, features, sizes, colors } = body;

    const result = await query(
      `INSERT INTO products (name, price, description, category, image_url, features, sizes, colors, slug)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        name,
        price,
        description,
        category,
        image_url,
        features || [],
        sizes || [],
        colors || [],
        name.toLowerCase().replace(/ /g, '-')
      ]
    );

    return NextResponse.json({ success: true, product: result.rows[0] });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}