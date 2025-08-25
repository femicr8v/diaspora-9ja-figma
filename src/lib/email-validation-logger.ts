/**
 * Structured logging service for email validation operations
 * Provides comprehensive logging for email validation attempts, errors,
 * performance monitoring, and security events
 */

export interface EmailValidationLogEvent {
  timestamp: string;
  email: string; // Hashed for privacy
  eventType:
    | "VALIDATION_ATTEMPT"
    | "DUPLICATE_CLIENT"
    | "LEAD_CONVERSION"
    | "DATABASE_ERROR"
    | "PERFORMANCE_WARNING";
  result?: {
    isValid: boolean;
    existsAsClient: boolean;
    existsAsLead: boolean;
    clientId?: string;
    leadId?: string;
  };
  error?: {
    type: string;
    message: string;
    code?: string;
    stack?: string;
  };
  performance?: {
    duration: number; // milliseconds
    queryType: "CLIENT_CHECK" | "LEAD_CHECK" | "COMBINED_VALIDATION";
  };
  metadata?: {
    userAgent?: string;
    ip?: string;
    sessionId?: string;
  };
}

export interface DatabaseConnectionError {
  timestamp: string;
  operation: "CLIENT_CHECK" | "LEAD_CHECK";
  error: {
    type: string;
    message: string;
    code?: string;
  };
  retryAttempt?: number;
  duration: number;
}

export interface PerformanceMetrics {
  timestamp: string;
  operation: "EMAIL_VALIDATION" | "CLIENT_CHECK" | "LEAD_CHECK";
  duration: number;
  success: boolean;
  email?: string; // Hashed
}

/**
 * Hash email for privacy-preserving logging
 * @param email - Email address to hash
 * @returns Hashed email string
 */
function hashEmail(email: string): string {
  // Simple hash for logging purposes - just use a simple transformation
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    const char = email.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36).substring(0, 8);
}

/**
 * Email Validation Logger Class
 * Provides structured logging for all email validation operations
 */
export class EmailValidationLogger {
  private static instance: EmailValidationLogger;

  private constructor() {}

  public static getInstance(): EmailValidationLogger {
    if (!EmailValidationLogger.instance) {
      EmailValidationLogger.instance = new EmailValidationLogger();
    }
    return EmailValidationLogger.instance;
  }

  /**
   * Log email validation attempt
   * @param email - Email being validated
   * @param result - Validation result
   * @param duration - Time taken for validation
   * @param metadata - Additional context
   */
  public logValidationAttempt(
    email: string,
    result: any,
    duration: number,
    metadata?: { userAgent?: string; ip?: string; sessionId?: string }
  ): void {
    const logEvent: EmailValidationLogEvent = {
      timestamp: new Date().toISOString(),
      email: hashEmail(email),
      eventType: "VALIDATION_ATTEMPT",
      result,
      performance: {
        duration,
        queryType: "COMBINED_VALIDATION",
      },
      metadata,
    };

    console.log("[EMAIL_VALIDATION]", JSON.stringify(logEvent));

    // Log performance warning if validation takes too long
    if (duration > 1000) {
      // More than 1 second
      this.logPerformanceWarning(email, duration, "EMAIL_VALIDATION");
    }
  }

  /**
   * Log duplicate client detection event
   * @param email - Email that was detected as duplicate
   * @param clientId - ID of existing client
   * @param metadata - Additional context
   */
  public logDuplicateClientDetection(
    email: string,
    clientId: string,
    metadata?: { userAgent?: string; ip?: string; sessionId?: string }
  ): void {
    const logEvent: EmailValidationLogEvent = {
      timestamp: new Date().toISOString(),
      email: hashEmail(email),
      eventType: "DUPLICATE_CLIENT",
      result: {
        isValid: true,
        existsAsClient: true,
        existsAsLead: false,
        clientId,
      },
      metadata,
    };

    console.log("[DUPLICATE_CLIENT_DETECTED]", JSON.stringify(logEvent));

    // Also log as a security event for monitoring
    console.warn(
      `[SECURITY] Duplicate client registration attempt for email hash: ${hashEmail(
        email
      )}`
    );
  }

