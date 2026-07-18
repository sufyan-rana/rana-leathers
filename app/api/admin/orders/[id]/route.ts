// app/api/admin/orders/[id]/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;

    // Get order details with customer info
    const orderResult = await query(
      `SELECT 
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
        o.customer_postal_code,
        o.shipping_address,
        o.payment_method,
        o.order_notes
      FROM orders o
      WHERE o.id = $1`,
      [orderId]
    );

    if (orderResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const order = orderResult.rows[0];

    // Get order items with product details
    const itemsResult = await query(
      `SELECT 
        oi.id,
        oi.product_id,
        oi.quantity,
        oi.price,
        oi.size,
        oi.color,
        p.name as product_name,
        p.image_url,
        p.category
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1`,
      [orderId]
    );

    return NextResponse.json({
      order: order,
      items: itemsResult.rows
    });
  } catch (error: any) {
    console.error('Error fetching order details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order details' },
      { status: 500 }
    );
  }
}