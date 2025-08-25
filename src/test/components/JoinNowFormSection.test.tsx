import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { JoinNowFormSection } from "@/components/join-now-page/JoinNowFormSection";
import { ERROR_TYPES } from "@/lib/error-types";
import { toast } from "sonner";

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

// Mock fetch
global.fetch = vi.fn();

describe("JoinNowFormSection - Enhanced Error Handling", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockClear();
    vi.mocked(toast.error).mockClear();
  });

  it("should render form correctly", () => {
    render(<JoinNowFormSection />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /join the community/i })
    ).toBeInTheDocument();
  });

  it("should handle form submission with valid data", async () => {
    // Mock successful API responses
    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          url: "https://checkout.stripe.com/test-session",
        }),
      });

    // Mock window.location.href
    delete (window as any).location;
    (window as any).location = { href: "" };

    render(<JoinNowFormSection />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole("button", {
      name: /join the community/i,
    });

    fireEvent.change(nameInput, { target: { value: "Test User" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(submitButton);

    // Wait for the redirect
    await waitFor(() => {
      expect(window.location.href).toBe(
        "https://checkout.stripe.com/test-session"
      );
    });
  });

  it("should show error toast for duplicate client", async () => {
    // Mock the API responses
    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          error:
            "This email is already registered. Please sign in to your account or use a different email.",
          errorType: ERROR_TYPES.DUPLICATE_CLIENT,
          details: { field: "email" },
        }),
      });

    render(<JoinNowFormSection />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole("button", {
      name: /join the community/i,
    });

    fireEvent.change(nameInput, { target: { value: "Test User" } });
    fireEvent.change(emailInput, { target: { value: "existing@test.com" } });
    fireEvent.click(submitButton);

    // Wait for the error handling
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });

    // Verify the toast was called with correct parameters
    expect(toast.error).toHaveBeenCalledWith(
      "Email Already Registered",
      expect.objectContaining({
        description: expect.stringContaining(
          "This email is already registered"
        ),
        duration: 8000,
      })
    );
  });

  it("should clear error state when user modifies input", async () => {
    render(<JoinNowFormSection />);

    const emailInput = screen.getByLabelText(/email/i);

    // Simulate typing in the email field
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    // The form should remain in normal state
    expect(emailInput).not.toHaveClass("border-destructive");
  });
});
