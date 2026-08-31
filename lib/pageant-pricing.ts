/**
 * Server-side pricing for WTSF 2026 Traditional Fair Pageants.
 *
 * RULE: The amount charged is determined by when PAYMENT IS SUCCESSFULLY
 * COMPLETED — not when the registration form was submitted.
 *
 * - Payment completed on or before October 10, 2026 (America/Chicago) → base fee
 * - Payment completed on October 11, 2026 or later                    → base fee + late fee
 *
 * This function is the single authoritative source for pricing.
 * Call it every time a Square payment is created. Never reuse a stored amount.
 */

/**
 * Calculate the amount due in cents based on the current moment.
 *
 * @param now            The current UTC Date (new Date()) at moment of payment
 * @param entryFeeCents  Base entry fee in cents (from pageant_settings.entry_fee_cents)
 * @param lateFeeCents   Late fee amount in cents (from pageant_settings.late_fee_cents), or null if not set
 * @param lateFeeStartsAt ISO timestamp string or null (from pageant_settings.late_fee_begins_at)
 *                        Stored as the UTC equivalent of midnight America/Chicago on the late-fee start date.
 *                        Oct 11, 2026 00:00 CDT = 2026-10-11T05:00:00Z
 * @returns amount in cents to charge
 */
export function calculateCurrentAmountCents(
  now: Date,
  entryFeeCents: number,
  lateFeeCents: number | null | undefined,
  lateFeeStartsAt: string | Date | null | undefined,
): number {
  // If no late fee is configured, always return base fee
  if (!lateFeeCents || !lateFeeStartsAt) return entryFeeCents;

  const cutoff = lateFeeStartsAt instanceof Date
    ? lateFeeStartsAt
    : new Date(lateFeeStartsAt);

  // now >= cutoff means the late fee window has opened
  return now >= cutoff
    ? entryFeeCents + lateFeeCents
    : entryFeeCents;
}

/**
 * Format a cents value as a dollar string (e.g. 5500 → "$55.00").
 */
export function formatCentsAsDollars(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
