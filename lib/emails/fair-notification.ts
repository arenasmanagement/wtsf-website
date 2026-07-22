// Notification email sent to fair staff when a new registration is submitted.

import { FAIR_YEAR } from "@/lib/exhibit-config";

interface EntryItem {
  department: string;
  division: string;
  class_name: string;
  lot: string;
  entry_title?: string | null;
  entry_description?: string | null;
}

interface FairNotificationData {
  submissionRef: string;
  submittedAt: string;
  entrant: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    entrantType: "adult" | "youth";
    youthAge?: number | null;
    youthGrade?: string | null;
    guardianName?: string | null;
  };
  entries: EntryItem[];
  adminUrl: string;
}

export function buildFairNotificationEmail(data: FairNotificationData): {
  subject: string;
  html: string;
  text: string;
} {
  const { submissionRef, submittedAt, entrant, entries, adminUrl } = data;

  const entryRows = entries
    .map(
      (e, i) => `
      <tr style="background:${i % 2 === 0 ? "#FDFAF3" : "#fff"}">
        <td style="padding:9px 12px;border:1px solid #E8DFC8;font-size:13px">${e.department}</td>
        <td style="padding:9px 12px;border:1px solid #E8DFC8;font-size:13px">${e.division}</td>
        <td style="padding:9px 12px;border:1px solid #E8DFC8;font-size:13px">${e.class_name}</td>
        <td style="padding:9px 12px;border:1px solid #E8DFC8;font-size:13px">${e.lot}</td>
        <td style="padding:9px 12px;border:1px solid #E8DFC8;font-size:13px">${e.entry_title || e.entry_description || "—"}</td>
      </tr>`
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:24px 16px">
<tr><td>
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #ddd">

    <tr>
      <td style="background:#2C4A2E;padding:20px 28px">
        <p style="margin:0 0 2px;font-size:10px;font-weight:bold;letter-spacing:0.2em;color:#D4A827;text-transform:uppercase">Staff Notification</p>
        <h1 style="margin:0;font-size:18px;color:#F5EDD4;font-family:Georgia,serif;font-style:italic">New Exhibit Registration — WTSF ${FAIR_YEAR}</h1>
      </td>
    </tr>

    <tr>
      <td style="padding:24px 28px">

        <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;background:#F5EDD4;border-left:4px solid #D4A827;padding:14px 18px">
          <tr>
            <td>
              <span style="font-size:11px;font-weight:bold;letter-spacing:0.1em;color:#8B7355;text-transform:uppercase">Submission Reference</span><br>
              <span style="font-size:20px;font-weight:bold;color:#2C4A2E;font-family:monospace">${submissionRef}</span><br>
              <span style="font-size:12px;color:#5C4A32">Submitted: ${submittedAt}</span>
            </td>
          </tr>
        </table>

        <!-- Entrant info -->
        <p style="margin:0 0 8px;font-size:13px;font-weight:bold;color:#2C4A2E;text-transform:uppercase;letter-spacing:0.08em">Entrant Information</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 20px;font-size:13px">
          <tr style="background:#F5EDD4"><td style="padding:7px 12px;border:1px solid #E8DFC8;width:38%;font-weight:bold;color:#5C4A32">Name</td><td style="padding:7px 12px;border:1px solid #E8DFC8;color:#2C4A2E">${entrant.lastName}, ${entrant.firstName}</td></tr>
          <tr><td style="padding:7px 12px;border:1px solid #E8DFC8;font-weight:bold;color:#5C4A32">Type</td><td style="padding:7px 12px;border:1px solid #E8DFC8">${entrant.entrantType === "adult" ? "Adult" : "Youth"}${entrant.youthAge ? ` (Age ${entrant.youthAge})` : ""}${entrant.youthGrade ? `, ${entrant.youthGrade}` : ""}</td></tr>
          ${entrant.guardianName ? `<tr style="background:#F5EDD4"><td style="padding:7px 12px;border:1px solid #E8DFC8;font-weight:bold;color:#5C4A32">Parent/Guardian</td><td style="padding:7px 12px;border:1px solid #E8DFC8">${entrant.guardianName}</td></tr>` : ""}
          <tr style="background:#F5EDD4"><td style="padding:7px 12px;border:1px solid #E8DFC8;font-weight:bold;color:#5C4A32">Email</td><td style="padding:7px 12px;border:1px solid #E8DFC8"><a href="mailto:${entrant.email}" style="color:#2C4A2E">${entrant.email}</a></td></tr>
          <tr><td style="padding:7px 12px;border:1px solid #E8DFC8;font-weight:bold;color:#5C4A32">Phone</td><td style="padding:7px 12px;border:1px solid #E8DFC8">${entrant.phone}</td></tr>
          <tr style="background:#F5EDD4"><td style="padding:7px 12px;border:1px solid #E8DFC8;font-weight:bold;color:#5C4A32">Address</td><td style="padding:7px 12px;border:1px solid #E8DFC8">${entrant.address}, ${entrant.city}, ${entrant.state} ${entrant.zip}</td></tr>
          <tr><td style="padding:7px 12px;border:1px solid #E8DFC8;font-weight:bold;color:#5C4A32">Total Entries</td><td style="padding:7px 12px;border:1px solid #E8DFC8;font-weight:bold;color:#2C4A2E">${entries.length}</td></tr>
        </table>

        <!-- Entries -->
        <p style="margin:0 0 8px;font-size:13px;font-weight:bold;color:#2C4A2E;text-transform:uppercase;letter-spacing:0.08em">Exhibit Entries (${entries.length})</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 20px">
          <thead>
            <tr style="background:#2C4A2E">
              <th style="padding:9px 12px;text-align:left;font-size:11px;font-weight:bold;color:#D4A827;text-transform:uppercase;border:1px solid #2C4A2E">Dept</th>
              <th style="padding:9px 12px;text-align:left;font-size:11px;font-weight:bold;color:#D4A827;text-transform:uppercase;border:1px solid #2C4A2E">Division</th>
              <th style="padding:9px 12px;text-align:left;font-size:11px;font-weight:bold;color:#D4A827;text-transform:uppercase;border:1px solid #2C4A2E">Class</th>
              <th style="padding:9px 12px;text-align:left;font-size:11px;font-weight:bold;color:#D4A827;text-transform:uppercase;border:1px solid #2C4A2E">Lot</th>
              <th style="padding:9px 12px;text-align:left;font-size:11px;font-weight:bold;color:#D4A827;text-transform:uppercase;border:1px solid #2C4A2E">Description</th>
            </tr>
          </thead>
          <tbody>${entryRows}</tbody>
        </table>

        <p style="margin:0;font-size:13px;color:#5C4A32">
          View and manage this submission in the staff dashboard:<br>
          <a href="${adminUrl}" style="color:#2C4A2E;font-weight:bold">${adminUrl}</a>
        </p>

      </td>
    </tr>

    <tr>
      <td style="background:#1E3320;padding:14px 28px;text-align:center">
        <p style="margin:0;font-size:11px;color:#A8BFA9">West Tennessee State Fair ${FAIR_YEAR} · Staff Notification · Do not reply to this email</p>
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
        `  ${i + 1}. ${e.department} / ${e.division} / ${e.class_name} / ${e.lot}${e.entry_title ? ` — ${e.entry_title}` : e.entry_description ? ` — ${e.entry_description}` : ""}`
    )
    .join("\n");

  const text = `NEW EXHIBIT REGISTRATION — WTSF ${FAIR_YEAR}

Submission Reference: ${submissionRef}
Submitted: ${submittedAt}

ENTRANT:
  Name: ${entrant.lastName}, ${entrant.firstName}
  Type: ${entrant.entrantType === "adult" ? "Adult" : "Youth"}${entrant.youthAge ? ` (Age ${entrant.youthAge})` : ""}
  ${entrant.guardianName ? `Parent/Guardian: ${entrant.guardianName}\n  ` : ""}Email: ${entrant.email}
  Phone: ${entrant.phone}
  Address: ${entrant.address}, ${entrant.city}, ${entrant.state} ${entrant.zip}

ENTRIES (${entries.length}):
${entryText}

Admin dashboard: ${adminUrl}`;

  return {
    subject: `[WTSF ${FAIR_YEAR}] New Exhibit Registration — ${submissionRef} (${entrant.lastName}, ${entrant.firstName})`,
    html,
    text,
  };
}
