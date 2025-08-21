import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");
  const email = searchParams.get("email");

  if (!sessionId && !email) {
    return NextResponse.json(
      { error: "Missing session_id or email parameter" },
      { status: 400 }
    );
  }

  try {
    let query = supabase.from("clients").select("*");

    if (sessionId) {
      query = query.eq("stripe_session_id", sessionId);
    } else if (email) {
      query = query.eq("email", email);
    }

    const { data: clients, error } = await query
      .eq("status", "completed")
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error("Error verifying payment:", error);
      return NextResponse.json(
        { error: "Failed to verify payment" },
        { status: 500 }
      );
    }

    if (!clients || clients.length === 0) {
      return NextResponse.json(
        { verified: false, message: "No completed payment found" },
        { status: 200 }
      );
    }

    const payment = clients[0];
    return NextResponse.json({
      verified: true,
      payment: {
        id: payment.id,
        email: payment.email,
        name: payment.name,
        tier_name: payment.tier_name,
        amount_total: payment.amount_total,
        currency: payment.currency,
        created_at: payment.created_at,
      },
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
