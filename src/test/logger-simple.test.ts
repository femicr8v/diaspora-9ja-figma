import { describe, it, expect, beforeEach, vi } from "vitest";

describe("Email Validation Logger Simple Test", () => {
  let consoleSpy: any;
  let consoleWarnSpy: any;
  let consoleErrorSpy: any;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should be able to import and instantiate logger", async () => {
    // Dynamic import to avoid module resolution issues
    const module = await import("../lib/email-validation-logger");
    const { EmailValidationLogger } = module;

    expect(EmailValidationLogger).toBeDefined();

    const logger = EmailValidationLogger.getInstance();
    expect(logger).toBeDefined();

    // Test basic logging functionality
    logger.logValidationAttempt(
      "test@example.com",
      { isValid: true, existsAsClient: false, existsAsLead: false },
      100
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      "[EMAIL_VALIDATION]",
      expect.stringContaining('"eventType":"VALIDATION_ATTEMPT"')
    );
  });

  it("should log duplicate client detection", async () => {
    const module = await import("../lib/email-validation-logger");
    const { EmailValidationLogger } = module;

    const logger = EmailValidationLogger.getInstance();

    logger.logDuplicateClientDetection("existing@example.com", "client-123");

    expect(consoleSpy).toHaveBeenCalledWith(
      "[DUPLICATE_CLIENT_DETECTED]",
      expect.stringContaining('"eventType":"DUPLICATE_CLIENT"')
    );

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        "[SECURITY] Duplicate client registration attempt"
      )
    );
  });

  it("should log database errors", async () => {
    const module = await import("../lib/email-validation-logger");
    const { EmailValidationLogger } = module;

    const logger = EmailValidationLogger.getInstance();
    const error = new Error("Connection failed");

    logger.logDatabaseError("CLIENT_CHECK", error, 1000);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "[DATABASE_ERROR]",
      expect.stringContaining('"operation":"CLIENT_CHECK"')
    );
  });

  it("should hash emails for privacy", async () => {
    const module = await import("../lib/email-validation-logger");
    const { EmailValidationLogger } = module;

    const logger = EmailValidationLogger.getInstance();

    logger.logValidationAttempt(
      "sensitive@example.com",
      { isValid: true, existsAsClient: false, existsAsLead: false },
      100
    );

    const logCall = consoleSpy.mock.calls[0];
    const logData = JSON.parse(logCall[1]);

    // Email should be hashed, not plain text
    expect(logData.email).toBeDefined();
    expect(logData.email).not.toBe("sensitive@example.com");
    expect(logData.email.length).toBeGreaterThan(0);
  });
});
