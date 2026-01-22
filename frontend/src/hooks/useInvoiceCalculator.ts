import { useMemo, useState } from "react";
import type { InvoiceItem, InvoiceTotals } from "../types/invoice";
import { calculateInvoiceTotals } from "../utils/calculations";
import { validateItem } from "../utils/validators";

/**
 * Central GST-aware invoice state & calculation hook
 */
export function useInvoiceCalculator() {
  // --------------------
  // STATE
  // --------------------
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [errors, setErrors] = useState<Record<string, any>>({});

  // --------------------
  // DERIVED TOTALS
  // --------------------
  const totals: InvoiceTotals = useMemo(() => {
    return calculateInvoiceTotals(items);
  }, [items]);

  // --------------------
  // ITEM OPERATIONS
  // --------------------

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: crypto.randomUUID(),
      name: "",
      quantity: 1,
      price: 0,
      discountRate: 0,
      gstRate: 0,
    };

    setItems((prev) => [...prev, newItem]);

    setErrors((prev) => ({
      ...prev,
      [newItem.id]: validateItem(newItem),
    }));
  };

  const updateItem = (
    id: string,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const updatedItem = {
          ...item,
          [field]: value,
        };

        setErrors((prevErrors) => ({
          ...prevErrors,
          [id]: validateItem(updatedItem),
        }));

        return updatedItem;
      })
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));

    setErrors((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  // --------------------
  // PUBLIC API
  // --------------------
  return {
    items,
    totals,
    errors,
    addItem,
    updateItem,
    removeItem,
  };
}
