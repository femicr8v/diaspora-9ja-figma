import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    // You can send userId/email from your client (or derive from your auth)
    const { email, userId } = await req.json();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],

      // Make Stripe collect the info for you
      billing_address_collection: "required", // full billing address required
      phone_number_collection: { enabled: true }, // phone collected & required
      customer_creation: "always", // create a Customer in Stripe
      customer_email: email || undefined, // prefill if you have it
      // Attach internal reference if you have one
      client_reference_id: userId ?? undefined,
      metadata: { userId: userId ?? "" },

      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Checkout session error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
