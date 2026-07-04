// app/api/cart/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query, getClient } from '@/lib/db';

// Helper function to get user from request
async function getUserFromRequest(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) return null;
    
    // For testing - return a mock user
    // In production, verify JWT and get real user
    return { id: 'test-user-id', name: 'Test User' };
  } catch (error) {
    return null;
  }
}

// GET - Get cart items
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await query(
      `SELECT 
        c.id,
        c.quantity,
        c.size,
        c.color,
        p.id as product_id,
        p.name,
        p.price,
        p.image_url as image,
        p.slug
      FROM cart_items c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = $1`,
      [user.id]
    );
    
    return NextResponse.json({ items: result.rows });
  } catch (error: any) {
    console.error('Cart GET error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch cart', 
      details: error.message 
    }, { status: 500 });
  }
}

// POST - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId, quantity, size, color } = await request.json();
    
    if (!productId || !quantity) {
      return NextResponse.json({ 
        error: 'Product ID and quantity required' 
      }, { status: 400 });
    }

    // Check if product exists
    const productCheck = await query(
      'SELECT id FROM products WHERE id = $1',
      [productId]
    );
    
    if (productCheck.rows.length === 0) {
      return NextResponse.json({ 
        error: 'Product not found' 
      }, { status: 404 });
    }

    // Insert or update cart
    await query(
      `INSERT INTO cart_items (user_id, product_id, quantity, size, color)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, product_id) 
       DO UPDATE SET 
         quantity = cart_items.quantity + $3,
         size = $4,
         color = $5`,
      [user.id, productId, quantity, size || null, color || null]
    );
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Cart POST error:', error);
    return NextResponse.json({ 
      error: 'Failed to add to cart', 
      details: error.message 
    }, { status: 500 });
  }
}

// PUT - Update quantity
export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId, quantity } = await request.json();
    
    if (!productId || quantity === undefined) {
      return NextResponse.json({ 
        error: 'Product ID and quantity required' 
      }, { status: 400 });
    }

    if (quantity <= 0) {
      await query(
        'DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2',
        [user.id, productId]
      );
    } else {
      await query(
        'UPDATE cart_items SET quantity = $1 WHERE user_id = $2 AND product_id = $3',
        [quantity, user.id, productId]
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Cart PUT error:', error);
    return NextResponse.json({ 
      error: 'Failed to update cart', 
      details: error.message 
    }, { status: 500 });
  }
}

// DELETE - Remove item or clear cart
export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    
    if (productId) {
      await query(
        'DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2',
        [user.id, parseInt(productId)]
      );
    } else {
      await query(
        'DELETE FROM cart_items WHERE user_id = $1',
        [user.id]
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Cart DELETE error:', error);
    return NextResponse.json({ 
      error: 'Failed to remove from cart', 
      details: error.message 
    }, { status: 500 });
  }
}