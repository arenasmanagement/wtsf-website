import Link from "next/link";

export const metadata = {
  title: "Unsubscribed — West Tennessee State Fair",
  robots: { index: false, follow: false },
};

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  const isSuccess = status === "success" || status === "already";

  const content = {
    success: {
      heading: "You've Been Unsubscribed",
      body: "You will no longer receive fair update emails. Your information remains on file in case you choose to resubscribe.",
    },
    already: {
      heading: "Already Unsubscribed",
      body: "This email address is already unsubscribed. You will not receive any further update emails.",
    },
    invalid: {
      heading: "Link Not Recognized",
      body: "This unsubscribe link is invalid or could not be found. If you're still receiving emails and would like to stop, please email wtsfair@gmail.com.",
    },
    error: {
      heading: "Something Went Wrong",
      body: "We were unable to process your unsubscribe request. Please email wtsfair@gmail.com for assistance.",
    },
  }[status ?? "invalid"] ?? {
    heading: "Link Not Recognized",
    body: "This unsubscribe link is invalid.",
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20 px-4" style={{ backgroundColor: "#F5EDD4" }}>
      <div className="w-full max-w-md text-center">
        {/* Icon */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold"
          style={{
            backgroundColor: isSuccess ? "#F5EDD4" : "#FEE2E2",
            color: isSuccess ? "#2C4A2E" : "#991B1B",
            border: isSuccess ? "2px solid #D4A827" : "2px solid #FECACA",
          }}
        >
          {isSuccess ? "✓" : "!"}
        </div>

        <p className="section-label mb-3">West Tennessee State Fair 2026</p>

        <h1
          className="text-3xl font-bold italic mb-4"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2C4A2E" }}
        >
          {content.heading}
        </h1>

        <p className="text-base leading-relaxed mb-8" style={{ color: "#5C4A32" }}>
          {content.body}
        </p>

        <Link
          href="/"
          className="inline-block px-8 py-3 text-sm font-bold tracking-wider uppercase transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#2C4A2E", color: "#D4A827", letterSpacing: "0.08em" }}
        >
          Back to the Fair
        </Link>
      </div>
    </div>
  );
}
