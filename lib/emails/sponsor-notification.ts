// Notification email sent to the fair when a sponsor application is submitted.
import { FAIR_CONFIG } from "@/lib/fair-config";

const YEAR = FAIR_CONFIG.year;

export interface SponsorNotificationData {
  submittedAt: string;
  business: {
    name: string;
    contactPerson: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    website?: string;
    socialMedia?: string;
  };
  package: {
    name: string;
    price: string;
  };
  businessDescription?: string;
  logoAvailable?: string;
  additionalInterests?: string;
  preferredContact?: string;
  notes?: string;
  applicantName: string;
}

export function buildSponsorNotificationEmail(data: SponsorNotificationData): {
  subject: string; html: string; text: string;
} {
  const { business, package: pkg, submittedAt } = data;

  const row = (label: string, value: string, bg = "#FDFAF3") =>
    `<tr style="background:${bg}"><td style="padding:7px 12px;border:1px solid #E8DFC8;width:38%;font-weight:bold;color:#5C4A32;font-size:13px">${label}</td><td style="padding:7px 12px;border:1px solid #E8DFC8;color:#2C4A2E;font-size:13px">${value || "—"}</td></tr>`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:24px 16px">
<tr><td>
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #ddd">
    <tr>
      <td style="background:#2C4A2E;padding:20px 28px">
        <p style="margin:0 0 2px;font-size:10px;font-weight:bold;letter-spacing:0.2em;color:#D4A827;text-transform:uppercase">Sponsorship Application</p>
        <h1 style="margin:0;font-size:18px;color:#F5EDD4;font-family:Georgia,serif;font-style:italic">New Sponsor Application — WTSF ${YEAR}</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:24px 28px">

        <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;background:#F5EDD4;border-left:4px solid #D4A827;padding:14px 18px">
          <tr><td>
            <span style="font-size:11px;font-weight:bold;letter-spacing:0.1em;color:#8B7355;text-transform:uppercase">Selected Package</span><br>
            <span style="font-size:20px;font-weight:bold;color:#2C4A2E;font-family:Georgia,serif">${pkg.name}</span><br>
            <span style="font-size:15px;font-weight:bold;color:#8B2E2E">${pkg.price}</span>
            <span style="font-size:12px;color:#5C4A32;margin-left:12px">Submitted: ${submittedAt}</span>
          </td></tr>
        </table>

        <p style="margin:0 0 8px;font-size:13px;font-weight:bold;color:#2C4A2E;text-transform:uppercase;letter-spacing:0.08em">Business Information</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 20px">
          ${row("Business Name",    business.name)}
          ${row("Contact Person",   business.contactPerson, "#fff")}
          ${row("Email",            `<a href="mailto:${business.email}" style="color:#2C4A2E">${business.email}</a>`)}
          ${row("Phone",            business.phone, "#fff")}
          ${row("Mailing Address",  `${business.address}, ${business.city}, ${business.state} ${business.zip}`)}
          ${business.website ? row("Website", `<a href="${business.website}" style="color:#2C4A2E">${business.website}</a>`, "#fff") : ""}
          ${business.socialMedia ? row("Social Media", business.socialMedia) : ""}
        </table>

        <p style="margin:0 0 8px;font-size:13px;font-weight:bold;color:#2C4A2E;text-transform:uppercase;letter-spacing:0.08em">Application Details</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 20px">
          ${row("Business Description",   data.businessDescription || "—")}
          ${row("Logo Available",         data.logoAvailable || "—", "#fff")}
          ${row("Additional Interests",   data.additionalInterests || "—")}
          ${row("Preferred Contact",      data.preferredContact || "—", "#fff")}
          ${row("Notes / Questions",      data.notes || "—")}
          ${row("Applicant Signature",    data.applicantName, "#fff")}
        </table>

      </td>
    </tr>
    <tr>
      <td style="background:#1E3320;padding:14px 28px;text-align:center">
        <p style="margin:0;font-size:11px;color:#A8BFA9">West Tennessee State Fair ${YEAR} · Sponsorship Application · Staff Copy</p>
      </td>
    </tr>
  </table>
</td></tr>
</table>
</body>
</html>`;

  const text = `NEW SPONSORSHIP APPLICATION — WTSF ${YEAR}
Submitted: ${submittedAt}

SELECTED PACKAGE: ${pkg.name} — ${pkg.price}

BUSINESS:
  Name:           ${business.name}
  Contact:        ${business.contactPerson}
  Email:          ${business.email}
  Phone:          ${business.phone}
  Address:        ${business.address}, ${business.city}, ${business.state} ${business.zip}
  ${business.website ? `Website: ${business.website}` : ""}
  ${business.socialMedia ? `Social: ${business.socialMedia}` : ""}

DETAILS:
  Description:    ${data.businessDescription || "—"}
  Logo Available: ${data.logoAvailable || "—"}
  Additional:     ${data.additionalInterests || "—"}
  Pref. Contact:  ${data.preferredContact || "—"}
  Notes:          ${data.notes || "—"}
  Signed by:      ${data.applicantName}`;

  return {
    subject: `New Sponsorship Application — ${business.name} — ${pkg.name}`,
    html,
    text,
  };
}
