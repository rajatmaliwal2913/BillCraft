import { useEffect, useRef, useState } from "react";
import html2pdf from "html2pdf.js";

import InvoiceForm from "../components/InvoiceForm/InvoiceForm";
import GstInvoicePreview from "../components/InvoicePreview/GstInvoicePreview";
import { useInvoiceCalculator } from "../hooks/useInvoiceCalculator";
import { generateInvoiceNumber } from "../utils/invoiceNumber";

export default function CreateInvoice() {
  // --------------------
  // Invoice state
  // --------------------
  const {
    items,
    totals,
    errors,
    addItem,
    updateItem,
    removeItem,
  } = useInvoiceCalculator();

  const [invoiceNumber, setInvoiceNumber] = useState<string>("");

  // Generate invoice number once on page load
  useEffect(() => {
    setInvoiceNumber(generateInvoiceNumber());
  }, []);

  // Ref for PDF export
  const invoiceRef = useRef<HTMLDivElement>(null);

  // --------------------
  // PDF Download
  // --------------------
  const downloadPDF = () => {
    if (!invoiceRef.current) return;

    html2pdf()
      .from(invoiceRef.current)
      .set({
        margin: 10,
        filename: `${invoiceNumber}.pdf`,
        html2canvas: {
          scale: 2,
          useCORS: true,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
      })
      .save();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* PAGE TITLE */}
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700">
        Billcraft – GST Invoice
      </h1>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* ================= LEFT: INVOICE FORM ================= */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <InvoiceForm
            items={items}
            errors={errors}
            onAddItem={addItem}
            onUpdateItem={updateItem}
            onRemoveItem={removeItem}
          />
        </div>

        {/* ================= RIGHT: PREVIEW + PDF ================= */}
        <div className="space-y-4">
          {/* PDF BUTTON */}
          <button
            onClick={downloadPDF}
            disabled={items.length === 0}
            className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 transition"
          >
            ⬇ Download GST Invoice (PDF)
          </button>

          {/* GST INVOICE PREVIEW */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <GstInvoicePreview
              ref={invoiceRef}
              items={items}
              totals={totals}
              invoiceNumber={invoiceNumber}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
