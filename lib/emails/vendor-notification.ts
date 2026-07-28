// Notification email sent to the fair when a vendor application is submitted.
import { FAIR_CONFIG } from "@/lib/fair-config";
import type { VendorCostBreakdown } from "@/lib/vendor-config";

const YEAR = FAIR_CONFIG.year;

export interface VendorNotificationData {
  submittedAt: string;
  business: {
    name: string;
    ownerOrAgent: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    website?: string;
    socialMedia?: string;
  };
  vendor: {
    businessType: string;
    productDescription: string;
    itemsSold: string;
    isFood: string;
    cookingOnSite: string;
    insideOrOutside: string;
    categoryName: string;
    boothSize: string;
    boothPrice: number;
    numberOfSpaces?: string;
    placementRequest?: string;
  };
  fees: {
    hasInsuranceBinder: boolean;
    electricalService: string;
    hasCord: boolean;
  };
  cost: VendorCostBreakdown;
  additional: {
    trailerDimensions?: string;
    waterNeeded?: string;
    vehicleInfo?: string;
    specialAccommodations?: string;
    notes?: string;
  };
  applicantName: string;
}

function fmt(n: number) {
  return n === 0 ? "$0" : `$${n.toLocaleString()}`;
}

export function buildVendorNotificationEmail(data: VendorNotificationData): {
  subject: string; html: string; text: string;
} {
  const { business, vendor, fees, cost, additional } = data;

  const row = (label: string, value: string, bg = "#FDFAF3") =>
    `<tr style="background:${bg}"><td style="padding:7px 12px;border:1px solid #E8DFC8;width:38%;font-weight:bold;color:#5C4A32;font-size:13px">${label}</td><td style="padding:7px 12px;border:1px solid #E8DFC8;color:#2C4A2E;font-size:13px">${value || "—"}</td></tr>`;

  const costRow = (label: string, value: number, bg = "#FDFAF3") =>
    `<tr style="background:${bg}"><td style="padding:7px 12px;border:1px solid #E8DFC8;font-size:13px;font-weight:bold;color:#5C4A32">${label}</td><td style="padding:7px 12px;border:1px solid #E8DFC8;font-size:13px;color:#2C4A2E;text-align:right">${fmt(value)}</td></tr>`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:24px 16px">
<tr><td>
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #ddd">
    <tr>
      <td style="background:#2C4A2E;padding:20px 28px">
        <p style="margin:0 0 2px;font-size:10px;font-weight:bold;letter-spacing:0.2em;color:#D4A827;text-transform:uppercase">Vendor Application</p>
        <h1 style="margin:0;font-size:18px;color:#F5EDD4;font-family:Georgia,serif;font-style:italic">New Vendor Application — WTSF ${YEAR}</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:24px 28px">

        <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;background:#F5EDD4;border-left:4px solid #D4A827;padding:14px 18px">
          <tr><td>
            <span style="font-size:11px;font-weight:bold;letter-spacing:0.1em;color:#8B7355;text-transform:uppercase">Booth Selected</span><br>
            <span style="font-size:18px;font-weight:bold;color:#2C4A2E;font-family:Georgia,serif">${vendor.categoryName} — ${vendor.boothSize}</span><br>
            <span style="font-size:13px;color:#5C4A32">Submitted: ${data.submittedAt}</span>
          </td></tr>
        </table>

        <p style="margin:0 0 8px;font-size:13px;font-weight:bold;color:#2C4A2E;text-transform:uppercase;letter-spacing:0.08em">Business Information</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 20px">
          ${row("Organization / Business", business.name)}
          ${row("Owner / Agent",   business.ownerOrAgent, "#fff")}
          ${row("Email",           `<a href="mailto:${business.email}" style="color:#2C4A2E">${business.email}</a>`)}
          ${row("Phone",           business.phone, "#fff")}
          ${row("Mailing Address", `${business.address}, ${business.city}, ${business.state} ${business.zip}`)}
          ${business.website ? row("Website", business.website, "#fff") : ""}
          ${business.socialMedia ? row("Social Media", business.socialMedia) : ""}
        </table>

        <p style="margin:0 0 8px;font-size:13px;font-weight:bold;color:#2C4A2E;text-transform:uppercase;letter-spacing:0.08em">Vendor Information</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 20px">
          ${row("Business Type",          vendor.businessType)}
          ${row("Product Description",    vendor.productDescription, "#fff")}
          ${row("Items to Be Sold",       vendor.itemsSold)}
          ${row("Food Vendor",            vendor.isFood, "#fff")}
          ${row("Cooking On Site",        vendor.cookingOnSite)}
          ${row("Placement Preference",   vendor.insideOrOutside, "#fff")}
          ${row("Booth Category",         vendor.categoryName)}
          ${row("Booth Size",             vendor.boothSize, "#fff")}
          ${row("Booth Price",            fmt(vendor.boothPrice))}
          ${vendor.numberOfSpaces ? row("Spaces Requested", vendor.numberOfSpaces, "#fff") : ""}
          ${vendor.placementRequest ? row("Placement Request", vendor.placementRequest) : ""}
        </table>

        <p style="margin:0 0 8px;font-size:13px;font-weight:bold;color:#2C4A2E;text-transform:uppercase;letter-spacing:0.08em">Insurance & Electrical</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 20px">
          ${row("Insurance Binder Provided", fees.hasInsuranceBinder ? "Yes" : "No — $100 coverage charge")}
          ${row("Electrical Service",        fees.electricalService === "none" ? "None" : fees.electricalService.toUpperCase(), "#fff")}
          ${row("50-ft Cord Provided",       fees.hasCord ? "Yes" : "No — $50 cord charge")}
        </table>

        <p style="margin:0 0 8px;font-size:13px;font-weight:bold;color:#2C4A2E;text-transform:uppercase;letter-spacing:0.08em">Estimated Cost Breakdown</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 20px">
          ${costRow("Booth Fee",                cost.boothFee)}
          ${cost.insuranceFee > 0 ? costRow("Insurance Coverage",       cost.insuranceFee, "#fff") : ""}
          ${cost.electricalFee > 0 ? costRow("Electrical Hookup",       cost.electricalFee) : ""}
          ${cost.cordFee > 0 ? costRow("Electrical Cord",               cost.cordFee, "#fff") : ""}
          ${cost.cleanupDeposit > 0 ? costRow("Refundable Cleanup Deposit", cost.cleanupDeposit) : ""}
          <tr style="background:#2C4A2E"><td style="padding:9px 12px;border:1px solid #2C4A2E;font-size:14px;font-weight:bold;color:#D4A827">Estimated Total</td><td style="padding:9px 12px;border:1px solid #2C4A2E;font-size:14px;font-weight:bold;color:#D4A827;text-align:right">${fmt(cost.estimatedTotal)}</td></tr>
          ${cost.refundableAmount > 0 ? `<tr><td colspan="2" style="padding:6px 12px;font-size:12px;color:#8B7355;font-style:italic">Includes ${fmt(cost.refundableAmount)} refundable cleanup deposit (returned when area is fully cleaned after the fair)</td></tr>` : ""}
        </table>

        ${(additional.trailerDimensions || additional.waterNeeded || additional.vehicleInfo || additional.specialAccommodations || additional.notes) ? `
        <p style="margin:0 0 8px;font-size:13px;font-weight:bold;color:#2C4A2E;text-transform:uppercase;letter-spacing:0.08em">Additional Information</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 20px">
          ${additional.trailerDimensions ? row("Trailer / Setup Dimensions", additional.trailerDimensions) : ""}
          ${additional.waterNeeded ? row("Water Connection", additional.waterNeeded, "#fff") : ""}
          ${additional.vehicleInfo ? row("Vehicle / Equipment", additional.vehicleInfo) : ""}
          ${additional.specialAccommodations ? row("Special Accommodations", additional.specialAccommodations, "#fff") : ""}
          ${additional.notes ? row("Notes", additional.notes) : ""}
        </table>` : ""}

        <p style="margin:0 0 8px;font-size:13px;font-weight:bold;color:#2C4A2E;text-transform:uppercase;letter-spacing:0.08em">Agreement</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 8px">
          ${row("Signed by", data.applicantName)}
        </table>

      </td>
    </tr>
    <tr>
      <td style="background:#1E3320;padding:14px 28px;text-align:center">
        <p style="margin:0;font-size:11px;color:#A8BFA9">West Tennessee State Fair ${YEAR} · Vendor Application · Staff Copy</p>
      </td>
    </tr>
  </table>
</td></tr>
</table>
</body>
</html>`;

  const text = `NEW VENDOR APPLICATION — WTSF ${YEAR}
Submitted: ${data.submittedAt}

BOOTH: ${vendor.categoryName} — ${vendor.boothSize}

BUSINESS:
  Name:     ${business.name}
  Contact:  ${business.ownerOrAgent}
  Email:    ${business.email}
  Phone:    ${business.phone}
  Address:  ${business.address}, ${business.city}, ${business.state} ${business.zip}

VENDOR INFO:
  Type:        ${vendor.businessType}
  Products:    ${vendor.productDescription}
  Items Sold:  ${vendor.itemsSold}
  Food:        ${vendor.isFood}  Cooking: ${vendor.cookingOnSite}
  Preference:  ${vendor.insideOrOutside}
  Category:    ${vendor.categoryName}
  Booth Size:  ${vendor.boothSize}  Price: ${fmt(vendor.boothPrice)}

FEES:
  Insurance Binder: ${fees.hasInsuranceBinder ? "Yes" : "No ($100 added)"}
  Electrical:       ${fees.electricalService}
  Cord Provided:    ${fees.hasCord ? "Yes" : "No ($50 added)"}

COST BREAKDOWN:
  Booth Fee:          ${fmt(cost.boothFee)}
  Insurance:          ${fmt(cost.insuranceFee)}
  Electrical:         ${fmt(cost.electricalFee)}
  Cord:               ${fmt(cost.cordFee)}
  Cleanup Deposit:    ${fmt(cost.cleanupDeposit)}
  ESTIMATED TOTAL:    ${fmt(cost.estimatedTotal)}
  (Refundable:        ${fmt(cost.refundableAmount)})

Signed by: ${data.applicantName}`;

  return {
    subject: `New Vendor Application — ${business.name} — ${vendor.categoryName} ${vendor.boothSize}`,
    html,
    text,
  };
}
