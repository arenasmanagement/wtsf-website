/**
 * Tests for calculateVendorCost — pure function, no external dependencies.
 */
import { describe, it, expect } from "vitest";
import { calculateVendorCost, VENDOR_FEES } from "@/lib/vendor-config";

describe("calculateVendorCost", () => {
  it("returns correct base booth fee with no add-ons", () => {
    const result = calculateVendorCost({
      categoryId:         "general",
      sizeId:             "10x10",
      hasInsuranceBinder: true,  // has binder → no insurance fee
      electricalService:  "none",
      hasCord:            true,  // has cord → no cord fee
    });
    expect(result.boothFee).toBe(150);
    expect(result.insuranceFee).toBe(0);
    expect(result.electricalFee).toBe(0);
    expect(result.cordFee).toBe(0);
    expect(result.cleanupDeposit).toBe(0);
    expect(result.estimatedTotal).toBe(150);
    expect(result.refundableAmount).toBe(0);
  });

  it("adds insurance fee when vendor has no binder", () => {
    const result = calculateVendorCost({
      categoryId:         "general",
      sizeId:             "10x10",
      hasInsuranceBinder: false,
      electricalService:  "none",
      hasCord:            true,
    });
    expect(result.insuranceFee).toBe(VENDOR_FEES.insuranceWithoutBinder); // 100
    expect(result.estimatedTotal).toBe(250); // 150 + 100
  });

  it("adds correct electrical fee for 20amp service", () => {
    const result = calculateVendorCost({
      categoryId:         "general",
      sizeId:             "10x10",
      hasInsuranceBinder: true,
      electricalService:  "20amp",
      hasCord:            true,
    });
    expect(result.electricalFee).toBe(25);
    expect(result.estimatedTotal).toBe(175);
  });

  it("adds correct electrical fee for 50amp service", () => {
    const result = calculateVendorCost({
      categoryId:         "general",
      sizeId:             "10x10",
      hasInsuranceBinder: true,
      electricalService:  "50amp",
      hasCord:            true,
    });
    expect(result.electricalFee).toBe(75);
    expect(result.estimatedTotal).toBe(225);
  });

  it("adds cord fee when vendor has no cord and uses electricity", () => {
    const result = calculateVendorCost({
      categoryId:         "general",
      sizeId:             "10x10",
      hasInsuranceBinder: true,
      electricalService:  "20amp",
      hasCord:            false,
    });
    expect(result.cordFee).toBe(50);
    expect(result.estimatedTotal).toBe(225); // 150 + 25 + 50
  });

  it("does not charge cord fee when no electricity is used", () => {
    const result = calculateVendorCost({
      categoryId:         "general",
      sizeId:             "10x10",
      hasInsuranceBinder: true,
      electricalService:  "none",
      hasCord:            false, // hasCord=false but no electrical → no cord fee
    });
    expect(result.cordFee).toBe(0);
    expect(result.estimatedTotal).toBe(150);
  });

  it("adds cleanup deposit for food-outside category", () => {
    const result = calculateVendorCost({
      categoryId:         "food-outside",
      sizeId:             "10x10",
      hasInsuranceBinder: true,
      electricalService:  "none",
      hasCord:            true,
    });
    expect(result.boothFee).toBe(150);
    expect(result.cleanupDeposit).toBe(100);
    expect(result.refundableAmount).toBe(100);
    expect(result.estimatedTotal).toBe(250); // 150 + 100
  });

  it("no cleanup deposit for food-inside category", () => {
    const result = calculateVendorCost({
      categoryId:         "food-inside",
      sizeId:             "10x10",
      hasInsuranceBinder: true,
      electricalService:  "none",
      hasCord:            true,
    });
    expect(result.cleanupDeposit).toBe(0);
    expect(result.estimatedTotal).toBe(150);
  });

  it("calculates full cost with all add-ons for food-outside", () => {
    const result = calculateVendorCost({
      categoryId:         "food-outside",
      sizeId:             "20x20",  // $1200
      hasInsuranceBinder: false,     // +$100
      electricalService:  "30amp",  // +$50
      hasCord:            false,     // +$50 (has electrical)
    });
    expect(result.boothFee).toBe(1200);
    expect(result.insuranceFee).toBe(100);
    expect(result.electricalFee).toBe(50);
    expect(result.cordFee).toBe(50);
    expect(result.cleanupDeposit).toBe(100);
    expect(result.estimatedTotal).toBe(1500);
    expect(result.refundableAmount).toBe(100);
  });

  it("returns zero booth fee for unknown category/size", () => {
    const result = calculateVendorCost({
      categoryId:         "nonexistent",
      sizeId:             "nonexistent",
      hasInsuranceBinder: true,
      electricalService:  "none",
      hasCord:            true,
    });
    expect(result.boothFee).toBe(0);
    expect(result.estimatedTotal).toBe(0);
  });
});
