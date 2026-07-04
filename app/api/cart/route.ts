// app/api/cart/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

async function getUserFromRequest(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) return null;
    return { id: 'test-user-id', name: 'Test User' };
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await sql`
      SELECT 
        c.id, c.quantity, c.size, c.color,
        p.id as product_id, p.name, p.price, p.image_url as image, p.slug
      FROM cart_items c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ${user.id}
    `;
    
    return NextResponse.json({ items: result });
  } catch (error: any) {
    console.error('Cart GET error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch cart', 
      details: error.message 
    }, { status: 500 });
  }
}

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

    await sql`
      INSERT INTO cart_items (user_id, product_id, quantity, size, color)
      VALUES (${user.id}, ${productId}, ${quantity}, ${size || null}, ${color || null})
      ON CONFLICT (user_id, product_id) 
      DO UPDATE SET 
        quantity = cart_items.quantity + ${quantity},
        size = ${size || null},
        color = ${color || null}
    `;
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Cart POST error:', error);
    return NextResponse.json({ 
      error: 'Failed to add to cart', 
      details: error.message 
    }, { status: 500 });
  }
}

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
      await sql`
        DELETE FROM cart_items 
        WHERE user_id = ${user.id} AND product_id = ${productId}
      `;
    } else {
      await sql`
        UPDATE cart_items 
        SET quantity = ${quantity}
        WHERE user_id = ${user.id} AND product_id = ${productId}
      `;
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

export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    
    if (productId) {
      await sql`
        DELETE FROM cart_items 
        WHERE user_id = ${user.id} AND product_id = ${parseInt(productId)}
      `;
    } else {
      await sql`
        DELETE FROM cart_items 
        WHERE user_id = ${user.id}
      `;
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