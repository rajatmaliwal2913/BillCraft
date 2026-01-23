import { supabase } from "../lib/supabase";
import type {
  InvoiceHistoryEntry,
  SellerDetails,
  BuyerDetails,
  InvoiceItem,
  InvoiceTotals,
} from "../types/invoice";

/* =====================================================
   FETCH INVOICES (Dashboard – Latest First)
   ===================================================== */
export async function fetchInvoices(): Promise<
  InvoiceHistoryEntry[]
> {
  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching invoices:", error);
    throw error;
  }

  return data as InvoiceHistoryEntry[];
}

/* =====================================================
   SAVE NEW INVOICE (Create Invoice)
   ===================================================== */
export async function saveInvoiceToSupabase(params: {
  invoiceNumber: string;
  seller: SellerDetails;
  buyer: BuyerDetails;
  items: InvoiceItem[];
  totals: InvoiceTotals;
}) {
  const {
    invoiceNumber,
    seller,
    buyer,
    items,
    totals,
  } = params;

  const { data, error } = await supabase
    .from("invoices")
    .insert([
      {
        invoice_number: invoiceNumber,
        seller,
        buyer,
        items,
        totals,
        // user_id is automatically set by Supabase RLS
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error saving invoice:", error);
    throw error;
  }

  return data;
}

/* =====================================================
   FETCH SINGLE INVOICE (for Preview / Edit later)
   ===================================================== */
export async function fetchInvoiceById(
  id: string
): Promise<InvoiceHistoryEntry> {
  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching invoice:", error);
    throw error;
  }

  return data as InvoiceHistoryEntry;
}
export async function deleteInvoiceById(
  id: string
) {
  const { error } = await supabase
    .from("invoices")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting invoice:", error);
    throw error;
  }
}

export async function updateInvoiceById(
  id: string,
  params: {
    seller: any;
    buyer: any;
    items: any[];
    totals: any;
  }
) {
  const { error } = await supabase
    .from("invoices")
    .update({
      seller: params.seller,
      buyer: params.buyer,
      items: params.items,
      totals: params.totals,
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating invoice:", error);
    throw error;
  }
}

