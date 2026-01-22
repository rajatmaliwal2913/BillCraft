import { InvoiceItem, InvoiceTotals } from "../types/invoice";

/**
 * Calculate total for a single item
 */
export function calculateItemTotal(
  quantity: number,
  price: number
): number {
  if (quantity < 0 || price < 0) return 0;
  return roundToTwo(quantity * price);
}

/**
 * Calculate subtotal of all items
 */
export function calculateSubtotal(items: InvoiceItem[]): number {
  const subtotal = items.reduce((sum, item) => {
    return sum + calculateItemTotal(item.quantity, item.price);
  }, 0);

  return roundToTwo(subtotal);
}

/**
 * Calculate tax amount
 */
export function calculateTax(
  subtotal: number,
  taxRate: number
): number {
  if (taxRate < 0) return 0;
  return roundToTwo((subtotal * taxRate) / 100);
}

/**
 * Calculate discount amount
 */
export function calculateDiscount(
  subtotal: number,
  discountRate: number
): number {
  if (discountRate < 0) return 0;
  return roundToTwo((subtotal * discountRate) / 100);
}

/**
 * Calculate final totals for invoice
 */
export function calculateInvoiceTotals(
  items: InvoiceItem[],
  taxRate: number,
  discountRate: number
): InvoiceTotals {
  const subtotal = calculateSubtotal(items);
  const tax = calculateTax(subtotal, taxRate);
  const discount = calculateDiscount(subtotal, discountRate);

  const grandTotal = roundToTwo(subtotal + tax - discount);

  return {
    subtotal,
    tax,
    discount,
    grandTotal,
  };
}

/**
 * Utility: round to 2 decimal places
 */
function roundToTwo(value: number): number {
  return Math.round(value * 100) / 100;
}
