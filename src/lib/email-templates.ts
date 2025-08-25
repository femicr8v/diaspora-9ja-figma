interface EmailTemplate {
  subject: string;
  body: string;
}

interface LeadNotificationData {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  createdAt: string;
  id?: string;
}

interface PaymentNotificationData {
  name: string;
  email: string;
  amount: number;
  currency: string;
  tierName: string;
  paymentDate: string;
  isSubscription?: boolean;
}

/**
 * Sanitizes input data to prevent injection attacks and ensure clean email content
 */
function sanitizeString(input: string | undefined): string {
  if (!input) return "";

  return input
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .replace(/[\r\n\t]/g, " ") // Replace line breaks and tabs with spaces
    .trim()
    .substring(0, 500); // Limit length to prevent abuse
}

/**
 * Validates and sanitizes lead notification data
 */
function validateLeadData(data: LeadNotificationData): LeadNotificationData {
  return {
    name: sanitizeString(data.name),
    email: sanitizeString(data.email),
    phone: sanitizeString(data.phone),
    location: sanitizeString(data.location),
    createdAt: sanitizeString(data.createdAt),
    id: sanitizeString(data.id),
  };
}

/**
 * Validates and sanitizes payment notification data
 */
function validatePaymentData(
  data: PaymentNotificationData
): PaymentNotificationData {
  return {
    name: sanitizeString(data.name),
    email: sanitizeString(data.email),
    amount: Math.max(0, Number(data.amount) || 0),
    currency: sanitizeString(data.currency).toUpperCase(),
    tierName: sanitizeString(data.tierName),
    paymentDate: sanitizeString(data.paymentDate),
    isSubscription: Boolean(data.isSubscription),
  };
}

/**
 * Generates email template for admin notification when a new lead is created
 */
export function generateLeadAdminNotification(
  data: LeadNotificationData
): EmailTemplate {
  const sanitizedData = validateLeadData(data);

  const subject = `New Lead: ${sanitizedData.name} - ${sanitizedData.email}`;

  const body = `A new lead has been created:

Name: ${sanitizedData.name}
Email: ${sanitizedData.email}
Phone: ${sanitizedData.phone || "Not provided"}
Location: ${sanitizedData.location || "Not provided"}
Created: ${sanitizedData.createdAt}${
    sanitizedData.id ? `\nLead ID: ${sanitizedData.id}` : ""
  }

Please follow up with this lead as appropriate.

---
Diaspora9ja Admin System`;

  return { subject, body };
}

/**
 * Generates welcome email template for new leads
 */
export function generateLeadUserWelcome(
  data: LeadNotificationData
): EmailTemplate {
  const sanitizedData = validateLeadData(data);

  const subject = "Welcome to Diaspora9ja - You're One Step Away!";

  const body = `Hi ${sanitizedData.name},

Thank you for your interest in joining the Diaspora9ja community!

You're one step away from becoming part of our exclusive network of Nigerians around the world. We've received your information and you should receive a checkout link shortly to complete your membership.

What happens next:
1. Complete your payment through our secure checkout
2. Get instant access to our community platform
3. Connect with fellow Nigerians worldwide

Our community offers:
• Exclusive news and insights
• Investment opportunities
• Business networking
• Cultural events and meetups
• Mentorship programs

If you have any questions, feel free to reach out to us at femicr8v@gmail.com.

Welcome aboard!
The Diaspora9ja Team

---
This email was sent because you expressed interest in joining Diaspora9ja.`;

  return { subject, body };
}
/**
 * Generates email template for admin notification when a payment is completed
 */
export function generatePaymentAdminNotification(
  data: PaymentNotificationData
): EmailTemplate {
  const sanitizedData = validatePaymentData(data);

  const paymentType = sanitizedData.isSubscription
    ? "Subscription Renewal"
    : "New Payment";
  const subject = `Payment Received: ${sanitizedData.name} - ${sanitizedData.amount} ${sanitizedData.currency}`;

  const body = `A payment has been completed:

Customer: ${sanitizedData.name}
Email: ${sanitizedData.email}
Amount: ${sanitizedData.amount} ${sanitizedData.currency}
Tier: ${sanitizedData.tierName}
Payment Date: ${sanitizedData.paymentDate}
Type: ${paymentType}

${
  sanitizedData.isSubscription
    ? "This is a subscription renewal. Customer access has been extended."
    : "This is a new payment. Customer has been added to the system and granted access."
}

---
Diaspora9ja Admin System`;

  return { subject, body };
}

/**
 * Generates payment confirmation email template for customers
 */
export function generatePaymentUserConfirmation(
  data: PaymentNotificationData
): EmailTemplate {
  const sanitizedData = validatePaymentData(data);

  const subject = "Payment Confirmed - Welcome to Diaspora9ja!";

  const body = `Hi ${sanitizedData.name},

Your payment has been successfully processed! ${
    sanitizedData.isSubscription
      ? "Your membership has been renewed."
      : "Welcome to the Diaspora9ja community."
  }

Payment Details:
Amount: ${sanitizedData.amount} ${sanitizedData.currency}
Membership: ${sanitizedData.tierName}
Date: ${sanitizedData.paymentDate}

You now have full access to:
• Exclusive community platform
• Networking opportunities with 15,000+ members
• Investment opportunities ($50M+ deals showcased)
• Events and meetups
• Premium content and resources
• Business directory and connections
• Mentorship programs

${
  sanitizedData.isSubscription
    ? "Your access has been extended and you can continue enjoying all premium features."
    : "Log in to your account to start exploring and connecting with fellow Nigerians worldwide."
}

If you have any questions or need assistance, please contact us at femicr8v@gmail.com.

${
  sanitizedData.isSubscription
    ? "Thank you for your continued membership!"
    : "We're excited to have you as part of our community!"
}

Best regards,
The Diaspora9ja Team

---
This email confirms your payment for Diaspora9ja membership.`;

  return { subject, body };
}

/**
 * Email template generator class that provides all template generation methods
 */
export class EmailTemplateGenerator {
  generateLeadAdminNotification(data: LeadNotificationData): EmailTemplate {
    return generateLeadAdminNotification(data);
  }

  generateLeadUserWelcome(data: LeadNotificationData): EmailTemplate {
    return generateLeadUserWelcome(data);
  }

  generatePaymentAdminNotification(
    data: PaymentNotificationData
  ): EmailTemplate {
    return generatePaymentAdminNotification(data);
  }

  generatePaymentUserConfirmation(
    data: PaymentNotificationData
  ): EmailTemplate {
    return generatePaymentUserConfirmation(data);
  }
}

// Export types for use in other modules
export type { EmailTemplate, LeadNotificationData, PaymentNotificationData };
