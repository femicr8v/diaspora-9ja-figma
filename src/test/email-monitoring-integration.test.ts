import { describe, it, expect, beforeEach, vi } from "vitest";
import { EmailService } from "../lib/email-service";
import { emailMonitor } from "../lib/email-monitor";

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

describe("Email Monitoring Integration", () => {
  let emailService: EmailService;

  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);

    // Reset email monitor
    emailMonitor.resetMetrics();

    // Create email service instance
    emailService = new EmailService();
  });

  describe("EmailService Monitoring Methods", () => {
    it("should expose monitoring methods from email service", () => {
      expect(typeof emailService.getEmailMetrics).toBe("function");
      expect(typeof emailService.getVolumeStatus).toBe("function");
      expect(typeof emailService.getRecentEmailLogs).toBe("function");
      expect(typeof emailService.getFailedEmailLogs).toBe("function");
      expect(typeof emailService.getEmailLogsByType).toBe("function");
      expect(typeof emailService.generateEmailReport).toBe("function");
      expect(typeof emailService.canSendEmail).toBe("function");
      expect(typeof emailService.clearEmailLogs).toBe("function");
      expect(typeof emailService.resetEmailMetrics).toBe("function");
    });

    it("should return initial metrics", () => {
      const metrics = emailService.getEmailMetrics();

      expect(metrics.totalSent).toBe(0);
      expect(metrics.totalFailed).toBe(0);
      expect(metrics.successRate).toBe(0);
      expect(metrics.dailyVolume).toBe(0);
      expect(metrics.monthlyVolume).toBe(0);
      expect(typeof metrics.lastResetDate).toBe("string");
      expect(typeof metrics.errorsByType).toBe("object");
      expect(typeof metrics.emailsByType).toBe("object");
    });

    it("should return volume status", () => {
      const status = emailService.getVolumeStatus();

      expect(status.daily).toBe(100); // Daily limit
      expect(status.monthly).toBe(3000); // Monthly limit
      expect(status.current.daily).toBe(0);
      expect(status.current.monthly).toBe(0);
    });

    it("should check if emails can be sent", () => {
      const canSend = emailService.canSendEmail();

      expect(canSend.allowed).toBe(true);
      expect(canSend.reason).toBeUndefined();
    });

    it("should return empty logs initially", () => {
      const recentLogs = emailService.getRecentEmailLogs();
      const failedLogs = emailService.getFailedEmailLogs();
      const typeLogs = emailService.getEmailLogsByType("test");

      expect(recentLogs).toHaveLength(0);
      expect(failedLogs).toHaveLength(0);
      expect(typeLogs).toHaveLength(0);
    });

    it("should generate initial report", () => {
      const report = emailService.generateEmailReport();

      expect(report).toContain("📊 Email Monitoring Report");
      expect(report).toContain("Volume Statistics");
      expect(report).toContain("Success Metrics");
      expect(report).toContain("Total Sent: 0");
      expect(report).toContain("Total Failed: 0");
      expect(report).toContain("Success Rate: 0.00%");
    });

    it("should clear logs", () => {
      // First add some test data directly to monitor
      emailMonitor.logEmailAttempt("test", "user@example.com", "Test", true);

      expect(emailService.getRecentEmailLogs()).toHaveLength(1);

      emailService.clearEmailLogs();

      expect(emailService.getRecentEmailLogs()).toHaveLength(0);
    });

    it("should reset metrics", () => {
      // First add some test data directly to monitor
      emailMonitor.logEmailAttempt("test", "user@example.com", "Test", true);

      expect(emailService.getEmailMetrics().totalSent).toBe(1);

      emailService.resetEmailMetrics();

      expect(emailService.getEmailMetrics().totalSent).toBe(0);
    });
  });

  describe("Configuration Error Monitoring", () => {
    it("should track configuration errors when API key is missing", async () => {
      // Remove API key
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

    it("should track template errors for invalid data", async () => {
      process.env.RESEND_API_KEY = "test-key";

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

  describe("Volume Limit Integration", () => {
    beforeEach(() => {
      process.env.RESEND_API_KEY = "test-key";
    });

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

    it("should update volume status correctly", () => {
      // Add some emails directly to monitor
      emailMonitor.logEmailAttempt(
        "lead_user_welcome",
        "user1@example.com",
        "Welcome 1",
        true
      );
      emailMonitor.logEmailAttempt(
        "lead_admin_notification",
        "admin@example.com",
        "New Lead",
        true
      );
      emailMonitor.logEmailAttempt(
        "payment_user_confirmation",
        "user2@example.com",
        "Payment",
        false,
        "Error"
      );

      const status = emailService.getVolumeStatus();
      expect(status.current.daily).toBe(2); // Only successful emails count toward volume
      expect(status.current.monthly).toBe(2);

      const metrics = emailService.getEmailMetrics();
      expect(metrics.totalSent).toBe(2);
      expect(metrics.totalFailed).toBe(1);
      expect(Math.round(metrics.successRate * 100) / 100).toBe(66.67); // 2/3 * 100, rounded
    });
  });

  describe("Report Generation Integration", () => {
    it("should generate comprehensive report with real data", () => {
      // Add various types of email logs
      emailMonitor.logEmailAttempt(
        "lead_user_welcome",
        "user1@example.com",
        "Welcome",
        true
      );
      emailMonitor.logEmailAttempt(
        "lead_admin_notification",
        "admin@example.com",
        "New Lead",
        true
      );
      emailMonitor.logEmailAttempt(
        "payment_user_confirmation",
        "user2@example.com",
        "Payment",
        false,
        "API Error",
        "PROVIDER_ERROR"
      );
      emailMonitor.logEmailAttempt(
        "payment_admin_notification",
        "admin@example.com",
        "Payment Received",
        false,
        "Network timeout",
        "NETWORK_ERROR"
      );

      const report = emailService.generateEmailReport();

      expect(report).toContain("📊 Email Monitoring Report");
      expect(report).toContain("Total Sent: 2");
      expect(report).toContain("Total Failed: 2");
      expect(report).toContain("Success Rate: 50.00%");
      expect(report).toContain("lead_user_welcome: 1");
      expect(report).toContain("lead_admin_notification: 1");
      expect(report).toContain("payment_user_confirmation: 1");
      expect(report).toContain("payment_admin_notification: 1");
      expect(report).toContain("PROVIDER_ERROR: 1");
      expect(report).toContain("NETWORK_ERROR: 1");
      expect(report).toContain("Recent Failures");
    });
  });

  describe("Log Filtering Integration", () => {
    beforeEach(() => {
      // Add test data
      emailMonitor.logEmailAttempt(
        "lead_user_welcome",
        "user1@example.com",
        "Welcome 1",
        true
      );
      emailMonitor.logEmailAttempt(
        "lead_admin_notification",
        "admin@example.com",
        "New Lead 1",
        true
      );
      emailMonitor.logEmailAttempt(
        "payment_user_confirmation",
        "user2@example.com",
        "Payment 1",
        false,
        "Error"
      );
      emailMonitor.logEmailAttempt(
        "lead_user_welcome",
        "user3@example.com",
        "Welcome 2",
        true
      );
      emailMonitor.logEmailAttempt(
        "payment_admin_notification",
        "admin@example.com",
        "Payment Received",
        false,
        "Network Error"
      );
    });

    it("should filter logs by type correctly", () => {
      const welcomeLogs = emailService.getEmailLogsByType("lead_user_welcome");
      expect(welcomeLogs).toHaveLength(2);
      expect(welcomeLogs.every((log) => log.type === "lead_user_welcome")).toBe(
        true
      );

      const adminLogs = emailService.getEmailLogsByType(
        "lead_admin_notification"
      );
      expect(adminLogs).toHaveLength(1);
      expect(adminLogs[0].subject).toBe("New Lead 1");
    });

    it("should filter failed logs correctly", () => {
      const failedLogs = emailService.getFailedEmailLogs();
      expect(failedLogs).toHaveLength(2);
      expect(failedLogs.every((log) => !log.success)).toBe(true);
    });

    it("should return recent logs in correct order", () => {
      const recentLogs = emailService.getRecentEmailLogs(3);
      expect(recentLogs).toHaveLength(3);
      // Most recent first
      expect(recentLogs[0].subject).toBe("Payment Received");
      expect(recentLogs[1].subject).toBe("Welcome 2");
      expect(recentLogs[2].subject).toBe("Payment 1");
    });

    it("should respect log limits", () => {
      const limitedLogs = emailService.getRecentEmailLogs(2);
      expect(limitedLogs).toHaveLength(2);

      const limitedFailedLogs = emailService.getFailedEmailLogs(1);
      expect(limitedFailedLogs).toHaveLength(1);

      const limitedTypeLogs = emailService.getEmailLogsByType(
        "lead_user_welcome",
        1
      );
      expect(limitedTypeLogs).toHaveLength(1);
    });
  });

  describe("Data Persistence Integration", () => {
    it("should attempt to persist data to localStorage", () => {
      emailMonitor.logEmailAttempt("test", "user@example.com", "Test", true);

      // Should have called setItem for both metrics and logs
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "email_metrics",
        expect.any(String)
      );
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "email_logs",
        expect.any(String)
      );
    });

    it("should handle localStorage errors gracefully", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error("Storage quota exceeded");
      });

      // Should not throw error
      expect(() => {
        emailMonitor.logEmailAttempt("test", "user@example.com", "Test", true);
      }).not.toThrow();

      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to persist email monitoring data:",
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });
});
