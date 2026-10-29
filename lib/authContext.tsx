"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Registration } from "./db";

export interface OperativeUser {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  college: string;
  department: string;
  course?: string;
  year: string;
  prn: string;
  avatar?: string;
  provider?: "google" | "github" | "manual";
  isProfileComplete?: boolean;
  signedInAt: string;
}

export type AuthModalStep = "choice" | "profile" | "portfolio" | "edit" | "success";

interface AuthContextType {
  user: OperativeUser | null;
  myRegistrations: Registration[];
  isLoading: boolean;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  onboardingStep: AuthModalStep;
  setOnboardingStep: (step: AuthModalStep) => void;
  signIn: (userData: Omit<OperativeUser, "id" | "signedInAt">) => void;
  signInWithGoogle: () => void;
  signInWithGithub: () => void;
  completeOnboarding: (data: {
    firstName: string;
    lastName: string;
    college: string;
    course: string;
    year: string;
    phone: string;
    prn?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: {
    firstName: string;
    lastName: string;
    college: string;
    course: string;
    year: string;
    phone: string;
    prn?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshMyRegistrations: () => Promise<void>;
  openProfile: (mode?: AuthModalStep) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  myRegistrations: [],
  isLoading: true,
  showAuthModal: false,
  setShowAuthModal: () => {},
  onboardingStep: "choice",
  setOnboardingStep: () => {},
  signIn: () => {},
  signInWithGoogle: () => {},
  signInWithGithub: () => {},
  completeOnboarding: async () => ({ success: false }),
  updateProfile: async () => ({ success: false }),
  signOut: async () => {},
  refreshMyRegistrations: async () => {},
  openProfile: () => {},
});

const STORAGE_KEY = "enigma2_operative_session";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<OperativeUser | null>(null);
  const [myRegistrations, setMyRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<AuthModalStep>("choice");

  // Sync server session & URL params on mount
  useEffect(() => {
    async function loadSession() {
      try {
        // 1. Check server cookie session first
        const res = await fetch("/api/auth/session");
        const data = await res.json();

        if (data.authenticated && data.user) {
          const sUser: OperativeUser = {
            id: data.user.id,
            name: data.user.name || `${data.user.firstName} ${data.user.lastName}`.trim(),
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            email: data.user.email,
            phone: data.user.phone || "",
            college: data.user.college || "",
            department: data.user.course || "Computer Science",
            course: data.user.course || "",
            year: data.user.year || "Final Year (BE / Final)",
            prn: data.user.prn || "N/A",
            avatar: data.user.avatar || "",
            provider: data.user.provider || "manual",
            isProfileComplete: data.user.isProfileComplete,
            signedInAt: data.user.createdAt || new Date().toISOString(),
          };
          setUser(sUser);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(sUser));

          // If profile is incomplete, open onboarding immediately
          if (!data.user.isProfileComplete) {
            setOnboardingStep("profile");
            setShowAuthModal(true);
          }
        } else {
          // Fallback to local storage
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            setUser(parsed);
          }
        }
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }

      // Check URL parameters for auth redirects
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const authAction = params.get("auth");
        if (authAction === "onboarding") {
          setOnboardingStep("profile");
          setShowAuthModal(true);
          window.history.replaceState({}, document.title, window.location.pathname);
        } else if (authAction === "success") {
          setOnboardingStep("portfolio");
          setShowAuthModal(true);
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    }

    loadSession();
  }, []);

  // Fetch registrations matching user email/phone
  const fetchUserRegistrations = async (currentUser: OperativeUser) => {
    try {
      const res = await fetch("/api/registrations");
      const data = await res.json();
      if (data.success && Array.isArray(data.registrations)) {
        const matched = data.registrations.filter(
          (r: Registration) =>
            r.email.toLowerCase() === currentUser.email.toLowerCase() ||
            (currentUser.phone && r.phone === currentUser.phone)
        );
        setMyRegistrations(matched);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserRegistrations(user);
    } else {
      setMyRegistrations([]);
    }
  }, [user]);

  const signInWithGoogle = () => {
    window.location.href = "/api/auth/google";
  };

  const signInWithGithub = () => {
    window.location.href = "/api/auth/github";
  };

  const persistProfile = async (data: {
    firstName: string;
    lastName: string;
    college: string;
    course: string;
    year: string;
    phone: string;
    prn?: string;
  }) => {
    try {
      const res = await fetch("/api/auth/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          email: user?.email,
        }),
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        return { success: false, error: resData.error || "Failed to update profile" };
      }

      const updated = resData.user;
      const sUser: OperativeUser = {
        id: updated.id,
        name: updated.name || `${updated.firstName} ${updated.lastName}`.trim(),
        firstName: updated.firstName,
        lastName: updated.lastName,
        email: updated.email,
        phone: updated.phone || "",
        college: updated.college || "",
        department: updated.course || "Computer Science",
        course: updated.course || "",
        year: updated.year || "Final Year (BE / Final)",
        prn: updated.prn || "N/A",
        avatar: updated.avatar || user?.avatar || "",
        provider: updated.provider || user?.provider || "manual",
        isProfileComplete: true,
        signedInAt: updated.updatedAt || new Date().toISOString(),
      };

      setUser(sUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sUser));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || "Server error" };
    }
  };

  const completeOnboarding = async (data: {
    firstName: string;
    lastName: string;
    college: string;
    course: string;
    year: string;
    phone: string;
    prn?: string;
  }) => {
    const res = await persistProfile(data);
    if (res.success) {
      setOnboardingStep("success");
    }
    return res;
  };

  const updateProfile = async (data: {
    firstName: string;
    lastName: string;
    college: string;
    course: string;
    year: string;
    phone: string;
    prn?: string;
  }) => {
    const res = await persistProfile(data);
    if (res.success) {
      setOnboardingStep("portfolio");
    }
    return res;
  };

  const openProfile = (mode?: AuthModalStep) => {
    if (mode) {
      setOnboardingStep(mode);
    } else if (user) {
      setOnboardingStep("portfolio");
    } else {
      setOnboardingStep("choice");
    }
    setShowAuthModal(true);
  };

  const signIn = (userData: Omit<OperativeUser, "id" | "signedInAt">) => {
    const newUser: OperativeUser = {
      ...userData,
      id: "OP-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
      signedInAt: new Date().toISOString(),
      isProfileComplete: true,
    };
    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
  };

  const signOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    setUser(null);
    setMyRegistrations([]);
    localStorage.removeItem(STORAGE_KEY);
    setOnboardingStep("choice");
  };

  const refreshMyRegistrations = async () => {
    if (user) {
      await fetchUserRegistrations(user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        myRegistrations,
        isLoading,
        showAuthModal,
        setShowAuthModal,
        onboardingStep,
        setOnboardingStep,
        signIn,
        signInWithGoogle,
        signInWithGithub,
        completeOnboarding,
        updateProfile,
        signOut,
        refreshMyRegistrations,
        openProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
