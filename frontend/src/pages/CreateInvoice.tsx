import { useRef } from "react";
import html2pdf from "html2pdf.js";

import InvoiceForm from "../components/InvoiceForm/InvoiceForm";
import GstInvoicePreview from "../components/InvoicePreview/GstInvoicePreview";
import { useInvoiceCalculator } from "../hooks/useInvoiceCalculator";

export default function CreateInvoice() {
  const { items, totals, errors, addItem, updateItem, removeItem } =
    useInvoiceCalculator();

  const invoiceRef = useRef<HTMLDivElement>(null);

  const downloadPDF = () => {
    if (!invoiceRef.current) return;

    html2pdf()
      .from(invoiceRef.current)
      .set({
        margin: 10,
        filename: "GST_Invoice.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .save();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700">
        Billcraft – GST Invoice
      </h1>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* LEFT */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <InvoiceForm
            items={items}
            errors={errors}
            onAddItem={addItem}
            onUpdateItem={updateItem}
            onRemoveItem={removeItem}
          />
        </div>

        {/* RIGHT */}
        <div className="space-y-4">
          <button
            onClick={downloadPDF}
            className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            ⬇ Download GST Invoice (PDF)
          </button>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <GstInvoicePreview
              ref={invoiceRef}
              items={items}
              totals={totals}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
