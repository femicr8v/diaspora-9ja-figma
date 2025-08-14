import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2023-08-16",
  });

  const body = await req.json();
  const { amount, currency, description, payment_method } = body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      description,
      payment_method,
      confirm: true,
    });

    return NextResponse.json({ paymentIntent });
  } catch (error) {
    return NextResponse.json({ error });
  }
}
