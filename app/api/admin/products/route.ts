// app/api/admin/products/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET - Fetch all products
export async function GET() {
  try {
    const result = await query(`
      SELECT id, name, price, original_price, description, category, 
             image_url, images, rating, in_stock, features, sizes, colors, slug
      FROM products 
      ORDER BY id DESC
    `);
    return NextResponse.json({ products: result.rows });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Create a new product
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      name, price, originalPrice, description, category, 
      image_url, images, features, sizes, colors, in_stock 
    } = body;

    if (!name || !price || !category) {
      return NextResponse.json(
        { error: 'Name, price, and category are required' },
        { status: 400 }
      );
    }

    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
    const productImages = images && images.length > 0 ? images : [image_url || '/images/products/jacket.jpg'];
    const mainImage = productImages[0] || '/images/products/jacket.jpg';

    const result = await query(
      `INSERT INTO products (name, price, original_price, description, category, 
        image_url, images, features, sizes, colors, in_stock, slug)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [
        name,
        price,
        originalPrice || null,
        description || null,
        category,
        mainImage,
        productImages,
        features || [],
        sizes || [],
        colors || [],
        in_stock !== undefined ? in_stock : true,
        slug
      ]
    );

    return NextResponse.json({ success: true, product: result.rows[0] });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Update a product
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { 
      id, name, price, originalPrice, description, category, 
      image_url, images, features, sizes, colors, in_stock 
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Check if product exists
    const existing = await query('SELECT id FROM products WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
    const productImages = images && images.length > 0 ? images : [image_url || '/images/products/jacket.jpg'];
    const mainImage = productImages[0] || '/images/products/jacket.jpg';

    const result = await query(
      `UPDATE products 
       SET name = $1, price = $2, original_price = $3, description = $4, 
           category = $5, image_url = $6, images = $7, features = $8, 
           sizes = $9, colors = $10, in_stock = $11, slug = $12
       WHERE id = $13
       RETURNING *`,
      [
        name,
        price,
        originalPrice || null,
        description || null,
        category,
        mainImage,
        productImages,
        features || [],
        sizes || [],
        colors || [],
        in_stock !== undefined ? in_stock : true,
        slug,
        id
      ]
    );

    return NextResponse.json({ success: true, product: result.rows[0] });
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Delete a product
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Check if product exists
    const existing = await query('SELECT id FROM products WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Delete product
    await query('DELETE FROM products WHERE id = $1', [id]);

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}