  /**
   * Log lead conversion event
   * @param email - Email of converting lead
   * @param leadId - ID of existing lead
   * @param metadata - Additional context
   */
  public logLeadConversion(
    email: string,
    leadId: string,
    metadata?: { userAgent?: string; ip?: string; sessionId?: string }
  ): void {
    const logEvent: EmailValidationLogEvent = {
      timestamp: new Date().toISOString(),
      email: hashEmail(email),
      eventType: "LEAD_CONVERSION",
      result: {
        isValid: true,
        existsAsClient: false,
        existsAsLead: true,
        leadId,
      },
      metadata,
    };

    console.log("[LEAD_CONVERSION]", JSON.stringify(logEvent));
  }

  /**
   * Log database connection error
   * @param operation - Type of database operation that failed
   * @param error - Error details
   * @param duration - Time taken before failure
   * @param retryAttempt - Retry attempt number if applicable
   */
  public logDatabaseError(
    operation: "CLIENT_CHECK" | "LEAD_CHECK",
    error: Error,
    duration: number,
    retryAttempt?: number
  ): void {
    const errorLog: DatabaseConnectionError = {
      timestamp: new Date().toISOString(),
      operation,
      error: {
        type: error.constructor.name,
        message: error.message,
        code: (error as any).code,
      },
      retryAttempt,
      duration,
    };

    console.error("[DATABASE_ERROR]", JSON.stringify(errorLog));

    // Also log the full error for debugging
    console.error(`Database ${operation} failed:`, error);
  }

  /**
   * Log performance warning
   * @param email - Email being processed (will be hashed)
   * @param duration - Duration that triggered the warning
   * @param operation - Type of operation
   */
  public logPerformanceWarning(
    email: string,
    duration: number,
    operation: "EMAIL_VALIDATION" | "CLIENT_CHECK" | "LEAD_CHECK"
  ): void {
    const performanceLog: PerformanceMetrics = {
      timestamp: new Date().toISOString(),
      operation,
      duration,
      success: true, // Warning, not failure
      email: hashEmail(email),
    };

    console.warn("[PERFORMANCE_WARNING]", JSON.stringify(performanceLog));
  }

  /**
   * Log general validation error
   * @param email - Email being validated
   * @param error - Error that occurred
   * @param duration - Time taken before error
   * @param metadata - Additional context
   */
  public logValidationError(
    email: string,
    error: Error,
    duration: number,
    metadata?: { userAgent?: string; ip?: string; sessionId?: string }
  ): void {
    const logEvent: EmailValidationLogEvent = {
      timestamp: new Date().toISOString(),
      email: hashEmail(email),
      eventType: "DATABASE_ERROR",
      error: {
        type: error.constructor.name,
        message: error.message,
        code: (error as any).code,
        stack: error.stack,
      },
      performance: {
        duration,
        queryType: "COMBINED_VALIDATION",
      },
      metadata,
    };

    console.error("[EMAIL_VALIDATION_ERROR]", JSON.stringify(logEvent));
  }

  /**
   * Log performance metrics for successful operations
   * @param operation - Type of operation
   * @param duration - Duration of operation
   * @param email - Email being processed (optional, will be hashed)
   */
  public logPerformanceMetrics(
    operation: "EMAIL_VALIDATION" | "CLIENT_CHECK" | "LEAD_CHECK",
    duration: number,
    email?: string
  ): void {
    const performanceLog: PerformanceMetrics = {
      timestamp: new Date().toISOString(),
      operation,
      duration,
      success: true,
      email: email ? hashEmail(email) : undefined,
    };

    // Only log if duration is significant or for monitoring purposes
    if (duration > 100) {
      // More than 100ms
      console.log("[PERFORMANCE_METRICS]", JSON.stringify(performanceLog));
    }
  }
}
