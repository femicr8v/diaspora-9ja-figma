import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Simple hash function for email privacy in logs
function hashEmail(email: string): string {
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    const char = email.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36).substring(0, 8);
}

// Logging functions for email validation
const emailValidationLogger = {
  logValidationAttempt: (
    email: string,
    result: any,
    duration: number,
    metadata?: any
  ) => {
    const logEvent = {
      timestamp: new Date().toISOString(),
      email: hashEmail(email),
      eventType: "VALIDATION_ATTEMPT",
      result,
      performance: { duration, queryType: "COMBINED_VALIDATION" },
      metadata,
    };
    console.log("[EMAIL_VALIDATION]", JSON.stringify(logEvent));

    if (duration > 1000) {
      console.warn(
        "[PERFORMANCE_WARNING]",
        JSON.stringify({
          timestamp: new Date().toISOString(),
          operation: "EMAIL_VALIDATION",
          duration,
          success: true,
          email: hashEmail(email),
        })
      );
    }
  },

  logDuplicateClientDetection: (
    email: string,
    clientId: string,
    metadata?: any
  ) => {
    const logEvent = {
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
    console.warn(
      `[SECURITY] Duplicate client registration attempt for email hash: ${hashEmail(
        email
      )}`
    );
  },

  logLeadConversion: (email: string, leadId: string, metadata?: any) => {
    const logEvent = {
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
  },

  logDatabaseError: (
    operation: string,
    error: Error,
    duration: number,
    retryAttempt?: number
  ) => {
    const errorLog = {
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
    console.error(`Database ${operation} failed:`, error);
  },

  logValidationError: (
    email: string,
    error: Error,
    duration: number,
    metadata?: any
  ) => {
    const logEvent = {
      timestamp: new Date().toISOString(),
      email: hashEmail(email),
      eventType: "DATABASE_ERROR",
      error: {
        type: error.constructor.name,
        message: error.message,
        code: (error as any).code,
        stack: error.stack,
      },
      performance: { duration, queryType: "COMBINED_VALIDATION" },
      metadata,
    };
    console.error("[EMAIL_VALIDATION_ERROR]", JSON.stringify(logEvent));
  },

  logPerformanceMetrics: (
    operation: string,
    duration: number,
    email?: string
  ) => {
    if (duration > 100) {
      const performanceLog = {
        timestamp: new Date().toISOString(),
        operation,
        duration,
        success: true,
        email: email ? hashEmail(email) : undefined,
      };
      console.log("[PERFORMANCE_METRICS]", JSON.stringify(performanceLog));
    }
  },
};

export interface EmailValidationResult {
  isValid: boolean;
  existsAsClient: boolean;
  existsAsLead: boolean;
  clientId?: string;
  leadId?: string;
  error?: string;
}

export interface ClientRecord {
  id: string;
  email: string;
  status: string;
}

export interface LeadRecord {
  id: string;
  email: string;
  status: string;
}

/**
 * Normalizes email address for case-insensitive comparison
 * @param email - The email address to normalize
 * @returns Normalized email address in lowercase
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Validates email format using regex
 * @param email - The email address to validate
 * @returns True if email format is valid
 */
export function isValidEmailFormat(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Checks if email exists in the clients table
 * Uses case-insensitive index for optimal performance
 * @param email - The email address to check
 * @returns Client record if found, null otherwise
 */
export async function checkClientEmail(
  email: string
): Promise<ClientRecord | null> {
  const startTime = Date.now();

  try {
    const normalizedEmail = normalizeEmail(email);

    // Use exact equality with normalized email to leverage case-insensitive index
    const { data, error } = await supabase
      .from("clients")
      .select("id, email, status")
      .eq("email", normalizedEmail)
      .eq("status", "active")
      .limit(1)
      .single();

    const duration = Date.now() - startTime;

    if (error) {
      // If no rows found, error.code will be 'PGRST116'
      if (error.code === "PGRST116") {
        emailValidationLogger.logPerformanceMetrics(
          "CLIENT_CHECK",
          duration,
          email
        );
        return null;
      }

      // Log database error
      emailValidationLogger.logDatabaseError("CLIENT_CHECK", error, duration);
      throw error;
    }

    // Log successful operation
    emailValidationLogger.logPerformanceMetrics(
      "CLIENT_CHECK",
      duration,
      email
    );
    return data;
  } catch (error) {
    const duration = Date.now() - startTime;
    emailValidationLogger.logDatabaseError(
      "CLIENT_CHECK",
      error as Error,
      duration
    );
    console.error("Error checking client email:", error);
    throw error;
  }
}

/**
 * Checks if email exists in the leads table
 * Uses case-insensitive index for optimal performance
 * @param email - The email address to check
 * @returns Lead record if found, null otherwise
 */
export async function checkLeadEmail(
  email: string
): Promise<LeadRecord | null> {
  const startTime = Date.now();

  try {
    const normalizedEmail = normalizeEmail(email);

    // Use exact equality with normalized email to leverage case-insensitive index
    const { data, error } = await supabase
      .from("leads")
      .select("id, email, status")
      .eq("email", normalizedEmail)
      .limit(1)
      .single();

    const duration = Date.now() - startTime;

    if (error) {
      // If no rows found, error.code will be 'PGRST116'
      if (error.code === "PGRST116") {
        emailValidationLogger.logPerformanceMetrics(
          "LEAD_CHECK",
          duration,
          email
        );
        return null;
      }

      // Log database error
      emailValidationLogger.logDatabaseError("LEAD_CHECK", error, duration);
      throw error;
    }

    // Log successful operation
    emailValidationLogger.logPerformanceMetrics("LEAD_CHECK", duration, email);
    return data;
  } catch (error) {
    const duration = Date.now() - startTime;
    emailValidationLogger.logDatabaseError(
      "LEAD_CHECK",
      error as Error,
      duration
    );
    console.error("Error checking lead email:", error);
    throw error;
  }
}

/**
 * Comprehensive email validation that checks format and database existence
 * @param email - The email address to validate
 * @param metadata - Optional metadata for logging (userAgent, ip, sessionId)
 * @returns EmailValidationResult with validation details
 */
export async function validateEmail(
  email: string,
  metadata?: { userAgent?: string; ip?: string; sessionId?: string }
): Promise<EmailValidationResult> {
  const startTime = Date.now();

  // First check email format
  if (!isValidEmailFormat(email)) {
    const result = {
      isValid: false,
      existsAsClient: false,
      existsAsLead: false,
    };

    const duration = Date.now() - startTime;
    emailValidationLogger.logValidationAttempt(
      email,
      result,
      duration,
      metadata
    );

    return result;
  }

  try {
    // Check both clients and leads tables concurrently
    const [clientRecord, leadRecord] = await Promise.all([
      checkClientEmail(email),
      checkLeadEmail(email),
    ]);

    const result = {
      isValid: true,
      existsAsClient: clientRecord !== null,
      existsAsLead: leadRecord !== null,
      clientId: clientRecord?.id,
      leadId: leadRecord?.id,
    };

    const duration = Date.now() - startTime;

    // Log the validation attempt
    emailValidationLogger.logValidationAttempt(
      email,
      result,
      duration,
      metadata
    );

    // Log specific events based on results
    if (result.existsAsClient && clientRecord) {
      emailValidationLogger.logDuplicateClientDetection(
        email,
        clientRecord.id,
        metadata
      );
    }

    if (result.existsAsLead && leadRecord) {
      emailValidationLogger.logLeadConversion(email, leadRecord.id, metadata);
    }

    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    emailValidationLogger.logValidationError(
      email,
      error as Error,
      duration,
      metadata
    );
    console.error("Error during email validation:", error);
    // In case of database error, return a result that allows the process to continue
    // but indicates the validation couldn't be completed
    throw error;
  }
}

/**
 * Case-insensitive email comparison
 * @param email1 - First email address
 * @param email2 - Second email address
 * @returns True if emails are the same (case-insensitive)
 */
export function compareEmails(email1: string, email2: string): boolean {
  return normalizeEmail(email1) === normalizeEmail(email2);
}
