// Confirmation email sent to the entrant after a successful submission.

import { FAIR_YEAR, CHECKIN_SCHEDULE } from "@/lib/exhibit-config";

interface EntryItem {
  department: string;
  department_type: "Non-Perishable" | "Perishable";
  division: string;
  class_name: string;
  lot: string;
  entry_title?: string | null;
  entry_description?: string | null;
}

interface ConfirmationEmailData {
  firstName: string;
  lastName: string;
  submissionRef: string;
  submittedAt: string;
  entries: EntryItem[];
  siteUrl: string;
}

export function buildEntrantConfirmationEmail(data: ConfirmationEmailData): {
  subject: string;
  html: string;
  text: string;
} {
  const { firstName, lastName, submissionRef, submittedAt, entries, siteUrl } = data;

  // Determine which turn-in schedules apply based on submitted entry types
  const hasNP = entries.some((e) => e.department_type === "Non-Perishable");
  const hasP  = entries.some((e) => e.department_type === "Perishable");

  const turninScheduleHtml = (hasNP || hasP) ? `
        <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px">
          <tr>
            <td style="background:#FDFAF3;border:1px solid #E8DFC8;padding:16px 20px">
              <p style="margin:0 0 10px;font-size:11px;font-weight:bold;letter-spacing:0.12em;color:#D4A827;text-transform:uppercase">Exhibit Turn-In Schedule</p>
              ${hasNP ? `
              <p style="margin:0 0 4px;font-size:12px;font-weight:bold;color:#2C4A2E">${CHECKIN_SCHEDULE.nonPerishable.label}</p>
              ${CHECKIN_SCHEDULE.nonPerishable.windows.map((w) => `<p style="margin:0;font-size:13px;color:#3D3026">${w.day} Â· ${w.hours}</p>`).join("")}
              ` : ""}
              ${hasNP && hasP ? `<div style="height:12px"></div>` : ""}
              ${hasP ? `
              <p style="margin:0 0 4px;font-size:12px;font-weight:bold;color:#8B2E2E">${CHECKIN_SCHEDULE.perishable.label}</p>
              ${CHECKIN_SCHEDULE.perishable.windows.map((w) => `<p style="margin:0;font-size:13px;color:#3D3026">${w.day} Â· ${w.hours}</p>`).join("")}
              ` : ""}
              <p style="margin:10px 0 0;font-size:12px;color:#5C4A32">Bring your physical exhibits to the fairgrounds during the turn-in window that applies to your entry type.</p>
            </td>
          </tr>
        </table>` : "";

  const turninScheduleText = [
    hasNP ? `${CHECKIN_SCHEDULE.nonPerishable.label}:\n${CHECKIN_SCHEDULE.nonPerishable.windows.map((w) => `  ${w.day} Â· ${w.hours}`).join("\n")}` : "",
    hasP  ? `${CHECKIN_SCHEDULE.perishable.label}:\n${CHECKIN_SCHEDULE.perishable.windows.map((w) => `  ${w.day} Â· ${w.hours}`).join("\n")}` : "",
  ].filter(Boolean).join("\n\n");

  const entryRows = entries
    .map(
      (e, i) => `
      <tr style="background:${i % 2 === 0 ? "#FDFAF3" : "#fff"}">
        <td style="padding:10px 12px;border:1px solid #E8DFC8;font-size:13px;color:#2C4A2E">${e.department}</td>
        <td style="padding:10px 12px;border:1px solid #E8DFC8;font-size:13px;color:#5C4A32">${e.division}</td>
        <td style="padding:10px 12px;border:1px solid #E8DFC8;font-size:13px;color:#5C4A32">${e.class_name}</td>
        <td style="padding:10px 12px;border:1px solid #E8DFC8;font-size:13px;color:#5C4A32">${e.lot}</td>
        <td style="padding:10px 12px;border:1px solid #E8DFC8;font-size:13px;color:#5C4A32">${e.entry_title || e.entry_description || "â"}</td>
      </tr>`
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F5EDD4;font-family:Georgia,serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F5EDD4;padding:32px 16px">
<tr><td>
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;margin:0 auto;background:#fff;border:1px solid #E8DFC8">

    <!-- Header -->
    <tr>
      <td style="background:#2C4A2E;padding:28px 32px;text-align:center">
        <p style="margin:0 0 4px;font-size:11px;font-weight:bold;letter-spacing:0.2em;color:#D4A827;text-transform:uppercase">West Tennessee State Fair ${FAIR_YEAR}</p>
        <h1 style="margin:0;font-size:22px;font-style:italic;color:#F5EDD4">Exhibit Registration Received</h1>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding:32px">

        <p style="margin:0 0 24px;font-size:15px;color:#2C4A2E">Dear ${firstName} ${lastName},</p>

        <p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#3D3026">
          Your online exhibit registration for the ${FAIR_YEAR} West Tennessee State Fair has been received.
        </p>

        <!-- Ref number callout -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px">
          <tr>
            <td style="background:#F5EDD4;border-left:4px solid #D4A827;padding:16px 20px">
              <p style="margin:0 0 4px;font-size:11px;font-weight:bold;letter-spacing:0.15em;color:#8B7355;text-transform:uppercase">Your Website Submission Reference</p>
              <p style="margin:0;font-size:22px;font-weight:bold;color:#2C4A2E;font-family:monospace">${submissionRef}</p>
              <p style="margin:8px 0 0;font-size:12px;line-height:1.6;color:#5C4A32">
                <strong>Important:</strong> This reference confirms your <em>online submission</em> only. It is <strong>not</strong> your official exhibitor ID. Your official exhibitor ID will be assigned separately after your registration is processed through the fair's exhibit management program.
              </p>
            </td>
          </tr>
        </table>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px">
          <tr>
            <td style="padding:0 0 8px">
              <span style="font-size:12px;font-weight:bold;letter-spacing:0.12em;color:#D4A827;text-transform:uppercase">Submitted</span><br>
              <span style="font-size:14px;color:#3D3026">${submittedAt}</span>
            </td>
          </tr>
        </table>

        <!-- Entries table -->
        <p style="margin:0 0 10px;font-size:14px;font-weight:bold;color:#2C4A2E">Your Exhibit Entries (${entries.length})</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 28px">
          <thead>
            <tr style="background:#2C4A2E">
              <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:bold;letter-spacing:0.1em;color:#D4A827;text-transform:uppercase;border:1px solid #2C4A2E">Dept.</th>
              <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:bold;letter-spacing:0.1em;color:#D4A827;text-transform:uppercase;border:1px solid #2C4A2E">Division</th>
              <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:bold;letter-spacing:0.1em;color:#D4A827;text-transform:uppercase;border:1px solid #2C4A2E">Class</th>
              <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:bold;letter-spacing:0.1em;color:#D4A827;text-transform:uppercase;border:1px solid #2C4A2E">Lot</th>
              <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:bold;letter-spacing:0.1em;color:#D4A827;text-transform:uppercase;border:1px solid #2C4A2E">Description</th>
            </tr>
          </thead>
          <tbody>${entryRows}</tbody>
        </table>

        ${turninScheduleHtml}

        <!-- What to do if incorrect -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px">
          <tr>
            <td style="background:#fff8e1;border:1px solid #f0d060;padding:14px 18px">
              <p style="margin:0 0 4px;font-size:12px;font-weight:bold;color:#5C4A32">If any information is incorrect</p>
              <p style="margin:0;font-size:13px;line-height:1.6;color:#5C4A32">
                Email <a href="mailto:wtsfair@gmail.com" style="color:#2C4A2E">wtsfair@gmail.com</a> with your submission reference <strong>${submissionRef}</strong> and describe the correction needed.
              </p>
            </td>
          </tr>
        </table>

        <p style="margin:0 0 8px;font-size:13px;line-height:1.7;color:#5C4A32">
          Review the complete rules for your division before check-in:
          <a href="${siteUrl}/files/adult-rules.pdf" style="color:#2C4A2E">Adult Division Rules</a> &nbsp;|&nbsp;
          <a href="${siteUrl}/files/youth-rules.pdf" style="color:#2C4A2E">Youth Division Rules</a>
        </p>

        <p style="margin:24px 0 0;font-size:14px;color:#2C4A2E;font-style:italic">
          We look forward to seeing your entry at the ${FAIR_YEAR} West Tennessee State Fair!
        </p>

      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background:#1E3320;padding:20px 32px;text-align:center">
        <p style="margin:0 0 4px;font-size:12px;color:#A8BFA9">West Tennessee State Fair Â· 575 Fourth Street Â· Henderson, TN 38340</p>
        <p style="margin:0;font-size:12px;color:#A8BFA9">
          <a href="mailto:wtsfair@gmail.com" style="color:#D4A827">wtsfair@gmail.com</a>
          &nbsp;Â·&nbsp;
          <a href="${siteUrl}" style="color:#D4A827">Visit our website</a>
        </p>
      </td>
    </tr>

  </table>
</td></tr>
</table>
</body>
</html>`;

  const entryText = entries
    .map(
      (e, i) =>
        `  ${i + 1}. ${e.department} / ${e.division} / ${e.class_name} / ${e.lot}${e.entry_title ? ` â ${e.entry_title}` : e.entry_description ? ` â ${e.entry_description}` : ""}`
    )
    .join("\n");

  const text = `WEST TEMNESSEE STATE FAIR ${FAIR_YEAR}
Exhibit Registration Received

Dear ${firstName} ${lastName},

Your online exhibit registration has been received.

WEBSITE SUBMISSION REFERENCE: ${submissionRef}

IMPORTANT: This reference is not your official exhibitor ID. Your official exhibitor ID will be assigned separately through the fair's exhibit management program.

Submitted: ${submittedAt}

YOUR EXHIBIT ENTRIES (${entries.length}):
${entryText}

${turninScheduleText ? `EXBICIT TURN-IN SCHEDULE:\n${turninScheduleText}\n\n` : ""}If any information is incorrect, email wtsfair@gmail.com with your reference number ${submissionRef}.

West Tennessee State Fair Â· 575 Fourth Street Â· Henderson, TN 38340
wtsfair@gmail.com`;

  return {
    subject: `Exhibit Registration Received â ${submissionRef} | West Tennessee State Fair ${FAIR_YEAR}`,
    html,
    text,
  };
}
