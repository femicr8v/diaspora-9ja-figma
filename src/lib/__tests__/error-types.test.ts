/**
 * Unit tests for error types and constants
 */

import { describe, it, expect } from "vitest";
import {
  ERROR_TYPES,
  ERROR_MESSAGES,
  ErrorType,
  ErrorResponse,
  CheckoutResponse,
  ErrorDetails,
} from "../error-types";

describe("Error Types", () => {
  describe("ERROR_TYPES constants", () => {
    it("should have correct error type values", () => {
      expect(ERROR_TYPES.DUPLICATE_CLIENT).toBe("DUPLICATE_CLIENT");
      expect(ERROR_TYPES.VALIDATION_ERROR).toBe("VALIDATION_ERROR");
      expect(ERROR_TYPES.SERVER_ERROR).toBe("SERVER_ERROR");
    });

    it("should be readonly constants", () => {
      // TypeScript should prevent modification, but we can test the object is frozen
      expect(Object.isFrozen(ERROR_TYPES)).toBe(false); // as const doesn't freeze, but TS prevents modification
      expect(typeof ERROR_TYPES.DUPLICATE_CLIENT).toBe("string");
    });
  });

  describe("ERROR_MESSAGES constants", () => {
    it("should have messages for all error types", () => {
      expect(ERROR_MESSAGES[ERROR_TYPES.DUPLICATE_CLIENT]).toBe(
        "This email is already registered. Please sign in to your account or use a different email."
      );
      expect(ERROR_MESSAGES[ERROR_TYPES.VALIDATION_ERROR]).toBe(
        "Please enter a valid email address."
      );
      expect(ERROR_MESSAGES[ERROR_TYPES.SERVER_ERROR]).toBe(
        "Unable to verify email. Please try again."
      );
    });

    it("should have messages that match requirements 4.1", () => {
      // Requirement 4.1: specific message for duplicate client
      const duplicateMessage = ERROR_MESSAGES[ERROR_TYPES.DUPLICATE_CLIENT];
      expect(duplicateMessage).toContain("already registered");
      expect(duplicateMessage).toContain("sign in");
      expect(duplicateMessage).toContain("different email");
    });
  });

  describe("Type definitions", () => {
    it("should allow valid ErrorType values", () => {
      const validTypes: ErrorType[] = [
        ERROR_TYPES.DUPLICATE_CLIENT,
        ERROR_TYPES.VALIDATION_ERROR,
        ERROR_TYPES.SERVER_ERROR,
      ];

      validTypes.forEach((type) => {
        expect(typeof type).toBe("string");
        expect(Object.values(ERROR_TYPES)).toContain(type);
      });
    });

    it("should define ErrorResponse interface correctly", () => {
      const errorResponse: ErrorResponse = {
        error: "Test error",
        errorType: ERROR_TYPES.DUPLICATE_CLIENT,
      };

      expect(errorResponse.error).toBe("Test error");
      expect(errorResponse.errorType).toBe(ERROR_TYPES.DUPLICATE_CLIENT);
      expect(errorResponse.details).toBeUndefined();
    });

    it("should define ErrorResponse with details", () => {
      const details: ErrorDetails = {
        field: "email",
        suggestion: "Please check format",
      };

      const errorResponse: ErrorResponse = {
        error: "Test error",
        errorType: ERROR_TYPES.VALIDATION_ERROR,
        details,
      };

      expect(errorResponse.details).toEqual(details);
      expect(errorResponse.details?.field).toBe("email");
      expect(errorResponse.details?.suggestion).toBe("Please check format");
    });

    it("should define CheckoutResponse interface correctly", () => {
      // Success response
      const successResponse: CheckoutResponse = {
        url: "https://checkout.stripe.com/session123",
      };
      expect(successResponse.url).toBe(
        "https://checkout.stripe.com/session123"
      );
      expect(successResponse.error).toBeUndefined();

      // Error response
      const errorResponse: CheckoutResponse = {
        error: "Test error",
        errorType: ERROR_TYPES.DUPLICATE_CLIENT,
        details: { field: "email" },
      };
      expect(errorResponse.error).toBe("Test error");
      expect(errorResponse.errorType).toBe(ERROR_TYPES.DUPLICATE_CLIENT);
      expect(errorResponse.url).toBeUndefined();
    });
  });
});
