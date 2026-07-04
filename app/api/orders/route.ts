// app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createOrder, getOrderHistory, getCartItems, clearCart } from '@/lib/db-utils';
import { getUserFromRequest } from '@/lib/auth';

// GET - Get order history
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const orders = await getOrderHistory(user.id);
    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Orders GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create a new order
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { shippingAddress, paymentMethod } = await request.json();
    
    if (!shippingAddress || !paymentMethod) {
      return NextResponse.json({ error: 'Shipping address and payment method required' }, { status: 400 });
    }
    
    // Get cart items
    const cartItems = await getCartItems(user.id);
    
    if (cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }
    
    // Create order
    const order = await createOrder(user.id, cartItems, shippingAddress, paymentMethod);
    
    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Orders POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}