import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";

// Import the logger class directly
const { EmailValidationLogger } = await import(
  "../lib/email-validation-logger"
);

describe("EmailValidationLogger", () => {
  let logger: any;
  let consoleSpy: any;
  let consoleWarnSpy: any;
  let consoleErrorSpy: any;

  beforeEach(() => {
    logger = EmailValidationLogger.getInstance();
    consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("logValidationAttempt", () => {
    it("should log validation attempt with correct structure", () => {
      const email = "test@example.com";
      const result = {
        isValid: true,
        existsAsClient: false,
        existsAsLead: true,
        leadId: "lead-123",
      };
      const duration = 150;
      const metadata = { userAgent: "test-agent", ip: "127.0.0.1" };

      logger.logValidationAttempt(email, result, duration, metadata);

      expect(consoleSpy).toHaveBeenCalledWith(
        "[EMAIL_VALIDATION]",
        expect.stringContaining('"eventType":"VALIDATION_ATTEMPT"')
      );

      const logCall = consoleSpy.mock.calls[0];
      const logData = JSON.parse(logCall[1]);

      expect(logData.eventType).toBe("VALIDATION_ATTEMPT");
      expect(logData.result).toEqual(result);
      expect(logData.performance.duration).toBe(duration);
      expect(logData.metadata).toEqual(metadata);
      expect(logData.email).toBeDefined(); // Should be hashed
      expect(logData.email).not.toBe(email); // Should not be plain text
    });

    it("should log performance warning for slow validation", () => {
      const email = "test@example.com";
      const result = {
        isValid: true,
        existsAsClient: false,
        existsAsLead: false,
      };
      const duration = 1500; // > 1000ms threshold

      logger.logValidationAttempt(email, result, duration);

      expect(consoleSpy).toHaveBeenCalledWith(
        "[EMAIL_VALIDATION]",
        expect.any(String)
      );
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "[PERFORMANCE_WARNING]",
        expect.stringContaining('"operation":"EMAIL_VALIDATION"')
      );
    });
  });

  describe("logDuplicateClientDetection", () => {
    it("should log duplicate client detection with security warning", () => {
      const email = "existing@example.com";
      const clientId = "client-456";
      const metadata = { sessionId: "session-123" };

      logger.logDuplicateClientDetection(email, clientId, metadata);

      expect(consoleSpy).toHaveBeenCalledWith(
        "[DUPLICATE_CLIENT_DETECTED]",
        expect.stringContaining('"eventType":"DUPLICATE_CLIENT"')
      );

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          "[SECURITY] Duplicate client registration attempt"
        )
      );

      const logCall = consoleSpy.mock.calls[0];
      const logData = JSON.parse(logCall[1]);

      expect(logData.result.clientId).toBe(clientId);
      expect(logData.result.existsAsClient).toBe(true);
    });
  });

  describe("logLeadConversion", () => {
    it("should log lead conversion event", () => {
      const email = "lead@example.com";
      const leadId = "lead-789";

      logger.logLeadConversion(email, leadId);

      expect(consoleSpy).toHaveBeenCalledWith(
        "[LEAD_CONVERSION]",
        expect.stringContaining('"eventType":"LEAD_CONVERSION"')
      );

      const logCall = consoleSpy.mock.calls[0];
      const logData = JSON.parse(logCall[1]);

      expect(logData.result.leadId).toBe(leadId);
      expect(logData.result.existsAsLead).toBe(true);
    });
  });

  describe("logDatabaseError", () => {
    it("should log database connection error with details", () => {
      const operation = "CLIENT_CHECK";
      const error = new Error("Connection timeout");
      (error as any).code = "ECONNRESET";
      const duration = 5000;
      const retryAttempt = 2;

      logger.logDatabaseError(operation, error, duration, retryAttempt);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "[DATABASE_ERROR]",
        expect.stringContaining('"operation":"CLIENT_CHECK"')
      );

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Database CLIENT_CHECK failed:",
        error
      );

      const logCall = consoleErrorSpy.mock.calls[0];
      const logData = JSON.parse(logCall[1]);

      expect(logData.operation).toBe(operation);
      expect(logData.error.message).toBe("Connection timeout");
      expect(logData.error.code).toBe("ECONNRESET");
      expect(logData.retryAttempt).toBe(retryAttempt);
      expect(logData.duration).toBe(duration);
    });
  });

  describe("logPerformanceWarning", () => {
    it("should log performance warning for slow operations", () => {
      const email = "slow@example.com";
      const duration = 2000;
      const operation = "CLIENT_CHECK";

      logger.logPerformanceWarning(email, duration, operation);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "[PERFORMANCE_WARNING]",
        expect.stringContaining('"operation":"CLIENT_CHECK"')
      );

      const logCall = consoleWarnSpy.mock.calls[0];
      const logData = JSON.parse(logCall[1]);

      expect(logData.operation).toBe(operation);
      expect(logData.duration).toBe(duration);
      expect(logData.success).toBe(true);
    });
  });

  describe("logValidationError", () => {
    it("should log validation error with full context", () => {
      const email = "error@example.com";
      const error = new Error("Database unavailable");
      error.stack = "Error stack trace...";
      const duration = 1000;
      const metadata = { userAgent: "test-agent" };

      logger.logValidationError(email, error, duration, metadata);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "[EMAIL_VALIDATION_ERROR]",
        expect.stringContaining('"eventType":"DATABASE_ERROR"')
      );

      const logCall = consoleErrorSpy.mock.calls[0];
      const logData = JSON.parse(logCall[1]);

      expect(logData.error.message).toBe("Database unavailable");
      expect(logData.error.stack).toBe("Error stack trace...");
      expect(logData.performance.duration).toBe(duration);
      expect(logData.metadata).toEqual(metadata);
    });
  });

  describe("logPerformanceMetrics", () => {
    it("should log performance metrics for significant durations", () => {
      const operation = "EMAIL_VALIDATION";
      const duration = 150; // > 100ms threshold
      const email = "perf@example.com";

      logger.logPerformanceMetrics(operation, duration, email);

      expect(consoleSpy).toHaveBeenCalledWith(
        "[PERFORMANCE_METRICS]",
        expect.stringContaining('"operation":"EMAIL_VALIDATION"')
      );

      const logCall = consoleSpy.mock.calls[0];
      const logData = JSON.parse(logCall[1]);

      expect(logData.operation).toBe(operation);
      expect(logData.duration).toBe(duration);
      expect(logData.success).toBe(true);
    });

    it("should not log performance metrics for fast operations", () => {
      const operation = "CLIENT_CHECK";
      const duration = 50; // < 100ms threshold

      logger.logPerformanceMetrics(operation, duration);

      expect(consoleSpy).not.toHaveBeenCalled();
    });
  });

  describe("singleton pattern", () => {
    it("should return the same instance", () => {
      const instance1 = EmailValidationLogger.getInstance();
      const instance2 = EmailValidationLogger.getInstance();

      expect(instance1).toBe(instance2);
    });
  });

  describe("email hashing", () => {
    it("should hash emails consistently but not expose plain text", () => {
      const email1 = "test@example.com";
      const email2 = "TEST@EXAMPLE.COM"; // Different case

      logger.logValidationAttempt(
        email1,
        { isValid: true, existsAsClient: false, existsAsLead: false },
        100
      );
      logger.logValidationAttempt(
        email2,
        { isValid: true, existsAsClient: false, existsAsLead: false },
        100
      );

      const call1 = JSON.parse(consoleSpy.mock.calls[0][1]);
      const call2 = JSON.parse(consoleSpy.mock.calls[1][1]);

      // Should hash to same value (case-insensitive)
      expect(call1.email).toBe(call2.email);

      // Should not be the original email
      expect(call1.email).not.toBe(email1);
      expect(call1.email).not.toBe(email2);
    });
  });
});
