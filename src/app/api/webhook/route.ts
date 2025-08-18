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

      // Retrieve the full session with line items to get product info
      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ["line_items", "line_items.data.price.product"],
      });

      // Get tier name from the line items
      let tierName = "Unknown";
      if (fullSession.line_items?.data?.[0]) {
        const lineItem = fullSession.line_items.data[0];
        if (
          lineItem.price?.product &&
          typeof lineItem.price.product === "object"
        ) {
          // Check if product is not deleted and has a name
          const product = lineItem.price.product as Stripe.Product;
          if (!product.deleted && product.name) {
            tierName = product.name;
          }
        }
      }

      // Get customer details from the full session
      const customerDetails = fullSession.customer_details;

      // Format location as a readable string
      let locationString = null;
      if (customerDetails?.address) {
        const addr = customerDetails.address;
        locationString = [
          addr.line1,
          addr.line2,
          addr.city,
          addr.state,
          addr.postal_code,
          addr.country,
        ]
          .filter(Boolean)
          .join(", ");
      }

      const { error } = await supabase.from("payments").insert({
        stripe_session_id: fullSession.id,
        user_id: fullSession.metadata?.userId ?? null,
        email: customerDetails?.email ?? null,
        name: customerDetails?.name ?? null,
        phone: customerDetails?.phone ?? null,
        location: locationString,
        tier_name: tierName,
        amount_total: fullSession.amount_total ?? null,
        currency: fullSession.currency ?? null,
        status: "completed",
        raw: fullSession as any, // keep the full payload for auditing/debugging
      });

      if (error) {
        // ignore duplicate insert if Stripe retries
        if (!/duplicate key value/.test(error.message)) {
          console.error("Supabase insert error:", error);
        }
      } else {
        console.log(
          `✅ Payment recorded: ${customerDetails?.email} - ${tierName} - $${
            fullSession.amount_total ? fullSession.amount_total / 100 : 0
          } ${fullSession.currency?.toUpperCase()}`
        );
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
