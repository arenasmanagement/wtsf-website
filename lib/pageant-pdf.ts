// Real PDF files for pageant paperwork (admin only).
//
// The PDFs are built entirely in the logged-in administrator's browser from the
// authenticated admin API response, then handed to the browser as a download.
// Nothing is uploaded, stored on a server, or given a public URL.

import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb, type RGB } from "pdf-lib";
import { PAGEANT_DIVISIONS, PAGEANT_VENUE, PAGEANT_LOCATION, getDivisionById } from "@/lib/pageant-config";
import {
  MEDIA_RELEASE_TEXT,
  ageOnPageantDay,
  answer as val,
  fmtDateTime,
  formSections,
  paymentSection,
  printedAtNow,
  questionsAskedFor,
  type Answer,
  ruleSetFor,
  sortForPrint,
  type PrintableRegistration,
} from "@/lib/pageant-print";

// ── Page geometry (US Letter, points) ─────────────────────────────────────────
const PAGE_W = 612;
const PAGE_H = 792;
const MARGIN = 43; // 0.6 in
const CONTENT_W = PAGE_W - MARGIN * 2;
const FOOTER_H = 30;
const BOTTOM = MARGIN + FOOTER_H;
const BLACK = rgb(0, 0, 0);
const GRAY = rgb(0.33, 0.33, 0.33);
const LIGHT = rgb(0.6, 0.6, 0.6);

export const DIVISION_ORDER = PAGEANT_DIVISIONS.map((d) => d.id);

interface Fonts { reg: PDFFont; bold: PDFFont; ital: PDFFont }

// ── Text helpers ──────────────────────────────────────────────────────────────

const encodable = new Map<string, boolean>();
/** Replace characters the standard PDF fonts cannot draw (e.g. emoji) with "?". */
function clean(text: string, font: PDFFont): string {
  let out = "";
  for (const ch of text.replace(/\r\n?/g, "\n").replace(/\t/g, " ")) {
    if (ch === "\n") { out += ch; continue; }
    let ok = encodable.get(ch);
    if (ok === undefined) {
      try { font.widthOfTextAtSize(ch, 10); ok = true; } catch { ok = false; }
      encodable.set(ch, ok);
    }
    out += ok ? ch : "?";
  }
  return out;
}

/** Word-wrap text to a width. Honors line breaks typed by the parent. Never drops text. */
function wrap(text: string, font: PDFFont, size: number, width: number): string[] {
  const lines: string[] = [];
  for (const para of clean(text, font).split("\n")) {
    const words = para.split(/ +/).filter((w) => w.length > 0);
    if (words.length === 0) { lines.push(""); continue; }
    let line = "";
    for (let word of words) {
      // Break a single word that is wider than the column.
      while (font.widthOfTextAtSize(word, size) > width) {
        let i = 1;
        while (i < word.length && font.widthOfTextAtSize(word.slice(0, i + 1), size) <= width) i++;
        if (line) { lines.push(line); line = ""; }
        lines.push(word.slice(0, i));
        word = word.slice(i);
      }
      const candidate = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(candidate, size) <= width) line = candidate;
      else { lines.push(line); line = word; }
    }
    if (line) lines.push(line);
  }
  // Trim trailing blank lines from trailing newlines.
  while (lines.length > 1 && lines[lines.length - 1] === "") lines.pop();
  return lines;
}

// ── Simple flowing-layout writer ──────────────────────────────────────────────

class Writer {
  pdf: PDFDocument;
  f: Fonts;
  page!: PDFPage;
  y = 0;
  /** Footer label for each page index. */
  labels: string[] = [];
  private contHeader: string | null = null;

  constructor(pdf: PDFDocument, f: Fonts) { this.pdf = pdf; this.f = f; }

