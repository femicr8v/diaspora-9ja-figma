Awesome — here’s a clean, copy-paste setup that **makes name, phone, billing address (location) and email mandatory** on Stripe Checkout, then stores everything in Supabase.

Stripe bits we’ll use:

- `billing_address_collection: "required"` → forces full billing address. ([docs.stripe.com](https://docs.stripe.com/payments/collect-addresses))
- `phone_number_collection: { enabled: true }` → adds a **required** phone field. ([docs.stripe.com](https://docs.stripe.com/payments/checkout/phone-numbers))
- If you don’t prefill `customer_email`, Checkout asks for it by default. ([docs.stripe.com](https://docs.stripe.com/api/checkout/sessions/create?utm_source=chatgpt.com))

---

# 0) Install packages

```bash
npm install stripe @supabase/supabase-js
```

---

# 1) Environment variables (`.env.local`)

```bash
# Stripe
STRIPE_SECRET_KEY=sk_test_***
STRIPE_WEBHOOK_SECRET=whsec_***         # from Stripe Dashboard → Developers → Webhooks
STRIPE_PRICE_ID=price_***               # your Price ID
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://lvctdfifinwgaeugitpd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2Y3RkZmlmaW53Z2FldWdpdHBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNDM4NzIsImV4cCI6MjA2ODkxOTg3Mn0.VN8MTHGow6xfrzRqVVzOX9fxl9vgnShr21Rn5LiKZcA
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2Y3RkZmlmaW53Z2FldWdpdHBkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzM0Mzg3MiwiZXhwIjoyMDY4OTE5ODcyfQ.q9A9mqjC0R256aVoLW9GWw_QVEuER26c85t5IOgnxYo   # server-only
```

> Keep `SUPABASE_SERVICE_ROLE_KEY` strictly on the server (API routes/webhooks).

---

# 2) Supabase table

Run this in Supabase SQL editor:

```sql
create table if not exists clients (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  stripe_session_id text unique,
  user_id text,
  email text,
  name text,
  phone text,
  location jsonb,              -- full billing address as JSON
  amount_total bigint,         -- smallest currency unit (e.g. kobo/cents)
  currency text,
  status text,
  raw jsonb
);

create index if not exists clients_email_idx on clients (email);
```

---

# 3) Create Checkout Session (App Router)

`app/api/checkout/route.ts`

```ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

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
```

> With the two flags above, Checkout requires **email + name + full billing address** and a **phone number**. ([docs.stripe.com](https://docs.stripe.com/payments/collect-addresses))

---

# 4) Client button

Use this anywhere on your landing page:

```tsx
"use client";
import { useState } from "react";

export default function JoinNowButton({
  user,
}: {
  user?: { id: string; email: string };
}) {
  const [email, setEmail] = useState(user?.email ?? "");

  const handleCheckout = async () => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email, // optional if you want Stripe to ask for it
        userId: user?.id ?? "guest",
      }),
    });

    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else alert(data.error ?? "Something went wrong");
  };

  return (
    <div className="flex items-center gap-2">
      {!user && (
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="border rounded-lg px-3 py-2"
        />
      )}
      <button
        onClick={handleCheckout}
        className="px-4 py-2 rounded-lg text-white bg-black"
      >
        Join Now
      </button>
    </div>
  );
}
```

---

# 5) Webhook: save details in Supabase

`app/api/webhook/route.ts`

```ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

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

      const { error } = await supabase.from("clients").insert({
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
```

> After payment, these fields are available in the `checkout.session.completed` payload under `customer_details` (email, name, phone, address). ([docs.stripe.com](https://docs.stripe.com/payments/checkout/phone-numbers))

---

# 6) Thank-you page

`app/thank-you/page.tsx`

```tsx
import Link from "next/link";

export default function ThankYouPage() {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-3xl font-bold">🎉 Thank you!</h1>
      <p className="mt-2">
        Your payment was successful. Check your email for a receipt.
      </p>
      <Link href="/" className="mt-6 underline">
        Back to home
      </Link>
    </main>
  );
}
```

---

# 7) Stripe Dashboard setup (one-time)

1. Copy your **Price ID** from Products.
2. Add a **Webhook endpoint** pointing to `https://yourdomain.com/api/webhook`, subscribe to `checkout.session.completed`, and copy the **signing secret** into `STRIPE_WEBHOOK_SECRET`.

---

# 8) Local testing

Use Stripe CLI to forward webhooks to your dev server:

```bash
# login (once)
stripe login

# run your dev server
npm run dev

# forward webhooks to your local route
stripe listen --forward-to localhost:3000/api/webhook

# optional: fire a test event
stripe trigger checkout.session.completed
```

---

# 9) Going to production

- Add all env vars in your host (e.g. Vercel).
- Create a **production** webhook in Stripe pointing to your live domain and set the new `STRIPE_WEBHOOK_SECRET`.
- Keep `runtime = "nodejs"` on both API routes.

---

## Notes & options

- If you also need **shipping address**, add:
  ```ts
  shipping_address_collection: {
    allowed_countries: ["NG", "US", "GB", "CA"];
  }
  ```
  You’ll then also get `session.shipping_details`. ([docs.stripe.com](https://docs.stripe.com/payments/collect-addresses))
- If you pass `customer_email` when creating the session, Checkout pre-fills it (if not provided, Stripe asks for it). ([docs.stripe.com](https://docs.stripe.com/api/checkout/sessions/create?utm_source=chatgpt.com))

That’s the full flow. Want me to add an optional `/api/stripe/session` reader so your thank-you page can display the payer’s **name/amount** in real time?
