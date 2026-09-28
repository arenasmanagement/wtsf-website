/**
 * Phone number formatting utilities for Got Talent admin.
 *
 * Normalizes common U.S. phone number variants to (###) ###-####.
 * International or unrecognized formats are returned as-is (trimmed).
 */

/**
 * Format a raw phone string for display.
 *
 * Handles:
 *   7315550100        → (731) 555-0100
 *   731-555-0100      → (731) 555-0100
 *   (731) 555-0100    → (731) 555-0100
 *   731 555 0100      → (731) 555-0100
 *   17315550100       → +1 (731) 555-0100
 *
 * Non-standard numbers are returned trimmed without modification.
 */
export function formatPhone(raw: string | null | undefined): string {
  if (!raw) return "";
  const digits = raw.replace(/\D/g, "");

  if (digits.length === 11 && digits[0] === "1") {
    const d = digits.slice(1);
    return `+1 (${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  // Not a recognizable US number — return trimmed original
  return raw.trim();
}

/**
 * Return a normalized tel: href value for a phone number.
 *
 * 10-digit → +1XXXXXXXXXX
 * 11-digit starting with 1 → +1XXXXXXXXXX
 * Other → passthrough
 */
export function phoneHref(raw: string | null | undefined): string {
  if (!raw) return "";
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 11 && digits[0] === "1") return `+${digits}`;
  if (digits.length === 10) return `+1${digits}`;
  return raw.trim();
}