  newPage(label: string, contHeader: string | null = null): void {
    this.page = this.pdf.addPage([PAGE_W, PAGE_H]);
    this.labels.push(label);
    this.y = PAGE_H - MARGIN;
    this.contHeader = contHeader;
    if (contHeader) {
      this.text(contHeader, MARGIN, this.f.ital, 9, GRAY);
      this.y -= 4;
      this.rule(0.5, LIGHT);
      this.y -= 8;
    }
  }

  /** Start a new page (keeping the same footer label) if `h` points will not fit. */
  ensure(h: number): boolean {
    if (this.y - h >= BOTTOM) return false;
    this.newPage(this.labels[this.labels.length - 1], this.contHeader);
    return true;
  }

  setContinuation(header: string | null): void { this.contHeader = header; }

  text(s: string, x: number, font: PDFFont, size: number, color: RGB = BLACK): void {
    this.page.drawText(clean(s, font), { x, y: this.y - size, size, font, color });
    this.y -= size * 1.25;
  }

  centered(s: string, font: PDFFont, size: number, color: RGB = BLACK): void {
    const t = clean(s, font);
    const w = font.widthOfTextAtSize(t, size);
    this.page.drawText(t, { x: (PAGE_W - w) / 2, y: this.y - size, size, font, color });
    this.y -= size * 1.3;
  }

  rule(thickness = 1, color: RGB = BLACK, x1 = MARGIN, x2 = PAGE_W - MARGIN): void {
    this.page.drawLine({ start: { x: x1, y: this.y }, end: { x: x2, y: this.y }, thickness, color });
  }

  /** Draw pre-wrapped lines at x starting at the current y without moving y. Returns height used. */
  lines(ls: string[], x: number, font: PDFFont, size: number, color: RGB = BLACK, lh = 1.3): number {
    let yy = this.y;
    for (const l of ls) {
      this.page.drawText(l, { x, y: yy - size, size, font, color });
      yy -= size * lh;
    }
    return this.y - yy;
  }

  paragraph(s: string, font: PDFFont, size: number, x = MARGIN, width = CONTENT_W, color: RGB = BLACK): void {
    for (const l of wrap(s, font, size, width)) {
      this.ensure(size * 1.3);
      this.page.drawText(l, { x, y: this.y - size, size, font, color });
      this.y -= size * 1.3;
    }
  }

  checkbox(x: number, checked: boolean, size = 10): void {
    const top = this.y - 1;
    this.page.drawRectangle({ x, y: top - size, width: size, height: size, borderColor: BLACK, borderWidth: 1 });
    if (checked) {
      this.page.drawLine({ start: { x: x + 2, y: top - size * 0.55 }, end: { x: x + size * 0.42, y: top - size + 2 }, thickness: 1.4, color: BLACK });
      this.page.drawLine({ start: { x: x + size * 0.42, y: top - size + 2 }, end: { x: x + size - 1.5, y: top - 1.5 }, thickness: 1.4, color: BLACK });
    }
  }

  /** Stamp footers on every page once the document is complete. */
  footers(line2: string): void {
    const pages = this.pdf.getPages();
    pages.forEach((p, i) => {
      const y1 = MARGIN - 2;
      p.drawLine({ start: { x: MARGIN, y: y1 + 14 }, end: { x: PAGE_W - MARGIN, y: y1 + 14 }, thickness: 0.6, color: BLACK });
      const label = clean(this.labels[i] ?? "", this.f.reg);
      p.drawText(label, { x: MARGIN, y: y1 + 4, size: 8, font: this.f.reg, color: BLACK });
      const pg = `Page ${i + 1} of ${pages.length}`;
      p.drawText(pg, { x: PAGE_W - MARGIN - this.f.bold.widthOfTextAtSize(pg, 8), y: y1 + 4, size: 8, font: this.f.bold, color: BLACK });
      p.drawText(clean(line2, this.f.ital), { x: MARGIN, y: y1 - 6, size: 7, font: this.f.ital, color: GRAY });
    });
  }
}

