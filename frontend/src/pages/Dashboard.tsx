import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { supabase } from "../lib/supabase";
import {
  fetchInvoices,
  deleteInvoiceById,
} from "../utils/invoices";
import type { InvoiceHistoryEntry } from "../types/invoice";

export default function Dashboard() {
  const [invoices, setInvoices] = useState<
    InvoiceHistoryEntry[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices()
      .then(setInvoices)
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this invoice? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      await deleteInvoiceById(id);
      setInvoices((prev) =>
        prev.filter((inv) => inv.id !== id)
      );
    } catch (err) {
      console.error(err);
      alert("Failed to delete invoice");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">
          Loading invoices...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-indigo-700">
          BillCraft Dashboard
        </h1>

        <div className="flex gap-3">
          {/* NEW: Manage Beneficiaries */}
          <Link
            to="/beneficiaries"
            className="border px-4 py-2 rounded hover:bg-gray-100"
          >
            Manage Beneficiaries
          </Link>

          <Link
            to="/invoices/new"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            + Create Invoice
          </Link>

          <button
            onClick={handleLogout}
            className="border px-4 py-2 rounded hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      {invoices.length === 0 ? (
        <div className="bg-white p-10 rounded shadow text-center">
          <p className="text-gray-600">
            No invoices yet.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Click “Create Invoice” to get started.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-left">
                  Invoice No
                </th>
                <th className="p-4 text-left">
                  Date
                </th>
                <th className="p-4 text-left">
                  Buyer
                </th>
                <th className="p-4 text-right">
                  Amount
                </th>
                <th className="p-4 text-center">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {invoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-4 font-medium">
                    {inv.invoice_number}
                  </td>

                  <td className="p-4">
                    {new Date(
                      inv.created_at
                    ).toLocaleDateString()}
                  </td>

                  <td className="p-4">
                    {inv.buyer?.name || "-"}
                  </td>

                  <td className="p-4 text-right font-semibold">
                    ₹{inv.totals.grandTotal.toFixed(2)}
                  </td>

                  <td className="p-4 text-center space-x-4">
                    <Link
                      to={`/invoices/${inv.id}`}
                      className="text-indigo-600 hover:underline"
                    >
                      Preview
                    </Link>

                    <Link
                      to={`/invoices/${inv.id}`}
                      className="text-green-600 hover:underline"
                    >
                      Download
                    </Link>

                    <Link
                      to={`/invoices/${inv.id}/edit`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() =>
                        handleDelete(inv.id)
                      }
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
    </div>
  );
}
