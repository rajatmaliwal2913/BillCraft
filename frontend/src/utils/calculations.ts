import type { InvoiceItem, InvoiceTotals } from "../types/invoice";

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
  items: InvoiceItem[]
): InvoiceTotals {
  let subtotal = 0;
  let totalDiscount = 0;
  let totalGST = 0;

  items.forEach((item) => {
    const base = item.quantity * item.price;
    const discount = (base * item.discountRate) / 100;
    const taxable = base - discount;
    const gst = (taxable * item.gstRate) / 100;

    subtotal += base;
    totalDiscount += discount;
    totalGST += gst;
  });

  const grandTotal = subtotal - totalDiscount + totalGST;

  return {
    subtotal: round(subtotal),
    discount: round(totalDiscount),
    tax: round(totalGST),
    grandTotal: round(grandTotal),
  };
}

function round(n: number) {
  return Math.round(n * 100) / 100;
}


/**
 * Utility: round to 2 decimal places
 */
function roundToTwo(value: number): number {
  return Math.round(value * 100) / 100;
}
