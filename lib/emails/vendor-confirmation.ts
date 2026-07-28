// Confirmation email sent to the applicant after a vendor application is submitted.
import { FAIR_CONFIG } from "@/lib/fair-config";
import type { VendorCostBreakdown } from "@/lib/vendor-config";

const YEAR = FAIR_CONFIG.year;

export interface VendorConfirmationData {
  submittedAt: string;
  applicantName: string;
  businessName: string;
  email: string;
  categoryName: string;
  boothSize: string;
  cost: VendorCostBreakdown;
  paymentDeadline: string;
}

function fmt(n: number) {
  return n === 0 ? "$0" : `$${n.toLocaleString()}`;
}

export function buildVendorConfirmationEmail(data: VendorConfirmationData): {
  subject: string; html: string; text: string;
} {
  const { cost } = data;

  const costRow = (label: string, value: number, note = "", bg = "#FDFAF3") =>
    value > 0
      ? `<tr style="background:${bg}"><td style="padding:8px 12px;border:1px solid #E8DFC8;font-size:13px;font-weight:bold;color:#5C4A32">${label}${note ? `<br><span style="font-weight:normal;font-size:11px;color:#8B7355">${note}</span>` : ""}</td><td style="padding:8px 12px;border:1px solid #E8DFC8;font-size:13px;color:#2C4A2E;text-align:right">${fmt(value)}</td></tr>`
      : "";

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
        <h1 style="margin:0;font-size:22px;color:#F5EDD4;font-family:Georgia,serif;font-style:italic">Vendor Application Received</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:28px">

        <p style="margin:0 0 16px;font-size:15px;color:#2C4A2E">Dear ${data.applicantName},</p>
        <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#5C4A32">
          Thank you for applying to participate as a vendor at the ${YEAR} West Tennessee State Fair.
          Your application has been received and will be reviewed by our Advertising and Marketing Committee.
        </p>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;background:#F5EDD4;border-left:4px solid #D4A827;padding:16px 20px">
          <tr><td>
            <p style="margin:0 0 4px;font-size:11px;font-weight:bold;letter-spacing:0.1em;color:#8B7355;text-transform:uppercase">Your Booth Selection</p>
            <p style="margin:0;font-size:17px;font-weight:bold;color:#2C4A2E;font-family:Georgia,serif">${data.categoryName}</p>
            <p style="margin:2px 0 0;font-size:14px;color:#5C4A32">Booth Size: ${data.boothSize}</p>
          </td></tr>
        </table>

        <p style="margin:0 0 10px;font-size:13px;font-weight:bold;color:#2C4A2E;text-transform:uppercase;letter-spacing:0.08em">Estimated Cost Breakdown</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 8px">
          ${costRow("Booth Fee", cost.boothFee)}
          ${costRow("Insurance Coverage", cost.insuranceFee, "Added because insurance binder was not provided", "#fff")}
          ${costRow("Electrical Hookup", cost.electricalFee)}
          ${costRow("Electrical Cord", cost.cordFee, "Added because 50-ft cord was not available", "#fff")}
          ${costRow("Refundable Cleanup Deposit", cost.cleanupDeposit, "Returned when area is fully cleaned after the fair")}
          <tr style="background:#2C4A2E"><td style="padding:9px 12px;font-size:14px;font-weight:bold;color:#D4A827">Estimated Total</td><td style="padding:9px 12px;font-size:14px;font-weight:bold;color:#D4A827;text-align:right">${fmt(cost.estimatedTotal)}</td></tr>
        </table>
        ${cost.refundableAmount > 0 ? `<p style="margin:0 0 20px;font-size:12px;color:#8B7355;font-style:italic">Includes ${fmt(cost.refundableAmount)} refundable cleanup deposit.</p>` : `<p style="margin:0 0 20px"></p>`}

        <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;background:#FFF8E8;border:1px solid #E8DFC8;padding:16px 20px">
          <tr><td>
            <p style="margin:0 0 8px;font-size:13px;font-weight:bold;color:#2C4A2E">Important Notices</p>
            <ul style="margin:0;padding:0 0 0 18px;font-size:13px;line-height:1.6;color:#5C4A32">
              <li style="margin-bottom:6px">Submission of this form does not guarantee acceptance or placement. The West Tennessee State Fair will review your application and contact you regarding approval.</li>
              <li style="margin-bottom:6px">The estimated cost above is for reference only. Final fees and totals are subject to confirmation by the West Tennessee State Fair.</li>
              <li style="margin-bottom:6px">If approved, final payment is due by the confirmed deadline. Watch for communication from the fair for the confirmed ${YEAR} payment deadline.</li>
              <li>All decisions of the Advertising and Marketing Committee are final.</li>
            </ul>
          </td></tr>
        </table>

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

  const text = `VENDOR APPLICATION RECEIVED — WTSF ${YEAR}

Dear ${data.applicantName},

Thank you for applying to participate as a vendor at the ${YEAR} West Tennessee State Fair.
Your application has been received and will be reviewed by our Advertising and Marketing Committee.

BOOTH SELECTION:
  Category:  ${data.categoryName}
  Size:      ${data.boothSize}

ESTIMATED COST:
  Booth Fee:              ${fmt(cost.boothFee)}
  Insurance Coverage:     ${fmt(cost.insuranceFee)}
  Electrical Hookup:      ${fmt(cost.electricalFee)}
  Electrical Cord:        ${fmt(cost.cordFee)}
  Cleanup Deposit:        ${fmt(cost.cleanupDeposit)}
  ESTIMATED TOTAL:        ${fmt(cost.estimatedTotal)}

Submission of this form does not guarantee acceptance or placement.
Final fees are subject to confirmation by the West Tennessee State Fair.
If approved, payment deadline will be communicated by the fair.
All decisions of the Advertising and Marketing Committee are final.

Questions?
  Email:  wtsfair@gmail.com
  Mail:   P.O. Box 1404, Jackson, TN 38302

West Tennessee State Fair ${YEAR} · October 15–24, 2026 · Henderson, Tennessee`;

  return {
    subject: `Your WTSF ${YEAR} Vendor Application — ${data.categoryName} ${data.boothSize}`,
    html,
    text,
  };
}
