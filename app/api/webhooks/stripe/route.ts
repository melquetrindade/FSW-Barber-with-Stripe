import { db } from '@/app/_lib/prisma';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-06-24.dahlia',
  });

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe signature' }, { status: 400 });
  }

  const body = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (error) {
    console.error('Stripe webhook signature verification failed:', error);
    return NextResponse.json({ error: 'Invalid stripe signature' }, { status: 400 });
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true }, { status: 200 });
  }

  const checkoutSession = event.data.object as Stripe.Checkout.Session;
  const bookingId = checkoutSession.metadata?.bookingId;
  console.log('Booking ID:', bookingId);

  if (!bookingId) {
    return NextResponse.json({ received: true }, { status: 200 });
  }

  

  try {
    const updatedBooking = await db.booking.update({
      where: { id: bookingId },
      data: { status: 'CONFIRMED' },
    });
    revalidatePath('/bookings');

    console.log('Booking updated successfully:', updatedBooking.id, updatedBooking.status);
  } catch (error) {
    console.error('Failed to update booking:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }

  
  return NextResponse.json({ received: true }, { status: 200 });
}
