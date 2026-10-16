// Printable pageant registration forms (admin only).
//
// Builds HTML for a "completed registration form" that mirrors the questions
// parents/guardians answered on /pageants/register/[divisionId]. Question
// wording below is copied from that form. If the form changes, update here.
//
// All submitted values are HTML-escaped before rendering.

import { getDivisionById, PAGEANT_VENUE, PAGEANT_LOCATION } from "@/lib/pageant-config";
import { GENERAL_RULE_SET, JUNIOR_RULE_SET, getRuleSet, type PageantRuleSet } from "@/lib/pageant-rules";
import { escapeHtml } from "@/lib/emails/escape";

export interface PrintableRegistration {
  id: string;
  division_id: string;
  division_name: string;
  status: string;
  contestant_first_name: string;
  contestant_last_name: string;
  contestant_dob: string;
  contestant_age_months: number | null;
  contestant_school: string | null;
  contestant_grade: string | null;
  contestant_hair_color: string | null;
  contestant_eye_color: string | null;
  contestant_hobbies: string | null;
  contestant_ambitions: string | null;
  guardian_name: string;
  guardian_relationship: string | null;
  guardian_address: string;
  guardian_city: string;
  guardian_state: string;
  guardian_zip: string;
  guardian_phone: string;
  guardian_email: string;
  rules_agreed: boolean;
  rules_version: string | null;
  media_release_agreed: boolean;
  acknowledged_at: string | null;
  amount_cents: number | null;
  square_payment_id: string | null;
  square_order_id: string | null;
  paid_at: string | null;
  created_at: string;
  confirmed_at: string | null;
  cancelled_at: string | null;
  expired_at: string | null;
}

/** Columns needed to print a complete form. Never includes token hashes, IP or user agent. */
export const PRINTABLE_COLUMNS = [
  "id", "division_id", "division_name", "status",
  "contestant_first_name", "contestant_last_name", "contestant_dob", "contestant_age_months",
  "contestant_school", "contestant_grade", "contestant_hair_color", "contestant_eye_color",
  "contestant_hobbies", "contestant_ambitions",
  "guardian_name", "guardian_relationship", "guardian_address", "guardian_city",
  "guardian_state", "guardian_zip", "guardian_phone", "guardian_email",
  "rules_agreed", "rules_version", "media_release_agreed", "acknowledged_at",
  "amount_cents", "square_payment_id", "square_order_id", "paid_at",
  "created_at", "confirmed_at", "cancelled_at", "expired_at",
].join(", ");

/** Exact wording of the media release checkbox on the registration form. */
export const MEDIA_RELEASE_TEXT =
  "I grant the West Tennessee State Fair permission to photograph and/or record my child during the pageant for promotional and archival purposes.";

const e = (v: string) => escapeHtml(v);

export function fmtDateTime(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-US", {
    month: "long", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit",
    timeZone: "America/Chicago", timeZoneName: "short",
  });
}

export function fmtDob(dob: string): string {
  // Stored as YYYY-MM-DD; render without timezone shifting.
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dob);
  if (!m) return dob;
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  return `${months[parseInt(m[2], 10) - 1]} ${parseInt(m[3], 10)}, ${m[1]}`;
}

export function fmtDollars(cents: number | null): string {
  return cents === null ? "" : `$${(cents / 100).toFixed(2)}`;
}

export function ruleSetFor(reg: PrintableRegistration): PageantRuleSet {
  if (reg.rules_version === JUNIOR_RULE_SET.version) return JUNIOR_RULE_SET;
  if (reg.rules_version === GENERAL_RULE_SET.version) return GENERAL_RULE_SET;
  return getRuleSet(reg.division_id);
}

const NOT_PROVIDED = `<span class="np">Not provided</span>`;
const NOT_ASKED = `<span class="na">Not asked for this division</span>`;

/** One question/answer row. `asked=false` marks questions the form hid for this division. */
function qa(question: string, answer: string | null | undefined, asked = true): string {
  let value: string;
  if (!asked) value = NOT_ASKED;
  else if (answer === null || answer === undefined || answer.trim() === "") value = NOT_PROVIDED;
  else value = e(answer).replace(/\n/g, "<br>");
  return `<tr><th scope="row">${e(question)}</th><td>${value}</td></tr>`;
}

function section(title: string, rows: string): string {
  return `<section class="sec"><h3>${e(title)}</h3><table class="qa"><tbody>${rows}</tbody></table></section>`;
}

function checkbox(checked: boolean): string {
  return `<span class="box">${checked ? "&#10003;" : "&nbsp;"}</span>`;
}

