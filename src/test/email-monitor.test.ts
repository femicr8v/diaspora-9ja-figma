import { describe, it, expect, beforeEach, vi } from "vitest";
import { EmailMonitor, emailMonitor } from "../lib/email-monitor";

// Mock localStorage for testing
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

describe("EmailMonitor", () => {
  let monitor: EmailMonitor;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);

    // Create fresh instance for each test
    monitor = new EmailMonitor();
  });

  describe("Email Logging", () => {
    it("should log successful email attempts", () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      monitor.logEmailAttempt(
        "lead_user_welcome",
        "test@example.com",
        "Welcome Email",
        true,
        undefined,
        undefined,
        "msg_123"
      );

      const metrics = monitor.getMetrics();
      expect(metrics.totalSent).toBe(1);
      expect(metrics.totalFailed).toBe(0);
      expect(metrics.successRate).toBe(100);
      expect(metrics.dailyVolume).toBe(1);
      expect(metrics.monthlyVolume).toBe(1);
      expect(metrics.emailsByType["lead_user_welcome"]).toBe(1);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("📧 Email sent successfully:"),
        expect.any(Object)
      );

      consoleSpy.mockRestore();
    });

    it("should log failed email attempts", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      monitor.logEmailAttempt(
        "lead_admin_notification",
        "admin@example.com",
        "New Lead Alert",
        false,
        "API key invalid",
        "CONFIGURATION_ERROR"
      );

      const metrics = monitor.getMetrics();
      expect(metrics.totalSent).toBe(0);
      expect(metrics.totalFailed).toBe(1);
      expect(metrics.successRate).toBe(0);
      expect(metrics.errorsByType["CONFIGURATION_ERROR"]).toBe(1);
      expect(metrics.emailsByType["lead_admin_notification"]).toBe(1);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("❌ Email sending failed:"),
        expect.any(Object)
      );

      consoleSpy.mockRestore();
    });

    it("should calculate success rate correctly", () => {
      // Log 3 successful and 1 failed
      monitor.logEmailAttempt("test", "user1@example.com", "Test 1", true);
      monitor.logEmailAttempt("test", "user2@example.com", "Test 2", true);
      monitor.logEmailAttempt("test", "user3@example.com", "Test 3", true);
      monitor.logEmailAttempt(
        "test",
        "user4@example.com",
        "Test 4",
        false,
        "Error"
      );

      const metrics = monitor.getMetrics();
      expect(metrics.totalSent).toBe(3);
      expect(metrics.totalFailed).toBe(1);
      expect(metrics.successRate).toBe(75); // 3/4 * 100
    });
  });

  describe("Volume Limits", () => {
    it("should allow emails within limits", () => {
      const result = monitor.canSendEmail();
      expect(result.allowed).toBe(true);
      expect(result.reason).toBeUndefined();
    });

    it("should block emails when daily limit is reached", () => {
      // Simulate reaching daily limit
      for (let i = 0; i < 100; i++) {
        monitor.logEmailAttempt("test", `user${i}@example.com`, "Test", true);
      }

      const result = monitor.canSendEmail();
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain("Daily email limit reached");
    });

    it("should show volume warnings", () => {
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      // Send 80+ emails to trigger daily warning (80% of 100)
      for (let i = 0; i < 85; i++) {
        monitor.logEmailAttempt("test", `user${i}@example.com`, "Test", true);
      }

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("⚠️ Daily email volume warning")
      );

      consoleSpy.mockRestore();
    });
  });

  describe("Log Retrieval", () => {
    beforeEach(() => {
      // Add some test logs
      monitor.logEmailAttempt(
        "lead_user_welcome",
        "user1@example.com",
        "Welcome 1",
        true
      );
      monitor.logEmailAttempt(
        "lead_admin_notification",
        "admin@example.com",
        "New Lead 1",
        true
      );
      monitor.logEmailAttempt(
        "payment_user_confirmation",
        "user2@example.com",
        "Payment 1",
        false,
        "Error"
      );
      monitor.logEmailAttempt(
        "lead_user_welcome",
        "user3@example.com",
        "Welcome 2",
        true
      );
    });

    it("should retrieve recent logs", () => {
      const logs = monitor.getRecentLogs(2);
      expect(logs).toHaveLength(2);
      expect(logs[0].subject).toBe("Welcome 2"); // Most recent first
      expect(logs[1].subject).toBe("Payment 1");
    });

    it("should retrieve logs by type", () => {
      const welcomeLogs = monitor.getLogsByType("lead_user_welcome");
      expect(welcomeLogs).toHaveLength(2);
      expect(welcomeLogs.every((log) => log.type === "lead_user_welcome")).toBe(
        true
      );
    });

    it("should retrieve failed logs only", () => {
      const failedLogs = monitor.getFailedLogs();
      expect(failedLogs).toHaveLength(1);
      expect(failedLogs[0].success).toBe(false);
      expect(failedLogs[0].subject).toBe("Payment 1");
    });
  });

  describe("Volume Status", () => {
    it("should return current volume status", () => {
      // Add some emails
      monitor.logEmailAttempt("test", "user1@example.com", "Test 1", true);
      monitor.logEmailAttempt("test", "user2@example.com", "Test 2", true);

      const status = monitor.getVolumeStatus();
      expect(status.daily).toBe(100); // Daily limit
      expect(status.monthly).toBe(3000); // Monthly limit
      expect(status.current.daily).toBe(2);
      expect(status.current.monthly).toBe(2);
    });
  });

  describe("Report Generation", () => {
    it("should generate comprehensive report", () => {
      // Add test data
      monitor.logEmailAttempt(
        "lead_user_welcome",
        "user1@example.com",
        "Welcome",
        true
      );
      monitor.logEmailAttempt(
        "payment_admin_notification",
        "admin@example.com",
        "Payment",
        false,
        "API Error",
        "PROVIDER_ERROR"
      );

      const report = monitor.generateReport();

      expect(report).toContain("📊 Email Monitoring Report");
      expect(report).toContain("Volume Statistics");
      expect(report).toContain("Success Metrics");
      expect(report).toContain("Email Types");
      expect(report).toContain("Error Types");
      expect(report).toContain("Recent Failures");
      expect(report).toContain("lead_user_welcome: 1");
      expect(report).toContain("PROVIDER_ERROR: 1");
    });
  });

  describe("Data Persistence", () => {
    it("should attempt to save data to localStorage", () => {
      monitor.logEmailAttempt("test", "user@example.com", "Test", true);

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
        monitor.logEmailAttempt("test", "user@example.com", "Test", true);
      }).not.toThrow();

      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to persist email monitoring data:",
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe("Reset Functionality", () => {
    it("should clear logs", () => {
      monitor.logEmailAttempt("test", "user@example.com", "Test", true);
      expect(monitor.getRecentLogs()).toHaveLength(1);

      monitor.clearLogs();
      expect(monitor.getRecentLogs()).toHaveLength(0);
    });

    it("should reset all metrics", () => {
      monitor.logEmailAttempt("test", "user@example.com", "Test", true);
      expect(monitor.getMetrics().totalSent).toBe(1);

      monitor.resetMetrics();
      const metrics = monitor.getMetrics();
      expect(metrics.totalSent).toBe(0);
      expect(metrics.totalFailed).toBe(0);
      expect(monitor.getRecentLogs()).toHaveLength(0);
    });
  });

  describe("Singleton Instance", () => {
    it("should export a singleton instance", () => {
      expect(emailMonitor).toBeInstanceOf(EmailMonitor);
    });
  });
});