// ── Complete registration forms ───────────────────────────────────────────────

const LABEL_W = 165;
const ANSWER_X = MARGIN + LABEL_W + 10;
const ANSWER_W = CONTENT_W - LABEL_W - 10;

function sectionHeading(w: Writer, title: string): void {
  w.ensure(40);
  w.y -= 6;
  w.text(title.toUpperCase(), MARGIN, w.f.bold, 10);
  w.y += 1;
  w.rule(1.2);
  w.y -= 4;
}

function qaRow(w: Writer, question: string, answer: Answer, sectionTitle: string): void {
  const qLines = wrap(question, w.f.reg, 9, LABEL_W);
  let aFont = w.f.bold, aSize = 10, aColor: RGB = BLACK, aText: string;
  if (answer.kind === "value") aText = answer.text;
  else if (answer.kind === "missing") { aText = "Not provided"; aFont = w.f.ital; }
  else { aText = "Not asked for this division"; aFont = w.f.ital; aColor = GRAY; aSize = 9; }
  const aLines = wrap(aText, aFont, aSize, ANSWER_W);
  const h = Math.max(qLines.length * 9 * 1.3, aLines.length * aSize * 1.3) + 6;
  if (w.ensure(h)) {
    w.text(`${sectionTitle.toUpperCase()} (continued)`, MARGIN, w.f.bold, 10);
    w.y += 1; w.rule(1.2); w.y -= 4;
  }
  w.y -= 2;
  w.lines(qLines, MARGIN, w.f.reg, 9, GRAY);
  w.lines(aLines, ANSWER_X, aFont, aSize, aColor);
  w.y -= h - 2;
  w.page.drawLine({ start: { x: MARGIN, y: w.y + 1 }, end: { x: PAGE_W - MARGIN, y: w.y + 1 }, thickness: 0.4, color: LIGHT, dashArray: [1.5, 1.5] });
}

function writeForm(w: Writer, reg: PrintableRegistration): void {
  const name = `${reg.contestant_first_name} ${reg.contestant_last_name}`;
  const label = `${name} — ${reg.division_name} · Registration ID ${reg.id}`;
  w.newPage(label, null);

  // Header
  w.centered("WEST TENNESSEE STATE FAIR", w.f.bold, 15);
  w.centered("Traditional Pageants — October 17, 2026", w.f.bold, 12);
  w.centered(`${PAGEANT_VENUE} · ${PAGEANT_LOCATION} · Official Registration Form (as submitted online)`, w.f.reg, 8.5);
  w.y -= 2; w.rule(1.5); w.y -= 10;

  // Identity box
  const boxH = 42;
  w.page.drawRectangle({ x: MARGIN, y: w.y - boxH, width: CONTENT_W, height: boxH, borderColor: BLACK, borderWidth: 1 });
  const top = w.y;
  w.y = top - 6;
  w.text("CONTESTANT", MARGIN + 8, w.f.reg, 7.5, GRAY);
  w.text(name, MARGIN + 8, w.f.bold, 16);
  const divText = clean(reg.division_name, w.f.bold);
  const dw = w.f.bold.widthOfTextAtSize(divText, 13);
  w.page.drawText(divText, { x: PAGE_W - MARGIN - 8 - dw, y: top - 21, size: 13, font: w.f.bold });
  const st = `Status: ${reg.status.replace(/_/g, " ")}`;
  w.page.drawText(st, { x: PAGE_W - MARGIN - 8 - w.f.reg.widthOfTextAtSize(st, 9), y: top - 34, size: 9, font: w.f.reg });
  w.y = top - boxH - 6;

  w.setContinuation(`${name} — ${reg.division_name} — Registration Form (continued)`);

  for (const sec of formSections(reg)) {
    sectionHeading(w, sec.title);
    for (const [q, a] of sec.rows) qaRow(w, q, a, sec.title);
  }

  // Agreements
  const ruleSet = ruleSetFor(reg);
  sectionHeading(w, "Agreements & Acknowledgments");
  const agreements: [boolean, string][] = [
    [reg.rules_agreed, `I have read and agree to the ${ruleSet.title}.`],
    [reg.media_release_agreed, MEDIA_RELEASE_TEXT],
  ];
  for (const [checked, txt] of agreements) {
    const ls = wrap(txt, w.f.reg, 10, CONTENT_W - 20);
    w.ensure(ls.length * 13 + 6);
    w.checkbox(MARGIN, checked);
    w.lines(ls, MARGIN + 18, w.f.reg, 10);
    w.y -= ls.length * 13 + 5;
  }
  qaRow(w, "Rules Agreed", val(reg.rules_agreed ? "Yes" : "No"), "Agreements & Acknowledgments");
  qaRow(w, "Photo / Media Release", val(reg.media_release_agreed ? "Granted" : "Not granted"), "Agreements & Acknowledgments");
  qaRow(w, "Rules Version on File", val(reg.rules_version ?? "Not recorded"), "Agreements & Acknowledgments");
  qaRow(w, "Agreed Electronically On", val(reg.acknowledged_at ? fmtDateTime(reg.acknowledged_at) : "Not recorded"), "Agreements & Acknowledgments");
  qaRow(w, "Signature", val("Agreed electronically online. No handwritten signature was collected."), "Agreements & Acknowledgments");

  // Payment
  const pay = paymentSection(reg);
  sectionHeading(w, pay.title);
  for (const [q, a] of pay.rows) qaRow(w, q, a, pay.title);

  // Rules text as agreed
  sectionHeading(w, `${ruleSet.title} (as agreed)`);
  for (const r of ruleSet.rules) {
    w.ensure(22);
    w.paragraph(`${r.number}. ${r.title}`, w.f.bold, 8);
    w.paragraph(r.body, w.f.reg, 8);
    w.y -= 2;
  }
  w.setContinuation(null);
}

