import { forwardRef } from "react";
import type {
  InvoiceItem,
  InvoiceTotals,
  SellerDetails,
  BuyerDetails,
} from "../../types/invoice";
import { numberToWords } from "../../utils/numberToWords";
import { getGstType } from "../../utils/gstType";

interface GstInvoicePreviewProps {
  items: InvoiceItem[];
  totals: InvoiceTotals;
  invoiceNumber: string;
  seller: SellerDetails;
  buyer: BuyerDetails;
}

const GstInvoicePreview = forwardRef<
  HTMLDivElement,
  GstInvoicePreviewProps
>(({ items, totals, invoiceNumber, seller, buyer }, ref) => {
  const gstType = getGstType(seller.state, buyer.state);

  return (
    <div
      ref={ref}
      className="bg-white border border-gray-300 shadow-md p-6 text-sm text-gray-800"
    >
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-start border-b pb-4 mb-4">
        {/* LOGO */}
        <div>
          {seller.logo ? (
            <img
              src={seller.logo}
              alt="Company Logo"
              className="h-14 object-contain"
            />
          ) : (
            <div className="h-14 w-32 border flex items-center justify-center text-xs text-gray-400">
              LOGO
            </div>
          )}
        </div>

        {/* INVOICE META */}
        <div className="text-right">
          <h1 className="text-2xl font-bold text-indigo-700">
            TAX INVOICE
          </h1>
          <p>
            <strong>Invoice No:</strong> {invoiceNumber}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date().toLocaleDateString("en-IN")}
          </p>
        </div>
      </div>

      {/* ================= SELLER ================= */}
      <div className="mb-4">
        <p className="font-semibold text-gray-900">
          {seller.companyName || "Seller / Company Name"}
        </p>
        <p>{seller.address || "Address"}</p>
        {seller.phone && <p>Phone: {seller.phone}</p>}
        {seller.email && <p>Email: {seller.email}</p>}
        <p>GSTIN: {seller.gstin || "—"}</p>
        <p>State: {seller.state || "—"}</p>
      </div>

      {/* ================= BILL / SHIP ================= */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* BILL TO */}
        <div className="border p-3">
          <p className="font-semibold bg-indigo-50 px-2 py-1 mb-2">
            Bill To
          </p>
          <p>{buyer.name || "Customer Name"}</p>
          <p>{buyer.address || "Billing Address"}</p>
          {buyer.phone && <p>Contact: {buyer.phone}</p>}
          <p>GSTIN: {buyer.gstin || "—"}</p>
          <p>State: {buyer.state || "—"}</p>
        </div>

        {/* SHIP TO */}
        <div className="border p-3">
          <p className="font-semibold bg-indigo-50 px-2 py-1 mb-2">
            Ship To
          </p>
          <p>{buyer.name || "Customer Name"}</p>
          <p>
            {buyer.shippingAddress ||
              buyer.address ||
              "Shipping Address"}
          </p>
          <p>
            State:{" "}
            {buyer.shippingState ||
              buyer.state ||
              "—"}
          </p>
        </div>
      </div>

      {/* ================= ITEMS TABLE ================= */}
      <table className="w-full border border-gray-400 mb-4 text-sm">
        <thead className="bg-indigo-50 text-indigo-800">
          <tr>
            <th className="border p-2 text-left">#</th>
            <th className="border p-2 text-left">Item</th>
            <th className="border p-2 text-center">Qty</th>
            <th className="border p-2 text-right">Price</th>
            <th className="border p-2 text-center">Disc %</th>
            <th className="border p-2 text-center">GST %</th>
            <th className="border p-2 text-right">Amount</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item, index) => {
            const base = item.quantity * item.price;
            const discount = (base * item.discountRate) / 100;
            const taxable = base - discount;
            const gst = (taxable * item.gstRate) / 100;
            const amount = taxable + gst;

            return (
              <tr key={item.id}>
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{item.name || "—"}</td>
                <td className="border p-2 text-center">
                  {item.quantity}
                </td>
                <td className="border p-2 text-right">
                  ₹{item.price.toFixed(2)}
                </td>
                <td className="border p-2 text-center">
                  {item.discountRate}%
                </td>
                <td className="border p-2 text-center">
                  {item.gstRate}%
                </td>
                <td className="border p-2 text-right font-medium">
                  ₹{amount.toFixed(2)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* ================= TOTALS ================= */}
      <div className="grid grid-cols-2 gap-4">
        {/* LEFT */}
        <div className="border p-3">
          <p className="font-semibold mb-1">
            Amount in Words
          </p>
          <p className="italic text-sm">
            Rupees {numberToWords(totals.grandTotal)} Only
          </p>

          <p className="font-semibold mt-4">
            Terms & Conditions
          </p>
          <p className="text-xs text-gray-600">
            Goods once sold will not be taken back.
          </p>
        </div>

        {/* RIGHT */}
        <div className="border p-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Sub Total</span>
            <span>₹{totals.subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-red-600">
            <span>Total Discount</span>
            <span>-₹{totals.discount.toFixed(2)}</span>
          </div>

          {gstType === "CGST_SGST" ? (
            <>
              <div className="flex justify-between">
                <span>CGST</span>
                <span>
                  ₹{(totals.tax / 2).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>SGST</span>
                <span>
                  ₹{(totals.tax / 2).toFixed(2)}
                </span>
              </div>
            </>
          ) : (
            <div className="flex justify-between">
              <span>IGST</span>
              <span>
                ₹{totals.tax.toFixed(2)}
              </span>
            </div>
          )}

          <div className="flex justify-between font-bold text-lg border-t pt-2 text-green-700">
            <span>Grand Total</span>
            <span>
              ₹{totals.grandTotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default GstInvoicePreview;
