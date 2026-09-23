// Sent to contestant's guardian immediately after the registration form is submitted.
// At this point payment has NOT been received — status is PAYMENT_PENDING.
// This email serves as both the submission acknowledgment and the recovery vehicle:
// the resume link is the only way to return to the saved application.

export interface PageantSubmissionEmailData {
  guardianName: string;      // full name from form — first word used as greeting
  guardianEmail: string;
  contestantFirstName: string;
  contestantLastName: string;
  divisionName: string;
  resumeUrl: string; // https://wtsfair.com/pageants/register/pay/[rawToken]
}

/** Extract first word of a name string for use in greetings. */
function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? fullName.trim();
}

export function buildPageantSubmissionEmail(data: PageantSubmissionEmailData): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = `Your WTSF Pageant Application Is Saved — Complete Payment to Register`;
  const guardianFirst = firstName(data.guardianName);

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
              <h1 style="margin:0;color:#F5EDD4;font-size:26px;font-family:Georgia,serif;font-weight:700;">Application Saved</h1>
              <p style="margin:8px 0 0 0;color:#E8DFC8;font-size:14px;font-family:Georgia,serif;">2026 Traditional Fair Pageants</p>
            </td>
          </tr>

          <!-- Incomplete notice banner -->
          <tr>
            <td style="background-color:#FFF3CD;border-bottom:2px solid #D4A827;padding:16px 40px;text-align:center;">
              <p style="margin:0;color:#856404;font-size:15px;font-family:Georgia,serif;font-weight:700;">
                &#9888; Registration is not complete until payment is successfully received.
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 20px 0;color:#5C4A32;font-size:16px;font-family:Georgia,serif;">
                Hi ${guardianFirst},
              </p>
              <p style="margin:0 0 20px 0;color:#2C4A2E;font-size:16px;font-family:Georgia,serif;">
                We received <strong>${data.contestantFirstName}</strong>'s application information for the 2026 West Tennessee State Fair Traditional Fair Pageants.
              </p>
              <p style="margin:0 0 20px 0;color:#2C4A2E;font-size:16px;font-family:Georgia,serif;">
                Your application information is saved, but registration is not complete until payment is successfully received.
              </p>
              <p style="margin:0 0 20px 0;color:#2C4A2E;font-size:16px;font-family:Georgia,serif;">
                If you are still completing your registration, you can continue on the payment page currently open in your browser.
              </p>
              <p style="margin:0 0 32px 0;color:#2C4A2E;font-size:16px;font-family:Georgia,serif;">
                If you need to come back later, use the button below to securely return to your saved application and complete payment.
              </p>

              <!-- CTA button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:36px;">
                <tr>
                  <td align="center">
                    <a href="${data.resumeUrl}"
                       style="display:inline-block;background-color:#2C4A2E;color:#F5EDD4;font-family:Georgia,serif;font-size:16px;font-weight:700;text-decoration:none;padding:14px 36px;border-radius:6px;border:2px solid #D4A827;">
                      Complete Your Registration &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Pricing box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5EDD4;border:1px solid #D4A827;border-radius:6px;margin-bottom:28px;">
                <tr>
                  <td style="padding:24px 28px;">
                    <h2 style="margin:0 0 16px 0;color:#2C4A2E;font-size:16px;font-family:Georgia,serif;border-bottom:1px solid #D4A827;padding-bottom:10px;">
                      Registration Fee
                    </h2>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:5px 0;color:#5C4A32;font-size:14px;font-family:Georgia,serif;">$55 through October 10</td>
                        <td style="padding:5px 0;color:#2C4A2E;font-size:14px;font-family:Georgia,serif;font-weight:700;text-align:right;">&nbsp;</td>
                      </tr>
                      <tr>
                        <td style="padding:5px 0;color:#5C4A32;font-size:14px;font-family:Georgia,serif;">$65 October 11&ndash;14</td>
                        <td style="padding:5px 0;color:#2C4A2E;font-size:14px;font-family:Georgia,serif;font-weight:700;text-align:right;">&nbsp;</td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding-top:12px;border-top:1px solid #D4A827;">
                          <p style="margin:8px 0 0 0;color:#8B0000;font-size:13px;font-family:Georgia,serif;font-weight:700;">
                            Registration closes October 14 at 11:59 PM CDT.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 24px 0;color:#5C4A32;font-size:14px;font-family:Georgia,serif;">
                Questions? Contact us at <a href="mailto:wtsfpageant@outlook.com" style="color:#2C4A2E;font-weight:700;">wtsfpageant@outlook.com</a>
              </p>

              <p style="margin:0;color:#5C4A32;font-size:15px;font-family:Georgia,serif;">
                We hope to see you and your family at the Fair!<br /><br />
                <strong style="color:#2C4A2E;">The WTSF Pageant Team</strong>
              </p>
            </td>
          </tr>

          <!-- Event info -->
          <tr>
            <td style="background-color:#F5EDD4;border-top:1px solid #D4A827;padding:20px 40px;text-align:center;">
              <p style="margin:0 0 4px 0;color:#5C4A32;font-size:13px;font-family:Georgia,serif;font-weight:700;">Saturday, October 17, 2026</p>
              <p style="margin:0;color:#8B7355;font-size:12px;font-family:Georgia,serif;">Williams Auditorium &middot; Henderson, Tennessee</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#E8DFC8;padding:16px 40px;text-align:center;border-top:1px solid #D4A827;">
              <p style="margin:0;color:#8B7355;font-size:11px;font-family:Georgia,serif;">West Tennessee State Fair &middot; Henderson, Tennessee</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `YOUR WTSF PAGEANT APPLICATION IS SAVED — COMPLETE PAYMENT TO REGISTER
=======================================================================

Hi ${guardianFirst},

We received ${data.contestantFirstName}'s application information for the 2026 West Tennessee State Fair Traditional Fair Pageants.

Your application information is saved, but registration is not complete until payment is successfully received.

If you are still completing your registration, you can continue on the payment page currently open in your browser.

If you need to come back later, use the link below to securely return to your saved application and complete payment.

  ${data.resumeUrl}

REGISTRATION FEE
----------------
$55 through October 10
$65 October 11–14

Registration closes October 14 at 11:59 PM CDT.

Questions? Contact us at wtsfpageant@outlook.com

Saturday, October 17, 2026
Williams Auditorium · Henderson, Tennessee

We hope to see you and your family at the Fair!

The WTSF Pageant Team
---
West Tennessee State Fair · Henderson, Tennessee
`;

  return { subject, html, text };
}
