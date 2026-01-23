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
    state,
    phone,
  } = buyer;

  if (!name || !address || !state) {
    throw new Error(
      "Buyer name, address and state are required"
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // Prevent duplicates (GSTIN OR name)
  const { data: existing } = await supabase
    .from("beneficiaries")
    .select("id")
    .or(
      gstin
        ? `gstin.eq.${gstin}`
        : `name.eq.${name}`
    )
    .eq("user_id", user.id)
    .maybeSingle();

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
      state,
      phone,
    });

  if (error) throw error;
}
