import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import {
  saveInvoiceToSupabase,
  fetchInvoiceById,
  updateInvoiceById,
} from "../utils/invoices";
import { fetchBeneficiaries } from "../utils/beneficiaries";

import type {
  SellerDetails,
  BuyerDetails,
  InvoiceItem,
} from "../types/invoice";
import type { Beneficiary } from "../types/beneficiary";

export default function CreateInvoice() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  /* =======================
     LOADING GUARD
     ======================= */
  const [loadingInvoice, setLoadingInvoice] =
    useState(true);

  /* =======================
     BENEFICIARIES
     ======================= */
  const [beneficiaries, setBeneficiaries] =
    useState<Beneficiary[]>([]);

  /* =======================
     INVOICE ITEMS + TOTALS
     ======================= */
  const {
    items,
    setItems,
    totals,
    errors: itemErrors,
    addItem,
    updateItem,
    removeItem,
  } = useInvoiceCalculator([]);

  /* =======================
     INVOICE META
     ======================= */
  const [invoiceNumber, setInvoiceNumber] =
    useState<string>("");

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
     LOAD BENEFICIARIES
     ======================= */
  useEffect(() => {
    fetchBeneficiaries()
      .then(setBeneficiaries)
      .catch(console.error);
  }, []);

  /* =======================
     LOAD DATA (CREATE / EDIT)
     ======================= */
  useEffect(() => {
    let mounted = true;

    async function loadInvoice() {
      if (isEditMode && id) {
        const invoice = await fetchInvoiceById(id);
        if (!mounted) return;

        setInvoiceNumber(invoice.invoice_number);
        setSeller(invoice.seller);
        setBuyer(invoice.buyer);
        setItems(invoice.items as InvoiceItem[]);
      } else {
        setInvoiceNumber(generateInvoiceNumber());
        setItems([
          {
            id: crypto.randomUUID(),
            name: "",
            quantity: 1,
            price: 0,
            discountRate: 0,
            gstRate: 18,
          },
        ]);
      }

      setLoadingInvoice(false);
    }

    loadInvoice();

    return () => {
      mounted = false;
    };
  }, [id, isEditMode, setItems]);

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
     SAVE / UPDATE
     ======================= */
  const handleSaveInvoice = async () => {
    if (!isInvoiceValid) return;

    try {
      if (isEditMode && id) {
        await updateInvoiceById(id, {
          seller,
          buyer,
          items,
          totals,
        });
      } else {
        await saveInvoiceToSupabase({
          invoiceNumber,
          seller,
          buyer,
          items,
          totals,
        });
      }

      navigate("/");
    } catch (err: any) {
      console.error("SAVE INVOICE ERROR:", err);
      alert(err.message || "Failed to save invoice");
    }
  };

  /* =======================
     LOADING SCREEN
     ======================= */
  if (loadingInvoice) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">
          Loading invoice...
        </p>
      </div>
    );
  }

  /* =======================
     RENDER
     ======================= */
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-indigo-700">
          {isEditMode ? "Edit GST Invoice" : "Create GST Invoice"}
        </h1>

        <button
          onClick={() => navigate("/")}
          className="border px-4 py-2 rounded hover:bg-gray-100"
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* LEFT */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <SellerBuyerForm
              seller={seller}
              buyer={buyer}
              beneficiaries={beneficiaries}
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

        {/* RIGHT */}
        <div className="space-y-4">
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
              {isEditMode
                ? "💾 Update Invoice"
                : "💾 Save Invoice"}
            </button>

            <button
              onClick={downloadPDF}
              className="flex-1 py-2 rounded-lg border hover:bg-gray-100"
            >
              ⬇ Download PDF
            </button>
          </div>

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
