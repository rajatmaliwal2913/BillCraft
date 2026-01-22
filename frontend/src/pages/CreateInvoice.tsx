import InvoiceForm from "../components/InvoiceForm/InvoiceForm";
import InvoicePreview from "../components/InvoicePreview/InvoicePreview";
import { useInvoiceCalculator } from "../hooks/useInvoiceCalculator";

export default function CreateInvoice() {
  const {
    items,
    taxRate,
    discountRate,
    totals,
    addItem,
    updateItem,
    removeItem,
    setTaxRate,
    setDiscountRate,
  } = useInvoiceCalculator();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "24px",
        padding: "24px",
      }}
    >
      {/* LEFT: FORM */}
      <div>
        <h1>Billcraft – Create Invoice</h1>

        <InvoiceForm
          items={items}
          taxRate={taxRate}
          discountRate={discountRate}
          onAddItem={addItem}
          onUpdateItem={updateItem}
          onRemoveItem={removeItem}
          onTaxChange={setTaxRate}
          onDiscountChange={setDiscountRate}
        />
      </div>

      {/* RIGHT: LIVE PREVIEW */}
      <InvoicePreview
        items={items}
        totals={totals}
        taxRate={taxRate}
        discountRate={discountRate}
      />
    </div>
  );
}
