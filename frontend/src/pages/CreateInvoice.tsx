import InvoiceForm from "../components/InvoiceForm/InvoiceForm";
import GstInvoicePreview from "../components/InvoicePreview/GstInvoicePreview";
import { useInvoiceCalculator } from "../hooks/useInvoiceCalculator";

export default function CreateInvoice() {
  const {
    items,
    totals,
    errors,
    addItem,
    updateItem,
    removeItem,
  } = useInvoiceCalculator();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700">
        Billcraft – GST Invoice
      </h1>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* LEFT: FORM */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <InvoiceForm
            items={items}
            errors={errors}
            onAddItem={addItem}
            onUpdateItem={updateItem}
            onRemoveItem={removeItem}
          />
        </div>

        {/* RIGHT: GST PREVIEW */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <GstInvoicePreview
            items={items}
            totals={totals}
          />
        </div>
      </div>
    </div>
  );
}
