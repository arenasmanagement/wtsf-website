// Sent to a new admin account to let them set their own password.

export function buildPageantInviteEmail(data: {
  recipientEmail: string;
  setupUrl: string;
  expiresHours: number;
}): { subject: string; html: string; text: string } {
  const subject = "Set Up Your West Tennessee State Fair Pageants Account";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#F5EDD4;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5EDD4;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background-color:#ffffff;border:2px solid #D4A827;border-radius:8px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background-color:#2C4A2E;padding:28px 32px;text-align:center;">
              <p style="margin:0;color:#D4A827;font-size:11px;letter-spacing:2px;text-transform:uppercase;">West Tennessee State Fair</p>
              <h1 style="margin:8px 0 0;color:#F5EDD4;font-size:22px;font-weight:normal;">Traditional Pageants</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 32px;">
              <p style="margin:0 0 16px;color:#2C4A2E;font-size:16px;">Hello,</p>
              <p style="margin:0 0 16px;color:#5C4A32;font-size:15px;line-height:1.6;">
                An administrator account has been created for you on the West Tennessee State Fair
                pageants management portal. Please use the button below to set your password and
                activate your account.
              </p>
              <p style="margin:0 0 28px;color:#5C4A32;font-size:15px;line-height:1.6;">
                This link will expire in <strong>${data.expiresHours} hours</strong>.
                Do not share it with anyone.
              </p>

              <!-- CTA -->
              <table cellpadding="0" cellspacing="0" style="margin:0 auto 28px;">
                <tr>
                  <td style="background-color:#2C4A2E;border-radius:4px;">
                    <a href="${data.setupUrl}"
                       style="display:block;padding:14px 32px;color:#F5EDD4;font-size:15px;font-weight:bold;text-decoration:none;font-family:Georgia,serif;">
                      Set My Password →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px;color:#8B7355;font-size:13px;">
                If the button does not work, copy and paste this URL into your browser:
              </p>
              <p style="margin:0 0 24px;word-break:break-all;color:#2C4A2E;font-size:12px;font-family:monospace;">
                ${data.setupUrl}
              </p>

              <hr style="border:none;border-top:1px solid #E8DFC8;margin:24px 0;" />
              <p style="margin:0;color:#8B7355;font-size:13px;line-height:1.5;">
                If you did not expect this email, please disregard it. No account will be
                activated until you set a password using the link above.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#F5EDD4;padding:20px 32px;text-align:center;border-top:1px solid #E8DFC8;">
              <p style="margin:0;color:#8B7355;font-size:12px;">
                West Tennessee State Fair · Henderson, Tennessee
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `Set Up Your West Tennessee State Fair Pageants Account

An administrator account has been created for you on the West Tennessee State Fair pageants management portal.

Please visit the link below to set your password and activate your account.
This link expires in ${data.expiresHours} hours. Do not share it with anyone.

${data.setupUrl}

If you did not expect this email, please disregard it.

West Tennessee State Fair · Henderson, Tennessee`;

  return { subject, html, text };
}
