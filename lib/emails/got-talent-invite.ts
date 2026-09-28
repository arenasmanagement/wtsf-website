// Sent to a Got Talent admin when invited to set up their account.

export interface GotTalentInviteEmailData {
  recipientEmail: string;
  recipientName: string;
  setupUrl: string;
  expiresHours: number;
}

export function buildGotTalentInviteEmail(data: GotTalentInviteEmailData): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "Set Up Your WTSF Got Talent Admin Access";

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>${subject}</title></head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:6px;overflow:hidden;border:1px solid #ddd;">

          <!-- Header -->
          <tr>
            <td style="background-color:#2C4A2E;padding:24px 32px;">
              <p style="margin:0;color:#D4A827;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-family:Arial,sans-serif;">West Tennessee State Fair</p>
              <h2 style="margin:6px 0 0;color:#F5EDD4;font-size:22px;font-family:Georgia,serif;font-weight:normal;">You've been invited to manage<br>WTSF Got Talent</h2>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 20px;font-size:15px;color:#1a1a1a;line-height:1.65;font-family:Arial,sans-serif;">
                ${data.recipientName},
              </p>
              <p style="margin:0 0 20px;font-size:15px;color:#1a1a1a;line-height:1.65;font-family:Arial,sans-serif;">
                You've been given administrative access to <strong>WTSF Got Talent</strong> for the 2026 West Tennessee State Fair.
              </p>
              <p style="margin:0 0 28px;font-size:15px;color:#1a1a1a;line-height:1.65;font-family:Arial,sans-serif;">
                Use the button below to create your password and activate your account.
              </p>

              <!-- CTA -->
              <div style="text-align:center;margin:0 0 28px;">
                <a href="${data.setupUrl}"
                   style="display:inline-block;background-color:#2C4A2E;color:#F5EDD4;text-decoration:none;padding:16px 36px;border-radius:4px;font-size:15px;font-weight:bold;letter-spacing:0.5px;font-family:Arial,sans-serif;">
                  CREATE MY PASSWORD
                </a>
              </div>

              <p style="margin:0 0 20px;font-size:14px;color:#444;line-height:1.65;font-family:Arial,sans-serif;">
                After setting your password, you'll be able to securely view confirmed Got Talent registrations and contestant information.
              </p>

              <p style="margin:0 0 20px;font-size:14px;color:#666;line-height:1.65;font-family:Arial,sans-serif;">
                This setup link is for you only and will expire for security purposes.
              </p>

              <p style="margin:0;font-size:13px;color:#999;line-height:1.65;font-family:Arial,sans-serif;">
                If you weren't expecting this invitation, you can ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#2C4A2E;padding:20px 32px;text-align:center;">
              <p style="margin:0 0 4px;color:#D4A827;font-size:12px;font-family:Arial,sans-serif;font-weight:bold;">West Tennessee State Fair</p>
              <p style="margin:0;color:#B8C4A0;font-size:12px;font-family:Arial,sans-serif;">October 15–24, 2026 &nbsp;·&nbsp; Henderson, Tennessee</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `Set Up Your WTSF Got Talent Admin Access

${data.recipientName},

You've been given administrative access to WTSF Got Talent for the 2026 West Tennessee State Fair.

Use the link below to create your password and activate your account:

${data.setupUrl}

After setting your password, you'll be able to securely view confirmed Got Talent registrations and contestant information.

This setup link is for you only and will expire for security purposes.

If you weren't expecting this invitation, you can ignore this email.

West Tennessee State Fair
October 15–24, 2026 · Henderson, Tennessee`;

  return { subject, html, text };
}
