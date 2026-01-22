import { useEffect, useRef, useState } from "react";
import html2pdf from "html2pdf.js";

import InvoiceForm from "../components/InvoiceForm/InvoiceForm";
import SellerBuyerForm from "../components/InvoiceForm/SellerBuyerForm";
import GstInvoicePreview from "../components/InvoicePreview/GstInvoicePreview";

import { useInvoiceCalculator } from "../hooks/useInvoiceCalculator";
import { generateInvoiceNumber } from "../utils/invoiceNumber";
import {
  validateInvoice,
  type ValidationErrors,
} from "../utils/validateInvoice";

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
    errors: itemErrors,
    addItem,
    updateItem,
    removeItem,
  } = useInvoiceCalculator();

  // =======================
  // INVOICE META
  // =======================
  const [invoiceNumber, setInvoiceNumber] =
    useState<string>("");

  useEffect(() => {
    setInvoiceNumber(generateInvoiceNumber());
  }, []);

  // =======================
  // SELLER / BUYER STATE
  // =======================
  const [seller, setSeller] =
    useState<SellerDetails>({
      companyName: "",
      address: "",
      gstin: "",
      state: "",
      phone: "",
      email: "",
      logo: undefined,
    });

  const [buyer, setBuyer] =
    useState<BuyerDetails>({
      name: "",
      address: "",
      gstin: "",
      state: "",
      phone: "",
      shippingAddress: "",
      shippingState: "",
    });

  // =======================
  // VALIDATION
  // =======================
  const [validationErrors, setValidationErrors] =
    useState<ValidationErrors>({
      seller: {},
      buyer: {},
      items: null,
    });

  useEffect(() => {
    const errs = validateInvoice(seller, buyer, items);
    setValidationErrors(errs);
  }, [seller, buyer, items]);

  const isInvoiceValid =
    Object.keys(validationErrors.seller).length === 0 &&
    Object.keys(validationErrors.buyer).length === 0 &&
    !validationErrors.items;

  // =======================
  // PDF EXPORT
  // =======================
  const invoiceRef = useRef<HTMLDivElement>(null);

  const downloadPDF = () => {
    if (!isInvoiceValid || !invoiceRef.current) return;

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
              errors={validationErrors}
              onSellerChange={(field, value) =>
                setSeller((prev) => ({
                  ...prev,
                  [field]: value,
                }))
              }
              onBuyerChange={(field, value) =>
                setBuyer((prev) => ({
                  ...prev,
                  [field]: value,
                }))
              }
              onLogoUpload={(logo) =>
                setSeller((prev) => ({
                  ...prev,
                  logo,
                }))
              }
            />
          </div>

          {/* ITEM FORM */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            {validationErrors.items && (
              <p className="text-sm text-red-600 mb-2">
                {validationErrors.items}
              </p>
            )}

            <InvoiceForm
              items={items}
              errors={itemErrors}
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
            disabled={!isInvoiceValid}
            className={`w-full py-2 rounded-lg font-semibold transition ${
              isInvoiceValid
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
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
