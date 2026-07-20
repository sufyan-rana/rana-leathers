// app/api/payment/create-checkout/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-24.dahlia', // Correct latest stable version
});

export async function POST(request: Request) {
  try {
    const { items, orderNumber, customerEmail, customerName } = await request.json();

    // Convert items to Stripe line items
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'pkr',
        product_data: {
          name: item.name,
          images: [item.image || '/images/products/jacket.jpg'],
        },
        unit_amount: item.price * 100, // Stripe uses cents/paisa
      },
      quantity: item.quantity,
    }));

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
      customer_email: customerEmail,
      metadata: {
        orderNumber: orderNumber,
        customerName: customerName,
      },
      shipping_address_collection: {
        allowed_countries: ['PK', 'US', 'GB', 'AE', 'SA', 'IN', 'CN'],
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    console.error('Stripe error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create payment session' },
      { status: 500 }
    );
  }
}