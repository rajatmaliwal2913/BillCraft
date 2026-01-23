import { useEffect, useState } from "react";
import { INDIAN_STATES } from "../constants/indianStates";
import { Link } from "react-router-dom";
import {
  fetchBeneficiaries,
  createBeneficiary,
  updateBeneficiary,
  deleteBeneficiary,
} from "../utils/beneficiaries";

import type { Beneficiary } from "../types/beneficiary";

const emptyBeneficiary: Omit<Beneficiary, "id"> = {
  name: "",
  address: "",
  gstin: "",
  state: "",
  phone: "",
  email: "",
};

export default function Beneficiaries() {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] =
    useState<Omit<Beneficiary, "id">>(emptyBeneficiary);

  /* =======================
     LOAD BENEFICIARIES
     ======================= */
  const loadBeneficiaries = async () => {
    setLoading(true);
    const data = await fetchBeneficiaries();
    setBeneficiaries(data);
    setLoading(false);
  };

  useEffect(() => {
    loadBeneficiaries();
  }, []);

  /* =======================
     FORM HANDLERS
     ======================= */
  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyBeneficiary);
    setIsModalOpen(true);
  };

  const openEditModal = (b: Beneficiary) => {
    setEditingId(b.id);
    setForm({
      name: b.name,
      address: b.address,
      gstin: b.gstin,
      state: b.state,
      phone: b.phone,
      email: b.email ?? "",
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      alert("Beneficiary name is required");
      return;
    }

    if (editingId) {
      await updateBeneficiary(editingId, form);
    } else {
      await createBeneficiary(form);
    }

    setIsModalOpen(false);
    loadBeneficiaries();
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this beneficiary?"
    );
    if (!confirmed) return;

    await deleteBeneficiary(id);
    loadBeneficiaries();
  };

  /* =======================
     RENDER
     ======================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading beneficiaries…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-indigo-700">
          Beneficiaries
        </h1>
        <Link
            to="/"
            className="border px-4 py-2 rounded hover:bg-gray-100"
            >
            ← Back to Dashboard
        </Link>
        <button
          onClick={openAddModal}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          + Add Beneficiary
        </button>
      </div>

      {/* TABLE */}
      {beneficiaries.length === 0 ? (
        <div className="bg-white p-10 rounded shadow text-center">
          <p className="text-gray-600">
            No beneficiaries added yet.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">GSTIN</th>
                <th className="p-4 text-left">State</th>
                <th className="p-4 text-left">Phone</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {beneficiaries.map((b) => (
                <tr
                  key={b.id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-4 font-medium">
                    {b.name}
                  </td>
                  <td className="p-4">
                    {b.gstin || "-"}
                  </td>
                  <td className="p-4">
                    {b.state || "-"}
                  </td>
                  <td className="p-4">
                    {b.phone || "-"}
                  </td>
                  <td className="p-4 text-center space-x-4">
                    <button
                      onClick={() => openEditModal(b)}
                      className="text-indigo-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-xl shadow p-6">
            <h2 className="text-lg font-bold mb-4">
              {editingId
                ? "Edit Beneficiary"
                : "Add Beneficiary"}
            </h2>

            <div className="space-y-3">
              <input
                placeholder="Name *"
                className="w-full border p-2 rounded"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
              />
              <input
                placeholder="GSTIN"
                className="w-full border p-2 rounded"
                value={form.gstin}
                onChange={(e) =>
                  setForm({
                    ...form,
                    gstin: e.target.value,
                  })
                }
              />
              <select
                className="w-full border p-2 rounded"
                value={form.state}
                onChange={(e) =>
                    setForm({ ...form, state: e.target.value })
                }
                >
                <option value="">Select State</option>
                {INDIAN_STATES.map((state) => (
                    <option key={state} value={state}>
                    {state}
                    </option>
                ))}
                </select>

              <input
                placeholder="Phone"
                className="w-full border p-2 rounded"
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone: e.target.value,
                  })
                }
              />
              <input
                placeholder="Email"
                className="w-full border p-2 rounded"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
              />
              <textarea
                placeholder="Address"
                className="w-full border p-2 rounded"
                value={form.address}
                onChange={(e) =>
                  setForm({
                    ...form,
                    address: e.target.value,
                  })
                }
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
