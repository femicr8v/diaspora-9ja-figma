import { describe, it, expect, vi } from "vitest";
import { EmailLogger } from "../lib/email-logger-minimal";

describe("Minimal Email Logger", () => {
  it("should work with basic logging", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    EmailLogger.log("test message");
    EmailLogger.logValidation("test@example.com", true);

    expect(consoleSpy).toHaveBeenCalledWith("[EMAIL_LOG] test message");
    expect(consoleSpy).toHaveBeenCalledWith(
      "[EMAIL_VALIDATION] test@example.com: true"
    );

    consoleSpy.mockRestore();
  });
});
