// Sent to Donna when a super admin triggers /api/got-talent/admin/invite.

export interface GotTalentInviteEmailData {
  recipientEmail: string;
  setupUrl: string;
  expiresHours: number;
}

export function buildGotTalentInviteEmail(data: GotTalentInviteEmailData): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "WTSF Got Talent — Set Up Your Admin Account";

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>${subject}</title></head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:6px;overflow:hidden;border:1px solid #ddd;">
          <tr>
            <td style="background-color:#2C4A2E;padding:20px 28px;">
              <p style="margin:0;color:#D4A827;font-size:11px;letter-spacing:2px;text-transform:uppercase;">West Tennessee State Fair</p>
              <h2 style="margin:4px 0 0;color:#F5EDD4;font-size:20px;">Got Talent Admin Invitation</h2>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;">
              <p style="margin:0 0 16px;font-size:15px;color:#1a1a1a;line-height:1.6;">
                You've been invited to access the <strong>WTSF Got Talent</strong> administration portal.
              </p>
              <p style="margin:0 0 16px;font-size:14px;color:#444;line-height:1.6;">
                Click the button below to set your password and activate your account.
                This link expires in <strong>${data.expiresHours} hours</strong> and can only be used once.
              </p>
              <div style="text-align:center;margin:28px 0;">
                <a href="${data.setupUrl}"
                   style="display:inline-block;background-color:#2C4A2E;color:#F5EDD4;text-decoration:none;padding:14px 32px;border-radius:4px;font-size:15px;font-weight:bold;">
                  Set Up My Account
                </a>
              </div>
              <p style="margin:0 0 8px;font-size:12px;color:#888;line-height:1.5;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="margin:0;font-size:12px;color:#888;word-break:break-all;">
                ${data.setupUrl}
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f4f4f4;padding:16px 28px;text-align:center;">
              <p style="margin:0;font-size:11px;color:#999;">
                If you didn't expect this email, you can safely ignore it.
                Contact the fair administrator if you have questions.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `WTSF Got Talent — Set Up Your Admin Account

You've been invited to access the WTSF Got Talent administration portal.

Click the link below to set your password and activate your account.
This link expires in ${data.expiresHours} hours and can only be used once.

${data.setupUrl}

If you didn't expect this email, you can safely ignore it.`;

  return { subject, html, text };
}
