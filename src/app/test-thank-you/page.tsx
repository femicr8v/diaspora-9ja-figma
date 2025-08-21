"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestThankYouPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Test Thank You Page Protection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Test the thank-you page protection with different scenarios:
          </p>

          <div className="space-y-2">
            <Link href="/thank-you" className="block">
              <Button variant="outline" className="w-full">
                Access without payment (should be blocked)
              </Button>
            </Link>

            <Link
              href="/thank-you?session_id=cs_test_fake_session"
              className="block"
            >
              <Button variant="outline" className="w-full">
                Access with fake session_id (should be blocked)
              </Button>
            </Link>

            <Link href="/thank-you?email=test@example.com" className="block">
              <Button variant="outline" className="w-full">
                Access with test email (should be blocked unless paid)
              </Button>
            </Link>
          </div>

          <div className="pt-4 border-t">
            <Link href="/join-the-community">
              <Button className="w-full">Go to Payment Page</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
