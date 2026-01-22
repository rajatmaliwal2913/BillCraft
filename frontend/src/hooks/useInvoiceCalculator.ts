import { useMemo, useState } from "react";
import type { InvoiceItem, InvoiceTotals } from "../types/invoice";
import { calculateInvoiceTotals } from "../utils/calculations";

export function useInvoiceCalculator() {
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [taxRate, setTaxRate] = useState<number>(0);
  const [discountRate, setDiscountRate] = useState<number>(0);

  // 🔢 Auto-calculate totals whenever data changes
  const totals: InvoiceTotals = useMemo(() => {
    return calculateInvoiceTotals(items, taxRate, discountRate);
  }, [items, taxRate, discountRate]);

  // ➕ Add new item
  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: "",
        quantity: 1,
        price: 0,
        total: 0,
      },
    ]);
  };

  // ✏️ Update item field
  const updateItem = (
    id: string,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, [field]: value }
          : item
      )
    );
  };

  // ❌ Remove item
  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return {
    items,
    taxRate,
    discountRate,
    totals,

    setTaxRate,
    setDiscountRate,
    addItem,
    updateItem,
    removeItem,
  };
}
