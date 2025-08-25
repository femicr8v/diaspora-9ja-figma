/**
 * Unit tests for error response helper functions
 */

import { describe, it, expect } from "vitest";
import {
  createErrorResponse,
  createDuplicateClientError,
  createValidationError,
  createServerError,
  createCheckoutErrorResponse,
  createCheckoutSuccessResponse,
  isErrorResponse,
  formatErrorForAPI,
} from "../error-helpers";
import { ERROR_TYPES, ERROR_MESSAGES } from "../error-types";

describe("Error Helper Functions", () => {
  describe("createErrorResponse", () => {
    it("should create error response with default message", () => {
      const response = createErrorResponse(ERROR_TYPES.DUPLICATE_CLIENT);

      expect(response.error).toBe(ERROR_MESSAGES[ERROR_TYPES.DUPLICATE_CLIENT]);
      expect(response.errorType).toBe(ERROR_TYPES.DUPLICATE_CLIENT);
      expect(response.details).toBeUndefined();
    });

    it("should create error response with custom message", () => {
      const customMessage = "Custom error message";
      const response = createErrorResponse(
        ERROR_TYPES.SERVER_ERROR,
        customMessage
      );

      expect(response.error).toBe(customMessage);
      expect(response.errorType).toBe(ERROR_TYPES.SERVER_ERROR);
    });

    it("should create error response with details", () => {
      const details = { field: "email", suggestion: "Check format" };
      const response = createErrorResponse(
        ERROR_TYPES.VALIDATION_ERROR,
        undefined,
        details
      );

      expect(response.details).toEqual(details);
      expect(response.errorType).toBe(ERROR_TYPES.VALIDATION_ERROR);
    });
  });

  describe("createDuplicateClientError", () => {
    it("should create duplicate client error with default message", () => {
      const response = createDuplicateClientError();

      expect(response.error).toBe(ERROR_MESSAGES[ERROR_TYPES.DUPLICATE_CLIENT]);
      expect(response.errorType).toBe(ERROR_TYPES.DUPLICATE_CLIENT);
    });

    it("should create duplicate client error with details", () => {
      const details = { suggestion: "Try signing in instead" };
      const response = createDuplicateClientError(details);

      expect(response.details).toEqual(details);
      expect(response.errorType).toBe(ERROR_TYPES.DUPLICATE_CLIENT);
    });

    it("should match requirement 4.1 message format", () => {
      const response = createDuplicateClientError();

      expect(response.error).toContain("already registered");
      expect(response.error).toContain("sign in");
      expect(response.error).toContain("different email");
    });
  });

  describe("createValidationError", () => {
    it("should create validation error with default message", () => {
      const response = createValidationError();

      expect(response.error).toBe(ERROR_MESSAGES[ERROR_TYPES.VALIDATION_ERROR]);
      expect(response.errorType).toBe(ERROR_TYPES.VALIDATION_ERROR);
    });

    it("should create validation error with field details", () => {
      const response = createValidationError("email");

      expect(response.details?.field).toBe("email");
      expect(response.details?.suggestion).toBe(
        "Please check the format and try again."
      );
    });

    it("should create validation error with custom message", () => {
      const customMessage = "Invalid email format";
      const response = createValidationError("email", customMessage);

      expect(response.error).toBe(customMessage);
      expect(response.details?.field).toBe("email");
    });
  });

  describe("createServerError", () => {
    it("should create server error with default message", () => {
      const response = createServerError();

      expect(response.error).toBe(ERROR_MESSAGES[ERROR_TYPES.SERVER_ERROR]);
      expect(response.errorType).toBe(ERROR_TYPES.SERVER_ERROR);
    });

    it("should create server error with custom message", () => {
      const customMessage = "Database connection failed";
      const response = createServerError(customMessage);

      expect(response.error).toBe(customMessage);
      expect(response.errorType).toBe(ERROR_TYPES.SERVER_ERROR);
    });
  });

  describe("createCheckoutErrorResponse", () => {
    it("should create checkout error response", () => {
      const response = createCheckoutErrorResponse(
        ERROR_TYPES.DUPLICATE_CLIENT
      );

      expect(response.error).toBe(ERROR_MESSAGES[ERROR_TYPES.DUPLICATE_CLIENT]);
      expect(response.errorType).toBe(ERROR_TYPES.DUPLICATE_CLIENT);
      expect(response.url).toBeUndefined();
    });

    it("should create checkout error response with details", () => {
      const details = { field: "email" };
      const response = createCheckoutErrorResponse(
        ERROR_TYPES.VALIDATION_ERROR,
        "Custom message",
        details
      );

      expect(response.error).toBe("Custom message");
      expect(response.details).toEqual(details);
    });
  });

  describe("createCheckoutSuccessResponse", () => {
    it("should create successful checkout response", () => {
      const url = "https://checkout.stripe.com/session123";
      const response = createCheckoutSuccessResponse(url);

      expect(response.url).toBe(url);
      expect(response.error).toBeUndefined();
      expect(response.errorType).toBeUndefined();
    });
  });

  describe("isErrorResponse", () => {
    it("should identify error responses correctly", () => {
      const errorResponse = createCheckoutErrorResponse(
        ERROR_TYPES.DUPLICATE_CLIENT
      );
      const successResponse = createCheckoutSuccessResponse(
        "https://example.com"
      );

      expect(isErrorResponse(errorResponse)).toBe(true);
      expect(isErrorResponse(successResponse)).toBe(false);
    });

    it("should handle partial error responses", () => {
      const partialError = { error: "Test error" }; // Missing errorType
      const completeError = {
        error: "Test error",
        errorType: ERROR_TYPES.SERVER_ERROR,
      };

      expect(isErrorResponse(partialError as any)).toBe(false);
      expect(isErrorResponse(completeError)).toBe(true);
    });
  });

  describe("formatErrorForAPI", () => {
    it("should format duplicate client error with correct status code", () => {
      const errorResponse = createDuplicateClientError();
      const apiResponse = formatErrorForAPI(errorResponse);

      expect(apiResponse.status).toBe(409); // Conflict
      expect(apiResponse.headers.get("Content-Type")).toBe("application/json");
    });

    it("should format validation error with correct status code", () => {
      const errorResponse = createValidationError();
      const apiResponse = formatErrorForAPI(errorResponse);

      expect(apiResponse.status).toBe(400); // Bad Request
    });

    it("should format server error with correct status code", () => {
      const errorResponse = createServerError();
      const apiResponse = formatErrorForAPI(errorResponse);

      expect(apiResponse.status).toBe(500); // Internal Server Error
    });

    it("should return JSON response with error data", async () => {
      const errorResponse = createDuplicateClientError();
      const apiResponse = formatErrorForAPI(errorResponse);
      const responseData = await apiResponse.json();

      expect(responseData).toEqual(errorResponse);
    });
  });

  describe("Error message requirements compliance", () => {
    it("should meet requirement 4.1 for duplicate client messaging", () => {
      const response = createDuplicateClientError();

      // Requirement 4.1: "This email is already registered. Please sign in to your account or use a different email."
      expect(response.error).toContain("already registered");
      expect(response.error).toContain("sign in");
      expect(response.error).toContain("different email");
    });

    it("should meet requirement 4.2 for clear feedback", () => {
      const validationResponse = createValidationError("email");
      const serverResponse = createServerError();

      // Requirement 4.2: Clear feedback about status
      expect(validationResponse.error).toContain("valid email");
      expect(validationResponse.details?.field).toBe("email");
      expect(serverResponse.error).toContain("try again");
    });
  });
});
