import { supabase } from "../lib/supabase";
import type { Beneficiary } from "../types/beneficiary";

export async function fetchBeneficiaries(): Promise<Beneficiary[]> {
  const { data, error } = await supabase
    .from("beneficiaries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Beneficiary[];
}

export async function createBeneficiary(
  payload: Omit<Beneficiary, "id">
) {
  const { error } = await supabase
    .from("beneficiaries")
    .insert(payload);

  if (error) throw error;
}

export async function updateBeneficiary(
  id: string,
  payload: Omit<Beneficiary, "id">
) {
  const { error } = await supabase
    .from("beneficiaries")
    .update(payload)
    .eq("id", id);

  if (error) throw error;
}

export async function deleteBeneficiary(id: string) {
  const { error } = await supabase
    .from("beneficiaries")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
import type { BuyerDetails } from "../types/invoice";

export async function saveBuyerAsBeneficiary(
  buyer: BuyerDetails
) {
  const {
    name,
    address,
    gstin,
    phone,
    state,
  } = buyer;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  // Priority-based duplicate check
  let query = supabase
    .from("beneficiaries")
    .select("id")
    .eq("user_id", user.id);

  if (gstin) {
    query = query.eq("gstin", gstin);
  } else if (phone) {
    query = query.eq("phone", phone);
  } else if (name) {
    query = query.eq("name", name);
  } else {
    throw new Error(
      "At least GSTIN, phone or name is required"
    );
  }

  const { data: existing } =
    await query.maybeSingle();

  if (existing) {
    throw new Error(
      "Beneficiary already exists"
    );
  }

  const { error } = await supabase
    .from("beneficiaries")
    .insert({
      user_id: user.id,
      name,
      address,
      gstin,
      phone,
      state,
    });

  if (error) throw error;
}

