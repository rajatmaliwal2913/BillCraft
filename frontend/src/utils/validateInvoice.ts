import type {
  SellerDetails,
  BuyerDetails,
  InvoiceItem,
} from "../types/invoice";

export interface ValidationErrors {
  seller: Partial<Record<keyof SellerDetails, string>>;
  buyer: Partial<Record<keyof BuyerDetails, string>>;
  items: string | null;
}

export function validateInvoice(
  seller: SellerDetails,
  buyer: BuyerDetails,
  items: InvoiceItem[]
): ValidationErrors {
  const errors: ValidationErrors = {
    seller: {},
    buyer: {},
    items: null,
  };

  // Seller validations
  if (!seller.companyName)
    errors.seller.companyName = "Company name is required";
  if (!seller.address)
    errors.seller.address = "Address is required";
  if (!seller.gstin)
    errors.seller.gstin = "GSTIN is required";
  if (!seller.state)
    errors.seller.state = "State is required";

  // Buyer validations
  if (!buyer.name)
    errors.buyer.name = "Buyer name is required";
  if (!buyer.address)
    errors.buyer.address = "Billing address is required";

  // Items
  if (items.length === 0)
    errors.items = "At least one item is required";

  return errors;
}
