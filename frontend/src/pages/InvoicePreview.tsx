import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import html2pdf from "html2pdf.js";

import GstInvoicePreview from "../components/InvoicePreview/GstInvoicePreview";
import { fetchInvoiceById } from "../utils/invoices";
import type { InvoiceHistoryEntry } from "../types/invoice";

export default function InvoicePreviewPage() {
  const { id } = useParams();
  const [invoice, setInvoice] =
    useState<InvoiceHistoryEntry | null>(null);

  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    fetchInvoiceById(id).then(setInvoice);
  }, [id]);

  if (!invoice) {
    return <div className="p-8">Loading invoice...</div>;
  }

  const downloadPDF = () => {
    if (!invoiceRef.current) return;

    html2pdf()
      .from(invoiceRef.current)
      .set({
        margin: 10,
        filename: `${invoice.invoice_number}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4" },
      })
      .save();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">
          Invoice Preview
        </h1>

        <button
          onClick={downloadPDF}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          ⬇ Download PDF
        </button>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <GstInvoicePreview
          ref={invoiceRef}
          invoiceNumber={invoice.invoice_number}
          seller={invoice.seller}
          buyer={invoice.buyer}
          items={invoice.items}
          totals={invoice.totals}
        />
      </div>
    </div>
  );
}
