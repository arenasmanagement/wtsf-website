/**
 * VENDOR CONFIGURATION — West Tennessee State Fair
 * ─────────────────────────────────────────────────────────────────────────
 * Source of truth: Vendor Sheet (2025 reference — update annually)
 *
 * HOW TO UPDATE ANNUALLY
 * ───────────────────────
 * 1. Update VENDOR_PAYMENT_DEADLINE before publishing each year.
 * 2. Confirm booth prices with the fair board — update VENDOR_CATEGORIES.
 * 3. Update VENDOR_FEES if insurance/electric/cord/deposit amounts change.
 *
 * ⚠️  PAYMENT DEADLINE NOTE
 *   The current deadline (September 30) is sourced from a 2025 vendor sheet.
 *   Confirm the 2026 deadline with the fair board before publishing.
 *
 * ⚠️  GENERAL BOOTH CATEGORY LABEL
 *   The "General / Commercial" label for the first booth table was inferred
 *   from context. Confirm the exact intended label from the original vendor
 *   sheet before publishing.
 * ─────────────────────────────────────────────────────────────────────────
 */

export interface BoothSize {
  id: string;
  label: string;       // e.g. "10 × 10"
  dimensions: string;  // e.g. "10 x 10"
  price: number;
}

export interface VendorCategory {
  id: string;
  name: string;
  description: string;
  location: "inside" | "outside" | "either";
  cookingAllowed: boolean;
  requiresCleanupDeposit: boolean;
  boothSizes: BoothSize[];
  accentColor: string;
}

// ─── Booth Categories ──────────────────────────────────────────────────────

export const VENDOR_CATEGORIES: VendorCategory[] = [
  {
    // ⚠️ CONFIRM LABEL: The original vendor sheet table label for these
    // sizes was not confirmed from the PDF directly. "General / Commercial"
    // is inferred. Update with the exact label from the source document.
    id: "general",
    name: "General / Commercial Vendor",
    description:
      "Commercial products, merchandise, crafts, services, information booths, and non-food exhibits. Inside or outside placement depending on space availability.",
    location: "either",
    cookingAllowed: false,
    requiresCleanupDeposit: false,
    accentColor: "#2C4A2E",
    boothSizes: [
      { id: "10x10",  label: "10 × 10",  dimensions: "10 x 10",  price: 150 },
      { id: "15x10",  label: "15 × 10",  dimensions: "15 x 10",  price: 250 },
      { id: "20x10",  label: "20 × 10",  dimensions: "20 x 10",  price: 600 },
      { id: "20x20",  label: "20 × 20",  dimensions: "20 x 20",  price: 1200 },
      { id: "30x20",  label: "30 × 20",  dimensions: "30 x 20",  price: 1800 },
      { id: "40x20",  label: "40 × 20",  dimensions: "40 x 20",  price: 2400 },
      { id: "50x20",  label: "50 × 20",  dimensions: "50 x 20",  price: 3000 },
    ],
  },
  {
    id: "food-inside",
    name: "No-Cooking Food / Inside Exhibit Tent",
    description:
      "Pre-packaged food items, no-cook specialty foods, and food merchandise sold inside the exhibit tent. No on-site cooking permitted in this category.",
    location: "inside",
    cookingAllowed: false,
    requiresCleanupDeposit: false,
    accentColor: "#8B7355",
    boothSizes: [
      { id: "10x10",  label: "10 × 10",  dimensions: "10 x 10",  price: 150 },
      { id: "15x10",  label: "15 × 10",  dimensions: "15 x 10",  price: 250 },
      { id: "20x10",  label: "20 × 10",  dimensions: "20 x 10",  price: 600 },
    ],
  },
  {
    id: "food-outside",
    name: "Cooking-Allowed / Outside Fairgrounds",
    description:
      "Food vendors with on-site cooking, concession trailers, and grills. Located on the outside fairgrounds. Cleanup deposit required.",
    location: "outside",
    cookingAllowed: true,
    requiresCleanupDeposit: true,
    accentColor: "#8B2E2E",
    boothSizes: [
      { id: "10x10",  label: "10 × 10",  dimensions: "10 x 10",  price: 150 },
      { id: "15x10",  label: "15 × 10",  dimensions: "15 x 10",  price: 250 },
      { id: "15x15",  label: "15 × 15",  dimensions: "15 x 15",  price: 1000 },
      { id: "20x20",  label: "20 × 20",  dimensions: "20 x 20",  price: 1200 },
      { id: "30x20",  label: "30 × 20",  dimensions: "30 x 20",  price: 1800 },
    ],
  },
];

