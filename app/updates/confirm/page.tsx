import Link from "next/link";

export const metadata = {
  title: "Subscription Confirmed — West Tennessee State Fair",
  robots: { index: false, follow: false },
};

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  const content = {
    success: {
      heading: "You're Subscribed",
      body: "Your subscription has been confirmed. You'll receive updates for the topics you selected as soon as new information is announced.",
      icon: "✓",
      iconColor: "#2C4A2E",
      iconBg: "#D1FAE5",
    },
    already: {
      heading: "Already Confirmed",
      body: "Your subscription is already active. You'll continue receiving fair updates for your selected topics.",
      icon: "✓",
      iconColor: "#2C4A2E",
      iconBg: "#D1FAE5",
    },
    invalid: {
      heading: "Link Not Recognized",
      body: "This confirmation link is invalid or has already been used. If you believe this is an error, please subscribe again.",
      icon: "!",
      iconColor: "#991B1B",
      iconBg: "#FEE2E2",
    },
    error: {
      heading: "Something Went Wrong",
      body: "We were unable to confirm your subscription. Please try again or email wtsfair@gmail.com for assistance.",
      icon: "!",
      iconColor: "#991B1B",
      iconBg: "#FEE2E2",
    },
  }[status ?? "invalid"] ?? {
    heading: "Link Not Recognized",
    body: "This confirmation link is invalid or has already been used.",
    icon: "!",
    iconColor: "#991B1B",
    iconBg: "#FEE2E2",
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20 px-4" style={{ backgroundColor: "#F5EDD4" }}>
      <div className="w-full max-w-md text-center">
        {/* Icon */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold"
          style={{ backgroundColor: content.iconBg, color: content.iconColor }}
        >
          {content.icon}
        </div>

        {/* Overline */}
        <p className="section-label mb-3">West Tennessee State Fair 2026</p>

        {/* Heading */}
        <h1
          className="text-3xl font-bold italic mb-4"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif", color: "#2C4A2E" }}
        >
          {content.heading}
        </h1>

        {/* Body */}
        <p className="text-base leading-relaxed mb-8" style={{ color: "#5C4A32" }}>
          {content.body}
        </p>

        {/* CTA */}
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
