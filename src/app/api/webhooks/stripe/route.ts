import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handleSuccessfulPayment(paymentIntent);
        break;

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        await handleFailedPayment(failedPayment);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleSuccessfulPayment(paymentIntent: Stripe.PaymentIntent) {
  try {
    const { leadId, email } = paymentIntent.metadata;

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
        console.error("Error updating lead:", error);
      } else {
        console.log(
          `✅ Payment successful for lead ${leadId}: $${
            paymentIntent.amount / 100
          }`
        );
      }
    }

    // TODO: Send confirmation email to customer
    // TODO: Send notification email to admin
  } catch (error) {
    console.error("Error handling successful payment:", error);
  }
}

async function handleFailedPayment(paymentIntent: Stripe.PaymentIntent) {
  try {
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
        console.error("Error updating lead for failed payment:", error);
      } else {
        console.log(`❌ Payment failed for lead ${leadId}`);
      }
    }

    // TODO: Send payment failure notification
  } catch (error) {
    console.error("Error handling failed payment:", error);
  }
}
