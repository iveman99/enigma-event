import "server-only";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AuthHttpError } from "./http";

export interface StudentProfile {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  college: string;
  course: string;
  year: string;
  prn: string;
  id_card_path?: string;
  created_at: string;
  updated_at: string;
}

export async function requireVerifiedSession() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error && error.status && error.status >= 500) throw new AuthHttpError(503, "Sign-in is temporarily unavailable. Please try again.");
  if (!data.user || error) throw new AuthHttpError(401, "Please sign in to continue.", "unauthenticated");
  if (!data.user.email || !data.user.email_confirmed_at) throw new AuthHttpError(403, "Please verify your email before continuing.", "email_unverified");
  return { supabase, user: data.user };
}

export async function readProfile(supabase: SupabaseClient, user: User) {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (error || !data) throw new AuthHttpError(503, "Your profile couldn't be loaded. Please try again shortly.", "profile_unavailable");
  return toStudentUser(user, data as StudentProfile);
}

export function toStudentUser(user: User, profile: StudentProfile) {
  const provider = user.app_metadata.provider;
  return {
    id: user.id,
    email: user.email!,
    firstName: profile.first_name,
    lastName: profile.last_name,
    name: `${profile.first_name} ${profile.last_name}`.trim(),
    phone: profile.phone,
    college: profile.college,
    course: profile.course,
    department: profile.course,
    year: profile.year,
    prn: profile.prn,
    provider: provider === "google" || provider === "github" ? provider : "manual" as const,
    emailVerified: Boolean(user.email_confirmed_at),
    phoneVerified: false,
    hasIdCard: Boolean(profile.id_card_path),
    isRegistrationReady: Boolean(profile.first_name && profile.last_name && profile.phone && profile.college && profile.course && profile.id_card_path),
    isProfileComplete: Boolean(profile.first_name && profile.last_name && profile.phone),
    createdAt: profile.created_at,
    updatedAt: profile.updated_at,
    signedInAt: user.last_sign_in_at || profile.created_at,
  };
}
