import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { EmailService } from "../lib/email-service";
import { emailMonitor } from "../lib/email-monitor";

// Mock Resend
vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: {
      send: vi.fn(),
    },
  })),
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
  writable: true,
});

describe("EmailService Monitoring Integration", () => {
  let emailService: EmailService;
  let mockResendSend: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);

    // Reset email monitor
    emailMonitor.resetMetrics();

    // Set up environment
    process.env.RESEND_API_KEY = "test-api-key";

    // Set up mock resend send function
    mockResendSend = vi.fn();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Resend } = require("resend");
    Resend.mockImplementation(() => ({
      emails: {
        send: mockResendSend,
      },
    }));

    // Create email service instance
    emailService = new EmailService();
  });

  afterEach(() => {
    delete process.env.RESEND_API_KEY;
  });

  describe("Successful Email Monitoring", () => {
    it("should track successful lead admin notification", async () => {
      mockResendSend.mockResolvedValue({
        data: { id: "msg_123" },
      });

      const leadData = {
        name: "John Doe",
        email: "john@example.com",
        phone: "+1234567890",
        location: "New York",
        createdAt: new Date().toISOString(),
      };

      const result = await emailService.sendLeadCreatedAdminNotification(
        leadData
      );

      expect(result.success).toBe(true);
      expect(result.messageId).toBe("msg_123");

      // Check monitoring data
      const metrics = emailService.getEmailMetrics();
      expect(metrics.totalSent).toBe(1);
      expect(metrics.totalFailed).toBe(0);
      expect(metrics.successRate).toBe(100);
      expect(metrics.emailsByType["lead_admin_notification"]).toBe(1);

      const logs = emailService.getRecentEmailLogs(1);
      expect(logs).toHaveLength(1);
      expect(logs[0].type).toBe("lead_admin_notification");
      expect(logs[0].success).toBe(true);
      expect(logs[0].messageId).toBe("msg_123");
    });

    it("should track successful payment confirmation", async () => {
      mockResendSend.mockResolvedValue({
        data: { id: "msg_456" },
      });

      const paymentData = {
        name: "Jane Smith",
        email: "jane@example.com",
        amount: 99.99,
        currency: "USD",
        tierName: "Premium",
        paymentDate: new Date().toISOString(),
        isSubscription: false,
      };

      const result = await emailService.sendPaymentCompletedUserConfirmation(
        paymentData
      );

      expect(result.success).toBe(true);

      const metrics = emailService.getEmailMetrics();
      expect(metrics.emailsByType["payment_user_confirmation"]).toBe(1);

      const logs = emailService.getEmailLogsByType("payment_user_confirmation");
      expect(logs).toHaveLength(1);
      expect(logs[0].recipient).toBe("jane@example.com");
    });
  });

  describe("Failed Email Monitoring", () => {
    it("should track configuration errors", async () => {
      delete process.env.RESEND_API_KEY;

      const leadData = {
        name: "John Doe",
        email: "john@example.com",
        createdAt: new Date().toISOString(),
      };

      const result = await emailService.sendLeadCreatedUserWelcome(leadData);

      expect(result.success).toBe(false);
      expect(result.errorType).toBe("CONFIGURATION_ERROR");

      const metrics = emailService.getEmailMetrics();
      expect(metrics.totalFailed).toBe(1);
      expect(metrics.errorsByType["CONFIGURATION_ERROR"]).toBe(1);

      const failedLogs = emailService.getFailedEmailLogs();
      expect(failedLogs).toHaveLength(1);
      expect(failedLogs[0].error).toContain("RESEND_API_KEY is not configured");
    });

    it("should track provider errors", async () => {
      mockResendSend.mockRejectedValue(new Error("Invalid API key"));

      const paymentData = {
        name: "Jane Smith",
        email: "jane@example.com",
        amount: 99.99,
        currency: "USD",
        tierName: "Premium",
        paymentDate: new Date().toISOString(),
      };

      const result = await emailService.sendPaymentCompletedAdminNotification(
        paymentData
      );

      expect(result.success).toBe(false);
      expect(result.errorType).toBe("CONFIGURATION_ERROR"); // API key errors are categorized as config

      const metrics = emailService.getEmailMetrics();
      expect(metrics.totalFailed).toBe(1);
      expect(metrics.errorsByType["CONFIGURATION_ERROR"]).toBe(1);
    });

    it("should track template errors", async () => {
      const invalidData = {
        name: "",
        email: "",
        createdAt: new Date().toISOString(),
      };

      const result = await emailService.sendLeadCreatedUserWelcome(invalidData);

      expect(result.success).toBe(false);
      expect(result.errorType).toBe("TEMPLATE_ERROR");

      const metrics = emailService.getEmailMetrics();
      expect(metrics.errorsByType["TEMPLATE_ERROR"]).toBe(1);
    });
  });

  describe("Volume Limit Monitoring", () => {
    it("should block emails when daily limit is reached", async () => {
      // Simulate reaching daily limit by logging 100 emails
      for (let i = 0; i < 100; i++) {
        emailMonitor.logEmailAttempt(
          "test",
          `user${i}@example.com`,
          "Test",
          true
        );
      }

      const leadData = {
        name: "John Doe",
        email: "john@example.com",
        createdAt: new Date().toISOString(),
      };

      const result = await emailService.sendLeadCreatedUserWelcome(leadData);

      expect(result.success).toBe(false);
      expect(result.error).toContain("Daily email limit reached");
      expect(result.errorType).toBe("CONFIGURATION_ERROR");

      const volumeStatus = emailService.getVolumeStatus();
      expect(volumeStatus.current.daily).toBe(100);
    });

    it("should check volume limits before sending", () => {
      const canSend = emailService.canSendEmail();
      expect(canSend.allowed).toBe(true);

      // After reaching limit
      for (let i = 0; i < 100; i++) {
        emailMonitor.logEmailAttempt(
          "test",
          `user${i}@example.com`,
          "Test",
          true
        );
      }

      const cannotSend = emailService.canSendEmail();
      expect(cannotSend.allowed).toBe(false);
      expect(cannotSend.reason).toContain("Daily email limit reached");
    });
  });

  describe("Monitoring Report Generation", () => {
    it("should generate comprehensive monitoring report", async () => {
      mockResendSend.mockResolvedValue({ data: { id: "msg_123" } });

      // Send some test emails
      const leadData = {
        name: "John Doe",
        email: "john@example.com",
        createdAt: new Date().toISOString(),
      };

      await emailService.sendLeadCreatedAdminNotification(leadData);
      await emailService.sendLeadCreatedUserWelcome(leadData);

      // Simulate a failure
      mockResendSend.mockRejectedValueOnce(new Error("Network error"));

      const paymentData = {
        name: "Jane Smith",
        email: "jane@example.com",
        amount: 99.99,
        currency: "USD",
        tierName: "Premium",
        paymentDate: new Date().toISOString(),
      };

      await emailService.sendPaymentCompletedUserConfirmation(paymentData);

      const report = emailService.generateEmailReport();

      expect(report).toContain("📊 Email Monitoring Report");
      expect(report).toContain("Total Sent: 2");
      expect(report).toContain("Total Failed: 1");
      expect(report).toContain("lead_admin_notification: 1");
      expect(report).toContain("lead_user_welcome: 1");
      expect(report).toContain("payment_user_confirmation: 1");
    });
  });

  describe("Monitoring Data Management", () => {
    it("should clear logs when requested", async () => {
      mockResendSend.mockResolvedValue({ data: { id: "msg_123" } });

      const leadData = {
        name: "John Doe",
        email: "john@example.com",
        createdAt: new Date().toISOString(),
      };

      await emailService.sendLeadCreatedUserWelcome(leadData);
      expect(emailService.getRecentEmailLogs()).toHaveLength(1);

      emailService.clearEmailLogs();
      expect(emailService.getRecentEmailLogs()).toHaveLength(0);
    });

    it("should reset metrics when requested", async () => {
      mockResendSend.mockResolvedValue({ data: { id: "msg_123" } });

      const leadData = {
        name: "John Doe",
        email: "john@example.com",
        createdAt: new Date().toISOString(),
      };

      await emailService.sendLeadCreatedUserWelcome(leadData);
      expect(emailService.getEmailMetrics().totalSent).toBe(1);

      emailService.resetEmailMetrics();
      expect(emailService.getEmailMetrics().totalSent).toBe(0);
    });
  });

  describe("Multiple Email Monitoring", () => {
    it("should track multiple emails sent asynchronously", async () => {
      mockResendSend.mockResolvedValue({ data: { id: "msg_123" } });

      const leadData = {
        name: "John Doe",
        email: "john@example.com",
        createdAt: new Date().toISOString(),
      };

      const emailPromises = [
        emailService.sendLeadCreatedAdminNotification(leadData),
        emailService.sendLeadCreatedUserWelcome(leadData),
      ];

      const results = await emailService.sendEmailsAsync(emailPromises);

      expect(results).toHaveLength(2);
      expect(results.every((r) => r.success)).toBe(true);

      const metrics = emailService.getEmailMetrics();
      expect(metrics.totalSent).toBe(2);
      expect(metrics.successRate).toBe(100);
    });
  });
});
