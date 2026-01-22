import { useEffect, useRef, useState } from "react";
import html2pdf from "html2pdf.js";
import { validateInvoice } from "../utils/validateInvoice";
import InvoiceForm from "../components/InvoiceForm/InvoiceForm";
import SellerBuyerForm from "../components/InvoiceForm/SellerBuyerForm";
import GstInvoicePreview from "../components/InvoicePreview/GstInvoicePreview";

import { useInvoiceCalculator } from "../hooks/useInvoiceCalculator";
import { generateInvoiceNumber } from "../utils/invoiceNumber";

import type {
  SellerDetails,
  BuyerDetails,
} from "../types/invoice";

export default function CreateInvoice() {
  // =======================
  // INVOICE ITEMS + TOTALS
  // =======================
  const {
    items,
    totals,
    errors,
    addItem,
    updateItem,
    removeItem,
  } = useInvoiceCalculator();

  // =======================
  // INVOICE META
  // =======================
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");

  useEffect(() => {
    setInvoiceNumber(generateInvoiceNumber());
  }, []);

  // =======================
  // SELLER / BUYER STATE
  // =======================
  const [seller, setSeller] = useState<SellerDetails>({
    companyName: "",
    address: "",
    gstin: "",
    state: "",
    logo: undefined,
  });

  const [buyer, setBuyer] = useState<BuyerDetails>({
    name: "",
    address: "",
    gstin: "",
    state: "",
  });

  // =======================
  // PDF EXPORT
  // =======================
  const invoiceRef = useRef<HTMLDivElement>(null);

const downloadPDF = () => {
  const validationErrors = validateInvoice(seller, buyer, items);

  if (validationErrors.length > 0) {
    alert(
      "Please fix the following before downloading PDF:\n\n" +
        validationErrors.join("\n")
    );
    return;
  }

  if (!invoiceRef.current) return;

  html2pdf()
    .from(invoiceRef.current)
    .set({
      margin: 10,
      filename: `${invoiceNumber}.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    })
    .save();
};


  // =======================
  // RENDER
  // =======================
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* PAGE TITLE */}
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700">
        Billcraft – GST Invoice
      </h1>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* ================= LEFT SIDE ================= */}
        <div className="space-y-6">
          {/* SELLER / BUYER FORM */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <SellerBuyerForm
              seller={seller}
              buyer={buyer}
              onSellerChange={(field, value) =>
                setSeller((prev) => ({ ...prev, [field]: value }))
              }
              onBuyerChange={(field, value) =>
                setBuyer((prev) => ({ ...prev, [field]: value }))
              }
              onLogoUpload={(logo) =>
                setSeller((prev) => ({ ...prev, logo }))
              }
            />
          </div>

          {/* ITEM FORM */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <InvoiceForm
              items={items}
              errors={errors}
              onAddItem={addItem}
              onUpdateItem={updateItem}
              onRemoveItem={removeItem}
            />
          </div>
        </div>

        {/* ================= RIGHT SIDE ================= */}
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
              seller={seller}
              buyer={buyer}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
