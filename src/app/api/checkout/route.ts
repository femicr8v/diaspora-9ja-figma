import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // server-only
);

export async function POST(req: Request) {
  try {
    // You can send userId/email from your client (or derive from your auth)
    const { email, userId, name, phone, location } = await req.json();

    // Create checkout session with pre-filled information
    const sessionConfig: any = {
      mode: "subscription",
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
      // Attach internal reference if you have one
      client_reference_id: userId ?? undefined,
      metadata: {
        userId: userId ?? "",
        leadEmail: email || "",
        leadName: name || "",
        leadPhone: phone || "",
        leadLocation: location || "",
      },

      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/join-the-community`,
    };

    // If we have customer details, try to create or find existing customer
    if (email && name) {
      try {
        // Search for existing customer by email
        const existingCustomers = await stripe.customers.list({
          email: email,
          limit: 1,
        });

        let customerId;
        if (existingCustomers.data.length > 0) {
          customerId = existingCustomers.data[0].id;
          console.log(`Found existing customer: ${customerId}`);
        } else {
          // Create new customer with pre-filled information
          const customer = await stripe.customers.create({
            email: email,
            name: name,
            phone: phone || undefined,
            metadata: {
              source: "join-community-form",
              location: location || "",
            },
          });
          customerId = customer.id;
          console.log(`Created new customer: ${customerId}`);
        }

        sessionConfig.customer = customerId;
      } catch (customerError) {
        console.error("Error handling customer:", customerError);
        // Continue without customer pre-fill if there's an error
        sessionConfig.customer_email = email;
      }
    } else if (email) {
      // If we don't have name but have email, use customer_email
      sessionConfig.customer_email = email;
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    // Update the lead with the stripe session ID if we have an email
    if (email) {
      try {
        await supabase
          .from("leads")
          .update({
            stripe_session_id: session.id,
            status: "checkout_started",
          })
          .eq("email", email);
        console.log(`Updated lead with session ID: ${session.id}`);
      } catch (leadError) {
        console.error("Error updating lead with session ID:", leadError);
        // Continue even if lead update fails
      }
    }

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Checkout session error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
