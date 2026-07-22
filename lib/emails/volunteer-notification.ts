// Notification email sent to the fair when a volunteer interest form is submitted.
import { FAIR_CONFIG } from "@/lib/fair-config";

const YEAR = FAIR_CONFIG.year;

export interface VolunteerNotificationData {
  submittedAt: string;
  personal: {
    fullName: string;
    ageGroup: string;   // "adult" | "minor"
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  interest: {
    preferredAreaLabel: string;
    otherExplanation?: string;
  };
  availability: {
    availableDays: string[];
    preferredStartTime?: string;
    preferredEndTime?: string;
    multipleShifts: string;
    unavailableTimes?: string;
  };
  experience: {
    volunteeredBefore: string;
    priorRoleYear?: string;
    relevantExperience?: string;
    physicalConsiderations?: string;
    notes?: string;
  };
  applicantName: string;
}

export function buildVolunteerNotificationEmail(data: VolunteerNotificationData): {
  subject: string; html: string; text: string;
} {
  const { personal, interest, availability, experience, submittedAt } = data;

  const row = (label: string, value: string, bg = "#FDFAF3") =>
    `<tr style="background:${bg}"><td style="padding:7px 12px;border:1px solid #E8DFC8;width:38%;font-weight:bold;color:#5C4A32;font-size:13px">${label}</td><td style="padding:7px 12px;border:1px solid #E8DFC8;color:#2C4A2E;font-size:13px">${value || "—"}</td></tr>`;

  const ageLabel = personal.ageGroup === "adult" ? "18 or older" : "Under 18 (parental authorization may be required)";

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:24px 16px">
<tr><td>
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #ddd">
    <tr>
      <td style="background:#2C4A2E;padding:20px 28px">
        <p style="margin:0 0 2px;font-size:10px;font-weight:bold;letter-spacing:0.2em;color:#D4A827;text-transform:uppercase">Volunteer Interest Form</p>
        <h1 style="margin:0;font-size:18px;color:#F5EDD4;font-family:Georgia,serif;font-style:italic">New Volunteer Interest — WTSF ${YEAR}</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:24px 28px">

        <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;background:#F5EDD4;border-left:4px solid #D4A827;padding:14px 18px">
          <tr><td>
            <span style="font-size:11px;font-weight:bold;letter-spacing:0.1em;color:#8B7355;text-transform:uppercase">Preferred Volunteer Area</span><br>
            <span style="font-size:18px;font-weight:bold;color:#2C4A2E;font-family:Georgia,serif">${interest.preferredAreaLabel}</span><br>
            ${interest.otherExplanation ? `<span style="font-size:13px;color:#5C4A32;margin-top:4px;display:block">${interest.otherExplanation}</span>` : ""}
            <span style="font-size:12px;color:#5C4A32;margin-top:8px;display:block">Submitted: ${submittedAt}</span>
          </td></tr>
        </table>

        <p style="margin:0 0 8px;font-size:13px;font-weight:bold;color:#2C4A2E;text-transform:uppercase;letter-spacing:0.08em">Personal Information</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 20px">
          ${row("Full Name",    personal.fullName)}
          ${row("Age Group",   ageLabel, "#fff")}
          ${row("Email",       `<a href="mailto:${personal.email}" style="color:#2C4A2E">${personal.email}</a>`)}
          ${row("Phone",       personal.phone, "#fff")}
          ${row("Address",     `${personal.address}, ${personal.city}, ${personal.state} ${personal.zip}`)}
        </table>

        <p style="margin:0 0 8px;font-size:13px;font-weight:bold;color:#2C4A2E;text-transform:uppercase;letter-spacing:0.08em">Availability</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 20px">
          ${row("Available Days",       availability.availableDays.join(", "))}
          ${row("Preferred Hours",      [availability.preferredStartTime, availability.preferredEndTime].filter(Boolean).join(" – ") || "Not specified", "#fff")}
          ${row("Multiple Shifts",      availability.multipleShifts === "yes" ? "Yes, available for multiple shifts" : "No, single shift only")}
          ${availability.unavailableTimes ? row("Cannot Work", availability.unavailableTimes, "#fff") : ""}
        </table>

        <p style="margin:0 0 8px;font-size:13px;font-weight:bold;color:#2C4A2E;text-transform:uppercase;letter-spacing:0.08em">Experience</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 20px">
          ${row("Volunteered Before",     experience.volunteeredBefore === "yes" ? "Yes" : "No")}
          ${experience.priorRoleYear ? row("Prior Role / Year", experience.priorRoleYear, "#fff") : ""}
          ${experience.relevantExperience ? row("Relevant Experience", experience.relevantExperience) : ""}
          ${experience.physicalConsiderations ? row("Physical / Accessibility", experience.physicalConsiderations, "#fff") : ""}
          ${experience.notes ? row("Additional Notes", experience.notes) : ""}
          ${row("Applicant Signature", data.applicantName, "#fff")}
        </table>

      </td>
    </tr>
    <tr>
      <td style="background:#1E3320;padding:14px 28px;text-align:center">
        <p style="margin:0;font-size:11px;color:#A8BFA9">West Tennessee State Fair ${YEAR} · Volunteer Interest Form · Staff Copy</p>
      </td>
    </tr>
  </table>
</td></tr>
</table>
</body>
</html>`;

  const text = `NEW VOLUNTEER INTEREST FORM — WTSF ${YEAR}
Submitted: ${submittedAt}

PREFERRED AREA: ${interest.preferredAreaLabel}
${interest.otherExplanation ? `Details: ${interest.otherExplanation}` : ""}

PERSONAL:
  Name:    ${personal.fullName}
  Age:     ${ageLabel}
  Email:   ${personal.email}
  Phone:   ${personal.phone}
  Address: ${personal.address}, ${personal.city}, ${personal.state} ${personal.zip}

AVAILABILITY:
  Days:           ${availability.availableDays.join(", ")}
  Hours:          ${[availability.preferredStartTime, availability.preferredEndTime].filter(Boolean).join(" – ") || "Not specified"}
  Multiple Shifts:${availability.multipleShifts === "yes" ? "Yes" : "No"}
  ${availability.unavailableTimes ? `Cannot Work: ${availability.unavailableTimes}` : ""}

EXPERIENCE:
  Volunteered Before: ${experience.volunteeredBefore === "yes" ? "Yes" : "No"}
  ${experience.priorRoleYear ? `Prior Role/Year: ${experience.priorRoleYear}` : ""}
  ${experience.relevantExperience ? `Experience: ${experience.relevantExperience}` : ""}
  ${experience.physicalConsiderations ? `Physical/Accessibility: ${experience.physicalConsiderations}` : ""}
  ${experience.notes ? `Notes: ${experience.notes}` : ""}
  Signed by: ${data.applicantName}`;

  return {
    subject: `New Volunteer Interest Form — ${personal.fullName}`,
    html,
    text,
  };
}
