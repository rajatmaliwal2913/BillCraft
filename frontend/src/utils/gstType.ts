export function getGstType(
  sellerState: string,
  buyerState: string
): "IGST" | "CGST_SGST" {
  if (!sellerState || !buyerState) {
    return "CGST_SGST"; // safe default
  }

  return sellerState === buyerState
    ? "CGST_SGST"
    : "IGST";
}
