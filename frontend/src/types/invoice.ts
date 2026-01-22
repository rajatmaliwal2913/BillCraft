export interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface InvoiceTotals {
  subtotal: number;
  tax: number;
  discount: number;
  grandTotal: number;
}

export interface InvoiceMeta {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate?: string;
  currency: string;
}

export interface Invoice {
  meta: InvoiceMeta;
  items: InvoiceItem[];
  taxRate: number;
  discountRate: number;
  totals: InvoiceTotals;
}
