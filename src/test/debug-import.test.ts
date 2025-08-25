import { describe, it, expect } from "vitest";

describe("Debug Import", () => {
  it("should show what is exported from logger module", async () => {
    // eslint-disable-next-line @next/next/no-assign-module-variable
    const module = await import("../lib/email-validation-logger");
    console.log("Module exports:", Object.keys(module));
    console.log("Full module:", module);

    expect(true).toBe(true); // Just to make the test pass
  });
});
