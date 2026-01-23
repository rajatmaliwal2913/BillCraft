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

  beneficiaries: Beneficiary[];

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

  const [
    selectedBeneficiaryId,
    setSelectedBeneficiaryId,
  ] = useState<string | null>(null);

  // Tracks ONLY fields filled from beneficiary
  const [
    lockedBuyerFields,
    setLockedBuyerFields,
  ] = useState<Set<keyof BuyerDetails>>(
    new Set()
  );

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

  const handleBeneficiarySelect = (
    id: string | null
  ) => {
    setSelectedBeneficiaryId(id);

    // Clear locks if beneficiary cleared
    if (!id) {
      setLockedBuyerFields(new Set());
      return;
    }

    const selected = beneficiaries.find(
      (b) => b.id === id
    );
    if (!selected) return;

    const locked = new Set<keyof BuyerDetails>();

    if (selected.name) {
      onBuyerChange("name", selected.name);
      locked.add("name");
    }
    if (selected.address) {
      onBuyerChange(
        "address",
        selected.address
      );
      locked.add("address");
    }
    if (selected.gstin) {
      onBuyerChange("gstin", selected.gstin);
      locked.add("gstin");
    }
    if (selected.state) {
      onBuyerChange("state", selected.state);
      locked.add("state");
    }
    if (selected.phone) {
      onBuyerChange("phone", selected.phone);
      locked.add("phone");
    }

    setLockedBuyerFields(locked);
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
          disabled={Boolean(selectedBeneficiaryId)}
          onClick={onSaveBuyerAsBeneficiary}
          className={`text-sm mb-2 ${
            selectedBeneficiaryId
              ? "text-gray-400 cursor-not-allowed"
              : "text-indigo-600 hover:underline"
          }`}
        >
          ➕ Save Buyer as Beneficiary
        </button>

        {beneficiaries.length > 0 && (
          <select
            value={selectedBeneficiaryId || ""}
            className="w-full border rounded px-3 py-2 mb-3"
            onChange={(e) =>
              handleBeneficiarySelect(
                e.target.value || null
              )
            }
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
          disabled={lockedBuyerFields.has("name")}
          onChange={(e) =>
            onBuyerChange("name", e.target.value)
          }
          className="w-full border rounded px-3 py-2 mb-1 disabled:bg-gray-100"
        />

        <textarea
          placeholder="Billing Address *"
          value={buyer.address}
          disabled={lockedBuyerFields.has("address")}
          onChange={(e) =>
            onBuyerChange(
              "address",
              e.target.value
            )
          }
          className="w-full border rounded px-3 py-2 mb-1 disabled:bg-gray-100"
        />

        <input
          placeholder="GSTIN (optional)"
          value={buyer.gstin}
          disabled={lockedBuyerFields.has("gstin")}
          onChange={(e) =>
            onBuyerChange("gstin", e.target.value)
          }
          className="w-full border rounded px-3 py-2 mb-2 disabled:bg-gray-100"
        />

        <select
          value={buyer.state}
          disabled={lockedBuyerFields.has("state")}
          onChange={(e) =>
            onBuyerChange("state", e.target.value)
          }
          className="w-full border rounded px-3 py-2 mb-2 disabled:bg-gray-100"
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
          disabled={lockedBuyerFields.has("phone")}
          onChange={(e) =>
            onBuyerChange(
              "phone",
              e.target.value
            )
          }
          className="w-full border rounded px-3 py-2 mb-3 disabled:bg-gray-100"
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
