/**
 * Error types for duplicate email prevention system
 * Based on requirements 4.1 and 4.2
 */

// Error type constants for different validation scenarios
export const ERROR_TYPES = {
  DUPLICATE_CLIENT: "DUPLICATE_CLIENT",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  SERVER_ERROR: "SERVER_ERROR",
} as const;

export type ErrorType = (typeof ERROR_TYPES)[keyof typeof ERROR_TYPES];

// TypeScript interfaces for error responses
export interface ErrorDetails {
  field?: string;
  suggestion?: string;
}

export interface ErrorResponse {
  error: string;
  errorType: ErrorType;
  details?: ErrorDetails;
}

export interface CheckoutResponse {
  url?: string; // Stripe checkout URL (success case)
  error?: string; // Error message (failure case)
  errorType?: ErrorType;
  details?: ErrorDetails;
}

// Predefined error messages for consistency
export const ERROR_MESSAGES = {
  [ERROR_TYPES.DUPLICATE_CLIENT]:
    "This email is already registered. Please sign in to your account or use a different email.",
  [ERROR_TYPES.VALIDATION_ERROR]: "Please enter a valid email address.",
  [ERROR_TYPES.SERVER_ERROR]: "Unable to verify email. Please try again.",
} as const;
