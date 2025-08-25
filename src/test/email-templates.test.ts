import { describe, it, expect } from "vitest";
import {
  generateLeadAdminNotification,
  generateLeadUserWelcome,
  generatePaymentAdminNotification,
  generatePaymentUserConfirmation,
  EmailTemplateGenerator,
  type LeadNotificationData,
  type PaymentNotificationData,
} from "../lib/email-templates";

describe("Email Templates", () => {
  describe("generateLeadAdminNotification", () => {
    it("should generate correct admin notification for lead creation", () => {
      const leadData: LeadNotificationData = {
        name: "John Doe",
        email: "john@example.com",
        phone: "+1234567890",
        location: "New York, USA",
        createdAt: "2024-01-15T10:30:00Z",
        id: "lead_123",
      };

      const result = generateLeadAdminNotification(leadData);

      expect(result.subject).toBe("New Lead: John Doe - john@example.com");
      expect(result.body).toContain("Name: John Doe");
      expect(result.body).toContain("Email: john@example.com");
      expect(result.body).toContain("Phone: +1234567890");
      expect(result.body).toContain("Location: New York, USA");
      expect(result.body).toContain("Created: 2024-01-15T10:30:00Z");
      expect(result.body).toContain("Lead ID: lead_123");
      expect(result.body).toContain("Diaspora9ja Admin System");
    });

    it("should handle missing optional fields gracefully", () => {
      const leadData: LeadNotificationData = {
        name: "Jane Smith",
        email: "jane@example.com",
        createdAt: "2024-01-15T10:30:00Z",
      };

      const result = generateLeadAdminNotification(leadData);

      expect(result.body).toContain("Phone: Not provided");
      expect(result.body).toContain("Location: Not provided");
      expect(result.body).not.toContain("Lead ID:");
    });

    it("should sanitize potentially dangerous input", () => {
      const leadData: LeadNotificationData = {
        name: 'John <script>alert("xss")</script> Doe',
        email: "john@example.com\r\n\tmalicious",
        phone: '<img src="x" onerror="alert(1)">',
        location: "New York\n\rUSA",
        createdAt: "2024-01-15T10:30:00Z",
      };

      const result = generateLeadAdminNotification(leadData);

      expect(result.body).not.toContain("<script>");
      expect(result.body).not.toContain("<img");
      // Note: The email body itself contains \n for formatting, we're checking that user input \r\n\t are sanitized
      expect(result.body).toContain("john@example.com   malicious"); // \r\n\t replaced with spaces
      expect(result.body).toContain("New York  USA"); // \n\r replaced with spaces
    });
  });

  describe("generateLeadUserWelcome", () => {
    it("should generate correct welcome email for new leads", () => {
      const leadData: LeadNotificationData = {
        name: "Alice Johnson",
        email: "alice@example.com",
        createdAt: "2024-01-15T10:30:00Z",
      };

      const result = generateLeadUserWelcome(leadData);

      expect(result.subject).toBe(
        "Welcome to Diaspora9ja - You're One Step Away!"
      );
      expect(result.body).toContain("Hi Alice Johnson,");
      expect(result.body).toContain("Thank you for your interest");
      expect(result.body).toContain("What happens next:");
      expect(result.body).toContain("1. Complete your payment");
      expect(result.body).toContain("2. Get instant access");
      expect(result.body).toContain("3. Connect with fellow Nigerians");
      expect(result.body).toContain("femicr8v@gmail.com");
      expect(result.body).toContain("The Diaspora9ja Team");
    });

    it("should sanitize user name in welcome email", () => {
      const leadData: LeadNotificationData = {
        name: 'Alice <script>alert("test")</script>',
        email: "alice@example.com",
        createdAt: "2024-01-15T10:30:00Z",
      };

      const result = generateLeadUserWelcome(leadData);

      expect(result.body).not.toContain("<script>");
      expect(result.body).toContain('Hi Alice scriptalert("test")/script,'); // < and > are removed
    });
  });

  describe("generatePaymentAdminNotification", () => {
    it("should generate correct admin notification for new payment", () => {
      const paymentData: PaymentNotificationData = {
        name: "Bob Wilson",
        email: "bob@example.com",
        amount: 25,
        currency: "USD",
        tierName: "Premium",
        paymentDate: "2024-01-15T10:30:00Z",
        isSubscription: false,
      };

      const result = generatePaymentAdminNotification(paymentData);

      expect(result.subject).toBe("Payment Received: Bob Wilson - 25 USD");
      expect(result.body).toContain("Customer: Bob Wilson");
      expect(result.body).toContain("Email: bob@example.com");
      expect(result.body).toContain("Amount: 25 USD");
      expect(result.body).toContain("Tier: Premium");
      expect(result.body).toContain("Type: New Payment");
      expect(result.body).toContain("Customer has been added to the system");
    });

    it("should generate correct admin notification for subscription renewal", () => {
      const paymentData: PaymentNotificationData = {
        name: "Carol Davis",
        email: "carol@example.com",
        amount: 25,
        currency: "USD",
        tierName: "Premium",
        paymentDate: "2024-01-15T10:30:00Z",
        isSubscription: true,
      };

      const result = generatePaymentAdminNotification(paymentData);

      expect(result.body).toContain("Type: Subscription Renewal");
      expect(result.body).toContain("Customer access has been extended");
    });

    it("should sanitize and validate payment data", () => {
      const paymentData: PaymentNotificationData = {
        name: "Test <script>User</script>",
        email: "test@example.com",
        amount: -50, // Negative amount should be corrected
        currency: "usd", // Should be uppercase
        tierName: "Premium\n\rTier",
        paymentDate: "2024-01-15T10:30:00Z",
        isSubscription: false,
      };

      const result = generatePaymentAdminNotification(paymentData);

      expect(result.body).not.toContain("<script>");
      expect(result.body).toContain("Amount: 0 USD"); // Negative amount corrected to 0
      // The currency is shown in the amount line, not separately
      expect(result.body).toContain("Tier: Premium  Tier"); // \n\r replaced with spaces
    });
  });

  describe("generatePaymentUserConfirmation", () => {
    it("should generate correct confirmation email for new payment", () => {
      const paymentData: PaymentNotificationData = {
        name: "David Brown",
        email: "david@example.com",
        amount: 25,
        currency: "USD",
        tierName: "Premium",
        paymentDate: "2024-01-15T10:30:00Z",
        isSubscription: false,
      };

      const result = generatePaymentUserConfirmation(paymentData);

      expect(result.subject).toBe(
        "Payment Confirmed - Welcome to Diaspora9ja!"
      );
      expect(result.body).toContain("Hi David Brown,");
      expect(result.body).toContain("Welcome to the Diaspora9ja community");
      expect(result.body).toContain("Amount: 25 USD");
      expect(result.body).toContain("Membership: Premium");
      expect(result.body).toContain("You now have full access to:");
      expect(result.body).toContain("15,000+ members");
      expect(result.body).toContain("$50M+ deals");
      expect(result.body).toContain("femicr8v@gmail.com");
      expect(result.body).toContain("We're excited to have you");
    });

    it("should generate correct confirmation email for subscription renewal", () => {
      const paymentData: PaymentNotificationData = {
        name: "Emma Wilson",
        email: "emma@example.com",
        amount: 25,
        currency: "USD",
        tierName: "Premium",
        paymentDate: "2024-01-15T10:30:00Z",
        isSubscription: true,
      };

      const result = generatePaymentUserConfirmation(paymentData);

      expect(result.body).toContain("Your membership has been renewed");
      expect(result.body).toContain("Your access has been extended");
      expect(result.body).toContain("Thank you for your continued membership");
    });
  });

  describe("EmailTemplateGenerator class", () => {
    it("should provide all template generation methods", () => {
      const generator = new EmailTemplateGenerator();

      const leadData: LeadNotificationData = {
        name: "Test User",
        email: "test@example.com",
        createdAt: "2024-01-15T10:30:00Z",
      };

      const paymentData: PaymentNotificationData = {
        name: "Test User",
        email: "test@example.com",
        amount: 25,
        currency: "USD",
        tierName: "Premium",
        paymentDate: "2024-01-15T10:30:00Z",
        isSubscription: false,
      };

      expect(generator.generateLeadAdminNotification(leadData)).toBeDefined();
      expect(generator.generateLeadUserWelcome(leadData)).toBeDefined();
      expect(
        generator.generatePaymentAdminNotification(paymentData)
      ).toBeDefined();
      expect(
        generator.generatePaymentUserConfirmation(paymentData)
      ).toBeDefined();
    });
  });

  describe("Data validation and sanitization", () => {
    it("should limit string length to prevent abuse", () => {
      const longString = "a".repeat(1000);
      const leadData: LeadNotificationData = {
        name: longString,
        email: "test@example.com",
        createdAt: "2024-01-15T10:30:00Z",
      };

      const result = generateLeadAdminNotification(leadData);

      // Should be truncated to 500 characters max
      const nameInBody = result.body.match(/Name: (.+)/)?.[1];
      expect(nameInBody?.length).toBeLessThanOrEqual(500);
    });

    it("should handle undefined and empty values gracefully", () => {
      const leadData: LeadNotificationData = {
        name: "",
        email: "",
        phone: undefined,
        location: undefined,
        createdAt: "",
      };

      const result = generateLeadAdminNotification(leadData);

      expect(result.subject).toBe("New Lead:  - ");
      expect(result.body).toContain("Phone: Not provided");
      expect(result.body).toContain("Location: Not provided");
    });
  });
});
