import type { InvoiceItem, InvoiceTotals } from "../../types/invoice";
import { numberToWords } from "../../utils/numberToWords";

interface GstInvoicePreviewProps {
  items: InvoiceItem[];
  totals: InvoiceTotals;
}

export default function GstInvoicePreview({
  items,
  totals,
}: GstInvoicePreviewProps) {
  const cgst = totals.tax / 2;
  const sgst = totals.tax / 2;

  return (
    <div className="bg-white border border-gray-300 shadow-md p-6 text-sm">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-start border-b pb-4 mb-4">
        <div>
          <div className="h-14 w-32 border flex items-center justify-center text-gray-400 text-xs">
            LOGO
          </div>
        </div>

        <div className="text-right">
          <h1 className="text-2xl font-bold text-indigo-700">
            TAX INVOICE
          </h1>
          <p className="text-sm">
            <strong>Invoice No:</strong> INV-001
          </p>
          <p className="text-sm">
            <strong>Date:</strong> DD/MM/YYYY
          </p>
        </div>
      </div>

      {/* ================= SELLER ================= */}
      <div className="mb-4">
        <p className="font-semibold text-gray-800">
          Seller / Company Name
        </p>
        <p>Address line 1</p>
        <p>Phone: XXXXXXXXXX</p>
        <p>Email: example@email.com</p>
        <p>GSTIN: 24XXXXXXXXX</p>
        <p>State: Gujarat</p>
      </div>

      {/* ================= BILL / SHIP ================= */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="border p-3">
          <p className="font-semibold bg-indigo-50 px-2 py-1 mb-2">
            Bill To
          </p>
          <p>Name</p>
          <p>Address</p>
          <p>GSTIN:</p>
          <p>State:</p>
        </div>

        <div className="border p-3">
          <p className="font-semibold bg-indigo-50 px-2 py-1 mb-2">
            Ship To
          </p>
          <p>Name</p>
          <p>Address</p>
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
            const finalAmount = taxable + gst;

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
                  ₹{finalAmount.toFixed(2)}
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

          <div className="flex justify-between">
            <span>CGST</span>
            <span>₹{cgst.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>SGST</span>
            <span>₹{sgst.toFixed(2)}</span>
          </div>

          <div className="flex justify-between font-bold text-lg border-t pt-2 text-green-700">
            <span>Grand Total</span>
            <span>₹{totals.grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
