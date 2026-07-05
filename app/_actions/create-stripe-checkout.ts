"use server"

import { BarbershopService } from "@/prisma/generated/browser"
import { headers } from "next/headers"
import Stripe from "stripe"
import { db } from "../_lib/prisma"

interface CreateStripeCheckoutProps {
  service: BarbershopService
  bookingId: string
}

export const createStripeCheckout = async ({
  service,
  bookingId,
}: CreateStripeCheckoutProps) => {
  const reqHeaders = headers()
  const origin = reqHeaders.get("origin") as string
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-06-24.dahlia",
  })

  const priceService = await db.barbershopService.findUnique({
    where: {
      id: service.id,
    },
  })

  const unitAmount = Math.round(Number(priceService?.price.toString()) * 100)

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${origin}/bookings`,
    cancel_url: `${origin}/bookings`,
    metadata: {
      bookingId: bookingId,
    },
    payment_method_types: ["card"],
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "brl",
          product_data: {
            name: service.name,
            images: [service.imageURL],
          },
          unit_amount: unitAmount,
        },
      },
    ],
  })

  if (!session.url) {
    throw new Error("Stripe checkout session URL was not created.")
  }

  return { sessionUrl: session.url }
}
