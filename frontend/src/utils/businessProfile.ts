import { supabase } from "../lib/supabase";
import type { SellerDetails } from "../types/invoice";

/**
 * Fetch the logged-in user's business profile
 * Returns null if profile does not exist
 */
export async function fetchBusinessProfile(): Promise<SellerDetails | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("business_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle(); // important for 0 or 1 row

  if (error || !data) {
    return null;
  }

  return {
    companyName: data.company_name,
    address: data.address,
    gstin: data.gstin,
    state: data.state,
    phone: data.phone || "",
    email: data.email || "",
    logo: data.logo || undefined,
  };
}

/**
 * Create or update business profile
 */
export async function upsertBusinessProfile(
  seller: SellerDetails
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const { error } = await supabase
    .from("business_profiles")
    .upsert(
      {
        user_id: user.id,
        company_name: seller.companyName,
        address: seller.address,
        gstin: seller.gstin,
        state: seller.state,
        phone: seller.phone || null,
        email: seller.email || null,
        logo: seller.logo || null,
        updated_at: new Date(),
      },
      {
        onConflict: "user_id", // 🔑 CRITICAL
      }
    );

  if (error) {
    console.error("BUSINESS PROFILE UPSERT ERROR:", error);
    throw error;
  }
}
