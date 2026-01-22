import ItemRow from "./ItemRow";
import type { InvoiceItem } from "../../types/invoice";

interface InvoiceFormProps {
  items: InvoiceItem[];
  errors?: Record<string, any>;
  onAddItem: () => void;
  onUpdateItem: (
    id: string,
    field: keyof InvoiceItem,
    value: string | number
  ) => void;
  onRemoveItem: (id: string) => void;
}

export default function InvoiceForm({
  items,
  errors,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
}: InvoiceFormProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">
        Invoice Items
      </h2>

      {items.length === 0 && (
        <p className="text-sm text-gray-500">
          No items added yet.
        </p>
      )}

      {items.map((item, index) => (
        <ItemRow
          key={item.id}
          index={index + 1}
          item={item}
          errors={errors?.[item.id]}
          onChange={onUpdateItem}
          onRemove={onRemoveItem}
        />
      ))}

      <button
        onClick={onAddItem}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
      >
        ➕ Add Item
      </button>
    </div>
  );
}
