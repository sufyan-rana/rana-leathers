// app/api/payment/verify/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { query } from '@/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      );
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      // Update order status in database
      const orderNumber = session.metadata?.orderNumber;
      if (orderNumber) {
        await query(
          'UPDATE orders SET status = $1 WHERE order_number = $2',
          ['completed', orderNumber]
        );
      }

      return NextResponse.json({
        success: true,
        orderNumber: orderNumber,
        customerEmail: session.customer_email,
      });
    }

    return NextResponse.json(
      { error: 'Payment not completed' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}