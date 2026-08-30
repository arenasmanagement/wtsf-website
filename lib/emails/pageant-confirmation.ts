// Sent to contestant's guardian after payment is confirmed.

export interface PageantConfirmationEmailData {
  guardianName: string;
  guardianEmail: string;
  contestantFirstName: string;
  contestantLastName: string;
  divisionName: string;
  arrivalTime: string;
  competitionTime: string;
  amountPaidCents: number;
  registrationId: string;
  confirmedAt: Date;
}

function formatDollars(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function buildPageantConfirmationEmail(data: PageantConfirmationEmailData): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = `Registration Confirmed — ${data.contestantFirstName} ${data.contestantLastName} · WTSF 2026 Traditional Pageant`;

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
              <p style="margin:0 0 4px 0;color:#D4A827;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-family:Georgia,serif;">West Tennessee State Fair</p>
              <h1 style="margin:0;color:#F5EDD4;font-size:26px;font-family:Georgia,serif;font-weight:700;">Registration Confirmed</h1>
              <p style="margin:8px 0 0 0;color:#E8DFC8;font-size:14px;font-family:Georgia,serif;">2026 Traditional Fair Pageants</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 20px 0;color:#5C4A32;font-size:16px;font-family:Georgia,serif;">
                Dear ${data.guardianName},
              </p>
              <p style="margin:0 0 24px 0;color:#2C4A2E;font-size:16px;font-family:Georgia,serif;">
                We are delighted to confirm that <strong>${data.contestantFirstName} ${data.contestantLastName}</strong> is officially registered for the 2026 West Tennessee State Fair Traditional Pageant. We look forward to welcoming your family!
              </p>

              <!-- Confirmation box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5EDD4;border:1px solid #D4A827;border-radius:6px;margin-bottom:28px;">
                <tr>
                  <td style="padding:24px 28px;">
                    <h2 style="margin:0 0 16px 0;color:#2C4A2E;font-size:18px;font-family:Georgia,serif;border-bottom:1px solid #D4A827;padding-bottom:10px;">
                      Registration Details
                    </h2>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:6px 0;color:#8B7355;font-size:13px;font-family:Georgia,serif;width:40%;vertical-align:top;">Contestant</td>
                        <td style="padding:6px 0;color:#2C4A2E;font-size:14px;font-family:Georgia,serif;font-weight:700;">${data.contestantFirstName} ${data.contestantLastName}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;color:#8B7355;font-size:13px;font-family:Georgia,serif;vertical-align:top;">Division</td>
                        <td style="padding:6px 0;color:#2C4A2E;font-size:14px;font-family:Georgia,serif;">${data.divisionName}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;color:#8B7355;font-size:13px;font-family:Georgia,serif;vertical-align:top;">Date</td>
                        <td style="padding:6px 0;color:#2C4A2E;font-size:14px;font-family:Georgia,serif;">October 17, 2026</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;color:#8B7355;font-size:13px;font-family:Georgia,serif;vertical-align:top;">Venue</td>
                        <td style="padding:6px 0;color:#2C4A2E;font-size:14px;font-family:Georgia,serif;">Williams Auditorium<br />Henderson, Tennessee</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;color:#8B7355;font-size:13px;font-family:Georgia,serif;vertical-align:top;">Arrival Time</td>
                        <td style="padding:6px 0;color:#2C4A2E;font-size:14px;font-family:Georgia,serif;font-weight:700;">${data.arrivalTime}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;color:#8B7355;font-size:13px;font-family:Georgia,serif;vertical-align:top;">Competition Time</td>
                        <td style="padding:6px 0;color:#2C4A2E;font-size:14px;font-family:Georgia,serif;">${data.competitionTime}</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;color:#8B7355;font-size:13px;font-family:Georgia,serif;vertical-align:top;">Payment</td>
                        <td style="padding:6px 0;color:#2C4A2E;font-size:14px;font-family:Georgia,serif;">
                          <span style="background-color:#D4EDDA;color:#155724;padding:2px 8px;border-radius:4px;font-size:13px;">Received — ${formatDollars(data.amountPaidCents)}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 16px 0;color:#5C4A32;font-size:15px;font-family:Georgia,serif;">
                Please plan to arrive by your <strong>arrival time of ${data.arrivalTime}</strong>. Additional details regarding dress, categories, and event logistics will be communicated closer to the pageant date.
              </p>

              <p style="margin:0 0 24px 0;color:#5C4A32;font-size:15px;font-family:Georgia,serif;">
                If you have any questions in the meantime, please reach out to the pageant team directly at <a href="mailto:wtsfpageant@outlook.com" style="color:#2C4A2E;font-weight:700;">wtsfpageant@outlook.com</a> — we are happy to help.
              </p>

              <p style="margin:0;color:#5C4A32;font-size:15px;font-family:Georgia,serif;">
                We can't wait to see ${data.contestantFirstName} shine on October 17th!
              </p>

              <p style="margin:24px 0 0 0;color:#5C4A32;font-size:15px;font-family:Georgia,serif;">
                Warmly,<br />
                <strong style="color:#2C4A2E;">The WTSF Pageant Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#E8DFC8;padding:20px 40px;text-align:center;border-top:1px solid #D4A827;">
              <p style="margin:0 0 4px 0;color:#8B7355;font-size:12px;font-family:Georgia,serif;">West Tennessee State Fair · Henderson, Tennessee</p>
              <p style="margin:0;color:#8B7355;font-size:11px;font-family:Georgia,serif;">Registration ID: ${data.registrationId}</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `REGISTRATION CONFIRMED — 2026 West Tennessee State Fair Traditional Pageant

Dear ${data.guardianName},

We are delighted to confirm that ${data.contestantFirstName} ${data.contestantLastName} is officially registered for the 2026 West Tennessee State Fair Traditional Pageant.

REGISTRATION DETAILS
--------------------
Contestant:       ${data.contestantFirstName} ${data.contestantLastName}
Division:         ${data.divisionName}
Date:             October 17, 2026
Venue:            Williams Auditorium, Henderson, Tennessee
Arrival Time:     ${data.arrivalTime}
Competition Time: ${data.competitionTime}
Payment:          Received — ${formatDollars(data.amountPaidCents)}

Please plan to arrive by your arrival time of ${data.arrivalTime}. Additional details regarding dress, categories, and event logistics will be communicated closer to the pageant date.

Questions? Contact the pageant team at wtsfpageant@outlook.com

We can't wait to see ${data.contestantFirstName} shine on October 17th!

Warmly,
The WTSF Pageant Team

---
West Tennessee State Fair · Henderson, Tennessee
Registration ID: ${data.registrationId}
`;

  return { subject, html, text };
}
