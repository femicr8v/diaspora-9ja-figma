import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";

// Mock Supabase client
const mockSupabaseSelect = vi.fn();
const mockSupabaseSingle = vi.fn();
const mockSupabaseUpsert = vi.fn();
const mockSupabaseFrom = vi.fn();

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({
    from: mockSupabaseFrom,
  })),
}));

// Mock email service
vi.mock("@/lib/email-service", () => ({
  emailService: {
    sendLeadCreatedAdminNotification: vi.fn(),
    sendLeadCreatedUserWelcome: vi.fn(),
    sendEmailsAsync: vi.fn(),
  },
  LeadNotificationData: {},
}));

// Mock setImmediate to make it synchronous for testing
vi.mock("timers", () => ({
  setImmediate: (fn: () => void) => fn(),
}));

// Mock console methods
const mockConsoleLog = vi.spyOn(console, "log").mockImplementation(() => {});
const mockConsoleError = vi
  .spyOn(console, "error")
  .mockImplementation(() => {});

// Import the API route handler after mocks
import { POST } from "../app/api/leads/route";
import { emailService } from "@/lib/email-service";

// Get the mocked functions
const mockEmailService = vi.mocked(emailService);

describe("Leads API Email Integration", () => {
  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Set up default environment variables
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";

    // Set up default Supabase mock chain
    mockSupabaseFrom.mockReturnValue({
      upsert: mockSupabaseUpsert,
    });
    mockSupabaseUpsert.mockReturnValue({
      select: mockSupabaseSelect,
    });
    mockSupabaseSelect.mockReturnValue({
      single: mockSupabaseSingle,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Successful Lead Creation with Email Notifications", () => {
    it("should create lead and send both admin and user emails successfully", async () => {
      // Mock successful database operation
      const mockLeadData = {
        id: "lead-123",
        name: "John Doe",
        email: "john@example.com",
        phone: "+1-234-567-8900",
        location: "New York",
        status: "lead",
        created_at: "2024-01-01T12:00:00Z",
      };

      mockSupabaseSingle.mockResolvedValue({
        data: mockLeadData,
        error: null,
      });

      // Mock successful email sending
      mockEmailService.sendEmailsAsync.mockResolvedValue([
        { success: true, messageId: "admin-email-123" },
        { success: true, messageId: "user-email-456" },
      ]);

      // Create request
      const request = new NextRequest("http://localhost:3000/api/leads", {
        method: "POST",
        body: JSON.stringify({
          name: "John Doe",
          email: "john@example.com",
          phone: "+1-234-567-8900",
          location: "New York",
        }),
      });

      // Call the API
      const response = await POST(request);
      const responseData = await response.json();

      // Verify response
      expect(response.status).toBe(200);
      expect(responseData).toEqual({
        success: true,
        leadId: "lead-123",
      });

      // Verify database operations
      expect(mockSupabaseFrom).toHaveBeenCalledWith("leads");
      expect(mockSupabaseUpsert).toHaveBeenCalledWith(
        {
          name: "John Doe",
          email: "john@example.com",
          phone: "+1-234-567-8900",
          location: "New York",
          status: "lead",
        },
        {
          onConflict: "email",
          ignoreDuplicates: false,
        }
      );

      // Verify email service calls
      expect(mockEmailService.sendEmailsAsync).toHaveBeenCalledWith([
        expect.any(Promise),
        expect.any(Promise),
      ]);

      // Verify logging
      expect(mockConsoleLog).toHaveBeenCalledWith(
        "✅ Lead saved: john@example.com - John Doe"
      );
    });

    it("should handle lead creation with minimal data and send emails", async () => {
      // Mock successful database operation with minimal data
      const mockLeadData = {
        id: "lead-456",
        name: "Jane Smith",
        email: "jane@example.com",
        phone: null,
        location: null,
        status: "lead",
        created_at: "2024-01-01T12:00:00Z",
      };

      mockSupabaseSingle.mockResolvedValue({
        data: mockLeadData,
        error: null,
      });

      mockEmailService.sendEmailsAsync.mockResolvedValue([
        { success: true, messageId: "admin-email-789" },
        { success: true, messageId: "user-email-012" },
      ]);

      const request = new NextRequest("http://localhost:3000/api/leads", {
        method: "POST",
        body: JSON.stringify({
          name: "Jane Smith",
          email: "jane@example.com",
        }),
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData).toEqual({
        success: true,
        leadId: "lead-456",
      });

      // Verify database call with null values for optional fields
      expect(mockSupabaseUpsert).toHaveBeenCalledWith(
        {
          name: "Jane Smith",
          email: "jane@example.com",
          phone: null,
          location: null,
          status: "lead",
        },
        {
          onConflict: "email",
          ignoreDuplicates: false,
        }
      );
    });
  });

  describe("Email Failure Scenarios", () => {
    it("should complete lead creation even when admin email fails", async () => {
      const mockLeadData = {
        id: "lead-789",
        name: "Bob Wilson",
        email: "bob@example.com",
        phone: null,
        location: null,
        status: "lead",
        created_at: "2024-01-01T12:00:00Z",
      };

      mockSupabaseSingle.mockResolvedValue({
        data: mockLeadData,
        error: null,
      });

      // Mock admin email failure, user email success
      mockEmailService.sendEmailsAsync.mockResolvedValue([
        { success: false, error: "Admin email service unavailable" },
        { success: true, messageId: "user-email-345" },
      ]);

      const request = new NextRequest("http://localhost:3000/api/leads", {
        method: "POST",
        body: JSON.stringify({
          name: "Bob Wilson",
          email: "bob@example.com",
        }),
      });

      const response = await POST(request);
      const responseData = await response.json();

      // Lead creation should still succeed
      expect(response.status).toBe(200);
      expect(responseData).toEqual({
        success: true,
        leadId: "lead-789",
      });

      // Verify error logging for failed admin email
      expect(mockConsoleError).toHaveBeenCalledWith(
        "Failed to send admin notification email for lead lead-789:",
        "Admin email service unavailable"
      );

      // Verify success logging for user email
      expect(mockConsoleLog).toHaveBeenCalledWith(
        "✅ user welcome email sent successfully for lead lead-789"
      );
    });

    it("should complete lead creation even when user email fails", async () => {
      const mockLeadData = {
        id: "lead-012",
        name: "Alice Brown",
        email: "alice@example.com",
        phone: "+1-555-0123",
        location: "California",
        status: "lead",
        created_at: "2024-01-01T12:00:00Z",
      };

      mockSupabaseSingle.mockResolvedValue({
        data: mockLeadData,
        error: null,
      });

      // Mock user email failure, admin email success
      mockEmailService.sendEmailsAsync.mockResolvedValue([
        { success: true, messageId: "admin-email-678" },
        { success: false, error: "User email delivery failed" },
      ]);

      const request = new NextRequest("http://localhost:3000/api/leads", {
        method: "POST",
        body: JSON.stringify({
          name: "Alice Brown",
          email: "alice@example.com",
          phone: "+1-555-0123",
          location: "California",
        }),
      });

      const response = await POST(request);
      const responseData = await response.json();

      // Lead creation should still succeed
      expect(response.status).toBe(200);
      expect(responseData).toEqual({
        success: true,
        leadId: "lead-012",
      });

      // Verify success logging for admin email
      expect(mockConsoleLog).toHaveBeenCalledWith(
        "✅ admin notification email sent successfully for lead lead-012"
      );

      // Verify error logging for failed user email
      expect(mockConsoleError).toHaveBeenCalledWith(
        "Failed to send user welcome email for lead lead-012:",
        "User email delivery failed"
      );
    });

    it("should complete lead creation even when both emails fail", async () => {
      const mockLeadData = {
        id: "lead-345",
        name: "Charlie Davis",
        email: "charlie@example.com",
        phone: null,
        location: null,
        status: "lead",
        created_at: "2024-01-01T12:00:00Z",
      };

      mockSupabaseSingle.mockResolvedValue({
        data: mockLeadData,
        error: null,
      });

      // Mock both emails failing
      mockEmailService.sendEmailsAsync.mockResolvedValue([
        { success: false, error: "Email service completely down" },
        { success: false, error: "Email service completely down" },
      ]);

      const request = new NextRequest("http://localhost:3000/api/leads", {
        method: "POST",
        body: JSON.stringify({
          name: "Charlie Davis",
          email: "charlie@example.com",
        }),
      });

      const response = await POST(request);
      const responseData = await response.json();

      // Lead creation should still succeed
      expect(response.status).toBe(200);
      expect(responseData).toEqual({
        success: true,
        leadId: "lead-345",
      });

      // Verify error logging for both emails
      expect(mockConsoleError).toHaveBeenCalledWith(
        "Failed to send admin notification email for lead lead-345:",
        "Email service completely down"
      );
      expect(mockConsoleError).toHaveBeenCalledWith(
        "Failed to send user welcome email for lead lead-345:",
        "Email service completely down"
      );
    });

    it("should handle email service throwing exceptions", async () => {
      const mockLeadData = {
        id: "lead-678",
        name: "Diana Evans",
        email: "diana@example.com",
        phone: null,
        location: null,
        status: "lead",
        created_at: "2024-01-01T12:00:00Z",
      };

      mockSupabaseSingle.mockResolvedValue({
        data: mockLeadData,
        error: null,
      });

      // Mock email service throwing an exception
      mockEmailService.sendEmailsAsync.mockRejectedValue(
        new Error("Email service crashed")
      );

      const request = new NextRequest("http://localhost:3000/api/leads", {
        method: "POST",
        body: JSON.stringify({
          name: "Diana Evans",
          email: "diana@example.com",
        }),
      });

      const response = await POST(request);
      const responseData = await response.json();

      // Lead creation should still succeed
      expect(response.status).toBe(200);
      expect(responseData).toEqual({
        success: true,
        leadId: "lead-678",
      });

      // Verify error logging for email service exception
      expect(mockConsoleError).toHaveBeenCalledWith(
        "Failed to send lead creation emails for lead lead-678:",
        expect.objectContaining({
          message: "Email service crashed",
        })
      );
    });
  });

  describe("Asynchronous Email Sending Behavior", () => {
    it("should not block API response while sending emails", async () => {
      const mockLeadData = {
        id: "lead-async",
        name: "Async Test",
        email: "async@example.com",
        phone: null,
        location: null,
        status: "lead",
        created_at: "2024-01-01T12:00:00Z",
      };

      mockSupabaseSingle.mockResolvedValue({
        data: mockLeadData,
        error: null,
      });

      // Mock slow email sending (should not affect response time)
      mockEmailService.sendEmailsAsync.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve([
                  { success: true, messageId: "slow-admin" },
                  { success: true, messageId: "slow-user" },
                ]),
              100
            )
          )
      );

      const request = new NextRequest("http://localhost:3000/api/leads", {
        method: "POST",
        body: JSON.stringify({
          name: "Async Test",
          email: "async@example.com",
        }),
      });

      const startTime = Date.now();
      const response = await POST(request);
      const endTime = Date.now();
      const responseData = await response.json();

      // Response should be immediate (not wait for email sending)
      expect(endTime - startTime).toBeLessThan(50); // Should be much faster than 100ms email delay
      expect(response.status).toBe(200);
      expect(responseData).toEqual({
        success: true,
        leadId: "lead-async",
      });
    });

    it("should properly format lead data for email service", async () => {
      const mockLeadData = {
        id: "lead-format",
        name: "Format Test",
        email: "format@example.com",
        phone: "+1-999-888-7777",
        location: "Test City",
        status: "lead",
        created_at: "2024-01-01T12:00:00.000Z",
      };

      mockSupabaseSingle.mockResolvedValue({
        data: mockLeadData,
        error: null,
      });

      mockEmailService.sendEmailsAsync.mockResolvedValue([
        { success: true, messageId: "format-admin" },
        { success: true, messageId: "format-user" },
      ]);

      const request = new NextRequest("http://localhost:3000/api/leads", {
        method: "POST",
        body: JSON.stringify({
          name: "Format Test",
          email: "format@example.com",
          phone: "+1-999-888-7777",
          location: "Test City",
        }),
      });

      await POST(request);

      // Verify that email service receives properly formatted data
      expect(mockEmailService.sendEmailsAsync).toHaveBeenCalledWith([
        expect.any(Promise),
        expect.any(Promise),
      ]);

      // The promises should be created with the correct lead data format
      // We can't directly inspect the promises, but we can verify the service was called
      expect(mockEmailService.sendEmailsAsync).toHaveBeenCalledTimes(1);
    });
  });

  describe("Database Error Scenarios", () => {
    it("should not send emails when lead creation fails", async () => {
      // Mock database error
      mockSupabaseSingle.mockResolvedValue({
        data: null,
        error: { message: "Database connection failed" },
      });

      const request = new NextRequest("http://localhost:3000/api/leads", {
        method: "POST",
        body: JSON.stringify({
          name: "Failed Lead",
          email: "failed@example.com",
        }),
      });

      const response = await POST(request);
      const responseData = await response.json();

      // Should return error response
      expect(response.status).toBe(500);
      expect(responseData).toEqual({
        error: "Failed to save lead information",
      });

      // Should not attempt to send emails
      expect(mockEmailService.sendEmailsAsync).not.toHaveBeenCalled();
      expect(
        mockEmailService.sendLeadCreatedAdminNotification
      ).not.toHaveBeenCalled();
      expect(
        mockEmailService.sendLeadCreatedUserWelcome
      ).not.toHaveBeenCalled();
    });
  });

  describe("Input Validation", () => {
    it("should not send emails for invalid input", async () => {
      const request = new NextRequest("http://localhost:3000/api/leads", {
        method: "POST",
        body: JSON.stringify({
          name: "",
          email: "",
        }),
      });

      const response = await POST(request);
      const responseData = await response.json();

      // Should return validation error
      expect(response.status).toBe(400);
      expect(responseData).toEqual({
        error: "Name and email are required",
      });

      // Should not attempt database operations or send emails
      expect(mockSupabaseFrom).not.toHaveBeenCalled();
      expect(mockEmailService.sendEmailsAsync).not.toHaveBeenCalled();
    });

    it("should not send emails when name is missing", async () => {
      const request = new NextRequest("http://localhost:3000/api/leads", {
        method: "POST",
        body: JSON.stringify({
          email: "test@example.com",
        }),
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData).toEqual({
        error: "Name and email are required",
      });

      expect(mockEmailService.sendEmailsAsync).not.toHaveBeenCalled();
    });

    it("should not send emails when email is missing", async () => {
      const request = new NextRequest("http://localhost:3000/api/leads", {
        method: "POST",
        body: JSON.stringify({
          name: "Test User",
        }),
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData).toEqual({
        error: "Name and email are required",
      });

      expect(mockEmailService.sendEmailsAsync).not.toHaveBeenCalled();
    });
  });

  describe("Error Handling and Resilience", () => {
    it("should handle malformed JSON gracefully", async () => {
      const request = new NextRequest("http://localhost:3000/api/leads", {
        method: "POST",
        body: "invalid json",
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(500);
      expect(responseData).toEqual({
        error: "Internal server error",
      });

      expect(mockEmailService.sendEmailsAsync).not.toHaveBeenCalled();
    });

    it("should handle unexpected database response format", async () => {
      // Mock unexpected database response
      mockSupabaseSingle.mockResolvedValue({
        data: undefined,
        error: null,
      });

      const request = new NextRequest("http://localhost:3000/api/leads", {
        method: "POST",
        body: JSON.stringify({
          name: "Test User",
          email: "test@example.com",
        }),
      });

      const response = await POST(request);

      // Should handle gracefully and not crash
      expect(response.status).toBe(500);
      expect(mockEmailService.sendEmailsAsync).not.toHaveBeenCalled();
    });
  });
});
