// Confirmation email sent to the applicant after a sponsor application is submitted.
import { FAIR_CONFIG } from "@/lib/fair-config";

const YEAR = FAIR_CONFIG.year;

export interface SponsorConfirmationData {
  submittedAt: string;
  applicantName: string;
  businessName: string;
  email: string;
  packageName: string;
  packagePrice: string;
  notes?: string;
}

export function buildSponsorConfirmationEmail(data: SponsorConfirmationData): {
  subject: string; html: string; text: string;
} {
  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:24px 16px">
<tr><td>
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #ddd">
    <tr>
      <td style="background:#2C4A2E;padding:28px 28px 24px">
        <p style="margin:0 0 4px;font-size:10px;font-weight:bold;letter-spacing:0.2em;color:#D4A827;text-transform:uppercase">${YEAR} West Tennessee State Fair</p>
        <h1 style="margin:0;font-size:22px;color:#F5EDD4;font-family:Georgia,serif;font-style:italic">Application Received</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:28px">

        <p style="margin:0 0 16px;font-size:15px;color:#2C4A2E">Dear ${data.applicantName},</p>
        <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#5C4A32">
          Thank you for your interest in sponsoring the ${YEAR} West Tennessee State Fair.
          Your sponsorship application has been received and will be reviewed by our team.
        </p>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;background:#F5EDD4;border-left:4px solid #D4A827;padding:16px 20px">
          <tr><td>
            <p style="margin:0 0 4px;font-size:11px;font-weight:bold;letter-spacing:0.1em;color:#8B7355;text-transform:uppercase">Your Selected Package</p>
            <p style="margin:0;font-size:18px;font-weight:bold;color:#2C4A2E;font-family:Georgia,serif">${data.packageName}</p>
            <p style="margin:4px 0 0;font-size:15px;font-weight:bold;color:#8B2E2E">${data.packagePrice}</p>
          </td></tr>
        </table>

        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 24px">
          <tr style="background:#F5EDD4"><td style="padding:8px 12px;border:1px solid #E8DFC8;font-size:13px;font-weight:bold;color:#5C4A32;width:40%">Organization / Business</td><td style="padding:8px 12px;border:1px solid #E8DFC8;font-size:13px;color:#2C4A2E">${data.businessName}</td></tr>
          <tr><td style="padding:8px 12px;border:1px solid #E8DFC8;font-size:13px;font-weight:bold;color:#5C4A32">Submitted</td><td style="padding:8px 12px;border:1px solid #E8DFC8;font-size:13px;color:#2C4A2E">${data.submittedAt}</td></tr>
          ${data.notes ? `<tr style="background:#F5EDD4"><td style="padding:8px 12px;border:1px solid #E8DFC8;font-size:13px;font-weight:bold;color:#5C4A32">Notes Submitted</td><td style="padding:8px 12px;border:1px solid #E8DFC8;font-size:13px;color:#2C4A2E">${data.notes}</td></tr>` : ""}
        </table>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;background:#FFF8E8;border:1px solid #E8DFC8;padding:16px 20px">
          <tr><td>
            <p style="margin:0;font-size:13px;line-height:1.6;color:#5C4A32">
              <strong>Please note:</strong> Submission of this form does not guarantee acceptance or confirmation of your sponsorship.
              The West Tennessee State Fair will review your application and contact you to discuss next steps.
            </p>
          </td></tr>
        </table>

        <p style="margin:0 0 8px;font-size:13px;font-weight:bold;color:#2C4A2E;text-transform:uppercase;letter-spacing:0.08em">Questions?</p>
        <p style="margin:0 0 4px;font-size:13px;color:#5C4A32">
          📧 <a href="mailto:wtsfair@gmail.com" style="color:#2C4A2E">wtsfair@gmail.com</a>
        </p>
        <p style="margin:0;font-size:13px;color:#5C4A32">📮 P.O. Box 1404, Jackson, TN 38302</p>

      </td>
    </tr>
    <tr>
      <td style="background:#1E3320;padding:16px 28px;text-align:center">
        <p style="margin:0;font-size:11px;color:#A8BFA9">
          West Tennessee State Fair ${YEAR} · "Back to Our Roots"<br>
          October 15–24, 2026 · Henderson, Tennessee
        </p>
      </td>
    </tr>
  </table>
</td></tr>
</table>
</body>
</html>`;

  const text = `APPLICATION RECEIVED — WTSF ${YEAR} Sponsorship

Dear ${data.applicantName},

Thank you for your interest in sponsoring the ${YEAR} West Tennessee State Fair.
Your application has been received and will be reviewed by our team.

YOUR SELECTED PACKAGE:
  ${data.packageName} — ${data.packagePrice}

DETAILS:
  Organization / Business: ${data.businessName}
  Submitted:  ${data.submittedAt}
  ${data.notes ? `Notes: ${data.notes}` : ""}

IMPORTANT: Submission of this form does not guarantee acceptance or confirmation
of your sponsorship. The West Tennessee State Fair will review your application
and contact you to discuss next steps.

Questions?
  Email:   wtsfair@gmail.com
  Mail:    P.O. Box 1404, Jackson, TN 38302

West Tennessee State Fair ${YEAR} · October 15–24, 2026 · Henderson, Tennessee`;

  return {
    subject: `Your WTSF ${YEAR} Sponsorship Application — ${data.packageName}`,
    html,
    text,
  };
}
