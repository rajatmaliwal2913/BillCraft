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
    <div
      style={{
        border: "1px solid #ccc",
        padding: "16px",
        borderRadius: "8px",
        background: "#fafafa",
      }}
    >
      <h2>Invoice Preview</h2>

      {items.length === 0 ? (
        <p>No items added</p>
      ) : (
        <table width="100%" cellPadding={8}>
          <thead>
            <tr>
              <th align="left">Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.name || "—"}</td>
                <td align="center">{item.quantity}</td>
                <td align="right">₹{item.price}</td>
                <td align="right">
                  ₹{(item.quantity * item.price).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <hr />

      <div style={{ textAlign: "right" }}>
        <p>Subtotal: ₹{totals.subtotal}</p>
        <p>Tax ({taxRate}%): ₹{totals.tax}</p>
        <p>Discount ({discountRate}%): -₹{totals.discount}</p>
        <h3>Grand Total: ₹{totals.grandTotal}</h3>
      </div>
    </div>
  );
}
