import { Resend } from "resend";
import { adminEmail, emailConfig } from "./constants";
import { emailConfigValidator } from "./email-config-validator";
import { emailMonitor } from "./email-monitor";

// Initialize Resend with API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

// Email error types
export enum EmailError {
  PROVIDER_ERROR = "PROVIDER_ERROR",
  TEMPLATE_ERROR = "TEMPLATE_ERROR",
  CONFIGURATION_ERROR = "CONFIGURATION_ERROR",
  NETWORK_ERROR = "NETWORK_ERROR",
}

// Email sending result interface
export interface EmailResult {
  success: boolean;
  error?: string;
  errorType?: EmailError;
  messageId?: string;
}

// Email template interfaces
export interface EmailTemplate {
  subject: string;
  body: string;
}

export interface LeadNotificationData {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  createdAt: string;
}

export interface PaymentNotificationData {
  name: string;
  email: string;
  amount: number;
  currency: string;
  tierName: string;
  paymentDate: string;
  isSubscription?: boolean;
}

// Email Service Class
export class EmailService {
  private logEmailAttempt(
    type: string,
    recipient: string,
    subject: string,
    success: boolean,
    error?: string,
    errorType?: EmailError,
    messageId?: string,
    attemptNumber: number = 1
  ): void {
    // Use the email monitor for comprehensive logging and volume tracking
    emailMonitor.logEmailAttempt(
      type,
      recipient,
      subject,
      success,
      error,
      errorType,
      messageId,
      attemptNumber
    );
  }

  private categorizeError(error: any): EmailError {
    if (!error) return EmailError.PROVIDER_ERROR;

    const errorMessage = error.message?.toLowerCase() || "";

    if (
      errorMessage.includes("api key") ||
      errorMessage.includes("unauthorized")
    ) {
      return EmailError.CONFIGURATION_ERROR;
    }

    if (
      errorMessage.includes("network") ||
      errorMessage.includes("timeout") ||
      errorMessage.includes("connection")
    ) {
      return EmailError.NETWORK_ERROR;
    }

    if (
      errorMessage.includes("template") ||
      errorMessage.includes("invalid email")
    ) {
      return EmailError.TEMPLATE_ERROR;
    }

    return EmailError.PROVIDER_ERROR;
  }