function writeContents(w: Writer, regs: PrintableRegistration[], startPages: Map<string, number>): void {
  w.y = PAGE_H - MARGIN;
  w.centered("WEST TENNESSEE STATE FAIR", w.f.bold, 15);
  w.centered("Traditional Pageants — October 17, 2026", w.f.bold, 12);
  w.centered("Complete Registration Forms — Confirmed Contestants", w.f.reg, 11);
  w.centered(`${regs.length} confirmed contestants · Printed ${printedAtNow()}`, w.f.reg, 9);
  w.y -= 2; w.rule(1.5); w.y -= 12;
  for (const d of PAGEANT_DIVISIONS) {
    const group = regs.filter((r) => r.division_id === d.id);
    w.text(`${d.name} (${d.ageLabel}) — ${group.length} contestant${group.length === 1 ? "" : "s"}`, MARGIN, w.f.bold, 10);
    w.y -= 1;
    if (group.length === 0) { w.text("No confirmed contestants", MARGIN + 14, w.f.ital, 9, GRAY); }
    for (const r of group) {
      const n = `${r.contestant_last_name}, ${r.contestant_first_name}`;
      const pg = `page ${startPages.get(r.id)}`;
      const nameT = clean(n, w.f.reg);
      w.page.drawText(nameT, { x: MARGIN + 14, y: w.y - 9.5, size: 9.5, font: w.f.reg });
      w.page.drawText(pg, { x: PAGE_W - MARGIN - w.f.reg.widthOfTextAtSize(pg, 9.5), y: w.y - 9.5, size: 9.5, font: w.f.reg });
      const dotsX1 = MARGIN + 18 + w.f.reg.widthOfTextAtSize(nameT, 9.5);
      w.page.drawLine({ start: { x: dotsX1, y: w.y - 9 }, end: { x: PAGE_W - MARGIN - w.f.reg.widthOfTextAtSize(pg, 9.5) - 4, y: w.y - 9 }, thickness: 0.4, color: LIGHT, dashArray: [1, 2] });
      w.y -= 12.5;
    }
    w.y -= 6;
  }
}

