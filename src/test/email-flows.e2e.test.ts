import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  EmailService,
  LeadNotificationData,
  PaymentNotificationData,
} from "../lib/email-service";

// Mock Resend to avoid actual email sending in E2E tests
vi.mock("resend", () => {
  const mockSend = vi.fn();
  return {
    Resend: vi.fn().mockImplementation(() => ({
      emails: {
        send: mockSend,
      },
    })),
    __mockSend: mockSend,
  };
});

// Mock constants
vi.mock("../lib/constants", () => ({
  adminEmail: "admin@test.com",
  emailConfig: {
    fromEmail: "noreply@test.com",
    fromName: "Test Service",
  },
}));

describe("Email Flows End-to-End Tests", () => {
  let emailService: EmailService;
  let mockSend: any;

  beforeEach(async () => {
    emailService = new EmailService();

    // Get the mock send function
    const resendModule = await import("resend");
    mockSend = (resendModule as any).__mockSend;

    // Set up environment
    process.env.RESEND_API_KEY = "test-api-key";

    // Clear mocks
    mockSend.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Lead Creation Email Flow", () => {
    it("should send both admin and user emails for lead creation", async () => {
      // Mock successful email sending
      mockSend.mockResolvedValue({ data: { id: "email-123" } });

      const leadData: LeadNotificationData = {
        name: "John Doe",
        email: "john@example.com",
        phone: "+1-555-0123",
        location: "New York, NY",
        createdAt: "2024-01-15T10:30:00Z",
      };

      // Send both emails as would happen in the lead creation flow
      const emailPromises = [
        emailService.sendLeadCreatedAdminNotification(leadData),
        emailService.sendLeadCreatedUserWelcome(leadData),
      ];

      const results = await emailService.sendEmailsAsync(emailPromises);

      // Verify both emails were sent successfully
      expect(results).toHaveLength(2);
      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(true);

      // Verify correct number of email send calls
      expect(mockSend).toHaveBeenCalledTimes(2);

      // Verify admin notification email
      expect(mockSend).toHaveBeenCalledWith({
        from: "Test Service <noreply@test.com>",
        to: ["admin@test.com"],
        subject: "New Lead: John Doe - john@example.com",
        text: expect.stringContaining("John Doe"),
      });

      // Verify user welcome email
      expect(mockSend).toHaveBeenCalledWith({
        from: "Test Service <noreply@test.com>",
        to: ["john@example.com"],
        subject: "Welcome to Diaspora9ja - You're One Step Away!",
        text: expect.stringContaining("Hi John Doe"),
      });
    });

    it("should handle lead creation emails when some fail", async () => {
      // Mock first email success, second email failure
      mockSend
        .mockResolvedValueOnce({ data: { id: "email-1" } })
        .mockRejectedValueOnce(new Error("Network timeout"));

      const leadData: LeadNotificationData = {
        name: "Jane Smith",
        email: "jane@example.com",
        createdAt: "2024-01-15T14:45:00Z",
      };

      const emailPromises = [
        emailService.sendLeadCreatedAdminNotification(leadData),
        emailService.sendLeadCreatedUserWelcome(leadData),
      ];

      const results = await emailService.sendEmailsAsync(emailPromises);

      // Verify mixed results
      expect(results).toHaveLength(2);
      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(false);
      expect(results[1].error).toContain("Network timeout");

      // Verify both emails were attempted
      expect(mockSend).toHaveBeenCalledTimes(2);
    });

    it("should handle lead creation with missing optional data", async () => {
      mockSend.mockResolvedValue({ data: { id: "email-minimal" } });

      const minimalLeadData: LeadNotificationData = {
        name: "Minimal User",
        email: "minimal@example.com",
        createdAt: "2024-01-15T18:00:00Z",
        // phone and location are undefined
      };

      const emailPromises = [
        emailService.sendLeadCreatedAdminNotification(minimalLeadData),
        emailService.sendLeadCreatedUserWelcome(minimalLeadData),
      ];

      const results = await emailService.sendEmailsAsync(emailPromises);

      // Verify both emails succeed despite missing optional data
      expect(results).toHaveLength(2);
      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(true);

      // Verify admin email handles missing data gracefully
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          text: expect.stringContaining("Phone: Not provided"),
        })
      );
    });

    it("should handle special characters in lead data", async () => {
      mockSend.mockResolvedValue({ data: { id: "email-special" } });

      const specialLeadData: LeadNotificationData = {
        name: "José María Ñoño",
        email: "jose.maria@example.com",
        phone: "+34-123-456-789",
        location: "São Paulo, Brazil",
        createdAt: "2024-01-15T20:00:00Z",
      };

      const result = await emailService.sendLeadCreatedAdminNotification(
        specialLeadData
      );

      expect(result.success).toBe(true);

      // Verify special characters are handled correctly
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: "New Lead: José María Ñoño - jose.maria@example.com",
          text: expect.stringContaining("José María Ñoño"),
        })
      );
    });
  });

  describe("Payment Completion Email Flow", () => {
    it("should send both admin and user emails for new payment", async () => {
      mockSend.mockResolvedValue({ data: { id: "payment-email" } });

      const paymentData: PaymentNotificationData = {
        name: "Customer Name",
        email: "customer@example.com",
        amount: 25.0,
        currency: "USD",
        tierName: "Premium",
        paymentDate: "2024-01-15T16:20:00Z",
        isSubscription: false,
      };

      const emailPromises = [
        emailService.sendPaymentCompletedAdminNotification(paymentData),
        emailService.sendPaymentCompletedUserConfirmation(paymentData),
      ];

      const results = await emailService.sendEmailsAsync(emailPromises);

      // Verify both emails were sent successfully
      expect(results).toHaveLength(2);
      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(true);

      // Verify admin notification for new payment
      expect(mockSend).toHaveBeenCalledWith({
        from: "Test Service <noreply@test.com>",
        to: ["admin@test.com"],
        subject: "New Payment: Customer Name - 25 USD",
        text: expect.stringContaining("A new payment has been completed"),
      });

      // Verify user confirmation for new payment
      expect(mockSend).toHaveBeenCalledWith({
        from: "Test Service <noreply@test.com>",
        to: ["customer@example.com"],
        subject: "Payment Confirmed - Welcome to Diaspora9ja!",
        text: expect.stringContaining(
          "Your payment has been successfully processed"
        ),
      });
    });

    it("should send different emails for subscription renewals", async () => {
      mockSend.mockResolvedValue({ data: { id: "subscription-email" } });

      const subscriptionData: PaymentNotificationData = {
        name: "Subscriber Name",
        email: "subscriber@example.com",
        amount: 15.0,
        currency: "USD",
        tierName: "Standard",
        paymentDate: "2024-01-15T17:30:00Z",
        isSubscription: true,
      };

      const emailPromises = [
        emailService.sendPaymentCompletedAdminNotification(subscriptionData),
        emailService.sendPaymentCompletedUserConfirmation(subscriptionData),
      ];

      const results = await emailService.sendEmailsAsync(emailPromises);

      // Verify both emails were sent successfully
      expect(results).toHaveLength(2);
      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(true);

      // Verify admin notification for subscription renewal
      expect(mockSend).toHaveBeenCalledWith({
        from: "Test Service <noreply@test.com>",
        to: ["admin@test.com"],
        subject: "Subscription Renewal: Subscriber Name - 15 USD",
        text: expect.stringContaining(
          "A subscription renewal has been completed"
        ),
      });

      // Verify user confirmation for subscription renewal
      expect(mockSend).toHaveBeenCalledWith({
        from: "Test Service <noreply@test.com>",
        to: ["subscriber@example.com"],
        subject: "Subscription Renewed - Thank You!",
        text: expect.stringContaining(
          "Your subscription has been successfully renewed"
        ),
      });
    });

    it("should handle payment emails with various currencies and amounts", async () => {
      mockSend.mockResolvedValue({ data: { id: "currency-email" } });

      const euroPaymentData: PaymentNotificationData = {
        name: "European Customer",
        email: "euro@example.com",
        amount: 20.5,
        currency: "EUR",
        tierName: "International",
        paymentDate: "2024-01-15T19:00:00Z",
        isSubscription: false,
      };

      const result = await emailService.sendPaymentCompletedAdminNotification(
        euroPaymentData
      );

      expect(result.success).toBe(true);

      // Verify currency and amount formatting
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: "New Payment: European Customer - 20.5 EUR",
          text: expect.stringContaining("Amount: 20.5 EUR"),
        })
      );
    });

    it("should handle payment email failures gracefully", async () => {
      // Mock admin email success, user email failure
      mockSend
        .mockResolvedValueOnce({ data: { id: "admin-success" } })
        .mockRejectedValueOnce(new Error("User email service down"));

      const paymentData: PaymentNotificationData = {
        name: "Test Customer",
        email: "test@example.com",
        amount: 10.0,
        currency: "USD",
        tierName: "Basic",
        paymentDate: "2024-01-15T21:00:00Z",
        isSubscription: false,
      };

      const emailPromises = [
        emailService.sendPaymentCompletedAdminNotification(paymentData),
        emailService.sendPaymentCompletedUserConfirmation(paymentData),
      ];

      const results = await emailService.sendEmailsAsync(emailPromises);

      // Verify mixed results
      expect(results).toHaveLength(2);
      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(false);
      expect(results[1].error).toContain("User email service down");
    });
  });

  describe("Email Content Accuracy", () => {
    it("should generate accurate email content for all email types", async () => {
      mockSend.mockResolvedValue({ data: { id: "content-test" } });

      const leadData: LeadNotificationData = {
        name: "Content Test User",
        email: "content@example.com",
        phone: "+1-555-CONTENT",
        location: "Content City, CC",
        createdAt: "2024-01-15T12:00:00Z",
      };

      const paymentData: PaymentNotificationData = {
        name: "Payment Test User",
        email: "payment@example.com",
        amount: 30.0,
        currency: "USD",
        tierName: "Premium Plus",
        paymentDate: "2024-01-15T13:00:00Z",
        isSubscription: false,
      };

      // Test all four email types
      const results = await Promise.all([
        emailService.sendLeadCreatedAdminNotification(leadData),
        emailService.sendLeadCreatedUserWelcome(leadData),
        emailService.sendPaymentCompletedAdminNotification(paymentData),
        emailService.sendPaymentCompletedUserConfirmation(paymentData),
      ]);

      // Verify all emails succeeded
      results.forEach((result) => {
        expect(result.success).toBe(true);
      });

      // Verify all emails were sent
      expect(mockSend).toHaveBeenCalledTimes(4);

      // Verify specific content for each email type
      const calls = mockSend.mock.calls;

      // Lead admin notification
      expect(calls[0][0]).toEqual(
        expect.objectContaining({
          to: ["admin@test.com"],
          subject: "New Lead: Content Test User - content@example.com",
          text: expect.stringContaining("Content Test User"),
        })
      );

      // Lead user welcome
      expect(calls[1][0]).toEqual(
        expect.objectContaining({
          to: ["content@example.com"],
          subject: "Welcome to Diaspora9ja - You're One Step Away!",
          text: expect.stringContaining("Hi Content Test User"),
        })
      );

      // Payment admin notification
      expect(calls[2][0]).toEqual(
        expect.objectContaining({
          to: ["admin@test.com"],
          subject: "New Payment: Payment Test User - 30 USD",
          text: expect.stringContaining("Premium Plus"),
        })
      );

      // Payment user confirmation
      expect(calls[3][0]).toEqual(
        expect.objectContaining({
          to: ["payment@example.com"],
          subject: "Payment Confirmed - Welcome to Diaspora9ja!",
          text: expect.stringContaining("Payment Test User"),
        })
      );
    });

    it("should handle very long content gracefully", async () => {
      mockSend.mockResolvedValue({ data: { id: "long-content" } });

      const longContentData: LeadNotificationData = {
        name: "A".repeat(500),
        email: "long@example.com",
        phone: "B".repeat(100),
        location: "C".repeat(200),
        createdAt: "2024-01-15T22:00:00Z",
      };

      const result = await emailService.sendLeadCreatedAdminNotification(
        longContentData
      );

      expect(result.success).toBe(true);

      // Verify long content is handled
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          text: expect.stringContaining("A".repeat(500)),
        })
      );
    });
  });

  describe("Error Recovery and Resilience", () => {
    it("should handle complete email service failure", async () => {
      // Mock complete service failure
      mockSend.mockRejectedValue(new Error("Email service completely down"));

      const leadData: LeadNotificationData = {
        name: "Resilience Test",
        email: "resilience@example.com",
        createdAt: "2024-01-15T23:00:00Z",
      };

      const emailPromises = [
        emailService.sendLeadCreatedAdminNotification(leadData),
        emailService.sendLeadCreatedUserWelcome(leadData),
      ];

      const results = await emailService.sendEmailsAsync(emailPromises);

      // Verify graceful failure handling
      expect(results).toHaveLength(2);
      expect(results[0].success).toBe(false);
      expect(results[1].success).toBe(false);
      expect(results[0].error).toContain("Email service completely down");
      expect(results[1].error).toContain("Email service completely down");
    });

    it("should handle configuration errors appropriately", async () => {
      // Remove API key to simulate configuration error
      delete process.env.RESEND_API_KEY;

      const leadData: LeadNotificationData = {
        name: "Config Test",
        email: "config@example.com",
        createdAt: "2024-01-15T23:30:00Z",
      };

      const result = await emailService.sendLeadCreatedUserWelcome(leadData);

      expect(result.success).toBe(false);
      expect(result.error).toContain("RESEND_API_KEY is not configured");
      expect(result.errorType).toBe("CONFIGURATION_ERROR");

      // Verify no actual email send was attempted
      expect(mockSend).not.toHaveBeenCalled();
    });

    it("should handle invalid email data gracefully", async () => {
      const invalidData = {
        name: "",
        email: "",
        createdAt: "",
      } as LeadNotificationData;

      const result = await emailService.sendLeadCreatedUserWelcome(invalidData);

      expect(result.success).toBe(false);
      expect(result.error).toContain("Missing required email parameters");
      expect(result.errorType).toBe("TEMPLATE_ERROR");

      // Verify no actual email send was attempted
      expect(mockSend).not.toHaveBeenCalled();
    });

    it("should handle network timeouts appropriately", async () => {
      // Mock timeout
      mockSend.mockImplementation(() => new Promise(() => {})); // Never resolves

      const leadData: LeadNotificationData = {
        name: "Timeout Test",
        email: "timeout@example.com",
        createdAt: "2024-01-16T00:00:00Z",
      };

      const result = await emailService.sendLeadCreatedUserWelcome(leadData);

      expect(result.success).toBe(false);
      expect(result.error).toContain("timeout");
    }, 35000); // Allow for timeout to occur
  });

  describe("Async Operations", () => {
    it("should handle concurrent email operations correctly", async () => {
      mockSend.mockResolvedValue({ data: { id: "concurrent-email" } });

      const leadData: LeadNotificationData = {
        name: "Concurrent User",
        email: "concurrent@example.com",
        createdAt: "2024-01-16T01:00:00Z",
      };

      const paymentData: PaymentNotificationData = {
        name: "Concurrent User",
        email: "concurrent@example.com",
        amount: 25.0,
        currency: "USD",
        tierName: "Premium",
        paymentDate: "2024-01-16T01:00:00Z",
        isSubscription: false,
      };

      // Send multiple different email types concurrently
      const allEmailPromises = [
        emailService.sendLeadCreatedAdminNotification(leadData),
        emailService.sendLeadCreatedUserWelcome(leadData),
        emailService.sendPaymentCompletedAdminNotification(paymentData),
        emailService.sendPaymentCompletedUserConfirmation(paymentData),
      ];

      const results = await emailService.sendEmailsAsync(allEmailPromises);

      // Verify all emails succeeded
      expect(results).toHaveLength(4);
      results.forEach((result) => {
        expect(result.success).toBe(true);
      });

      // Verify all emails were sent
      expect(mockSend).toHaveBeenCalledTimes(4);
    });

    it("should handle mixed success/failure in concurrent operations", async () => {
      // Mock alternating success/failure
      mockSend
        .mockResolvedValueOnce({ data: { id: "success-1" } })
        .mockRejectedValueOnce(new Error("Failure 1"))
        .mockResolvedValueOnce({ data: { id: "success-2" } })
        .mockRejectedValueOnce(new Error("Failure 2"));

      const leadData: LeadNotificationData = {
        name: "Mixed Test",
        email: "mixed@example.com",
        createdAt: "2024-01-16T02:00:00Z",
      };

      const emailPromises = [
        emailService.sendLeadCreatedAdminNotification(leadData),
        emailService.sendLeadCreatedUserWelcome(leadData),
        emailService.sendLeadCreatedAdminNotification(leadData),
        emailService.sendLeadCreatedUserWelcome(leadData),
      ];

      const results = await emailService.sendEmailsAsync(emailPromises);

      // Verify mixed results
      expect(results).toHaveLength(4);
      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(false);
      expect(results[2].success).toBe(true);
      expect(results[3].success).toBe(false);

      // Verify all attempts were made
      expect(mockSend).toHaveBeenCalledTimes(4);
    });
  });
});
