/**
 * Notification email sent to Food Vendor Coordinators when an inquiry is submitted.
 * Reply-To is set to the inquirer's email so coordinators can reply directly.
 */
import { FAIR_CONFIG } from "@/lib/fair-config";

const YEAR = FAIR_CONFIG.year;

export interface FoodVendorInquiryData {
  name: string;
  businessName: string;
  email: string;
  phone: string;
  message: string;
  submittedAt: string;
}

export function buildFoodVendorInquiryEmail(data: FoodVendorInquiryData): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = `Food Vendor Inquiry — WTSF ${YEAR} — ${data.businessName}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#F5EDD4;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5EDD4;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:640px;background:#FDFAF3;border:1px solid #E8DFC8;">

          <!-- Header -->
          <tr>
            <td style="background:#2C4A2E;padding:28px 32px;">
              <p style="margin:0 0 4px 0;font-size:11px;letter-spacing:0.2em;color:#D4A827;text-transform:uppercase;font-family:Arial,Helvetica,sans-serif;">
                West Tennessee State Fair ${YEAR}
              </p>
              <h1 style="margin:0;font-size:22px;font-style:italic;color:#F5EDD4;font-family:Georgia,'Times New Roman',serif;">
                Food Vendor Inquiry
              </h1>
              <p style="margin:8px 0 0 0;font-size:12px;color:#A8C5AA;font-family:Arial,Helvetica,sans-serif;">
                Submitted ${data.submittedAt} (Central Time)
              </p>
            </td>
          </tr>

          <!-- Reply-To notice -->
          <tr>
            <td style="background:#F0F7F0;border-bottom:1px solid #E8DFC8;padding:14px 32px;">
              <p style="margin:0;font-size:13px;color:#2C4A2E;font-family:Arial,Helvetica,sans-serif;">
                <strong>Reply to this email to respond directly to the inquirer.</strong>
              </p>
            </td>
          </tr>

          <!-- Contact info -->
          <tr>
            <td style="padding:28px 32px 0;">
              <p style="margin:0 0 4px 0;font-size:10px;letter-spacing:0.18em;color:#8B7355;text-transform:uppercase;font-family:Arial,Helvetica,sans-serif;">
                Inquirer Contact
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E8DFC8;">
                <tr>
                  <td style="padding:10px 14px;border-bottom:1px solid #E8DFC8;background:#F5EDD4;">
                    <span style="font-size:11px;color:#8B7355;font-family:Arial,sans-serif;display:block;margin-bottom:2px;">Name</span>
                    <strong style="font-size:14px;color:#2C4A2E;font-family:Georgia,serif;">${escapeHtml(data.name)}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 14px;border-bottom:1px solid #E8DFC8;">
                    <span style="font-size:11px;color:#8B7355;font-family:Arial,sans-serif;display:block;margin-bottom:2px;">Business / Food Vendor Name</span>
                    <strong style="font-size:14px;color:#2C4A2E;font-family:Georgia,serif;">${escapeHtml(data.businessName)}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 14px;border-bottom:1px solid #E8DFC8;background:#F5EDD4;">
                    <span style="font-size:11px;color:#8B7355;font-family:Arial,sans-serif;display:block;margin-bottom:2px;">Email (Reply-To)</span>
                    <a href="mailto:${escapeHtml(data.email)}" style="font-size:14px;color:#2C4A2E;font-family:Georgia,serif;font-weight:bold;text-decoration:none;">
                      ${escapeHtml(data.email)}
                    </a>
                  </td>
                </tr>
                ${
                  data.phone
                    ? `<tr>
                  <td style="padding:10px 14px;border-bottom:1px solid #E8DFC8;">
                    <span style="font-size:11px;color:#8B7355;font-family:Arial,sans-serif;display:block;margin-bottom:2px;">Phone</span>
                    <strong style="font-size:14px;color:#2C4A2E;font-family:Georgia,serif;">${escapeHtml(data.phone)}</strong>
                  </td>
                </tr>`
                    : ""
                }
              </table>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="padding:24px 32px 0;">
              <p style="margin:0 0 4px 0;font-size:10px;letter-spacing:0.18em;color:#8B7355;text-transform:uppercase;font-family:Arial,Helvetica,sans-serif;">
                Message / What they sell
              </p>
              <div style="border:1px solid #E8DFC8;background:#F5EDD4;padding:14px;font-size:14px;color:#2C4A2E;font-family:Georgia,serif;white-space:pre-wrap;line-height:1.6;">
${escapeHtml(data.message)}
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:28px 32px;border-top:1px solid #E8DFC8;margin-top:28px;">
              <p style="margin:0;font-size:12px;color:#8B7355;font-family:Arial,Helvetica,sans-serif;">
                This inquiry was submitted through the West Tennessee State Fair website
                (<a href="https://www.wtsfair.com" style="color:#8B7355;">wtsfair.com</a>).
                Hit Reply to respond directly to ${escapeHtml(data.name)}.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `FOOD VENDOR INQUIRY — WTSF ${YEAR}
Submitted: ${data.submittedAt} (Central Time)

Reply to this email to respond directly to the inquirer.

─────────────────────────────────────────
INQUIRER CONTACT
─────────────────────────────────────────
Name:              ${data.name}
Business Name:     ${data.businessName}
Email (Reply-To):  ${data.email}${data.phone ? `\nPhone:             ${data.phone}` : ""}

─────────────────────────────────────────
MESSAGE / WHAT THEY SELL
─────────────────────────────────────────
${data.message}

─────────────────────────────────────────
This inquiry was submitted via wtsfair.com.
Hit Reply to respond directly to ${data.name}.
`;

  return { subject, html, text };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
