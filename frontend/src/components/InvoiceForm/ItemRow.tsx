import type { InvoiceItem } from "../../types/invoice";

interface ItemRowProps {
  item: InvoiceItem;
  index: number;
  errors?: {
    name?: string;
    quantity?: string;
    price?: string;
    discountRate?: string;
    gstRate?: string;
  };
  onChange: (
    id: string,
    field: keyof InvoiceItem,
    value: string | number
  ) => void;
  onRemove: (id: string) => void;
}

export default function ItemRow({
  item,
  index,
  errors,
  onChange,
  onRemove,
}: ItemRowProps) {
  // Calculations
  const base = item.quantity * item.price;
  const discount = (base * item.discountRate) / 100;
  const taxable = base - discount;
  const gst = (taxable * item.gstRate) / 100;
  const finalAmount = taxable + gst;

  return (
    <div className="border rounded-xl p-4 bg-gray-50 space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-700">
          Item {index}
        </h3>
        <button
          onClick={() => onRemove(item.id)}
          className="text-gray-400 hover:text-red-600"
          title="Remove item"
        >
          ✕
        </button>
      </div>

      {/* ITEM NAME */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Item Name
        </label>
        <input
          placeholder="e.g. Tomato Ketchup"
          value={item.name}
          onChange={(e) =>
            onChange(item.id, "name", e.target.value)
          }
          className="w-full border rounded-lg px-3 py-2"
        />
        {errors?.name && (
          <p className="text-xs text-red-600 mt-1">{errors.name}</p>
        )}
      </div>

      {/* QTY + PRICE */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Quantity
          </label>
          <input
            type="number"
            min={1}
            placeholder="0"
            value={item.quantity}
            onChange={(e) =>
              onChange(item.id, "quantity", Number(e.target.value))
            }
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Price (₹)
          </label>
          <input
            type="number"
            min={0}
            placeholder="0.00"
            value={item.price}
            onChange={(e) =>
              onChange(item.id, "price", Number(e.target.value))
            }
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
      </div>

      {/* DISCOUNT + GST */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Discount (%)
          </label>
          <input
            type="number"
            min={0}
            placeholder="0"
            value={item.discountRate}
            onChange={(e) =>
              onChange(item.id, "discountRate", Number(e.target.value))
            }
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            GST (%)
          </label>
          <input
            type="number"
            min={0}
            placeholder="0"
            value={item.gstRate}
            onChange={(e) =>
              onChange(item.id, "gstRate", Number(e.target.value))
            }
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
      </div>

      {/* AMOUNT */}
      <div className="flex justify-between items-center pt-2 border-t">
        <span className="text-sm text-gray-600">
          Item Amount
        </span>
        <span className="font-semibold text-gray-800">
          ₹{finalAmount.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
