# Stripe Integration Setup Guide

## ✅ What's Already Done

1. **Packages Installed**: Stripe and Supabase packages are installed
2. **API Routes Created**:
   - `/api/checkout` - Creates Stripe Checkout sessions
   - `/api/webhook` - Handles Stripe webhooks and saves to Supabase
3. **Components Created**:
   - `JoinNowButton` - Simplified button that redirects to Stripe Checkout
   - Updated `JoinNowFormSection` to use Stripe Checkout
4. **Pages Created**:
   - `/thank-you` - Success page after payment
   - `/test-stripe` - Test page for the integration

## 🔧 Setup Required

### 1. Environment Variables

Update your `.env.local` with a real Stripe Price ID:

```bash
# Replace this with your actual Price ID from Stripe Dashboard
STRIPE_PRICE_ID=price_1234567890abcdef
```

### 2. Supabase Database Setup

Run this SQL in your Supabase SQL editor:

```sql
create table if not exists payments (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  stripe_session_id text unique,
  user_id text,
  email text,
  name text,
  phone text,
  location jsonb,
  amount_total bigint,
  currency text,
  status text,
  raw jsonb
);

create index if not exists payments_email_idx on payments (email);
alter table payments enable row level security;

create policy "Service role can manage payments" on payments
  for all using (auth.role() = 'service_role');
```

### 3. Stripe Dashboard Setup

1. **Create a Product & Price**:

   - Go to Stripe Dashboard → Products
   - Create a new product
   - Add a price (one-time payment)
   - Copy the Price ID (starts with `price_`) to your `.env.local`

2. **Create Webhook Endpoint**:
   - Go to Stripe Dashboard → Developers → Webhooks
   - Add endpoint: `https://yourdomain.com/api/webhook`
   - Select event: `checkout.session.completed`
   - Copy the signing secret to `STRIPE_WEBHOOK_SECRET` in `.env.local`

### 4. Local Testing

1. **Install Stripe CLI**:

   ```bash
   # Install Stripe CLI (if not already installed)
   # Follow: https://stripe.com/docs/stripe-cli
   ```

2. **Login to Stripe**:

   ```bash
   stripe login
   ```

3. **Start your dev server**:

   ```bash
   npm run dev
   ```

4. **Forward webhooks** (in another terminal):

   ```bash
   stripe listen --forward-to localhost:3000/api/webhook
   ```

5. **Test the integration**:
   - Visit `http://localhost:3000/test-stripe`
   - Click the "Join Our Community" button
   - Complete the Stripe Checkout flow
   - Check your Supabase `payments` table for the data

### 5. Production Deployment

1. **Deploy your app** (Vercel, etc.)
2. **Update webhook endpoint** in Stripe Dashboard to your production URL
3. **Update environment variables** in your hosting platform

## 🎯 How It Works

1. **User clicks "Join Our Community"** → Calls `/api/checkout`
2. **Checkout API** → Creates Stripe Checkout session with required fields:
   - `billing_address_collection: "required"` (name + full address)
   - `phone_number_collection: { enabled: true }` (required phone)
   - Email is collected by default
3. **User completes payment** → Stripe redirects to `/thank-you`
4. **Stripe sends webhook** → `/api/webhook` saves all data to Supabase

## 🔍 Testing

- **Test page**: `/test-stripe`
- **Main integration**: `/join-the-community` (your existing page)
- **Success page**: `/thank-you`

## 📊 Data Collected

Stripe Checkout will collect and store in Supabase:

- ✅ Name (required)
- ✅ Email (required)
- ✅ Phone (required)
- ✅ Full billing address (required)
- ✅ Payment amount & currency
- ✅ Stripe session ID
- ✅ Full webhook payload (for debugging)

The integration is now complete and ready for testing!
