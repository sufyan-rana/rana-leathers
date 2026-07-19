// app/api/admin/orders/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query(`
      SELECT 
        o.id, 
        o.order_number, 
        o.total_amount, 
        o.status, 
        o.created_at,
        o.customer_name,
        o.customer_email,
        o.customer_phone,
        o.customer_city,
        o.customer_country,
        o.shipping_address,
        o.payment_method,
        o.order_notes,
        json_agg(
          json_build_object(
            'product_id', oi.product_id,
            'product_name', p.name,
            'quantity', oi.quantity,
            'price', oi.price,
            'size', oi.size,
            'color', oi.color,
            'image', p.image_url
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `);
    
    return NextResponse.json({ orders: result.rows });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { orderId, status } = await request.json();
   console.log('updating order:', { orderId, staus });

    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'Order ID and status are required' },
        { status: 400 }
      );
    }

    // Check if order exists
    const existing = await query('SELECT id FROM orders WHERE id = $1', [orderId]);
    if (existing.rows.length === 0) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Update order status
    await query(
      'UPDATE orders SET status = $1 WHERE id = $2',
      [status, orderId]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}