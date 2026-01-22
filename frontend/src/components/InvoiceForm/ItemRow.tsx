import type { InvoiceItem } from "../../types/invoice";

interface ItemRowProps {
  item: InvoiceItem;
  onChange: (
    id: string,
    field: keyof InvoiceItem,
    value: string | number
  ) => void;
  onRemove: (id: string) => void;
}

export default function ItemRow({
  item,
  onChange,
  onRemove,
}: ItemRowProps) {
  return (
    <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
      <input
        placeholder="Item name"
        value={item.name}
        onChange={(e) =>
          onChange(item.id, "name", e.target.value)
        }
      />

      <input
        type="number"
        min={1}
        value={item.quantity}
        onChange={(e) =>
          onChange(item.id, "quantity", Number(e.target.value))
        }
      />

      <input
        type="number"
        min={0}
        value={item.price}
        onChange={(e) =>
          onChange(item.id, "price", Number(e.target.value))
        }
      />

      <button onClick={() => onRemove(item.id)}>❌</button>
    </div>
  );
}