/** Keep only confirmed registrations, once each, in division then name order. */
export function prepareConfirmed<T extends PrintableRegistration>(regs: T[]): T[] {
  const seen = new Set<string>();
  const unique = regs.filter((r) => r.status === "CONFIRMED" && !seen.has(r.id) && (seen.add(r.id), true));
  return sortForPrint(unique, DIVISION_ORDER);
}

async function newDoc(title: string): Promise<{ pdf: PDFDocument; f: Fonts }> {
  const pdf = await PDFDocument.create();
  pdf.setTitle(title);
  pdf.setAuthor("West Tennessee State Fair");
  pdf.setSubject("Confidential — authorized pageant staff only");
  pdf.setCreator("wtsfair.com pageant admin");
  const f = {
    reg: await pdf.embedFont(StandardFonts.Helvetica),
    bold: await pdf.embedFont(StandardFonts.HelveticaBold),
    ital: await pdf.embedFont(StandardFonts.HelveticaOblique),
  };
  return { pdf, f };
}

/** One PDF: contents page, then each confirmed contestant's complete form starting on a new page. */
export async function buildCompleteRegistrationsPdf(input: PrintableRegistration[]): Promise<Uint8Array> {
  const regs = prepareConfirmed(input);
  const { pdf, f } = await newDoc("2026 WTSF Traditional Pageants — Complete Registration Forms");
  const w = new Writer(pdf, f);

  // Contents page first (filled in after we know page numbers).
  w.newPage("Contents");
  const contentsPage = w.page;

  const startPages = new Map<string, number>();
  for (const r of regs) {
    startPages.set(r.id, pdf.getPageCount() + 1);
    writeForm(w, r);
  }

  w.page = contentsPage;
  writeContents(w, regs, startPages);
  w.footers("CONFIDENTIAL — contains personal information about minors. Authorized West Tennessee State Fair pageant staff only.");
  return pdf.save();
}

