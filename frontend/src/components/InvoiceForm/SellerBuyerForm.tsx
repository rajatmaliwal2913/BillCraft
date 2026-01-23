import { useState } from "react";
import type {
  SellerDetails,
  BuyerDetails,
} from "../../types/invoice";
import type { ValidationErrors } from "../../utils/validateInvoice";
import type { Beneficiary } from "../../types/beneficiary";
import { INDIAN_STATES } from "../../constants/indianStates";

interface SellerBuyerFormProps {
  seller: SellerDetails;
  buyer: BuyerDetails;

  beneficiaries: Beneficiary[]; // ✅ ADDED

  errors: ValidationErrors;

  onSellerChange: (
    field: keyof SellerDetails,
    value: string
  ) => void;

  onBuyerChange: (
    field: keyof BuyerDetails,
    value: string
  ) => void;

  onLogoUpload: (logo: string) => void;
  onSaveBuyerAsBeneficiary: () => void;
}

export default function SellerBuyerForm({
  seller,
  buyer,
  beneficiaries,
  errors,
  onSellerChange,
  onBuyerChange,
  onLogoUpload,
  onSaveBuyerAsBeneficiary,
}: SellerBuyerFormProps) {
  const [sameAsBilling, setSameAsBilling] =
    useState(true);

  const handleLogoChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () =>
      onLogoUpload(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-8">
      {/* ================= SELLER ================= */}
      <div>
        <h2 className="text-lg font-semibold mb-3">
          Seller Details
        </h2>

        <input
          placeholder="Company Name *"
          value={seller.companyName}
          onChange={(e) =>
            onSellerChange(
              "companyName",
              e.target.value
            )
          }
          className={`w-full border rounded px-3 py-2 mb-1 ${
            errors.seller.companyName
              ? "border-red-500"
              : ""
          }`}
        />
        {errors.seller.companyName && (
          <p className="text-xs text-red-600">
            {errors.seller.companyName}
          </p>
        )}

        <textarea
          placeholder="Address *"
          value={seller.address}
          onChange={(e) =>
            onSellerChange(
              "address",
              e.target.value
            )
          }
          className={`w-full border rounded px-3 py-2 mb-1 ${
            errors.seller.address
              ? "border-red-500"
              : ""
          }`}
        />
        {errors.seller.address && (
          <p className="text-xs text-red-600">
            {errors.seller.address}
          </p>
        )}

        <input
          placeholder="GSTIN *"
          value={seller.gstin}
          onChange={(e) =>
            onSellerChange("gstin", e.target.value)
          }
          className={`w-full border rounded px-3 py-2 mb-1 ${
            errors.seller.gstin
              ? "border-red-500"
              : ""
          }`}
        />
        {errors.seller.gstin && (
          <p className="text-xs text-red-600">
            {errors.seller.gstin}
          </p>
        )}

        <select
          value={seller.state}
          onChange={(e) =>
            onSellerChange("state", e.target.value)
          }
          className={`w-full border rounded px-3 py-2 mb-1 ${
            errors.seller.state
              ? "border-red-500"
              : ""
          }`}
        >
          <option value="">
            Select State *
          </option>
          {INDIAN_STATES.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
        {errors.seller.state && (
          <p className="text-xs text-red-600">
            {errors.seller.state}
          </p>
        )}

        <div className="grid grid-cols-2 gap-3 mt-2">
          <input
            placeholder="Phone"
            value={seller.phone || ""}
            onChange={(e) =>
              onSellerChange(
                "phone",
                e.target.value
              )
            }
            className="border rounded px-3 py-2"
          />
          <input
            placeholder="Email"
            value={seller.email || ""}
            onChange={(e) =>
              onSellerChange(
                "email",
                e.target.value
              )
            }
            className="border rounded px-3 py-2"
          />
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleLogoChange}
          className="text-sm mt-2"
        />
      </div>

      {/* ================= BUYER ================= */}
      <div>
        <h2 className="text-lg font-semibold mb-3">
          Buyer Details (Billing)
        </h2>
        <button
            type="button"
            onClick={onSaveBuyerAsBeneficiary}
            className="text-sm text-indigo-600 hover:underline mb-2"
            >
            ➕ Save Buyer as Beneficiary
        </button>
    
        {/* 🔽 BENEFICIARY DROPDOWN */}
        {beneficiaries.length > 0 && (
          <select
            className="w-full border rounded px-3 py-2 mb-3"
            onChange={(e) => {
              const selected =
                beneficiaries.find(
                  (b) => b.id === e.target.value
                );
              if (!selected) return;

              onBuyerChange("name", selected.name);
              onBuyerChange(
                "address",
                selected.address
              );
              onBuyerChange("gstin", selected.gstin);
              onBuyerChange("state", selected.state);
              onBuyerChange("phone", selected.phone);
            }}
          >
            <option value="">
              Select Beneficiary
            </option>
            {beneficiaries.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        )}

        <input
          placeholder="Customer Name *"
          value={buyer.name}
          onChange={(e) =>
            onBuyerChange("name", e.target.value)
          }
          className={`w-full border rounded px-3 py-2 mb-1 ${
            errors.buyer.name
              ? "border-red-500"
              : ""
          }`}
        />
        {errors.buyer.name && (
          <p className="text-xs text-red-600">
            {errors.buyer.name}
          </p>
        )}

        <textarea
          placeholder="Billing Address *"
          value={buyer.address}
          onChange={(e) =>
            onBuyerChange(
              "address",
              e.target.value
            )
          }
          className={`w-full border rounded px-3 py-2 mb-1 ${
            errors.buyer.address
              ? "border-red-500"
              : ""
          }`}
        />
        {errors.buyer.address && (
          <p className="text-xs text-red-600">
            {errors.buyer.address}
          </p>
        )}

        <input
          placeholder="GSTIN (optional)"
          value={buyer.gstin}
          onChange={(e) =>
            onBuyerChange("gstin", e.target.value)
          }
          className="w-full border rounded px-3 py-2 mb-2"
        />

        <select
          value={buyer.state}
          onChange={(e) =>
            onBuyerChange("state", e.target.value)
          }
          className="w-full border rounded px-3 py-2 mb-2"
        >
          <option value="">
            Select State
          </option>
          {INDIAN_STATES.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>

        <input
          placeholder="Contact Number"
          value={buyer.phone || ""}
          onChange={(e) =>
            onBuyerChange(
              "phone",
              e.target.value
            )
          }
          className="w-full border rounded px-3 py-2 mb-3"
        />

        <label className="flex items-center gap-2 text-sm mb-2">
          <input
            type="checkbox"
            checked={sameAsBilling}
            onChange={(e) =>
              setSameAsBilling(e.target.checked)
            }
          />
          Shipping address same as billing
        </label>

        {!sameAsBilling && (
          <div className="space-y-2">
            <textarea
              placeholder="Shipping Address"
              value={buyer.shippingAddress || ""}
              onChange={(e) =>
                onBuyerChange(
                  "shippingAddress",
                  e.target.value
                )
              }
              className="w-full border rounded px-3 py-2"
            />

            <select
              value={buyer.shippingState || ""}
              onChange={(e) =>
                onBuyerChange(
                  "shippingState",
                  e.target.value
                )
              }
              className="w-full border rounded px-3 py-2"
            >
              <option value="">
                Select Shipping State
              </option>
              {INDIAN_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
