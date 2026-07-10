// app/api/orders/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { items, subtotal, shipping, total, customer, paymentMethod } = await request.json();

    // Generate order number
    const orderNumber = `RANA-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Create order
    const result = await query(
      `INSERT INTO orders (
        order_number, 
        user_id, 
        total_amount, 
        status, 
        shipping_address, 
        payment_method,
        customer_name,
        customer_email,
        customer_phone,
        customer_city
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id, order_number`,
      [
        orderNumber,
        null, // user_id - will be added later when auth is fully integrated
        total,
        'pending',
        customer.address,
        paymentMethod,
        customer.fullName,
        customer.email,
        customer.phone,
        customer.city,
      ]
    );

    const orderId = result.rows[0].id;

    // Create order items
    for (const item of items) {
      await query(
        `INSERT INTO order_items (order_id, product_id, quantity, price, size, color)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          orderId,
          item.id,
          item.quantity,
          item.price,
          item.size || null,
          item.color || null,
        ]
      );
    }

    return NextResponse.json({
      success: true,
      orderNumber: orderNumber,
      orderId: orderId,
    });

  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get('orderNumber');

    if (orderNumber) {
      const result = await query(
        `SELECT * FROM orders WHERE order_number = $1`,
        [orderNumber]
      );
      return NextResponse.json({ order: result.rows[0] });
    }

    const result = await query(
      `SELECT * FROM orders ORDER BY created_at DESC LIMIT 50`
    );
    return NextResponse.json({ orders: result.rows });

  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}