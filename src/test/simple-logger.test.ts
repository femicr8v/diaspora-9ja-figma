import { describe, it, expect, vi } from "vitest";
import { SimpleLogger, testFunction } from "../lib/simple-logger";

describe("Simple Logger Test", () => {
  it("should import and work", () => {
    expect(testFunction()).toBe("test works");

    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    SimpleLogger.log("test message");

    expect(consoleSpy).toHaveBeenCalledWith("[SIMPLE_LOG] test message");

    consoleSpy.mockRestore();
  });
});
