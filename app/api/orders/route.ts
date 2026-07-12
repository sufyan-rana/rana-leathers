// app/api/orders/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { items, subtotal, shipping, total, customer, paymentMethod } = await request.json();

    // Validate required fields
    if (!customer.fullName || !customer.email || !customer.phone || !customer.address || !customer.city) {
      return NextResponse.json(
        { error: 'Please fill in all required fields' },
        { status: 400 }
      );
    }

    // Validate phone number (11 digits, starts with 03)
    const phoneRegex = /^03\d{9}$/;
    if (!phoneRegex.test(customer.phone.replace(/[\s\-\(\)]/g, ''))) {
      return NextResponse.json(
        { error: 'Please enter a valid 11-digit Pakistani phone number' },
        { status: 400 }
      );
    }

    // Generate order number
    const orderNumber = `RANA-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Insert order with all fields including country, postalCode, and notes
    const result = await query(
      `INSERT INTO orders (
        order_number, 
        total_amount, 
        status, 
        payment_method,
        customer_name,
        customer_email,
        customer_phone,
        customer_city,
        customer_country,
        customer_postal_code,
        order_notes,
        shipping_address
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id, order_number`,
      [
        orderNumber,
        total,
        'pending',
        paymentMethod,
        customer.fullName,
        customer.email,
        customer.phone,
        customer.city || 'N/A',
        customer.country || 'Pakistan',
        customer.postalCode || null,
        customer.notes || null,
        customer.address,
      ]
    );

    const orderId = result.rows[0].id;

    // Insert order items
    for (const item of items) {
      await query(
        `INSERT INTO order_items (order_id, product_id, quantity, price, size, color)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          orderId,
          item.id || item.product_id,
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
      { error: error.message || 'Failed to create order' },
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
      return NextResponse.json({ order: result.rows[0] || null });
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