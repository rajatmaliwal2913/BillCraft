import ItemRow from "./ItemRow";
import type { InvoiceItem } from "../../types/invoice";

interface InvoiceFormProps {
  items: InvoiceItem[];
  taxRate: number;
  discountRate: number;
  onAddItem: () => void;
  onUpdateItem: (
    id: string,
    field: keyof InvoiceItem,
    value: string | number
  ) => void;
  onRemoveItem: (id: string) => void;
  onTaxChange: (value: number) => void;
  onDiscountChange: (value: number) => void;
}

export default function InvoiceForm({
  items,
  taxRate,
  discountRate,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
  onTaxChange,
  onDiscountChange,
}: InvoiceFormProps) {
  return (
    <div>
      <h2>Invoice Items</h2>

      {items.map((item) => (
        <ItemRow
          key={item.id}
          item={item}
          onChange={onUpdateItem}
          onRemove={onRemoveItem}
        />
      ))}

      <button onClick={onAddItem}>➕ Add Item</button>

      <hr />

      <div>
        <label>
          Tax (%):
          <input
            type="number"
            value={taxRate}
            onChange={(e) => onTaxChange(Number(e.target.value))}
          />
        </label>
      </div>

      <div>
        <label>
          Discount (%):
          <input
            type="number"
            value={discountRate}
            onChange={(e) =>
              onDiscountChange(Number(e.target.value))
            }
          />
        </label>
      </div>
    </div>
  );
}
