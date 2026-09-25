// Sent to Donna (GOT_TALENT_ADMIN_EMAIL) when a registration is CONFIRMED.

export interface GotTalentNotificationEmailData {
  actName: string;
  actType: string;
  isGroup: boolean;
  performerCount: number;
  primaryPerformerName: string;
  division: string;
  divisionLabel: string;
  requiresMusic: boolean;
  divisionConflict: boolean;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  amountPaidCents: number;
  registrationId: string;
  confirmedAt: Date;
}

function formatDollars(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function buildGotTalentNotificationEmail(data: GotTalentNotificationEmailData): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = `[Got Talent] New Registration — ${data.actName} (${data.divisionLabel})${data.divisionConflict ? " ⚠️ Division Review Needed" : ""}`;


  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>${subject}</title></head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:6px;overflow:hidden;border:1px solid #ddd;">
          <tr>
            <td style="background-color:#2C4A2E;padding:20px 28px;">
              <p style="margin:0;color:#D4A827;font-size:11px;letter-spacing:2px;text-transform:uppercase;">WTSF Got Talent Admin</p>
              <h2 style="margin:4px 0 0;color:#F5EDD4;font-size:20px;">New Registration Confirmed</h2>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;">
              ${data.divisionConflict ? `<div style="background-color:#FFF0F0;border:2px solid #E57373;border-radius:4px;padding:12px 16px;margin-bottom:20px;">
                <p style="margin:0;color:#8B2E2E;font-size:14px;font-weight:bold;">⚠️ Division Conflict — Manual Review Needed</p>
                <p style="margin:4px 0 0;color:#8B2E2E;font-size:13px;">This group has performers spanning multiple age divisions. Confirm correct division before performance day.</p>
              </div>` : ""}
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="padding:6px 0;font-size:13px;color:#666;width:160px;vertical-align:top;">Act Name</td><td style="padding:6px 0;font-size:13px;color:#1a1a1a;font-weight:bold;">${data.actName}</td></tr>
                <tr><td style="padding:6px 0;font-size:13px;color:#666;">Talent Type</td><td style="padding:6px 0;font-size:13px;color:#1a1a1a;">${data.actType}</td></tr>
                <tr><td style="padding:6px 0;font-size:13px;color:#666;">Division</td><td style="padding:6px 0;font-size:13px;color:#1a1a1a;">${data.divisionLabel}</td></tr>
                <tr><td style="padding:6px 0;font-size:13px;color:#666;">Solo / Group</td><td style="padding:6px 0;font-size:13px;color:#1a1a1a;">${data.isGroup ? `Group (${data.performerCount} performers)` : "Solo"}</td></tr>
                <tr><td style="padding:6px 0;font-size:13px;color:#666;">Primary Performer</td><td style="padding:6px 0;font-size:13px;color:#1a1a1a;">${data.primaryPerformerName}</td></tr>
                <tr><td style="padding:6px 0;font-size:13px;color:#666;">Music Required</td><td style="padding:6px 0;font-size:13px;color:#1a1a1a;">${data.requiresMusic ? "Yes" : "No"}</td></tr>
                <tr><td colspan="2" style="padding:8px 0;border-top:1px solid #eee;"></td></tr>
                <tr><td style="padding:6px 0;font-size:13px;color:#666;">Contact Name</td><td style="padding:6px 0;font-size:13px;color:#1a1a1a;">${data.contactName}</td></tr>
                <tr><td style="padding:6px 0;font-size:13px;color:#666;">Contact Email</td><td style="padding:6px 0;font-size:13px;color:#1a1a1a;"><a href="mailto:${data.contactEmail}" style="color:#2C4A2E;">${data.contactEmail}</a></td></tr>
                <tr><td style="padding:6px 0;font-size:13px;color:#666;">Contact Phone</td><td style="padding:6px 0;font-size:13px;color:#1a1a1a;">${data.contactPhone}</td></tr>
                <tr><td colspan="2" style="padding:8px 0;border-top:1px solid #eee;"></td></tr>
                <tr><td style="padding:6px 0;font-size:13px;color:#666;">Entry Fee Paid</td><td style="padding:6px 0;font-size:13px;color:#1a1a1a;font-weight:bold;">${formatDollars(data.amountPaidCents)}</td></tr>
                <tr><td style="padding:6px 0;font-size:13px;color:#666;">Registration ID</td><td style="padding:6px 0;font-size:13px;color:#666;">${data.registrationId}</td></tr>
                <tr><td style="padding:6px 0;font-size:13px;color:#666;">Confirmed At</td><td style="padding:6px 0;font-size:13px;color:#1a1a1a;">${data.confirmedAt.toLocaleString("en-US", { timeZone: "America/Chicago", dateStyle: "medium", timeStyle: "short" })} CT</td></tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f4f4f4;padding:16px 28px;text-align:center;">
              <p style="margin:0;font-size:11px;color:#999;">WTSF Got Talent Admin Notification</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `[Got Talent] New Registration — ${data.actName}

Act: ${data.actName}
Talent Type: ${data.actType}
Division: ${data.divisionLabel}
${data.isGroup ? `Group: ${data.performerCount} performers\nPrimary Performer: ${data.primaryPerformerName}` : "Solo"}
Music Required: ${data.requiresMusic ? "Yes" : "No"}
${data.divisionConflict ? "\n⚠️ DIVISION CONFLICT — Manual review needed\n" : ""}
Contact: ${data.contactName}
Email: ${data.contactEmail}
Phone: ${data.contactPhone}

Entry Fee Paid: ${formatDollars(data.amountPaidCents)}
Registration ID: ${data.registrationId}
Confirmed: ${data.confirmedAt.toISOString()}`;

  return { subject, html, text };
}
