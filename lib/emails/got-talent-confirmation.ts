// Sent to the primary contact after Square payment succeeds (status → CONFIRMED).

export interface GotTalentConfirmationEmailData {
  contactName: string;
  contactEmail: string;
  actName: string;
  actType: string;
  divisionLabel: string;
  performanceDate: string;
  performanceTime: string;
  requiresMusic: boolean;
  amountPaidCents: number;
  registrationId: string;
  confirmedAt: Date;
}

function formatDollars(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function buildGotTalentConfirmationEmail(data: GotTalentConfirmationEmailData): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = `Registration Confirmed — ${data.actName} · WTSF Got Talent 2026`;

  const musicRow = data.requiresMusic
    ? `<tr>
        <td style="padding:6px 0;color:#5C4A32;font-size:14px;font-family:Georgia,serif;border-bottom:1px solid #E8DFC8;"><strong>Music/Audio</strong></td>
        <td style="padding:6px 0 6px 16px;color:#2C4A2E;font-size:14px;font-family:Georgia,serif;border-bottom:1px solid #E8DFC8;">Required — bring your track on a USB drive or your phone</td>
       </tr>`
    : `<tr>
        <td style="padding:6px 0;color:#5C4A32;font-size:14px;font-family:Georgia,serif;border-bottom:1px solid #E8DFC8;"><strong>Music/Audio</strong></td>
        <td style="padding:6px 0 6px 16px;color:#2C4A2E;font-size:14px;font-family:Georgia,serif;border-bottom:1px solid #E8DFC8;">Not required</td>
       </tr>`;

  const musicText = data.requiresMusic
    ? "Music/Audio: Required — bring your track on a USB drive or your phone"
    : "Music/Audio: Not required";

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
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border:2px solid #D4A827;border-radius:8px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background-color:#2C4A2E;padding:32px 40px;text-align:center;">
              <p style="margin:0 0 4px 0;color:#D4A827;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-family:Georgia,serif;">West Tennessee State Fair · 2026</p>
              <h1 style="margin:0;color:#F5EDD4;font-size:26px;font-family:Georgia,serif;font-weight:700;">Registration Confirmed</h1>
              <p style="margin:8px 0 0 0;color:#E8DFC8;font-size:14px;font-family:Georgia,serif;">WTSF Got Talent</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 20px 0;color:#5C4A32;font-size:16px;font-family:Georgia,serif;">
                Dear ${data.contactName},
              </p>
              <p style="margin:0 0 24px 0;color:#2C4A2E;font-size:16px;font-family:Georgia,serif;">
                You're officially in! <strong>${data.actName}</strong> is registered and confirmed for WTSF Got Talent 2026. We can't wait to see what you've got!
              </p>

              <!-- Registration details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5EDD4;border:1px solid #D4A827;border-radius:6px;margin-bottom:28px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 12px 0;color:#2C4A2E;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;font-family:Georgia,serif;font-weight:700;">Registration Details</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:6px 0;color:#5C4A32;font-size:14px;font-family:Georgia,serif;border-bottom:1px solid #E8DFC8;"><strong>Act / Group Name</strong></td>
                        <td style="padding:6px 0 6px 16px;color:#2C4A2E;font-size:14px;font-family:Georgia,serif;border-bottom:1px solid #E8DFC8;">${data.actName}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;color:#5C4A32;font-size:14px;font-family:Georgia,serif;border-bottom:1px solid #E8DFC8;"><strong>Talent Type</strong></td>
                        <td style="padding:6px 0 6px 16px;color:#2C4A2E;font-size:14px;font-family:Georgia,serif;border-bottom:1px solid #E8DFC8;">${data.actType}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;color:#5C4A32;font-size:14px;font-family:Georgia,serif;border-bottom:1px solid #E8DFC8;"><strong>Division</strong></td>
                        <td style="padding:6px 0 6px 16px;color:#2C4A2E;font-size:14px;font-family:Georgia,serif;border-bottom:1px solid #E8DFC8;">${data.divisionLabel}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;color:#5C4A32;font-size:14px;font-family:Georgia,serif;border-bottom:1px solid #E8DFC8;"><strong>Performance Date</strong></td>
                        <td style="padding:6px 0 6px 16px;color:#2C4A2E;font-size:14px;font-family:Georgia,serif;border-bottom:1px solid #E8DFC8;">${data.performanceDate}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;color:#5C4A32;font-size:14px;font-family:Georgia,serif;border-bottom:1px solid #E8DFC8;"><strong>Check-In Time</strong></td>
                        <td style="padding:6px 0 6px 16px;color:#2C4A2E;font-size:14px;font-family:Georgia,serif;border-bottom:1px solid #E8DFC8;">${data.performanceTime}</td>
                      </tr>
                      ${musicRow}
                      <tr>
                        <td style="padding:6px 0;color:#5C4A32;font-size:14px;font-family:Georgia,serif;"><strong>Entry Fee</strong></td>
                        <td style="padding:6px 0 6px 16px;color:#2C4A2E;font-size:14px;font-family:Georgia,serif;">${formatDollars(data.amountPaidCents)} — Paid</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              ${data.requiresMusic ? `<!-- Music reminder -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FFF8E7;border-left:4px solid #D4A827;border-radius:4px;margin-bottom:24px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 6px 0;color:#8B6914;font-size:13px;font-family:Georgia,serif;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Music / Audio Reminder</p>
                    <p style="margin:0;color:#5C4A32;font-size:14px;font-family:Georgia,serif;">Please bring your performance track on a <strong>USB/jump drive</strong> or your <strong>phone</strong> with the track downloaded and ready to play. Do not rely on streaming. Our sound team will be ready to assist.</p>
                  </td>
                </tr>
              </table>` : ""}

              <p style="margin:0 0 16px 0;color:#5C4A32;font-size:14px;font-family:Georgia,serif;">
                We'll share additional details about check-in and the performance schedule closer to the event. Save this email for your records.
              </p>

              <p style="margin:0 0 32px 0;color:#5C4A32;font-size:14px;font-family:Georgia,serif;">
                Questions? Reply to this email or visit <a href="https://wtsfair.com/got-talent" style="color:#2C4A2E;">wtsfair.com/got-talent</a>.
              </p>

              <p style="margin:0;color:#5C4A32;font-size:14px;font-family:Georgia,serif;">
                See you at the Fair!<br/>
                <strong>West Tennessee State Fair</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#1E3320;padding:24px 40px;text-align:center;">
              <p style="margin:0 0 4px 0;color:#E8DFC8;font-size:12px;font-family:Georgia,serif;">West Tennessee State Fair — Got Talent 2026</p>
              <p style="margin:0;color:#A89070;font-size:11px;font-family:Georgia,serif;">Registration ID: ${data.registrationId.slice(0, 8).toUpperCase()}</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `Registration Confirmed — WTSF Got Talent 2026

Dear ${data.contactName},

You're officially in! ${data.actName} is registered and confirmed for WTSF Got Talent 2026.

REGISTRATION DETAILS
Act / Group Name: ${data.actName}
Talent Type: ${data.actType}
Division: ${data.divisionLabel}
Performance Date: ${data.performanceDate}
Check-In Time: ${data.performanceTime}
${musicText}
Entry Fee: ${formatDollars(data.amountPaidCents)} — Paid

${data.requiresMusic ? `MUSIC / AUDIO REMINDER
Please bring your performance track on a USB/jump drive or your phone with the track downloaded and ready to play. Do not rely on streaming.

` : ""}Questions? Visit wtsfair.com/got-talent

See you at the Fair!
West Tennessee State Fair

Registration ID: ${data.registrationId.slice(0, 8).toUpperCase()}`;

  return { subject, html, text };
}
