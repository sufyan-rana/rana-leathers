// app/api/cart/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCartItems, addToCart, removeFromCart, updateCartQuantity } from '@/lib/db-utils';

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

    const items = await getCartItems(user.id);
    return NextResponse.json({ items });
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

    await addToCart(user.id, productId, quantity, size, color);
    
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

    await updateCartQuantity(user.id, productId, quantity);
    
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
      await removeFromCart(user.id, parseInt(productId));
    } else {
      // Clear all cart - handle in db-utils
      await query('DELETE FROM cart_items WHERE user_id = $1', [user.id]);
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