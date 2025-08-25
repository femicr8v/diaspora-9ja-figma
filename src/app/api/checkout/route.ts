import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { validateEmail } from "@/lib/email-validation";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // server-only
);

// Error response types
interface CheckoutResponse {
  url?: string; // Stripe checkout URL (success case)
  error?: string; // Error message (failure case)
  errorType?: "DUPLICATE_CLIENT" | "VALIDATION_ERROR" | "SERVER_ERROR";
}

interface ErrorResponse {
  error: string;
  errorType: "DUPLICATE_CLIENT" | "VALIDATION_ERROR" | "SERVER_ERROR";
  details?: {
    field?: string;
    suggestion?: string;
  };
}

export async function POST(req: Request) {
  try {
    // You can send userId/email from your client (or derive from your auth)
    const { email, userId, name, phone, location } = await req.json();

    // Extract metadata for logging
    const userAgent = req.headers.get("user-agent") || undefined;
    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = forwardedFor
      ? forwardedFor.split(",")[0].trim()
      : req.headers.get("x-real-ip") || undefined;
    const sessionId = userId || undefined;

    const metadata = { userAgent, ip, sessionId };

    // Email validation - check for duplicates before proceeding
    if (email) {
      try {
        const validationResult = await validateEmail(email, metadata);

        // If email format is invalid
        if (!validationResult.isValid) {
          return NextResponse.json(
            {
              error: "Please enter a valid email address.",
              errorType: "VALIDATION_ERROR",
              details: {
                field: "email",
                suggestion: "Please check your email format and try again.",
              },
            } as ErrorResponse,
            { status: 400 }
          );
        }

        // If email exists as an active client, block the checkout
        if (validationResult.existsAsClient) {
          // Additional logging is already handled in validateEmail function
          return NextResponse.json(
            {
              error:
                "This email is already registered. Please sign in to your account or use a different email.",
              errorType: "DUPLICATE_CLIENT",
              details: {
                field: "email",
                suggestion:
                  "Try signing in to your existing account or use a different email address.",
              },
            } as ErrorResponse,
            { status: 409 }
          );
        }

        // If email exists as a lead, allow checkout to proceed
        // Logging is already handled in validateEmail function
      } catch (validationError) {
        // Graceful error handling for database connection failures
        // Detailed logging is already handled in validateEmail function
        console.error("Email validation failed:", validationError);

        // Log the graceful degradation decision
        console.warn(
          `Email validation failed for ${email}, proceeding with checkout due to database error`
        );

        // Log this as a system event for monitoring
        console.error(
          "[EMAIL_VALIDATION_GRACEFUL_DEGRADATION]",
          JSON.stringify({
            timestamp: new Date().toISOString(),
            email: email.substring(0, 3) + "***", // Partial email for privacy
            error: (validationError as Error).message,
            gracefulDegradation: true,
            metadata,
          })
        );

        // Optionally, you could return an error here if you want to be more strict
        // For now, we'll continue with the checkout process as per requirement 5.3
      }
    }

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
            address: {
              country: "US", // Default to US for phone number country selection
            },
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

    return NextResponse.json({ url: session.url } as CheckoutResponse);
  } catch (error: any) {
    console.error("Checkout session error:", error);

    // Return structured error response
    return NextResponse.json(
      {
        error: "Unable to create checkout session. Please try again.",
        errorType: "SERVER_ERROR",
        details: {
          suggestion:
            "Please try again in a few moments. If the problem persists, contact support.",
        },
      } as ErrorResponse,
      { status: 500 }
    );
  }
}