/** Check-in sheets: each division on its own page(s). */
export async function buildCheckInPdf(input: PrintableRegistration[]): Promise<Uint8Array> {
  const regs = prepareConfirmed(input);
  const { pdf, f } = await newDoc("2026 WTSF Pageant Check-In Sheets");
  const w = new Writer(pdf, f);

  const cols = [
    { title: "In", w: 30 },
    { title: "#", w: 22 },
    { title: "Contestant Name", w: 140 },
    { title: "Parent / Guardian", w: 130 },
    { title: "Contestant No.", w: 70 },
    { title: "Notes", w: CONTENT_W - (30 + 22 + 140 + 130 + 70) },
  ];
  const ROW_H = 30;
  const HEAD_H = 18;

  const pageHeader = (divTitle: string, sub: string, cont: boolean) => {
    w.centered("2026 WEST TENNESSEE STATE FAIR — PAGEANT CHECK-IN SHEETS", w.f.bold, 13);
    w.centered(`Traditional Pageants · Saturday, October 17, 2026 · ${PAGEANT_VENUE}, ${PAGEANT_LOCATION}`, w.f.reg, 9);
    w.y -= 2; w.rule(1.5); w.y -= 10;
    w.text(`${divTitle}${cont ? " (continued)" : ""}`, MARGIN, w.f.bold, 14);
    w.text(sub, MARGIN, w.f.reg, 10);
    w.y -= 6;
  };
  const tableHeader = () => {
    const top = w.y;
    w.page.drawRectangle({ x: MARGIN, y: top - HEAD_H, width: CONTENT_W, height: HEAD_H, color: rgb(0.88, 0.88, 0.88), borderColor: BLACK, borderWidth: 0.8 });
    let x = MARGIN;
    for (const c of cols) {
      w.page.drawText(c.title, { x: x + 4, y: top - 12.5, size: 8.5, font: w.f.bold });
      x += c.w;
    }
    w.y = top - HEAD_H;
  };

  for (const d of PAGEANT_DIVISIONS) {
    const group = regs.filter((r) => r.division_id === d.id);
    if (group.length === 0) continue;
    const divTitle = `${d.name} (Ages ${d.ageLabel})`;
    const sub = `Arrival ${d.arrivalTime} · Competition ${d.competitionTime} · ${group.length} confirmed contestant${group.length === 1 ? "" : "s"}`;
    w.newPage(`Check-In — ${d.name}`);
    pageHeader(divTitle, sub, false);
    tableHeader();

    group.forEach((r, i) => {
      if (w.y - ROW_H < BOTTOM + 40) {
        w.newPage(`Check-In — ${d.name}`);
        pageHeader(divTitle, sub, true);
        tableHeader();
      }
      const top = w.y;
      w.page.drawRectangle({ x: MARGIN, y: top - ROW_H, width: CONTENT_W, height: ROW_H, borderColor: BLACK, borderWidth: 0.8 });
      let x = MARGIN;
      cols.forEach((c, ci) => {
        if (ci > 0) w.page.drawLine({ start: { x, y: top }, end: { x, y: top - ROW_H }, thickness: 0.6, color: BLACK });
        x += c.w;
      });
      // check box
      w.page.drawRectangle({ x: MARGIN + 8, y: top - ROW_H / 2 - 7, width: 14, height: 14, borderColor: BLACK, borderWidth: 1.2 });
      const cell = (ci: number, s: string, font: PDFFont, size: number) => {
        const cx = MARGIN + cols.slice(0, ci).reduce((a, c) => a + c.w, 0) + 4;
        const ls = wrap(s, font, size, cols[ci].w - 8).slice(0, 2);
        const blockH = ls.length * size * 1.15;
        let yy = top - (ROW_H - blockH) / 2 - size + 1;
        for (const l of ls) { w.page.drawText(l, { x: cx, y: yy, size, font }); yy -= size * 1.15; }
      };
      cell(1, String(i + 1), w.f.reg, 9);
      cell(2, `${r.contestant_first_name} ${r.contestant_last_name}`, w.f.bold, 10);
      cell(3, r.guardian_name, w.f.reg, 9.5);
      w.y = top - ROW_H;
    });

    w.y -= 18;
    w.text(`Checked in: _______ of ${group.length}        Staff initials: ____________        Time completed: ____________`, MARGIN, w.f.reg, 9.5);
  }

  if (regs.length === 0) { w.newPage("Check-In"); w.text("No confirmed contestants.", MARGIN, w.f.reg, 12); }
  w.footers("CONFIDENTIAL — contains personal information about minors. Authorized West Tennessee State Fair pageant staff only.");
  return pdf.save();
}

/**
 * Emcee introduction sheets: one contestant per page, large type.
 * Only introduction answers the form actually collected for that division.
 * No date of birth, contact details, guardian details or payment information.
 */
