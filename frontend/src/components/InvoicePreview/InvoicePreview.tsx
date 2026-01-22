import type { InvoiceItem, InvoiceTotals } from "../../types/invoice";

interface InvoicePreviewProps {
  items: InvoiceItem[];
  totals: InvoiceTotals;
  taxRate: number;
  discountRate: number;
}

export default function InvoicePreview({
  items,
  totals,
  taxRate,
  discountRate,
}: InvoicePreviewProps) {
  return (
    <div className="bg-gray-50 p-6 rounded-xl border">
      <h2 className="text-lg font-semibold mb-4">Invoice Preview</h2>

      <table className="w-full text-sm mb-6">
        <thead className="text-gray-500 border-b">
          <tr>
            <th className="text-left py-2">Item</th>
            <th className="text-center">Qty</th>
            <th className="text-right">Price</th>
            <th className="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b last:border-b-0">
              <td className="py-2">{item.name || "—"}</td>
              <td className="text-center">{item.quantity}</td>
              <td className="text-right">₹{item.price}</td>
              <td className="text-right font-medium">
                ₹{(item.quantity * item.price).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{totals.subtotal}</span>
        </div>

        <div className="flex justify-between">
          <span>Tax ({taxRate}%)</span>
          <span>₹{totals.tax}</span>
        </div>

        <div className="flex justify-between text-red-600">
          <span>Discount ({discountRate}%)</span>
          <span>-₹{totals.discount}</span>
        </div>

        <div className="flex justify-between font-semibold text-lg pt-3 border-t">
          <span>Grand Total</span>
          <span>₹{totals.grandTotal}</span>
        </div>
      </div>
    </div>
  );
}
