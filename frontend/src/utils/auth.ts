import { supabase } from "../lib/supabase";

// Email + Password
export async function signUp(email: string, password: string) {
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw error;
}

export async function signIn(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
}

// Google OAuth
export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });
  if (error) throw error;
}

// Phone OTP
export async function signInWithPhone(phone: string) {
  const { error } = await supabase.auth.signInWithOtp({
    phone,
  });
  if (error) throw error;
}

export async function verifyPhoneOtp(
  phone: string,
  token: string
) {
  const { error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: "sms",
  });
  if (error) throw error;
}
