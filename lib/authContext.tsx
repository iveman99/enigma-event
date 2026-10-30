"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { Registration } from "./db";
import type { ProfileInput } from "./auth/validation";

export interface OperativeUser {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  college: string;
  department: string;
  course: string;
  year: string;
  prn: string;
  provider: "google" | "github" | "manual";
  emailVerified: boolean;
  phoneVerified: boolean;
  isProfileComplete: boolean;
  signedInAt: string;
}

export type AuthModalStep = "choice" | "profile" | "portfolio" | "edit" | "success";
export interface AuthResult { success: boolean; error?: string; retryAfter?: number }
export type OtpRequest =
  | { mode: "signup"; email: string; firstName: string; lastName: string; phone: string }
  | { mode: "signin"; email: string };

interface AuthContextType {
  user: OperativeUser | null;
  myRegistrations: Registration[];
  isLoading: boolean;
  configured: boolean | null;
  authError: string | null;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  onboardingStep: AuthModalStep;
  setOnboardingStep: (step: AuthModalStep) => void;
  requestEmailOtp: (input: OtpRequest) => Promise<AuthResult>;
  verifyEmailOtp: (email: string, token: string) => Promise<AuthResult>;
  signInWithGoogle: () => Promise<AuthResult>;
  signInWithGithub: () => Promise<AuthResult>;
  completeOnboarding: (data: ProfileInput) => Promise<AuthResult>;
  updateProfile: (data: ProfileInput) => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
  refreshMyRegistrations: () => Promise<void>;
  openProfile: (mode?: AuthModalStep) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

async function authRequest(path: string, body?: unknown) {
  const response = await fetch(path, {
    method: body === undefined ? "GET" : "POST",
    credentials: "same-origin",
    cache: "no-store",
    ...(body === undefined ? {} : { headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Please try again shortly.");
  return data;
}

function message(error: unknown) {
  return error instanceof Error ? error.message : "We couldn't connect. Please try again.";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<OperativeUser | null>(null);
  const [myRegistrations, setMyRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<AuthModalStep>("choice");
  const generation = useRef(0);

  const refreshSession = useCallback(async () => {
    const current = generation.current;
    try {
      const data = await authRequest("/api/auth/session");
      if (current !== generation.current) return;
      setConfigured(data.configured);
      setUser(data.authenticated ? data.user : null);
      setAuthError(null);
      return data.authenticated ? data.user as OperativeUser : null;
    } catch (error) {
      if (current === generation.current) setAuthError(message(error));
    } finally {
      if (current === generation.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Old browser profiles are never accepted as proof of identity.
    localStorage.removeItem("enigma2_operative_session");
    let active = true;
    const params = new URLSearchParams(window.location.search);
    const fromOAuth = params.get("auth") === "success";
    const oauthFailed = params.has("auth_error");
    if (fromOAuth || oauthFailed) {
      params.delete("auth");
      params.delete("auth_error");
      const query = params.toString();
      window.history.replaceState({}, "", window.location.pathname + (query ? "?" + query : "") + window.location.hash);
    }
    void Promise.resolve().then(refreshSession).then((currentUser) => {
      if (!active) return;
      if (fromOAuth && currentUser) {
        setOnboardingStep(currentUser.isProfileComplete ? "portfolio" : "profile");
        setShowAuthModal(true);
      }
      if (oauthFailed) {
        setAuthError("Sign-in wasn't completed. Please try again or continue with email.");
        setOnboardingStep("choice");
        setShowAuthModal(true);
      }
    });
    const onFocus = () => { void refreshSession(); };
    window.addEventListener("focus", onFocus);
    return () => { active = false; window.removeEventListener("focus", onFocus); };
  }, [refreshSession]);

  const requestEmailOtp = async (input: OtpRequest): Promise<AuthResult> => {
    try {
      const data = await authRequest("/api/auth/otp/request", input);
      setAuthError(null);
      return { success: true, retryAfter: data.retryAfter };
    } catch (error) { return { success: false, error: message(error) }; }
  };

  const verifyEmailOtp = async (email: string, token: string): Promise<AuthResult> => {
    try {
      const data = await authRequest("/api/auth/otp/verify", { email, token });
      generation.current++;
      setUser(data.user);
      setConfigured(true);
      setAuthError(null);
      setOnboardingStep(data.user.isProfileComplete ? "portfolio" : "profile");
      return { success: true };
    } catch (error) { return { success: false, error: message(error) }; }
  };

  const oauth = async (provider: "google" | "github"): Promise<AuthResult> => {
    try {
      const data = await authRequest("/api/auth/" + provider, {});
      window.location.assign(data.url);
      return { success: true };
    } catch (error) { return { success: false, error: message(error) }; }
  };

  const persistProfile = async (data: ProfileInput, next: AuthModalStep): Promise<AuthResult> => {
    try {
      const result = await authRequest("/api/auth/onboarding", data);
      setUser(result.user);
      setOnboardingStep(next);
      return { success: true };
    } catch (error) { return { success: false, error: message(error) }; }
  };

  const signOut = async (): Promise<AuthResult> => {
    try {
      await authRequest("/api/auth/logout", {});
      generation.current++;
      setUser(null);
      setMyRegistrations([]);
      setOnboardingStep("choice");
      return { success: true };
    } catch (error) { return { success: false, error: message(error) }; }
  };

  const refreshMyRegistrations = useCallback(async () => {
    if (!user) { setMyRegistrations([]); return; }
    const current = generation.current;
    try {
      const data = await authRequest("/api/registrations");
      if (current === generation.current && data.success) setMyRegistrations(data.registrations);
    } catch { if (current === generation.current) setMyRegistrations([]); }
  }, [user]);

  useEffect(() => { void Promise.resolve().then(refreshMyRegistrations); }, [refreshMyRegistrations]);

  const openProfile = (mode?: AuthModalStep) => {
    setOnboardingStep(user ? (mode === "edit" ? "edit" : user.isProfileComplete ? "portfolio" : "profile") : "choice");
    setShowAuthModal(true);
  };

  return <AuthContext.Provider value={{
    user, myRegistrations, isLoading, configured, authError, showAuthModal, setShowAuthModal,
    onboardingStep, setOnboardingStep, requestEmailOtp, verifyEmailOtp,
    signInWithGoogle: () => oauth("google"), signInWithGithub: () => oauth("github"),
    completeOnboarding: (data) => persistProfile(data, "portfolio"),
    updateProfile: (data) => persistProfile(data, "portfolio"),
    signOut, refreshMyRegistrations, openProfile,
  }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
