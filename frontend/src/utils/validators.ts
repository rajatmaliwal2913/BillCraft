import type { InvoiceItem } from "../types/invoice";

export interface ValidationErrors {
  [key: string]: string;
}

export function validateItem(item: InvoiceItem): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!item.name.trim()) {
    errors.name = "Item name is required";
  }

  if (item.quantity <= 0) {
    errors.quantity = "Quantity must be at least 1";
  }

  if (item.price < 0) {
    errors.price = "Price cannot be negative";
  }

  return errors;
}

export function validateRates(
  taxRate: number,
  discountRate: number
): ValidationErrors {
  const errors: ValidationErrors = {};

  if (taxRate < 0 || taxRate > 100) {
    errors.taxRate = "Tax must be between 0 and 100";
  }

  if (discountRate < 0 || discountRate > 100) {
    errors.discountRate = "Discount must be between 0 and 100";
  }

  return errors;
}
