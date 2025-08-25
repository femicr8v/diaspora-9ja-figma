import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock Resend with a factory function
vi.mock("resend", () => {
  const mockSend = vi.fn();
  return {
    Resend: vi.fn().mockImplementation(() => ({
      emails: {
        send: mockSend,
      },
    })),
    __mockSend: mockSend, // Export the mock for access in tests
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

// Import after mocks
import { EmailService, EmailError } from "../lib/email-service";

// Mock console methods to test logging
const mockConsoleLog = vi.spyOn(console, "log").mockImplementation(() => {});
const mockConsoleError = vi
  .spyOn(console, "error")
  .mockImplementation(() => {});

describe("EmailService Error Handling", () => {
  let emailService: EmailService;
  let mockSend: any;

  beforeEach(async () => {
    emailService = new EmailService();

    // Get the mock send function from the mocked module
    const resendModule = await import("resend");
    mockSend = (resendModule as any).__mockSend;

    // Reset environment variables
    process.env.RESEND_API_KEY = "test-api-key";

    // Clear mocks but not console spies
    mockSend.mockClear();
    // Don't clear console mocks here as they need to persist
  });

  afterEach(() => {
    // Don't restore console mocks here
  });

  describe("Configuration Validation", () => {
    it("should validate configuration successfully when all required values are present", () => {
      const result = emailService.validateConfiguration();
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should return configuration errors when API key is missing", () => {
      delete process.env.RESEND_API_KEY;

      const result = emailService.validateConfiguration();
      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        "RESEND_API_KEY environment variable is not set"
      );
    });
  });

  describe("Email Sending Error Scenarios", () => {
    it("should handle missing API key gracefully", async () => {
      delete process.env.RESEND_API_KEY;

      const leadData = {
        name: "Test User",
        email: "test@example.com",
        createdAt: new Date().toISOString(),
      };

      const result = await emailService.sendLeadCreatedUserWelcome(leadData);

      expect(result.success).toBe(false);
      expect(result.errorType).toBe(EmailError.CONFIGURATION_ERROR);
      expect(result.error).toContain("RESEND_API_KEY is not configured");
    });

    it("should handle Resend API errors gracefully", async () => {
      mockSend.mockRejectedValue(new Error("API rate limit exceeded"));

      const leadData = {
        name: "Test User",
        email: "test@example.com",
        createdAt: new Date().toISOString(),
      };

      const result = await emailService.sendLeadCreatedUserWelcome(leadData);

      expect(result.success).toBe(false);
      expect(result.errorType).toBe(EmailError.PROVIDER_ERROR);
      expect(result.error).toContain("API rate limit exceeded");
    });

    it("should handle network errors gracefully", async () => {
      mockSend.mockRejectedValue(new Error("Network timeout"));

      const leadData = {
        name: "Test User",
        email: "test@example.com",
        createdAt: new Date().toISOString(),
      };

      const result = await emailService.sendLeadCreatedUserWelcome(leadData);

      expect(result.success).toBe(false);
      expect(result.errorType).toBe(EmailError.NETWORK_ERROR);
      expect(result.error).toContain("Network timeout");
    });

    it("should handle invalid email parameters", async () => {
      const leadData = {
        name: "",
        email: "",
        createdAt: new Date().toISOString(),
      };

      const result = await emailService.sendLeadCreatedUserWelcome(leadData);

      expect(result.success).toBe(false);
      expect(result.errorType).toBe(EmailError.TEMPLATE_ERROR);
      expect(result.error).toContain("Missing required email parameters");
    });

    it("should handle email sending timeout", async () => {
      // Mock a promise that never resolves to simulate timeout
      mockSend.mockImplementation(() => new Promise(() => {}));

      const leadData = {
        name: "Test User",
        email: "test@example.com",
        createdAt: new Date().toISOString(),
      };

      const result = await emailService.sendLeadCreatedUserWelcome(leadData);

      expect(result.success).toBe(false);
      expect(result.error).toContain("timeout");
    }, 35000); // Increase timeout for this test
  });

  describe("Successful Email Sending", () => {
    it("should send lead admin notification successfully", async () => {
      mockSend.mockResolvedValue({ data: { id: "email-123" } });

      const leadData = {
        name: "Test User",
        email: "test@example.com",
        phone: "123-456-7890",
        location: "Test City",
        createdAt: new Date().toISOString(),
      };

      const result = await emailService.sendLeadCreatedAdminNotification(
        leadData
      );

      expect(result.success).toBe(true);
      expect(result.messageId).toBe("email-123");
      expect(mockSend).toHaveBeenCalledWith({
        from: "Test Service <noreply@test.com>",
        to: ["admin@test.com"],
        subject: `New Lead: ${leadData.name} - ${leadData.email}`,
        text: expect.stringContaining(leadData.name),
      });
    });

    it("should send payment confirmation successfully", async () => {
      mockSend.mockResolvedValue({ data: { id: "email-456" } });

      const paymentData = {
        name: "Test User",
        email: "test@example.com",
        amount: 100,
        currency: "USD",
        tierName: "Premium",
        paymentDate: new Date().toISOString(),
        isSubscription: false,
      };

      const result = await emailService.sendPaymentCompletedUserConfirmation(
        paymentData
      );

      expect(result.success).toBe(true);
      expect(result.messageId).toBe("email-456");
      expect(mockSend).toHaveBeenCalledWith({
        from: "Test Service <noreply@test.com>",
        to: ["test@example.com"],
        subject: "Payment Confirmed - Welcome to Diaspora9ja!",
        text: expect.stringContaining(paymentData.name),
      });
    });
  });

  describe("Async Email Sending", () => {
    it("should handle multiple email sending with some failures", async () => {
      // Mock first email to succeed, second to fail
      mockSend
        .mockResolvedValueOnce({ data: { id: "email-1" } })
        .mockRejectedValueOnce(new Error("API error"));

      const leadData = {
        name: "Test User",
        email: "test@example.com",
        createdAt: new Date().toISOString(),
      };

      const emailPromises = [
        emailService.sendLeadCreatedAdminNotification(leadData),
        emailService.sendLeadCreatedUserWelcome(leadData),
      ];

      const results = await emailService.sendEmailsAsync(emailPromises);

      expect(results).toHaveLength(2);
      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(false);
      expect(results[1].error).toContain("API error");
    });

    it("should handle all emails failing gracefully", async () => {
      mockSend.mockRejectedValue(new Error("Service unavailable"));

      const leadData = {
        name: "Test User",
        email: "test@example.com",
        createdAt: new Date().toISOString(),
      };

      const emailPromises = [
        emailService.sendLeadCreatedAdminNotification(leadData),
        emailService.sendLeadCreatedUserWelcome(leadData),
      ];

      const results = await emailService.sendEmailsAsync(emailPromises);

      expect(results).toHaveLength(2);
      expect(results.every((result) => !result.success)).toBe(true);
      expect(
        results.every((result) => result.error?.includes("Service unavailable"))
      ).toBe(true);
    });
  });

  describe("Error Categorization", () => {
    it("should categorize configuration errors correctly", async () => {
      mockSend.mockRejectedValue(new Error("Invalid API key"));

      const leadData = {
        name: "Test User",
        email: "test@example.com",
        createdAt: new Date().toISOString(),
      };

      const result = await emailService.sendLeadCreatedUserWelcome(leadData);

      expect(result.errorType).toBe(EmailError.CONFIGURATION_ERROR);
    });

    it("should categorize network errors correctly", async () => {
      mockSend.mockRejectedValue(new Error("Connection timeout"));

      const leadData = {
        name: "Test User",
        email: "test@example.com",
        createdAt: new Date().toISOString(),
      };

      const result = await emailService.sendLeadCreatedUserWelcome(leadData);

      expect(result.errorType).toBe(EmailError.NETWORK_ERROR);
    });

    it("should categorize template errors correctly", async () => {
      mockSend.mockRejectedValue(new Error("Invalid email address"));

      const leadData = {
        name: "Test User",
        email: "test@example.com",
        createdAt: new Date().toISOString(),
      };

      const result = await emailService.sendLeadCreatedUserWelcome(leadData);

      expect(result.errorType).toBe(EmailError.TEMPLATE_ERROR);
    });

    it("should default to provider error for unknown errors", async () => {
      mockSend.mockRejectedValue(new Error("Unknown service error"));

      const leadData = {
        name: "Test User",
        email: "test@example.com",
        createdAt: new Date().toISOString(),
      };

      const result = await emailService.sendLeadCreatedUserWelcome(leadData);

      expect(result.errorType).toBe(EmailError.PROVIDER_ERROR);
    });
  });

  describe("Logging Functionality", () => {
    it("should log successful email attempts", async () => {
      mockConsoleLog.mockClear();
      mockSend.mockResolvedValue({ data: { id: "email-123" } });

      const leadData = {
        name: "Test User",
        email: "test@example.com",
        createdAt: new Date().toISOString(),
      };

      await emailService.sendLeadCreatedUserWelcome(leadData);

      expect(mockConsoleLog).toHaveBeenCalledWith(
        "Email sent successfully:",
        expect.objectContaining({
          type: "lead_user_welcome",
          recipient: "test@example.com",
          subject: "Welcome to Diaspora9ja - You're One Step Away!",
          success: true,
        })
      );
    });

    it("should log failed email attempts with error details", async () => {
      mockConsoleError.mockClear();
      mockSend.mockRejectedValue(new Error("API rate limit exceeded"));

      const leadData = {
        name: "Test User",
        email: "test@example.com",
        createdAt: new Date().toISOString(),
      };

      await emailService.sendLeadCreatedUserWelcome(leadData);

      expect(mockConsoleError).toHaveBeenCalledWith(
        "Email sending failed:",
        expect.objectContaining({
          type: "lead_user_welcome",
          recipient: "test@example.com",
          success: false,
          error: "API rate limit exceeded",
        })
      );
    });

    it("should log configuration errors appropriately", async () => {
      mockConsoleError.mockClear();
      delete process.env.RESEND_API_KEY;

      const leadData = {
        name: "Test User",
        email: "test@example.com",
        createdAt: new Date().toISOString(),
      };

      await emailService.sendLeadCreatedUserWelcome(leadData);

      expect(mockConsoleError).toHaveBeenCalledWith(
        "Email sending failed:",
        expect.objectContaining({
          type: "lead_user_welcome",
          recipient: "test@example.com",
          success: false,
          error: "RESEND_API_KEY is not configured",
        })
      );
    });

    it("should include timestamp in log entries", async () => {
      mockConsoleLog.mockClear();
      mockSend.mockResolvedValue({ data: { id: "email-123" } });

      const leadData = {
        name: "Test User",
        email: "test@example.com",
        createdAt: new Date().toISOString(),
      };

      await emailService.sendLeadCreatedUserWelcome(leadData);

      expect(mockConsoleLog).toHaveBeenCalledWith(
        "Email sent successfully:",
        expect.objectContaining({
          timestamp: expect.stringMatching(
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/
          ),
        })
      );
    });
  });

  describe("Non-blocking Operations", () => {
    it("should not throw exceptions even when email sending fails", async () => {
      mockSend.mockRejectedValue(new Error("Critical API failure"));

      const leadData = {
        name: "Test User",
        email: "test@example.com",
        createdAt: new Date().toISOString(),
      };

      // This should not throw an exception
      const result = await emailService.sendLeadCreatedUserWelcome(leadData);

      expect(result.success).toBe(false);
      expect(result.error).toContain("Critical API failure");
    });

    it("should handle undefined or null error objects gracefully", async () => {
      mockSend.mockRejectedValue(null);

      const leadData = {
        name: "Test User",
        email: "test@example.com",
        createdAt: new Date().toISOString(),
      };

      const result = await emailService.sendLeadCreatedUserWelcome(leadData);

      expect(result.success).toBe(false);
      expect(result.errorType).toBe(EmailError.PROVIDER_ERROR);
    });

    it("should handle payment notification errors without blocking", async () => {
      mockSend.mockRejectedValue(new Error("Payment email service down"));

      const paymentData = {
        name: "Test User",
        email: "test@example.com",
        amount: 100,
        currency: "USD",
        tierName: "Premium",
        paymentDate: new Date().toISOString(),
        isSubscription: false,
      };

      const adminResult =
        await emailService.sendPaymentCompletedAdminNotification(paymentData);
      const userResult =
        await emailService.sendPaymentCompletedUserConfirmation(paymentData);

      expect(adminResult.success).toBe(false);
      expect(userResult.success).toBe(false);
      expect(adminResult.error).toContain("Payment email service down");
      expect(userResult.error).toContain("Payment email service down");
    });
  });

  describe("Edge Cases and Resilience", () => {
    it("should handle malformed email data gracefully", async () => {
      const malformedData = {
        name: null as any,
        email: undefined as any,
        createdAt: "",
      };

      const result = await emailService.sendLeadCreatedUserWelcome(
        malformedData
      );

      expect(result.success).toBe(false);
      expect(result.errorType).toBe(EmailError.TEMPLATE_ERROR);
    });

    it("should handle very long email content without issues", async () => {
      mockSend.mockResolvedValue({ data: { id: "email-long" } });

      const longData = {
        name: "A".repeat(1000),
        email: "test@example.com",
        phone: "B".repeat(500),
        location: "C".repeat(500),
        createdAt: new Date().toISOString(),
      };

      const result = await emailService.sendLeadCreatedAdminNotification(
        longData
      );

      expect(result.success).toBe(true);
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          text: expect.stringContaining("A".repeat(1000)),
        })
      );
    });

    it("should handle special characters in email content", async () => {
      mockSend.mockResolvedValue({ data: { id: "email-special" } });

      const specialData = {
        name: "José María Ñoño",
        email: "test@example.com",
        phone: "+1-234-567-8900",
        location: "São Paulo, Brazil",
        createdAt: new Date().toISOString(),
      };

      const result = await emailService.sendLeadCreatedAdminNotification(
        specialData
      );

      expect(result.success).toBe(true);
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          text: expect.stringContaining("José María Ñoño"),
        })
      );
    });
  });
});
