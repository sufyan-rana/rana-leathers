// app/api/payment/verify/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

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

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { 
          error: 'Card payments are not configured.',
          available: false 
        },
        { status: 400 }
      );
    }

    // Dynamically import Stripe
    const Stripe = await import('stripe').then(mod => mod.default);
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
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