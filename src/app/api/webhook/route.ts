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
    console.log(`🔔 Webhook received: ${event.type}`);

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`💳 Processing payment intent: ${paymentIntent.id}`);

      const { leadId } = paymentIntent.metadata;

      // Update lead status to paid
      if (leadId) {
        const { error } = await supabase
          .from("leads")
          .update({
            status: "paid",
            payment_intent_id: paymentIntent.id,
            amount_paid: paymentIntent.amount / 100, // Convert from cents
            paid_at: new Date().toISOString(),
          })
          .eq("id", leadId);

        if (error) {
          console.error("❌ Error updating lead:", error);
        } else {
          console.log(
            `✅ Payment successful for lead ${leadId}: $${
              paymentIntent.amount / 100
            }`
          );
        }
      }
    } else if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`❌ Processing failed payment intent: ${paymentIntent.id}`);

      const { leadId } = paymentIntent.metadata;

      if (leadId) {
        const { error } = await supabase
          .from("leads")
          .update({
            status: "payment_failed",
            payment_intent_id: paymentIntent.id,
          })
          .eq("id", leadId);

        if (error) {
          console.error("❌ Error updating lead for failed payment:", error);
        } else {
          console.log(`❌ Payment failed for lead ${leadId}`);
        }
      }
    } else if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(`📋 Processing session: ${session.id}`);

      // Retrieve the full session with line items to get product info
      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ["line_items", "line_items.data.price.product"],
      });
      console.log(
        `📦 Retrieved full session with ${
          fullSession.line_items?.data?.length || 0
        } line items`
      );

      // Get tier name from the line items
      let tierName = "Unknown";
      if (fullSession.line_items?.data?.[0]) {
        const lineItem = fullSession.line_items.data[0];
        console.log(
          `🏷️ Line item price product:`,
          typeof lineItem.price?.product
        );
        if (
          lineItem.price?.product &&
          typeof lineItem.price.product === "object"
        ) {
          // Check if product is not deleted and has a name
          const product = lineItem.price.product as Stripe.Product;
          if (!product.deleted && product.name) {
            tierName = product.name;
            console.log(`✅ Tier name found: ${tierName}`);
          }
        }
      }

      // Get customer details from the full session
      const customerDetails = fullSession.customer_details;
      console.log(`👤 Customer details:`, {
        email: customerDetails?.email,
        name: customerDetails?.name,
        phone: customerDetails?.phone,
        hasAddress: !!customerDetails?.address,
      });

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
        console.log(`📍 Location formatted: ${locationString}`);
      }

      console.log(`💾 Attempting to insert payment record...`);
      const { error } = await supabase.from("clients").insert({
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
        console.error("❌ Supabase insert error:", error);
        // ignore duplicate insert if Stripe retries
        if (!/duplicate key value/.test(error.message)) {
          console.error("🚨 Non-duplicate error:", error);
        }
      } else {
        console.log(
          `✅ Payment recorded: ${customerDetails?.email} - ${tierName} - $${
            fullSession.amount_total ? fullSession.amount_total / 100 : 0
          } ${fullSession.currency?.toUpperCase()}`
        );

        // Update lead status to converted if email exists
        if (customerDetails?.email) {
          try {
            await supabase
              .from("leads")
              .update({
                status: "converted",
                converted_at: new Date().toISOString(),
                stripe_session_id: fullSession.id,
              })
              .eq("email", customerDetails.email);
            console.log(
              `✅ Lead marked as converted: ${customerDetails.email}`
            );
          } catch (leadError) {
            console.error("❌ Error updating lead status:", leadError);
          }
        }
      }
    } else if (event.type === "invoice.payment_succeeded") {
      const invoice = event.data.object as Stripe.Invoice;
      console.log(`💰 Processing invoice payment: ${invoice.id}`);

      // For subscription payments, we need to get the subscription and customer details
      // Check if this invoice is associated with a subscription
      if ((invoice as any).subscription && invoice.customer) {
        try {
          const subscriptionId =
            typeof (invoice as any).subscription === "string"
              ? (invoice as any).subscription
              : (invoice as any).subscription.id;

          const subscription = await stripe.subscriptions.retrieve(
            subscriptionId,
            {
              expand: ["items.data.price.product", "customer"],
            }
          );

          const customer = subscription.customer as Stripe.Customer;
          console.log(`👤 Customer found: ${customer.email}`);

          // Get tier name from subscription items
          let tierName = "Unknown";
          if (subscription.items?.data?.[0]) {
            const item = subscription.items.data[0];
            if (item.price?.product && typeof item.price.product === "object") {
              const product = item.price.product as Stripe.Product;
              if (!product.deleted && product.name) {
                tierName = product.name;
                console.log(`✅ Tier name found: ${tierName}`);
              }
            }
          }

          // Format customer address if available
          let locationString = null;
          if (customer.address) {
            const addr = customer.address;
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
            console.log(`📍 Location formatted: ${locationString}`);
          }

          console.log(`💾 Attempting to insert subscription payment record...`);
          const { error } = await supabase.from("clients").insert({
            stripe_session_id: invoice.id, // Use invoice ID for subscriptions
            user_id: invoice.metadata?.userId ?? null,
            email: customer.email ?? null,
            name: customer.name ?? null,
            phone: customer.phone ?? null,
            location: locationString,
            tier_name: tierName,
            amount_total: invoice.amount_paid ?? null,
            currency: invoice.currency ?? null,
            status: "completed",
            raw: { invoice, subscription } as any,
          });

          if (error) {
            console.error("❌ Supabase insert error:", error);
            if (!/duplicate key value/.test(error.message)) {
              console.error("🚨 Non-duplicate error:", error);
            }
          } else {
            console.log(
              `✅ Subscription payment recorded: ${
                customer.email
              } - ${tierName} - $${
                invoice.amount_paid ? invoice.amount_paid / 100 : 0
              } ${invoice.currency?.toUpperCase()}`
            );
          }
        } catch (err) {
          console.error("🚨 Error processing subscription payment:", err);
        }
      }
    } else {
      console.log(`⏭️ Ignoring event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("🚨 Webhook handler error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
