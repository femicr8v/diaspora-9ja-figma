import Link from "next/link";

export default function ThankYouPage() {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-3xl font-bold">🎉 Thank you!</h1>
      <p className="mt-2">
        Your payment was successful. Check your email for a receipt.
      </p>
      <Link href="/" className="mt-6 underline">
        Back to home
      </Link>
    </main>
  );
}
