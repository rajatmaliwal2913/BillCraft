import type { InvoiceItem } from "../../types/invoice";

interface ItemRowProps {
  item: InvoiceItem;
  errors: Record<string, any>;
  onChange: (
    id: string,
    field: keyof InvoiceItem,
    value: string | number
  ) => void;
  onRemove: (id: string) => void;
}

const GST_SLABS = [0, 5, 12, 18, 28];

export default function ItemRow({
  item,
  errors,
  onChange,
  onRemove,
}: ItemRowProps) {
  return (
    <div className="border rounded-lg p-4 space-y-3 bg-gray-50">
      {/* ITEM NAME */}
      <div>
        <label className="text-sm font-medium">Item Name</label>
        <input
          placeholder="e.g. Steel Rod"
          value={item.name}
          onChange={(e) =>
            onChange(item.id, "name", e.target.value)
          }
          className={`w-full border rounded px-3 py-2 mt-1 ${
            errors.name ? "border-red-500" : ""
          }`}
        />
      </div>

      {/* QTY + PRICE */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium">Quantity</label>
          <input
            type="number"
            min={1}
            value={item.quantity}
            onChange={(e) =>
              onChange(
                item.id,
                "quantity",
                Number(e.target.value)
              )
            }
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium">
            Price / Unit
          </label>
          <input
            type="number"
            min={0}
            value={item.price}
            onChange={(e) =>
              onChange(
                item.id,
                "price",
                Number(e.target.value)
              )
            }
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </div>
      </div>

      {/* DISCOUNT */}
      <div>
        <label className="text-sm font-medium">
          Discount (%)
        </label>
        <input
          type="number"
          min={0}
          value={item.discountRate}
          onChange={(e) =>
            onChange(
              item.id,
              "discountRate",
              Number(e.target.value)
            )
          }
          className="w-full border rounded px-3 py-2 mt-1"
        />
      </div>

      {/* GST SLAB HELPER */}
      <div>
        <label className="text-sm font-medium">
          GST Rate (%)
        </label>

        <div className="flex flex-wrap gap-2 mt-2">
          {GST_SLABS.map((slab) => (
            <button
              key={slab}
              type="button"
              onClick={() =>
                onChange(item.id, "gstRate", slab)
              }
              className={`px-3 py-1 rounded text-sm border transition ${
                item.gstRate === slab
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {slab}%
            </button>
          ))}
        </div>

        {/* MANUAL INPUT (OPTIONAL) */}
        <input
          type="number"
          min={0}
          value={item.gstRate}
          onChange={(e) =>
            onChange(
              item.id,
              "gstRate",
              Number(e.target.value)
            )
          }
          className="w-full border rounded px-3 py-2 mt-2"
          placeholder="Custom GST %"
        />
      </div>

      {/* REMOVE */}
      <button
        onClick={() => onRemove(item.id)}
        className="text-red-600 text-sm hover:underline"
      >
        Remove Item
      </button>
    </div>
  );
}
