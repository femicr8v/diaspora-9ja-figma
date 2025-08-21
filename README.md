# Diaspo9ja - Connecting Nigerians Globally

A comprehensive community platform built with Next.js, designed to connect Nigerians worldwide through membership subscriptions, community features, and global networking opportunities.

## 🌟 Project Overview

**Diaspo9ja** is a modern web application that serves as a hub for the Nigerian diaspora community. The platform facilitates connections, provides valuable resources, and offers membership tiers with exclusive benefits for Nigerians living abroad and those interested in global Nigerian culture.

### Key Features

- **Community Membership Platform** with Stripe-powered subscriptions
- **Responsive Landing Page** with comprehensive sections
- **Lead Generation System** for community growth
- **Payment Processing** with automated customer data management
- **Modern UI/UX** built with Radix UI and Tailwind CSS
- **Database Integration** with Supabase for data persistence

## 🏗️ Architecture & Tech Stack

### Frontend

- **Framework**: Next.js 15.4.6 with App Router
- **UI Library**: Radix UI components with custom styling
- **Styling**: Tailwind CSS v4 with custom design system
- **Typography**: Space Grotesk & Roboto fonts
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **State Management**: React hooks and context

### Backend & Services

- **API Routes**: Next.js API routes for server-side logic
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Payments**: Stripe integration with webhooks
- **Authentication**: Supabase Auth (ready for implementation)

### Development Tools

- **Language**: TypeScript
- **Package Manager**: pnpm
- **Linting**: ESLint with Next.js config
- **Build Tool**: Turbopack for fast development

## 📁 Project Structure

```
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/                      # API endpoints
│   │   │   ├── checkout/             # Stripe checkout session creation
│   │   │   ├── leads/                # Lead capture and management
│   │   │   └── webhook/              # Stripe webhook handler
│   │   ├── join-the-community/       # Membership signup page
│   │   ├── thank-you/                # Post-payment success page
│   │   ├── layout.tsx                # Root layout with fonts
│   │   └── page.tsx                  # Homepage
│   ├── components/                   # React components
│   │   ├── landing-page/             # Homepage sections
│   │   ├── join-now-page/            # Membership signup flow
│   │   ├── ui/                       # Reusable UI components
│   │   └── [various pages].tsx       # Feature-specific components
│   ├── lib/                          # Utility functions and configs
│   └── guidelines/                   # Documentation and guides
├── public/                           # Static assets
├── supabase-setup.sql               # Database schema
└── [config files]                   # Next.js, TypeScript, etc.
```

## 🚀 Current Implementation Status

### ✅ Completed Features

#### **Landing Page System**

- **Hero Section** with compelling value proposition
- **About Section** explaining the community mission
- **Community Stats** showcasing growth and engagement
- **Platform Features** highlighting key benefits
- **Community Showcase** with member highlights
- **Testimonials** from satisfied community members
- **FAQ Section** addressing common questions
- **Call-to-Action** driving membership conversions
- **Contact Section** for community inquiries
- **Responsive Footer** with comprehensive links

#### **Membership & Payment System**

- **Stripe Integration** (Test Mode Active)
  - Checkout session creation (`/api/checkout`)
  - Webhook handling for payment confirmation (`/api/webhook`)
  - Customer data capture and storage
  - Subscription management (recurring monthly payments)
- **Payment Plans Available**:
  - Eco Membership (Early Bird): $10/month
  - Eco Membership Plan: $20/month
- **Database Schema** with `payments` and `leads` tables
- **Lead Capture System** (`/api/leads`) for pre-signup data collection

#### **UI/UX Components**

- **Modern Design System** with consistent styling
- **Responsive Layout** optimized for all devices
- **Interactive Elements** with proper loading states
- **Form Handling** with validation and error management
- **Accessibility Features** following WCAG guidelines

#### **Technical Infrastructure**

- **Environment Configuration** for development and production
- **Database Setup** with Supabase integration
- **API Security** with proper validation and error handling
- **Type Safety** with comprehensive TypeScript coverage

