import type { SellerDetails, BuyerDetails, InvoiceItem } from "../types/invoice";

export function validateInvoice(
  seller: SellerDetails,
  buyer: BuyerDetails,
  items: InvoiceItem[]
): string[] {
  const errors: string[] = [];

  if (!seller.companyName) errors.push("Seller company name is required");
  if (!seller.address) errors.push("Seller address is required");
  if (!seller.gstin) errors.push("Seller GSTIN is required");

  if (!buyer.name) errors.push("Buyer name is required");
  if (!buyer.address) errors.push("Buyer billing address is required");

  if (items.length === 0) errors.push("At least one item is required");

  return errors;
}
