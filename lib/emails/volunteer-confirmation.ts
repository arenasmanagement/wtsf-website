// Confirmation email sent to the volunteer applicant after a successful submission.
import { FAIR_CONFIG } from "@/lib/fair-config";

const YEAR = FAIR_CONFIG.year;

export interface VolunteerConfirmationData {
  submittedAt: string;
  applicantName: string;
  fullName: string;
  email: string;
  preferredAreaLabel: string;
  availableDays: string[];
}

export function buildVolunteerConfirmationEmail(data: VolunteerConfirmationData): {
  subject: string; html: string; text: string;
} {
  const { applicantName, fullName, preferredAreaLabel, availableDays, submittedAt } = data;

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:24px 16px">
<tr><td>
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#fff;border:1px solid #ddd">
    <tr>
      <td style="background:#2C4A2E;padding:20px 28px">
        <p style="margin:0 0 2px;font-size:10px;font-weight:bold;letter-spacing:0.2em;color:#D4A827;text-transform:uppercase">West Tennessee State Fair ${YEAR}</p>
        <h1 style="margin:0;font-size:18px;color:#F5EDD4;font-family:Georgia,serif;font-style:italic">Volunteer Interest Received</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:28px 28px 20px">
        <p style="margin:0 0 14px;font-size:15px;color:#2C4A2E">Dear ${applicantName},</p>
        <p style="margin:0 0 14px;font-size:14px;line-height:1.6;color:#5C4A32">
          Thank you for your interest in volunteering with the West Tennessee State Fair. Your information has been received and will be reviewed by the fair team.
        </p>
        <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#5C4A32;font-weight:bold">
          Submission of this form does not guarantee a volunteer assignment. Volunteer roles and schedules depend on fair needs and availability. We may contact you for additional information.
        </p>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;background:#F5EDD4;border-left:4px solid #D4A827">
          <tr><td style="padding:16px 20px">
            <p style="margin:0 0 6px;font-size:11px;font-weight:bold;letter-spacing:0.12em;color:#8B7355;text-transform:uppercase">Your Submission Summary</p>
            <p style="margin:0 0 4px;font-size:13px;color:#5C4A32"><strong>Name:</strong> ${fullName}</p>
            <p style="margin:0 0 4px;font-size:13px;color:#5C4A32"><strong>Preferred Area:</strong> ${preferredAreaLabel}</p>
            <p style="margin:0 0 4px;font-size:13px;color:#5C4A32"><strong>Available Days:</strong> ${availableDays.join(", ")}</p>
            <p style="margin:0;font-size:11px;color:#8B7355">Submitted: ${submittedAt}</p>
          </td></tr>
        </table>

        <p style="margin:0 0 14px;font-size:14px;line-height:1.6;color:#5C4A32">
          If you have questions about volunteering, you can reach us at
          <a href="mailto:wtsfair@gmail.com" style="color:#2C4A2E;font-weight:bold">wtsfair@gmail.com</a>.
        </p>
        <p style="margin:0;font-size:14px;line-height:1.6;color:#5C4A32">
          We appreciate your willingness to support the West Tennessee State Fair — it is community members like you who make this tradition possible.
        </p>
      </td>
    </tr>
    <tr>
      <td style="background:#1E3320;padding:14px 28px;text-align:center">
        <p style="margin:0;font-size:11px;color:#A8BFA9">West Tennessee State Fair · Henderson, TN · ${YEAR}</p>
        <p style="margin:4px 0 0;font-size:11px;color:#A8BFA9">This is an automated confirmation. Submission does not guarantee placement.</p>
      </td>
    </tr>
  </table>
</td></tr>
</table>
</body>
</html>`;

  const text = `VOLUNTEER INTEREST RECEIVED — WTSF ${YEAR}

Dear ${applicantName},

Thank you for your interest in volunteering with the West Tennessee State Fair. Your information has been received and will be reviewed by the fair team.

IMPORTANT: Submission of this form does not guarantee a volunteer assignment. Volunteer roles and schedules depend on fair needs and availability. We may contact you for additional information.

YOUR SUBMISSION:
  Name:           ${fullName}
  Preferred Area: ${preferredAreaLabel}
  Available Days: ${availableDays.join(", ")}
  Submitted:      ${submittedAt}

Questions? Contact us at wtsfair@gmail.com.

We appreciate your willingness to support the West Tennessee State Fair — it is community members like you who make this tradition possible.

West Tennessee State Fair · Henderson, TN · ${YEAR}`;

  return {
    subject: `Your WTSF ${YEAR} Volunteer Interest Form — Received`,
    html,
    text,
  };
}
