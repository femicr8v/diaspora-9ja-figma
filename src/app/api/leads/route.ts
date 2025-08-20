import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // server-only
);

export async function POST(req: Request) {
  try {
    const { name, email, phone, location } = await req.json();

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Insert or update lead (upsert based on email)
    const { data, error } = await supabase
      .from("leads")
      .upsert(
        {
          name,
          email,
          phone: phone || null,
          location: location || null,
          status: "lead",
        },
        {
          onConflict: "email",
          ignoreDuplicates: false,
        }
      )
      .select()
      .single();

    if (error) {
      console.error("Error creating/updating lead:", error);
      return NextResponse.json(
        { error: "Failed to save lead information" },
        { status: 500 }
      );
    }

    console.log(`✅ Lead saved: ${email} - ${name}`);
    return NextResponse.json({ success: true, leadId: data.id });
  } catch (error) {
    console.error("Lead creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
