import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // server-only
);

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig)
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  // IMPORTANT: use the raw body for signature verification
  const payload = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      // Details Stripe just collected for you
      const details = session.customer_details; // { email, name, phone, address }

      const { error } = await supabase.from("payments").insert({
        stripe_session_id: session.id,
        user_id: session.metadata?.userId ?? null,
        email: details?.email ?? null,
        name: details?.name ?? null,
        phone: details?.phone ?? null,
        location: details?.address ? JSON.stringify(details.address) : null,
        amount_total: session.amount_total ?? null,
        currency: session.currency ?? null,
        status: "completed",
        raw: session as any, // keep the full payload for auditing/debugging
      });

      if (error) {
        // ignore duplicate insert if Stripe retries
        if (!/duplicate key value/.test(error.message)) {
          console.error("Supabase insert error:", error);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
