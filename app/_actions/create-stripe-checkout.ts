"use server"

import { BarbershopService } from "@/prisma/generated/browser"
import { headers } from "next/headers"
import Stripe from "stripe"

interface CreateStripeCheckoutProps {
  service: BarbershopService
}

export const createStripeCheckout = async ({
  service,
}: CreateStripeCheckoutProps) => {
  const reqHeaders = headers()
  const origin =
    reqHeaders.get("origin") ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000"

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-06-24.dahlia",
  })

  const unitAmount = Math.round(Number(service.price.toString()) * 100)

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${origin}/bookings`,
    cancel_url: origin,
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
