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
