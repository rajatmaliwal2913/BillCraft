import type { InvoiceItem } from "../../types/invoice";
import ItemRow from "./ItemRow";

interface InvoiceFormProps {
  items: InvoiceItem[];
  errors: Record<string, any>;
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
    <div>
      <h2 className="text-lg font-semibold mb-4">
        Invoice Items
      </h2>

      <div className="space-y-4">
        {items.map((item) => (
          <ItemRow
                key={item.id}
                item={item}
                errors={errors[item.id] || {}}
                onChange={onUpdateItem}
                onRemove={onRemoveItem} index={0}          />
        ))}
      </div>

      <button
        onClick={onAddItem}
        className="mt-4 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
      >
        + Add Item
      </button>
    </div>
  );
}
