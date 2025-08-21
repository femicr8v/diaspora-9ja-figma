import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Protect the thank-you page
  if (request.nextUrl.pathname === "/thank-you") {
    const sessionId = request.nextUrl.searchParams.get("session_id");
    const email = request.nextUrl.searchParams.get("email");

    // If no session_id or email parameter, redirect to payment page
    if (!sessionId && !email) {
      return NextResponse.redirect(new URL("/join-the-community", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/thank-you"],
};