### 🔄 In Progress / Ready for Enhancement

#### **Authentication System**

- Supabase Auth integration prepared
- User session management ready for implementation
- Protected routes structure in place

#### **Member Dashboard**

- Component structure created (`MembershipDashboard.tsx`)
- Ready for feature implementation
- Integration points with payment system established

#### **Content Management**

- Blog system components prepared
- News section framework ready
- Investment/business content structure in place

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Supabase account
- Stripe account (test mode for development)

### Installation

1. **Clone and install dependencies**

```bash
git clone <repository-url>
cd diaspo9ja
pnpm install
```

2. **Environment Setup**
   Create `.env.local` with the following variables:

```bash
# Stripe Configuration (Test Mode)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_1RvzCjEElTF7N7ddqwEEAhBK

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. **Database Setup**

```bash
# Run the SQL setup in your Supabase dashboard
cat supabase-setup.sql
# Copy and execute in Supabase SQL editor
```

4. **Start Development Server**

```bash
pnpm dev
```

Visit `http://localhost:3000` to see the application.

### Testing the Payment Flow

1. Navigate to `/join-the-community`
2. Enter email and click "Join Our Community"
3. Complete Stripe checkout with test card: `4242424242424242`
4. Verify data storage in Supabase `payments` table

## 📊 Database Schema

### Payments Table

Stores completed payment information from Stripe webhooks:

```sql
- id (Primary Key)
- stripe_session_id (Unique)
- user_id, email, name, phone
- location (formatted address)
- tier_name (membership level)
- amount_total, currency, status
- raw (full Stripe session data)
```

### Leads Table

Captures potential members before payment:

```sql
- id (Primary Key)
- name, email, phone, location
- status ('lead', 'converted', 'abandoned')
- stripe_session_id (when checkout starts)
- conversion tracking timestamps
```

## 🔐 Security & Best Practices

- **Environment Variables** properly configured for sensitive data
- **Stripe Webhook Verification** with signature validation
- **Database Security** with Row Level Security (RLS) enabled
- **Input Validation** using Zod schemas
- **Error Handling** with comprehensive logging
- **Type Safety** with strict TypeScript configuration

## 🚀 Deployment Guide

### Production Checklist

- [ ] Replace Stripe test keys with live keys
- [ ] Configure production webhook endpoints
- [ ] Set up domain and SSL certificates
- [ ] Configure production environment variables
- [ ] Test payment flow with real transactions
- [ ] Set up monitoring and error tracking

### Recommended Deployment Platforms

- **Vercel** (Recommended for Next.js)
- **Netlify** with serverless functions
- **Railway** or **Render** for full-stack deployment

## 📈 Future Roadmap

### Phase 1: Core Features

- [ ] User authentication and profiles
- [ ] Member dashboard with subscription management
- [ ] Community forums and discussions
- [ ] Event management system

### Phase 2: Enhanced Features

- [ ] Mobile app development
- [ ] Advanced networking features
- [ ] Business directory integration
- [ ] Mentorship program platform

### Phase 3: Scale & Growth

- [ ] Multi-language support
- [ ] Regional community chapters
- [ ] Partnership integrations
- [ ] Advanced analytics dashboard

## 🤝 Contributing

This project follows modern development practices with:

- **Component-based architecture** for maintainability
- **TypeScript** for type safety
- **Responsive design** principles
- **Accessibility** standards compliance
- **Performance optimization** best practices

## 📞 Support & Documentation

- **Stripe Integration Guide**: `src/guidelines/STRIPE_INTEGRATION.md`
- **Component Documentation**: Available in respective component files
- **API Documentation**: Inline documentation in API route files

## 🎯 Current Status: **Production Ready for MVP**

The application is fully functional with:

- ✅ Complete payment processing system
- ✅ Professional UI/UX implementation
- ✅ Database integration and data persistence
- ✅ Responsive design across all devices
- ✅ Security best practices implemented
- ✅ Comprehensive error handling

**Ready for production deployment with live Stripe keys and webhook configuration.**
