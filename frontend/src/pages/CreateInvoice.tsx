import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { saveInvoiceToSupabase } from "../utils/invoices";

import type {
  SellerDetails,
  BuyerDetails,
} from "../types/invoice";

export default function CreateInvoice() {
  const navigate = useNavigate();

  /* =======================
     INVOICE ITEMS + TOTALS
     ======================= */
  const {
    items,
    totals,
    errors: itemErrors,
    addItem,
    updateItem,
    removeItem,
  } = useInvoiceCalculator();

  /* =======================
     INVOICE META
     ======================= */
  const [invoiceNumber, setInvoiceNumber] =
    useState<string>("");

  useEffect(() => {
    setInvoiceNumber(generateInvoiceNumber());
  }, []);

  /* =======================
     SELLER / BUYER STATE
     ======================= */
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

  /* =======================
     VALIDATION
     ======================= */
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

  /* =======================
     PDF EXPORT
     ======================= */
  const invoiceRef = useRef<HTMLDivElement>(null);

  const downloadPDF = () => {
    if (!invoiceRef.current) return;

    html2pdf()
      .from(invoiceRef.current)
      .set({
        margin: 10,
        filename: `${invoiceNumber}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
      })
      .save();
  };

  /* =======================
     SAVE TO SUPABASE
     ======================= */
  const handleSaveInvoice = async () => {
    if (!isInvoiceValid) return;

    try {
      await saveInvoiceToSupabase({
        invoiceNumber,
        seller,
        buyer,
        items,
        totals,
      });

      navigate("/"); // back to dashboard
    }catch (err: any) {
        console.error("SAVE INVOICE ERROR:", err);
        alert(err.message || "Failed to save invoice");
     }

  };

  /* =======================
     RENDER
     ======================= */
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-indigo-700">
          Create GST Invoice
        </h1>

        <button
          onClick={() => navigate("/")}
          className="border px-4 py-2 rounded hover:bg-gray-100"
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* ================= LEFT SIDE ================= */}
        <div className="space-y-6">
          {/* SELLER / BUYER */}
          <div className="bg-white p-6 rounded-xl shadow">
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

          {/* ITEMS */}
          <div className="bg-white p-6 rounded-xl shadow">
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
          {/* ACTION BUTTONS */}
          <div className="flex gap-4">
            <button
              onClick={handleSaveInvoice}
              disabled={!isInvoiceValid}
              className={`flex-1 py-2 rounded-lg font-semibold ${
                isInvoiceValid
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              💾 Save Invoice
            </button>

            <button
              onClick={downloadPDF}
              className="flex-1 py-2 rounded-lg border hover:bg-gray-100"
            >
              ⬇ Download PDF
            </button>
          </div>

          {/* PREVIEW */}
          <div className="bg-white p-6 rounded-xl shadow">
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