export const PRINT_FORM_STYLES = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: #fff; color: #000; }
  body { font-family: Georgia, "Times New Roman", serif; font-size: 10.5pt; line-height: 1.35; }
  @page { size: letter portrait; margin: 0.6in; }
  .form { page-break-after: always; break-after: page; }
  .form:last-of-type { page-break-after: auto; break-after: auto; }
  .hdr { text-align: center; border-bottom: 2px solid #000; padding-bottom: 8pt; margin-bottom: 10pt; }
  .hdr .t1 { font-size: 14pt; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
  .hdr .t2 { font-size: 12pt; font-weight: bold; margin-top: 2pt; }
  .hdr .t3 { font-size: 9.5pt; margin-top: 3pt; }
  .ident { display: flex; justify-content: space-between; align-items: flex-end; border: 1px solid #000; padding: 6pt 8pt; margin-bottom: 10pt; }
  .ident .name { font-size: 15pt; font-weight: bold; }
  .ident .div { font-size: 11pt; font-weight: bold; text-align: right; }
  .ident .small { font-size: 9pt; font-weight: normal; }
  .sec { margin-bottom: 9pt; page-break-inside: avoid; break-inside: avoid; }
  .sec h3 { font-size: 10pt; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1.5px solid #000; padding: 2pt 0; margin-bottom: 2pt; }
  table.qa { width: 100%; border-collapse: collapse; }
  table.qa th { text-align: left; font-weight: normal; width: 34%; padding: 3pt 6pt 3pt 0; vertical-align: top; font-size: 9.5pt; color: #222; }
  table.qa td { padding: 3pt 0; vertical-align: top; font-weight: bold; border-bottom: 1px dotted #999; }
  table.qa tr { page-break-inside: avoid; break-inside: avoid; }
  .np { font-weight: normal; font-style: italic; }
  .na { font-weight: normal; font-style: italic; color: #555; }
  .ack { display: flex; gap: 8pt; align-items: flex-start; margin: 4pt 0; page-break-inside: avoid; break-inside: avoid; }
  .box { display: inline-block; width: 12pt; height: 12pt; border: 1.2px solid #000; text-align: center; line-height: 11pt; font-size: 10pt; font-weight: bold; flex-shrink: 0; }
  .ack-meta { font-size: 9pt; margin: 2pt 0 0 20pt; }
  .rules { font-size: 8pt; line-height: 1.3; margin-top: 4pt; column-count: 2; column-gap: 14pt; }
  .rules p { margin-bottom: 3pt; break-inside: avoid; page-break-inside: avoid; }
  .foot { margin-top: 10pt; padding-top: 5pt; border-top: 1px solid #000; font-size: 8pt; text-align: center; }
  .toolbar { text-align: center; padding: 10pt; border-bottom: 1px solid #ccc; margin-bottom: 14pt; font-family: Georgia, serif; }
  .toolbar button { padding: 7pt 18pt; font-size: 11pt; font-family: Georgia, serif; background: #000; color: #fff; border: none; border-radius: 4px; cursor: pointer; }
  .toolbar span { display: block; font-size: 9pt; margin-top: 5pt; color: #333; }
  @media print { .no-print { display: none !important; } }
`;

/** HTML for one complete registration form (one or more printed pages). */
export function buildRegistrationFormHtml(reg: PrintableRegistration, printedAt: string): string {
  const division = getDivisionById(reg.division_id);
  const ageMin = division?.ageMinMonths ?? 0;
  // Same visibility rules as the public form.
  const askSchoolGrade = ageMin >= 48;
  const askHobbies = ageMin >= 24;
  const askAmbitions = ageMin >= 48;
  const ruleSet = ruleSetFor(reg);
  const name = `${reg.contestant_first_name} ${reg.contestant_last_name}`;
  const statusLabel = reg.status.replace(/_/g, " ");

  const divisionRows =
    qa("Division", division ? `${reg.division_name} (Ages ${division.ageLabel})` : reg.division_name) +
    qa("Pageant Date", "October 17, 2026") +
    (division ? qa("Arrival Time", division.arrivalTime) + qa("Competition Time", division.competitionTime) : "");

  const contestantRows =
    qa("First Name", reg.contestant_first_name) +
    qa("Last Name", reg.contestant_last_name) +
    qa("Date of Birth", fmtDob(reg.contestant_dob)) +
    qa("Hair Color", reg.contestant_hair_color) +
    qa("Eye Color", reg.contestant_eye_color) +
    qa("School", reg.contestant_school, askSchoolGrade) +
    qa("Grade", reg.contestant_grade, askSchoolGrade) +
    qa("Hobbies", reg.contestant_hobbies, askHobbies) +
    qa("Ambitions / Goals", reg.contestant_ambitions, askAmbitions);

  const guardianRows =
    qa("Full Name", reg.guardian_name) +
    qa("Relationship to Contestant", reg.guardian_relationship) +
    qa("Street Address", reg.guardian_address) +
    qa("City", reg.guardian_city) +
    qa("State", reg.guardian_state) +
    qa("ZIP", reg.guardian_zip) +
    qa("Phone", reg.guardian_phone) +
    qa("Email Address", reg.guardian_email);

  const rulesList = ruleSet.rules
    .map((r) => `<p><strong>${r.number}. ${e(r.title)}</strong> ${e(r.body)}</p>`)
    .join("");

  const acknowledgments = `
    <section class="sec">
      <h3>Rules &amp; Agreements</h3>
      <div class="ack">${checkbox(reg.rules_agreed)}<div>I have read and agree to the ${e(ruleSet.title)}.</div></div>
      <div class="ack">${checkbox(reg.media_release_agreed)}<div>${e(MEDIA_RELEASE_TEXT)}</div></div>
      <div class="ack-meta">
        Recorded answers: Rules agreed — <strong>${reg.rules_agreed ? "Yes" : "No"}</strong>;
        Media release — <strong>${reg.media_release_agreed ? "Granted" : "Not granted"}</strong>.
        Rules version on file: <strong>${e(reg.rules_version ?? "Not recorded")}</strong>.
        Agreed electronically on: <strong>${reg.acknowledged_at ? e(fmtDateTime(reg.acknowledged_at)) : "Not recorded"}</strong>.
        No handwritten signature was collected online.
      </div>
    </section>`;

  const paymentRows =
    qa("Registration Status", statusLabel) +
    qa("Registration Submitted", fmtDateTime(reg.created_at)) +
    qa("Registration Confirmed", fmtDateTime(reg.confirmed_at)) +
    (reg.cancelled_at ? qa("Cancelled", fmtDateTime(reg.cancelled_at)) : "") +
    (reg.expired_at ? qa("Expired", fmtDateTime(reg.expired_at)) : "") +
    qa("Amount", fmtDollars(reg.amount_cents)) +
    qa("Paid", fmtDateTime(reg.paid_at)) +
    qa("Square Payment ID", reg.square_payment_id);

  return `
  <article class="form">
    <div class="hdr">
      <div class="t1">West Tennessee State Fair</div>
      <div class="t2">Traditional Pageants — October 17, 2026</div>
      <div class="t3">${e(PAGEANT_VENUE)} · ${e(PAGEANT_LOCATION)} · Official Registration Form (as submitted online)</div>
    </div>
    <div class="ident">
      <div><div class="small">Contestant</div><div class="name">${e(name)}</div></div>
      <div class="div">${e(reg.division_name)}<br><span class="small">Status: ${e(statusLabel)}</span></div>
    </div>
    ${section("Division", divisionRows)}
    ${section("Contestant Information", contestantRows)}
    ${section("Parent / Guardian Information", guardianRows)}
    ${acknowledgments}
    ${section("Registration & Payment", paymentRows)}
    <section class="sec">
      <h3>${e(ruleSet.title)} (as agreed)</h3>
      <div class="rules">${rulesList}</div>
    </section>
    <div class="foot">
      CONFIDENTIAL — contains information about a minor. Authorized pageant staff only.<br>
      Registration ID ${e(reg.id)} · Printed ${e(printedAt)}
    </div>
  </article>`;
}

export function printedAtNow(): string {
  return new Date().toLocaleString("en-US", {
    month: "long", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit", timeZone: "America/Chicago", timeZoneName: "short",
  });
}

/** Full HTML document containing one or many forms, each starting on a new page. */
export function buildFormsDocument(regs: PrintableRegistration[], title: string): string {
  const printedAt = printedAtNow();
  const forms = regs.map((r) => buildRegistrationFormHtml(r, printedAt)).join("");
  return `<!DOCTYPE html><html><head><meta charset="utf-8">
    <meta name="robots" content="noindex,nofollow">
    <title>${e(title)}</title><style>${PRINT_FORM_STYLES}</style></head>
    <body>
      <div class="toolbar no-print">
        <button onclick="window.print()">Print / Save as PDF</button>
        <span>${e(title)} — ${regs.length} form${regs.length === 1 ? "" : "s"}. Each contestant starts on a new page. Choose “Save as PDF” as the printer to make a PDF.</span>
      </div>
      ${forms}
    </body></html>`;
}

/** Opens a document in a new window and triggers the print dialog. Client-side only. */
export function openPrintDocument(html: string): void {
  const w = window.open("", "_blank", "width=900,height=750");
  if (!w) { alert("Please allow pop-ups for this site to print."); return; }
  w.document.open();
  w.document.write(html);
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 500);
}

/** Sort: division order, then last name, then first name. */
export function sortForPrint<T extends { division_id: string; contestant_last_name: string; contestant_first_name: string }>(
  regs: T[], divisionOrder: string[],
): T[] {
  return [...regs].sort((a, b) => {
    const da = divisionOrder.indexOf(a.division_id);
    const db = divisionOrder.indexOf(b.division_id);
    if (da !== db) return da - db;
    const l = a.contestant_last_name.localeCompare(b.contestant_last_name, undefined, { sensitivity: "base" });
    if (l !== 0) return l;
    return a.contestant_first_name.localeCompare(b.contestant_first_name, undefined, { sensitivity: "base" });
  });
}