  private async sendEmail(
    to: string,
    subject: string,
    text: string,
    emailType: string
  ): Promise<EmailResult> {
    try {
      // Check volume limits before attempting to send
      const volumeCheck = emailMonitor.canSendEmail();
      if (!volumeCheck.allowed) {
        const error = `Email sending blocked: ${volumeCheck.reason}`;
        this.logEmailAttempt(
          emailType,
          to,
          subject,
          false,
          error,
          EmailError.CONFIGURATION_ERROR
        );
        return {
          success: false,
          error,
          errorType: EmailError.CONFIGURATION_ERROR,
        };
      }

      // Configuration validation
      if (!process.env.RESEND_API_KEY) {
        const error = "RESEND_API_KEY is not configured";
        this.logEmailAttempt(
          emailType,
          to,
          subject,
          false,
          error,
          EmailError.CONFIGURATION_ERROR
        );
        return {
          success: false,
          error,
          errorType: EmailError.CONFIGURATION_ERROR,
        };
      }

      // Email validation
      if (!to || !subject || !text) {
        const error = "Missing required email parameters";
        this.logEmailAttempt(
          emailType,
          to,
          subject,
          false,
          error,
          EmailError.TEMPLATE_ERROR
        );
        return {
          success: false,
          error,
          errorType: EmailError.TEMPLATE_ERROR,
        };
      }

      // Send email with timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Email sending timeout")), 30000)
      );

      const sendPromise = resend.emails.send({
        from: `${emailConfig.fromName} <${emailConfig.fromEmail}>`,
        to: [to],
        subject,
        text,
      });

      const result = await Promise.race([sendPromise, timeoutPromise]);
      const messageId = (result as any)?.data?.id;

      this.logEmailAttempt(
        emailType,
        to,
        subject,
        true,
        undefined,
        undefined,
        messageId
      );
      return {
        success: true,
        messageId,
      };
    } catch (error: any) {
      const errorType = this.categorizeError(error);
      const errorMessage = error.message || "Unknown email sending error";

      this.logEmailAttempt(
        emailType,
        to,
        subject,
        false,
        errorMessage,
        errorType
      );

      return {
        success: false,
        error: errorMessage,
        errorType,
      };
    }
  }

  async sendLeadCreatedAdminNotification(
    data: LeadNotificationData
  ): Promise<EmailResult> {
    try {
      const subject = `New Lead: ${data.name} - ${data.email}`;
      const body = `A new lead has been created:

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || "Not provided"}
Location: ${data.location || "Not provided"}
Created: ${data.createdAt}

Please follow up with this lead as appropriate.`;

      return await this.sendEmail(
        adminEmail,
        subject,
        body,
        "lead_admin_notification"
      );
    } catch (error: any) {
      const errorMessage =
        error.message || "Failed to send lead admin notification";
      this.logEmailAttempt(
        "lead_admin_notification",
        adminEmail,
        `New Lead: ${data.name}`,
        false,
        errorMessage,
        this.categorizeError(error)
      );
      return {
        success: false,
        error: errorMessage,
        errorType: this.categorizeError(error),
      };
    }
  }

  async sendLeadCreatedUserWelcome(
    data: LeadNotificationData
  ): Promise<EmailResult> {
    try {
      const subject = "Welcome to Diaspora9ja - You're One Step Away!";
      const body = `Hi ${data.name},

Thank you for your interest in joining the Diaspora9ja community!

You're one step away from becoming part of our exclusive network of Nigerians around the world. We've received your information and you should receive a checkout link shortly to complete your membership.

What happens next:
1. Complete your payment through our secure checkout
2. Get instant access to our community platform
3. Connect with fellow Nigerians worldwide

If you have any questions, feel free to reach out to us.

Welcome aboard!
The Diaspora9ja Team`;

      return await this.sendEmail(
        data.email,
        subject,
        body,
        "lead_user_welcome"
      );
    } catch (error: any) {
      const errorMessage = error.message || "Failed to send lead welcome email";
      this.logEmailAttempt(
        "lead_user_welcome",
        data.email,
        "Welcome to Diaspora9ja",
        false,
        errorMessage,
        this.categorizeError(error)
      );
      return {
        success: false,
        error: errorMessage,
        errorType: this.categorizeError(error),
      };
    }
  }

  async sendPaymentCompletedAdminNotification(
    data: PaymentNotificationData
  ): Promise<EmailResult> {
    try {
      // Enhanced payment type distinction for admin notifications
      const paymentType = data.isSubscription
        ? "Subscription Renewal"
        : "New Payment";

      const subject = `${paymentType}: ${data.name} - ${data.amount} ${data.currency}`;

      // More detailed admin notification with payment type specific information
      const body = `A ${paymentType.toLowerCase()} has been completed:

Customer: ${data.name}
Email: ${data.email}
Amount: ${data.amount} ${data.currency}
Tier: ${data.tierName}
Payment Date: ${data.paymentDate}
Type: ${paymentType}

${
  data.isSubscription
    ? "This is a subscription renewal. Customer access has been extended automatically."
    : "This is a new payment. Customer has been added to the system and granted initial access."
}

${
  data.isSubscription
    ? "Next billing cycle will continue as scheduled."
    : "Customer should now have full access to all tier benefits."
}

---
Diaspora9ja Admin System`;

      return await this.sendEmail(
        adminEmail,
        subject,
        body,
        "payment_admin_notification"
      );
    } catch (error: any) {
      const errorMessage =
        error.message || "Failed to send payment admin notification";
      this.logEmailAttempt(
        "payment_admin_notification",
        adminEmail,
        `Payment Received: ${data.name}`,
        false,
        errorMessage,
        this.categorizeError(error)
      );
      return {
        success: false,
        error: errorMessage,
        errorType: this.categorizeError(error),
      };
    }
  }

  async sendPaymentCompletedUserConfirmation(
    data: PaymentNotificationData
  ): Promise<EmailResult> {
    try {
      // Enhanced subject line based on payment type
      const subject = data.isSubscription
        ? "Subscription Renewed - Thank You!"
        : "Payment Confirmed - Welcome to Diaspora9ja!";

      // Payment type specific messaging
      const welcomeMessage = data.isSubscription
        ? "Your subscription has been successfully renewed!"
        : "Your payment has been successfully processed! Welcome to the Diaspora9ja community.";

      const accessMessage = data.isSubscription
        ? "Your access has been extended and you can continue enjoying all premium features."
        : "You now have full access to our exclusive platform and all membership benefits.";

      const closingMessage = data.isSubscription
        ? "Thank you for your continued membership!"
        : "We're excited to have you as part of our community!";

      const body = `Hi ${data.name},

${welcomeMessage}

Payment Details:
Amount: ${data.amount} ${data.currency}
Membership: ${data.tierName}
Date: ${data.paymentDate}
Type: ${data.isSubscription ? "Subscription Renewal" : "New Membership"}

${accessMessage}

${data.isSubscription ? "You continue to have" : "You now have"} access to:
• Exclusive community platform with 15,000+ members
• Networking opportunities and business connections
• Investment opportunities ($50M+ deals showcased)
• Events and meetups worldwide
• Premium content and resources
• Business directory and partnerships
• Mentorship programs

${
  data.isSubscription
    ? "Your next billing cycle will continue as scheduled. You can manage your subscription anytime in your account settings."
    : "Log in to your account to start exploring and connecting with fellow Nigerians worldwide."
}

If you have any questions or need assistance, please contact us at femicr8v@gmail.com.

${closingMessage}

Best regards,
The Diaspora9ja Team

---
This email confirms your ${
        data.isSubscription ? "subscription renewal" : "payment"
      } for Diaspora9ja membership.`;

      return await this.sendEmail(
        data.email,
        subject,
        body,
        "payment_user_confirmation"
      );
    } catch (error: any) {
      const errorMessage =
        error.message || "Failed to send payment confirmation email";
      this.logEmailAttempt(
        "payment_user_confirmation",
        data.email,
        "Payment Confirmed",
        false,
        errorMessage,
        this.categorizeError(error)
      );
      return {
        success: false,
        error: errorMessage,
        errorType: this.categorizeError(error),
      };
    }
  }

  // Helper method to send multiple emails without blocking
  async sendEmailsAsync(
    emailPromises: Promise<EmailResult>[]
  ): Promise<EmailResult[]> {
    try {
      // Use Promise.allSettled to ensure all emails are attempted even if some fail
      const results = await Promise.allSettled(emailPromises);

      return results.map((result, index) => {
        if (result.status === "fulfilled") {
          return result.value;
        } else {
          const error = result.reason?.message || "Unknown error occurred";
          console.error(`Email ${index + 1} failed:`, error);
          return {
            success: false,
            error,
            errorType: EmailError.PROVIDER_ERROR,
          };
        }
      });
    } catch (error: any) {
      console.error("Failed to send emails:", error);
      return emailPromises.map(() => ({
        success: false,
        error: error.message || "Failed to send emails",
        errorType: EmailError.PROVIDER_ERROR,
      }));
    }
  }

  // Validation method for email configuration (delegates to the dedicated validator)
  validateConfiguration(): { valid: boolean; errors: string[] } {
    const result = emailConfigValidator.validateConfigurationSync();
    return {
      valid: result.valid,
      errors: result.errors,
    };
  }

  // Email monitoring and reporting methods
  getEmailMetrics() {
    return emailMonitor.getMetrics();
  }

  getVolumeStatus() {
    return emailMonitor.getVolumeStatus();
  }

  getRecentEmailLogs(limit?: number) {
    return emailMonitor.getRecentLogs(limit);
  }

  getFailedEmailLogs(limit?: number) {
    return emailMonitor.getFailedLogs(limit);
  }

  getEmailLogsByType(type: string, limit?: number) {
    return emailMonitor.getLogsByType(type, limit);
  }

  generateEmailReport(): string {
    return emailMonitor.generateReport();
  }

  canSendEmail() {
    return emailMonitor.canSendEmail();
  }

  clearEmailLogs(): void {
    emailMonitor.clearLogs();
  }

  resetEmailMetrics(): void {
    emailMonitor.resetMetrics();
  }
}

// Export a singleton instance
export const emailService = new EmailService();
