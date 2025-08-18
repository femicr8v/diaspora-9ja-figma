import { JoinNowButton } from "@/components/join-now-page/JoinNowButton";

export default function TestStripePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Test Stripe Integration
        </h1>
        <JoinNowButton />
      </div>
    </div>
  );
}
