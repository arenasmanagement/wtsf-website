// Double opt-in confirmation email sent to new subscribers.

const FAIR_YEAR = 2026;

interface OptInEmailData {
  confirmUrl: string;
  categories: string[];
  siteUrl: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  entertainment: "Entertainment",
  tickets:       "Tickets & Promotions",
  exhibits:      "Exhibits",
  livestock:     "Livestock",
  pageants:      "Pageants",
  vendors:       "Vendors",
  volunteers:    "Volunteers",
  general:       "General Fair News",
};

export function buildOptInEmail(data: OptInEmailData): {
  subject: string;
  html: string;
  text: string;
} {
  const { confirmUrl, categories, siteUrl } = data;
  const categoryList = categories
    .map((c) => CATEGORY_LABELS[c] ?? c)
    .join(", ");

  const categoryItems = categories
    .map((c) => `<li style="margin:0 0 4px;font-size:13px;color:#5C4A32">• ${CATEGORY_LABELS[c] ?? c}</li>`)
    .join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F5EDD4;font-family:Georgia,serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F5EDD4;padding:32px 16px">
<tr><td>
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;margin:0 auto;background:#fff;border:1px solid #E8DFC8">

    <!-- Header -->
    <tr>
      <td style="background:#2C4A2E;padding:28px 32px;text-align:center">
        <p style="margin:0 0 4px;font-size:11px;font-weight:bold;letter-spacing:0.2em;color:#D4A827;text-transform:uppercase">West Tennessee State Fair ${FAIR_YEAR}</p>
        <h1 style="margin:0;font-size:22px;font-style:italic;color:#F5EDD4">Confirm Your Subscription</h1>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding:36px 32px">
        <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#2C4A2E">
          You're one step away from receiving updates about the ${FAIR_YEAR} West Tennessee State Fair.
        </p>
        <p style="margin:0 0 20px;font-size:14px;line-height:1.7;color:#3D3026">
          You selected updates for:
        </p>
        <ul style="margin:0 0 24px;padding:0;list-style:none">
          ${categoryItems}
        </ul>
        <p style="margin:0 0 28px;font-size:14px;line-height:1.7;color:#5C4A32">
          Click the button below to confirm your subscription. If you did not request this, simply ignore this email — you will not receive any further messages.
        </p>

        <!-- CTA -->
        <table cellpadding="0" cellspacing="0" style="margin:0 auto 28px">
          <tr>
            <td style="background:#2C4A2E;text-align:center">
              <a href="${confirmUrl}" style="display:inline-block;padding:14px 36px;font-size:13px;font-weight:bold;letter-spacing:0.1em;text-transform:uppercase;color:#D4A827;text-decoration:none">
                Confirm Subscription
              </a>
            </td>
          </tr>
        </table>

        <p style="margin:0;font-size:12px;line-height:1.6;color:#8B7355;text-align:center">
          Or copy and paste this link into your browser:<br>
          <a href="${confirmUrl}" style="color:#2C4A2E;word-break:break-all">${confirmUrl}</a>
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background:#1E3320;padding:20px 32px;text-align:center">
        <p style="margin:0 0 4px;font-size:12px;color:#A8BFA9">West Tennessee State Fair · 575 Fourth Street · Henderson, TN 38340</p>
        <p style="margin:0;font-size:12px;color:#A8BFA9">
          <a href="mailto:wtsfair@gmail.com" style="color:#D4A827">wtsfair@gmail.com</a>
          &nbsp;·&nbsp;
          <a href="${siteUrl}" style="color:#D4A827">wtsfair.com</a>
        </p>
        <p style="margin:8px 0 0;font-size:11px;color:#6B8F6C">
          You received this because someone subscribed with this email address.
        </p>
      </td>
    </tr>

  </table>
</td></tr>
</table>
</body>
</html>`;

  const text = `WEST TENNESSEE STATE FAIR ${FAIR_YEAR}
Confirm Your Subscription

You're one step away from receiving updates about the ${FAIR_YEAR} West Tennessee State Fair.

You selected updates for: ${categoryList}

Confirm your subscription by visiting this link:
${confirmUrl}

If you did not request this, simply ignore this email.

West Tennessee State Fair · 575 Fourth Street · Henderson, TN 38340
wtsfair@gmail.com · wtsfair.com`;

  return {
    subject: `Confirm your subscription — West Tennessee State Fair ${FAIR_YEAR}`,
    html,
    text,
  };
}
