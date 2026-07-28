// Announcement email sent to confirmed subscribers when an admin publishes.

const FAIR_YEAR = 2026;

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

interface AnnouncementEmailData {
  title: string;
  category: string;
  summary: string;
  body: string;
  unsubscribeUrl: string;
  siteUrl: string;
}

export function buildAnnouncementEmail(data: AnnouncementEmailData): {
  subject: string;
  html: string;
  text: string;
} {
  const { title, category, summary, body, unsubscribeUrl, siteUrl } = data;
  const categoryLabel = CATEGORY_LABELS[category] ?? category;

  // Convert newlines in body to <br> for HTML display
  const bodyHtml = body
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n\n/g, "</p><p style=\"margin:0 0 16px;font-size:14px;line-height:1.7;color:#3D3026\">")
    .replace(/\n/g, "<br>");

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
        <p style="margin:0 0 6px;font-size:11px;font-weight:bold;letter-spacing:0.2em;color:#D4A827;text-transform:uppercase">West Tennessee State Fair ${FAIR_YEAR} · ${categoryLabel}</p>
        <h1 style="margin:0;font-size:22px;font-style:italic;color:#F5EDD4;line-height:1.3">${title}</h1>
      </td>
    </tr>

    <!-- Summary callout -->
    <tr>
      <td style="background:#F5EDD4;border-bottom:1px solid #E8DFC8;padding:20px 32px">
        <p style="margin:0;font-size:15px;line-height:1.7;color:#2C4A2E;font-style:italic">${summary}</p>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding:32px">
        <p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#3D3026">${bodyHtml}</p>

        <!-- CTA -->
        <table cellpadding="0" cellspacing="0" style="margin:28px 0 0">
          <tr>
            <td style="background:#2C4A2E;text-align:center">
              <a href="${siteUrl}" style="display:inline-block;padding:13px 32px;font-size:13px;font-weight:bold;letter-spacing:0.1em;text-transform:uppercase;color:#D4A827;text-decoration:none">
                Visit wtsfair.com
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Social -->
    <tr>
      <td style="background:#FDFAF3;border-top:1px solid #E8DFC8;padding:16px 32px;text-align:center">
        <p style="margin:0;font-size:12px;color:#8B7355">
          Follow us for daily updates:&nbsp;&nbsp;
          <a href="https://www.facebook.com/WTSFAIR" style="color:#2C4A2E;font-weight:bold">Facebook</a>
          &nbsp;·&nbsp;
          <a href="https://www.instagram.com/westtnstatefair" style="color:#2C4A2E;font-weight:bold">Instagram</a>
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background:#1E3320;padding:20px 32px;text-align:center">
        <p style="margin:0 0 4px;font-size:12px;color:#A8BFA9">West Tennessee State Fair · 575 Fourth Street · Henderson, TN 38340</p>
        <p style="margin:0 0 8px;font-size:12px;color:#A8BFA9">
          <a href="mailto:wtsfair@gmail.com" style="color:#D4A827">wtsfair@gmail.com</a>
          &nbsp;·&nbsp;
          <a href="${siteUrl}" style="color:#D4A827">wtsfair.com</a>
        </p>
        <p style="margin:0;font-size:11px;color:#6B8F6C">
          You're receiving this because you subscribed for ${categoryLabel} updates.&nbsp;&nbsp;
          <a href="${unsubscribeUrl}" style="color:#A8BFA9;text-decoration:underline">Unsubscribe</a>
        </p>
      </td>
    </tr>

  </table>
</td></tr>
</table>
</body>
</html>`;

  const text = `WEST TENNESSEE STATE FAIR ${FAIR_YEAR}
${categoryLabel.toUpperCase()}

${title}

${summary}

${body}

Visit wtsfair.com for more information: ${siteUrl}

Follow us:
  Facebook: https://www.facebook.com/WTSFAIR
  Instagram: https://www.instagram.com/westtnstatefair

─────────────────────────────────────────────
West Tennessee State Fair · 575 Fourth Street · Henderson, TN 38340
wtsfair@gmail.com

You're receiving this because you subscribed for ${categoryLabel} updates.
Unsubscribe: ${unsubscribeUrl}`;

  return {
    subject: `${title} — West Tennessee State Fair ${FAIR_YEAR}`,
    html,
    text,
  };
}
