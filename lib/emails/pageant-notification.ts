// Sent to the pageant team (wtsfpageant@outlook.com) after payment is confirmed.

export interface PageantNotificationEmailData {
  registrationId: string;
  divisionId: string;
  divisionName: string;
  contestantFirstName: string;
  contestantLastName: string;
  contestantDob: string;
  guardianName: string;
  guardianRelationship?: string;
  guardianEmail: string;
  guardianPhone: string;
  guardianAddress: string;
  guardianCity: string;
  guardianState: string;
  guardianZip: string;
  amountPaidCents: number;
  squarePaymentId: string;
  createdAt: Date;
  confirmedAt: Date;
  rulesAgreed: boolean;
  mediaReleaseAgreed: boolean;
}

function formatDollars(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatDate(d: Date): string {
  return d.toLocaleString("en-US", {
    timeZone: "America/Chicago",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

export function buildPageantNotificationEmail(data: PageantNotificationEmailData): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = `New Confirmed Registration — ${data.contestantFirstName} ${data.contestantLastName} (${data.divisionName})`;

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:6px 12px 6px 0;color:#8B7355;font-size:13px;font-family:Georgia,serif;white-space:nowrap;vertical-align:top;width:38%;">${label}</td>
      <td style="padding:6px 0;color:#2C4A2E;font-size:14px;font-family:Georgia,serif;font-weight:600;">${value}</td>
    </tr>`;

  const section = (title: string, rows: string) => `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;background:#F5EDD4;border:1px solid #D4A827;border-radius:6px;">
      <tr><td style="padding:12px 20px 0 20px;">
        <h3 style="margin:0 0 10px 0;color:#2C4A2E;font-size:15px;font-family:Georgia,serif;border-bottom:1px solid #E8DFC8;padding-bottom:8px;">${title}</h3>
        <table width="100%" cellpadding="0" cellspacing="0">${rows}</table>
      </td></tr>
      <tr><td style="padding:0 20px 12px 20px;"></td></tr>
    </table>`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1.0" /><title>${subject}</title></head>
<body style="margin:0;padding:0;background-color:#F5EDD4;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5EDD4;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border:2px solid #D4A827;border-radius:8px;overflow:hidden;">

        <!-- Header -->
        <tr>
          <td style="background-color:#2C4A2E;padding:28px 40px;text-align:center;">
            <p style="margin:0 0 4px 0;color:#D4A827;font-size:11px;letter-spacing:2px;text-transform:uppercase;">West Tennessee State Fair — Pageant Team</p>
            <h1 style="margin:0;color:#F5EDD4;font-size:22px;font-family:Georgia,serif;font-weight:700;">New Registration Confirmed</h1>
            <p style="margin:6px 0 0 0;color:#E8DFC8;font-size:13px;">2026 Traditional Pageants</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px 40px;">

            <p style="margin:0 0 24px 0;color:#5C4A32;font-size:15px;">
              A new registration has been confirmed and payment received. Details below.
            </p>

            ${section("Division & Status",
              row("Division", data.divisionName) +
              row("Status", '<span style="background:#D4EDDA;color:#155724;padding:2px 8px;border-radius:4px;font-size:12px;">CONFIRMED — Payment Received</span>') +
              row("Amount Paid", formatDollars(data.amountPaidCents)) +
              row("Square Payment ID", `<code style="font-size:12px;">${data.squarePaymentId}</code>`) +
              row("Submitted", formatDate(data.createdAt)) +
              row("Confirmed", formatDate(data.confirmedAt))
            )}

            ${section("Contestant",
              row("Name", `${data.contestantFirstName} ${data.contestantLastName}`) +
              row("Date of Birth", data.contestantDob)
            )}

            ${section("Parent / Guardian",
              row("Name", data.guardianName) +
              (data.guardianRelationship ? row("Relationship", data.guardianRelationship) : "") +
              row("Email", `<a href="mailto:${data.guardianEmail}" style="color:#2C4A2E;">${data.guardianEmail}</a>`) +
              row("Phone", data.guardianPhone) +
              row("Address", `${data.guardianAddress}<br />${data.guardianCity}, ${data.guardianState} ${data.guardianZip}`)
            )}

            ${section("Acknowledgments",
              row("Rules Agreed", data.rulesAgreed ? "Yes" : "No") +
              row("Media Release", data.mediaReleaseAgreed ? "Yes" : "No")
            )}

            <p style="margin:0;color:#8B7355;font-size:12px;">Registration ID: ${data.registrationId}</p>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background-color:#E8DFC8;padding:16px 40px;text-align:center;border-top:1px solid #D4A827;">
            <p style="margin:0;color:#8B7355;font-size:12px;">West Tennessee State Fair · Pageant Administration System</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `NEW CONFIRMED REGISTRATION — 2026 WTSF Traditional Pageant
${subject}

DIVISION & STATUS
-----------------
Division:         ${data.divisionName}
Status:           CONFIRMED — Payment Received
Amount Paid:      ${formatDollars(data.amountPaidCents)}
Square Payment:   ${data.squarePaymentId}
Submitted:        ${formatDate(data.createdAt)}
Confirmed:        ${formatDate(data.confirmedAt)}

CONTESTANT
----------
Name:             ${data.contestantFirstName} ${data.contestantLastName}
Date of Birth:    ${data.contestantDob}

PARENT / GUARDIAN
-----------------
Name:             ${data.guardianName}${data.guardianRelationship ? `\nRelationship:     ${data.guardianRelationship}` : ""}
Email:            ${data.guardianEmail}
Phone:            ${data.guardianPhone}
Address:          ${data.guardianAddress}
                  ${data.guardianCity}, ${data.guardianState} ${data.guardianZip}

ACKNOWLEDGMENTS
---------------
Rules Agreed:     ${data.rulesAgreed ? "Yes" : "No"}
Media Release:    ${data.mediaReleaseAgreed ? "Yes" : "No"}

Registration ID: ${data.registrationId}
`;

  return { subject, html, text };
}
