/**
 * Error response helper functions for duplicate email prevention
 * Based on requirements 4.1 and 4.2
 */

import {
  ErrorResponse,
  CheckoutResponse,
  ErrorType,
  ERROR_TYPES,
  ERROR_MESSAGES,
  ErrorDetails,
} from "./error-types";

/**
 * Creates a standardized error response
 */
export function createErrorResponse(
  errorType: ErrorType,
  customMessage?: string,
  details?: ErrorDetails
): ErrorResponse {
  return {
    error: customMessage || ERROR_MESSAGES[errorType],
    errorType,
    details,
  };
}

/**
 * Creates a duplicate client error response
 */
export function createDuplicateClientError(
  details?: ErrorDetails
): ErrorResponse {
  return createErrorResponse(ERROR_TYPES.DUPLICATE_CLIENT, undefined, details);
}

/**
 * Creates a validation error response
 */
export function createValidationError(
  field?: string,
  customMessage?: string
): ErrorResponse {
  return createErrorResponse(
    ERROR_TYPES.VALIDATION_ERROR,
    customMessage,
    field
      ? { field, suggestion: "Please check the format and try again." }
      : undefined
  );
}

/**
 * Creates a server error response
 */
export function createServerError(customMessage?: string): ErrorResponse {
  return createErrorResponse(ERROR_TYPES.SERVER_ERROR, customMessage);
}

/**
 * Creates a checkout error response (extends ErrorResponse for checkout API)
 */
export function createCheckoutErrorResponse(
  errorType: ErrorType,
  customMessage?: string,
  details?: ErrorDetails
): CheckoutResponse {
  const errorResponse = createErrorResponse(errorType, customMessage, details);
  return {
    error: errorResponse.error,
    errorType: errorResponse.errorType,
    details: errorResponse.details,
  };
}

/**
 * Creates a successful checkout response
 */
export function createCheckoutSuccessResponse(url: string): CheckoutResponse {
  return { url };
}

/**
 * Checks if a response is an error response
 */
export function isErrorResponse(
  response: CheckoutResponse
): response is Required<Pick<CheckoutResponse, "error" | "errorType">> &
  CheckoutResponse {
  return response.error !== undefined && response.errorType !== undefined;
}

/**
 * Formats error response for API JSON response
 */
export function formatErrorForAPI(errorResponse: ErrorResponse): Response {
  return new Response(JSON.stringify(errorResponse), {
    status: getStatusCodeForErrorType(errorResponse.errorType),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 * Gets appropriate HTTP status code for error type
 */
function getStatusCodeForErrorType(errorType: ErrorType): number {
  switch (errorType) {
    case ERROR_TYPES.DUPLICATE_CLIENT:
      return 409; // Conflict
    case ERROR_TYPES.VALIDATION_ERROR:
      return 400; // Bad Request
    case ERROR_TYPES.SERVER_ERROR:
      return 500; // Internal Server Error
    default:
      return 400; // Default to Bad Request
  }
}
