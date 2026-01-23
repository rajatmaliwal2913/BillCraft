import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import type { SellerDetails } from "../types/invoice";
import { INDIAN_STATES } from "../constants/indianStates";
import { upsertBusinessProfile } from "../utils/businessProfile";

export default function BusinessProfile() {
  const navigate = useNavigate();

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

  const [loading, setLoading] =
    useState(true);
  const [saving, setSaving] =
    useState(false);

  /* =======================
     LOAD PROFILE
     ======================= */
  useEffect(() => {
    async function loadProfile() {
      const { data, error } =
        await supabase
          .from("business_profiles")
          .select("*")
          .single();

      if (data) {
        setSeller({
          companyName: data.company_name,
          address: data.address,
          gstin: data.gstin,
          state: data.state,
          phone: data.phone,
          email: data.email,
          logo: data.logo,
        });
      }

      setLoading(false);
    }

    loadProfile();
  }, []);

  /* =======================
     SAVE PROFILE
     ======================= */
  const handleSave = async () => {
    try {
        setSaving(true);

        // 🔁 Use centralized util instead of inline Supabase call
        await upsertBusinessProfile(seller);

        alert("Business profile saved");
        navigate("/");
    } catch (err: any) {
        console.error("SAVE BUSINESS PROFILE ERROR:", err);
        alert(err.message || "Failed to save profile");
    } finally {
        setSaving(false);
    }
    };

  /* =======================
     LOGO UPLOAD
     ======================= */
  const handleLogoChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () =>
      setSeller((prev) => ({
        ...prev,
        logo: reader.result as string,
      }));
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">
          Loading business profile...
        </p>
      </div>
    );
  }

  /* =======================
     RENDER
     ======================= */
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">
        <h1 className="text-2xl font-bold text-indigo-700 mb-6">
          Business Profile
        </h1>

        {/* COMPANY NAME */}
        <input
          placeholder="Company Name *"
          value={seller.companyName}
          onChange={(e) =>
            setSeller((p) => ({
              ...p,
              companyName: e.target.value,
            }))
          }
          className="w-full border rounded px-3 py-2 mb-3"
        />

        {/* ADDRESS */}
        <textarea
          placeholder="Address *"
          value={seller.address}
          onChange={(e) =>
            setSeller((p) => ({
              ...p,
              address: e.target.value,
            }))
          }
          className="w-full border rounded px-3 py-2 mb-3"
        />

        {/* GSTIN */}
        <input
          placeholder="GSTIN *"
          value={seller.gstin}
          onChange={(e) =>
            setSeller((p) => ({
              ...p,
              gstin: e.target.value,
            }))
          }
          className="w-full border rounded px-3 py-2 mb-3"
        />

        {/* STATE */}
        <select
          value={seller.state}
          onChange={(e) =>
            setSeller((p) => ({
              ...p,
              state: e.target.value,
            }))
          }
          className="w-full border rounded px-3 py-2 mb-3"
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

        {/* CONTACT */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            placeholder="Phone"
            value={seller.phone || ""}
            onChange={(e) =>
              setSeller((p) => ({
                ...p,
                phone: e.target.value,
              }))
            }
            className="border rounded px-3 py-2"
          />
          <input
            placeholder="Email"
            value={seller.email || ""}
            onChange={(e) =>
              setSeller((p) => ({
                ...p,
                email: e.target.value,
              }))
            }
            className="border rounded px-3 py-2"
          />
        </div>

        {/* LOGO */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Business Logo
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
          />
          {seller.logo && (
            <img
              src={seller.logo}
              alt="Logo preview"
              className="h-20 mt-3 object-contain"
            />
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            💾 Save Profile
          </button>

          <button
            onClick={() => navigate("/")}
            className="border px-6 py-2 rounded hover:bg-gray-100"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
