import { useState } from "react";
import type {
  SellerDetails,
  BuyerDetails,
} from "../../types/invoice";
import { INDIAN_STATES } from "../../constants/indianStates";

interface SellerBuyerFormProps {
  seller: SellerDetails;
  buyer: BuyerDetails;
  onSellerChange: (
    field: keyof SellerDetails,
    value: string
  ) => void;
  onBuyerChange: (
    field: keyof BuyerDetails,
    value: string
  ) => void;
  onLogoUpload: (logo: string) => void;
}

export default function SellerBuyerForm({
  seller,
  buyer,
  onSellerChange,
  onBuyerChange,
  onLogoUpload,
}: SellerBuyerFormProps) {
  const [sameAsBilling, setSameAsBilling] = useState(true);

  // Handle logo upload
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
        <h2 className="text-lg font-semibold mb-3 text-gray-800">
          Seller Details
        </h2>

        <input
          placeholder="Company Name *"
          value={seller.companyName}
          onChange={(e) =>
            onSellerChange("companyName", e.target.value)
          }
          className="w-full border rounded px-3 py-2 mb-2"
        />

        <textarea
          placeholder="Address *"
          value={seller.address}
          onChange={(e) =>
            onSellerChange("address", e.target.value)
          }
          className="w-full border rounded px-3 py-2 mb-2"
        />

        <input
          placeholder="GSTIN *"
          value={seller.gstin}
          onChange={(e) =>
            onSellerChange("gstin", e.target.value)
          }
          className="w-full border rounded px-3 py-2 mb-2"
        />

        <select
            value={seller.state}
            onChange={(e) =>
                onSellerChange("state", e.target.value)
            }
            className="w-full border rounded px-3 py-2 mb-2"
            >
            <option value="">Select State *</option>
            {INDIAN_STATES.map((state) => (
                <option key={state} value={state}>
                {state}
                </option>
            ))}
        </select>



        <div className="grid grid-cols-2 gap-3 mb-2">
          <input
            placeholder="Phone"
            value={seller.phone || ""}
            onChange={(e) =>
              onSellerChange("phone", e.target.value)
            }
            className="border rounded px-3 py-2"
          />

          <input
            placeholder="Email"
            value={seller.email || ""}
            onChange={(e) =>
              onSellerChange("email", e.target.value)
            }
            className="border rounded px-3 py-2"
          />
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleLogoChange}
          className="text-sm"
        />
      </div>

      {/* ================= BUYER ================= */}
      <div>
        <h2 className="text-lg font-semibold mb-3 text-gray-800">
          Buyer Details (Billing)
        </h2>

        <input
          placeholder="Customer Name *"
          value={buyer.name}
          onChange={(e) =>
            onBuyerChange("name", e.target.value)
          }
          className="w-full border rounded px-3 py-2 mb-2"
        />

        <textarea
          placeholder="Billing Address *"
          value={buyer.address}
          onChange={(e) =>
            onBuyerChange("address", e.target.value)
          }
          className="w-full border rounded px-3 py-2 mb-2"
        />

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
            <option value="">Select State</option>
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
            onBuyerChange("phone", e.target.value)
          }
          className="w-full border rounded px-3 py-2 mb-3"
        />

        {/* SHIPPING TOGGLE */}
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

        {/* SHIPPING ADDRESS */}
        {!sameAsBilling && (
          <div className="space-y-2 mt-2">
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
                    onBuyerChange("shippingState", e.target.value)
                }
                className="w-full border rounded px-3 py-2"
                >
                <option value="">Select Shipping State</option>
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
