import Stripe from 'stripe';
import { headers } from 'next/headers';

import { db } from '@/lib/db';
import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';

export async function POST(req, { params }) {
  const body = await req.text();

  const signature = headers().get('stripe-signature');

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error('[WEBHOOK]', error);
    return new NextResponse(`Webhook error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object;

  const userId = session?.metadata?.userId;
  const courseId = session?.metadata?.courseId;

  switch (event.type) {
    case 'checkout.session.completed':
      if (!userId || !courseId) {
        // TODO: notify admin
        console.log('[WEBHOOK]', 'Missing metadata');
        return new NextResponse(`Webhook error: Missing metadata`, {
          status: 400,
        });
      }
      const purchase = await db.purchase.create({
        data: {
          userId,
          courseId,
        },
      });

      return new NextResponse('Success', { status: 200 });

    default:
      return new NextResponse(`Unhandled event type: ${event.type}`, {
        status: 200,
      });
  }
}