export async function buildIntroSheetsPdf(input: PrintableRegistration[]): Promise<Uint8Array> {
  const regs = prepareConfirmed(input);
  const { pdf, f } = await newDoc("2026 WTSF Pageant Emcee Introduction Sheets");
  const w = new Writer(pdf, f);

  for (const r of regs) {
    const d = getDivisionById(r.division_id);
    const name = `${r.contestant_first_name} ${r.contestant_last_name}`;
    w.newPage(`${name} — ${r.division_name}`);
    w.centered("2026 West Tennessee State Fair · Traditional Pageants · Emcee Introduction Sheet", w.f.reg, 9);
    w.y -= 2; w.rule(1); w.y -= 14;

    // Division band + contestant number blank
    const band = `${r.division_name.toUpperCase()}${d ? `  ·  Ages ${d.ageLabel}` : ""}`;
    const top = w.y;
    w.page.drawRectangle({ x: MARGIN, y: top - 30, width: CONTENT_W, height: 30, borderColor: BLACK, borderWidth: 1.5 });
    w.page.drawText(clean(band, w.f.bold), { x: MARGIN + 10, y: top - 20, size: 14, font: w.f.bold });
    const num = "Contestant No. ______";
    w.page.drawText(num, { x: PAGE_W - MARGIN - 10 - w.f.bold.widthOfTextAtSize(num, 14), y: top - 20, size: 14, font: w.f.bold });
    w.y = top - 30 - 26;

    for (const l of wrap(name, w.f.bold, 32, CONTENT_W)) { w.page.drawText(l, { x: MARGIN, y: w.y - 32, size: 32, font: w.f.bold }); w.y -= 38; }
    const age = ageOnPageantDay(r.contestant_dob);
    if (age) w.text(age, MARGIN, w.f.reg, 18);
    w.y -= 14;

    const asked = questionsAskedFor(r.division_id);
    const show = (a: Answer) => (a.kind === "value" ? a.text : "Not provided");
    // Short answers side by side to keep each contestant on one page.
    const pairs: [string, Answer][][] = [[["Hair Color", val(r.contestant_hair_color)], ["Eye Color", val(r.contestant_eye_color)]]];
    if (asked.schoolGrade) pairs.push([["School", val(r.contestant_school)], ["Grade", val(r.contestant_grade)]]);
    const colW = (CONTENT_W - 20) / 2;
    for (const pair of pairs) {
      const wrapped = pair.map(([, a]) => wrap(show(a), a.kind === "value" ? w.f.reg : w.f.ital, 15, colW));
      const h = 14 + Math.max(...wrapped.map((l) => l.length)) * 19.5 + 12;
      w.ensure(h);
      const top = w.y;
      pair.forEach(([label, a], i) => {
        const x = MARGIN + i * (colW + 20);
        w.page.drawText(label.toUpperCase(), { x, y: top - 10, size: 10, font: w.f.bold, color: GRAY });
        wrapped[i].forEach((l, li) => w.page.drawText(l, { x, y: top - 14 - 15 - li * 19.5, size: 15, font: a.kind === "value" ? w.f.reg : w.f.ital }));
      });
      w.y = top - h;
    }

    const longItems: [string, Answer][] = [];
    if (asked.hobbies) longItems.push(["Hobbies", val(r.contestant_hobbies)]);
    if (asked.ambitions) longItems.push(["Ambitions / Goals", val(r.contestant_ambitions)]);
    for (const [label, a] of longItems) {
      const font = a.kind === "value" ? w.f.reg : w.f.ital;
      const ls = wrap(show(a), font, 15, CONTENT_W);
      w.ensure(14 + Math.min(ls.length, 3) * 19.5);
      w.text(label.toUpperCase(), MARGIN, w.f.bold, 10, GRAY);
      w.y -= 2;
      for (const l of ls) {
        w.ensure(19.5);
        w.page.drawText(l, { x: MARGIN, y: w.y - 15, size: 15, font });
        w.y -= 19.5;
      }
      w.y -= 12;
    }

    if (!asked.hobbies) {
      w.y -= 4;
      w.paragraph(`The ${r.division_name} registration form did not ask about hobbies, school or goals.`, w.f.ital, 10, MARGIN, CONTENT_W, GRAY);
    }
  }

  if (regs.length === 0) { w.newPage("Introductions"); w.text("No confirmed contestants.", MARGIN, w.f.reg, 12); }
  w.footers("Answers as submitted by the parent/guardian at registration. Introduction details only — no contact or payment information.");
  return pdf.save();
}

/** Hand PDF bytes to the browser as a file download (in-memory blob; nothing is uploaded). */
export function downloadPdf(bytes: Uint8Array, filename: string): void {
  const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