// ─── Vendor Fees ───────────────────────────────────────────────────────────

export const VENDOR_FEES = {
  // Insurance
  // Vendor provides certificate naming WTSF as Additional Insured → $0
  // Vendor does not provide binder → fair adds $100 for coverage
  insuranceWithBinder:    0,
  insuranceWithoutBinder: 100,

  // Electrical hookup (per event)
  electrical: {
    none:    0,
    "20amp": 25,
    "30amp": 50,
    "50amp": 75,
  } as Record<string, number>,

  // 50-foot electrical cord
  // Vendor provides qualifying 50-ft cord → $0
  // Vendor does not provide → $50 rental/supply charge
  cordProvided:    0,
  cordNotProvided: 50,

  // Cleanup deposit (outside vendors only)
  // Fully refundable when vendor cleans their assigned area after the fair
  cleanupDeposit: 100,
} as const;

// ─── Payment Deadline ──────────────────────────────────────────────────────
// ⚠️  SOURCE: 2025 Vendor Sheet — confirm 2026 deadline before publishing.
// Set confirmed: true only after the fair board has verified this date.
export const VENDOR_PAYMENT_DEADLINE = {
  label:     "September 30",         // human-readable
  confirmed: false,                  // flip to true after fair board confirms
  note:      "Date from 2025 vendor sheet — confirm 2026 deadline with fair board before publishing.",
};

// ─── Policies (from vendor sheet) ─────────────────────────────────────────
export const VENDOR_POLICIES = [
  "All decisions of the Advertising and Marketing Committee of the West Tennessee State Fair are final.",
  "The West Tennessee State Fair strives to promote integrity, virtue, and agricultural education values.",
  "The West Tennessee State Fair reserves the right to refuse a vendor based on legal or adverse educational factors.",
] as const;

// ─── Helpers ───────────────────────────────────────────────────────────────

export function getCategoryById(id: string): VendorCategory | undefined {
  return VENDOR_CATEGORIES.find((c) => c.id === id);
}

export function getBoothSizeById(
  categoryId: string,
  sizeId: string
): BoothSize | undefined {
  return getCategoryById(categoryId)?.boothSizes.find((s) => s.id === sizeId);
}

export interface VendorCostBreakdown {
  boothFee:       number;
  insuranceFee:   number;
  electricalFee:  number;
  cordFee:        number;
  cleanupDeposit: number;
  estimatedTotal: number;
  refundableAmount: number;
}

export function calculateVendorCost(opts: {
  categoryId:        string;
  sizeId:            string;
  hasInsuranceBinder: boolean;
  electricalService: string;  // "none" | "20amp" | "30amp" | "50amp"
  hasCord:           boolean;
}): VendorCostBreakdown {
  const category = getCategoryById(opts.categoryId);
  const size = category?.boothSizes.find((s) => s.id === opts.sizeId);

  const boothFee      = size?.price ?? 0;
  const insuranceFee  = opts.hasInsuranceBinder
    ? VENDOR_FEES.insuranceWithBinder
    : VENDOR_FEES.insuranceWithoutBinder;
  const electricalFee = VENDOR_FEES.electrical[opts.electricalService] ?? 0;
  // Cord fee only applies when electrical service is requested AND vendor has no cord.
  // If no electrical service is selected, no cord is needed — do not charge.
  const cordFee = (opts.electricalService !== "none" && !opts.hasCord)
    ? VENDOR_FEES.cordNotProvided
    : 0;
  const cleanupDeposit = category?.requiresCleanupDeposit
    ? VENDOR_FEES.cleanupDeposit
    : 0;

  const estimatedTotal = boothFee + insuranceFee + electricalFee + cordFee + cleanupDeposit;

  return {
    boothFee,
    insuranceFee,
    electricalFee,
    cordFee,
    cleanupDeposit,
    estimatedTotal,
    refundableAmount: cleanupDeposit,
  };
}
