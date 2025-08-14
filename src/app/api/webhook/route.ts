import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

  const payload = await req.text();
  const response = JSON.parse(payload);
  const sig = req.headers.get("Stripe-Signature");

  const dateTime = new Date(response?.created * 1000).toLocaleDateString();
  const timeString = new Date(response?.created * 1000).toLocaleTimeString();

  try {
    let event = stripe.webhooks.constructEvent(
      payload,
      sig as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );

    console.log("event", event.type);

    return NextResponse.json({ status: "Success", event: event.type });
  } catch (error) {
    return NextResponse.json({ status: "Failed", error });
  }
}
