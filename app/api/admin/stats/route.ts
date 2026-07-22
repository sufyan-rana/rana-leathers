// app/api/admin/stats/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Get total products
    const productsResult = await query('SELECT COUNT(*) as count FROM products');
    const totalProducts = parseInt(productsResult.rows[0].count);

    // Get total orders
    const ordersResult = await query('SELECT COUNT(*) as count FROM orders');
    const totalOrders = parseInt(ordersResult.rows[0].count);

    // Get total users
    const usersResult = await query('SELECT COUNT(*) as count FROM users');
    const totalUsers = parseInt(usersResult.rows[0].count);

    // Get total revenue
    const revenueResult = await query('SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE status = $1', ['completed']);
    const totalRevenue = parseInt(revenueResult.rows[0].total);

    // Get recent orders
    const recentOrders = await query(`
      SELECT id, order_number, total_amount, status, created_at
      FROM orders 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    return NextResponse.json({
      stats: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue,
      },
      recentOrders: recentOrders.rows,
    });
  } catch (error: any) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}