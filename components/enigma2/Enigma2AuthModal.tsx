"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Mail,
  Building2,
  GraduationCap,
  ChevronDown,
  Check,
  Edit3,
  Ticket,
  QrCode,
  LogOut,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  PhoneCall
} from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { cyberAudio } from "@/lib/audio";
import { MUMBAI_COLLEGES, STUDENT_COURSES, ACADEMIC_YEARS, CollegeItem } from "@/lib/colleges";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialMessage?: string;
}

export default function Enigma2AuthModal({
  isOpen,
  onClose,
  onSuccess,
  initialMessage
}: AuthModalProps) {
  const {
    user,
    myRegistrations,
    signInWithGoogle,
    signInWithGithub,
    completeOnboarding,
    updateProfile,
    signIn,
    signOut,
    onboardingStep,
    setOnboardingStep
  } = useAuth();

  // Tab switch: "signup" or "signin"
  const [authMode, setAuthMode] = useState<"signup" | "signin">("signup");

  // Form Fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [college, setCollege] = useState("");
  const [customCollege, setCustomCollege] = useState("");
  const [course, setCourse] = useState(STUDENT_COURSES[0]);
  const [customCourse, setCustomCourse] = useState("");
  const [year, setYear] = useState(ACADEMIC_YEARS[3]); // Default Final Year
  const [prn, setPrn] = useState("");

  // Searchable College Dropdown state
  const [collegeSearch, setCollegeSearch] = useState("");
  const [isCollegeDropdownOpen, setIsCollegeDropdownOpen] = useState(false);
  const collegeDropdownRef = useRef<HTMLDivElement>(null);

  // Status & loaders
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync incoming user
  useEffect(() => {
    if (user) {
      if (user.firstName) setFirstName(user.firstName);
      if (user.lastName) setLastName(user.lastName);
      if (!user.firstName && !user.lastName && user.name) {
        const parts = user.name.split(" ");
        setFirstName(parts[0] || "");
        setLastName(parts.slice(1).join(" ") || "");
      }
      if (user.email) setEmail(user.email);
      if (user.phone) setPhone(user.phone);
      if (user.college) {
        setCollege(user.college);
        setCollegeSearch(user.college);
      }
      if (user.course) setCourse(user.course);
      if (user.year) setYear(user.year);
      if (user.prn && user.prn !== "N/A") setPrn(user.prn);
    }
  }, [user]);

  // Click outside listener for college combobox
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (collegeDropdownRef.current && !collegeDropdownRef.current.contains(e.target as Node)) {
        setIsCollegeDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredColleges = MUMBAI_COLLEGES.filter((c) => {
    const q = collegeSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.shortName.toLowerCase().includes(q) ||
      c.area.toLowerCase().includes(q)
    );
  });

  const handleSelectCollege = (col: CollegeItem) => {
    if (col.id === "other") {
      setCollege("Other");
      setCollegeSearch("Other College / University");
    } else {
      setCollege(col.name);
      setCollegeSearch(col.name);
      setCustomCollege("");
    }
    setIsCollegeDropdownOpen(false);
    cyberAudio.playClick();
  };

  const handleGoogleLogin = () => {
    cyberAudio.playClick();
    signInWithGoogle();
  };

  const handleGithubLogin = () => {
    cyberAudio.playClick();
    signInWithGithub();
  };

  // Direct manual submit (Sign up or Sign in)
  const handleDirectAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (authMode === "signup") {
      if (!firstName.trim() || !lastName.trim()) {
        setError("Please enter your first and last name.");
        return;
      }
      if (!email.trim() || !email.includes("@")) {
        setError("Please enter a valid email address.");
        return;
      }

      cyberAudio.playClick();
      signIn({
        name: `${firstName.trim()} ${lastName.trim()}`,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim() || "+91 98201 54321",
        college: college.trim() || "University Department of Computer Science (UDCS, Kalina)",
        department: "Computer Science",
        course: course || "M.Sc Computer Science",
        year: year || "Final Year (BE / Final)",
        prn: prn.trim() || "ENG27-001"
      });

      if (!college.trim()) {
        setOnboardingStep("profile");
      } else {
        setOnboardingStep("portfolio");
      }
    } else {
      // Sign in mode
      if (!email.trim()) {
        setError("Please enter your registered email address.");
        return;
      }
      cyberAudio.playClick();
      signIn({
        name: email.split("@")[0].toUpperCase(),
        firstName: email.split("@")[0],
        lastName: "Student",
        email: email.trim(),
        phone: "+91 98201 54321",
        college: "University Department of Computer Science (UDCS, Kalina)",
        department: "Computer Science",
        course: "M.Sc Computer Science",
        year: "Final Year (BE / Final)",
        prn: "ENG27-001"
      });
      setOnboardingStep("portfolio");
    }
  };

  // Profile save (onboarding or edit)
  const handleSubmitProfile = async (e: React.FormEvent, isEditing = false) => {
    e.preventDefault();
    setError(null);
    setSaveSuccess(false);
    cyberAudio.playClick();

    const selectedCollege = college === "Other" ? customCollege.trim() : college.trim();
    const selectedCourse = course === "Other Course" ? customCourse.trim() : course.trim();

    if (!firstName.trim() || !lastName.trim()) {
      setError("Please provide both First Name and Last Name.");
      return;
    }
    if (!selectedCollege) {
      setError("Please select or specify your Mumbai College.");
      return;
    }
    if (!selectedCourse) {
      setError("Please specify your current course.");
      return;
    }

    setIsSubmitting(true);
    const payload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      college: selectedCollege,
      course: selectedCourse,
      year: year.trim(),
      phone: phone.trim() || "+91 99999 99999",
      prn: prn.trim() || "ENG-" + Math.floor(1000 + Math.random() * 9000),
    };

    const result = isEditing ? await updateProfile(payload) : await completeOnboarding(payload);
    setIsSubmitting(false);

    if (result.success) {
      cyberAudio.playSuccess();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      setError(result.error || "Failed to update profile. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Full Screen Dark Backdrop with Glossy Chromatic Horizon Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#050608]/94 backdrop-blur-2xl flex items-center justify-center pointer-events-auto overflow-hidden"
        >
          {/* Ambient Glowing Aurora Flares (Exact colors from Dribbble shot) */}
          <motion.div
            animate={{
              scale: [1, 1.12, 1],
              opacity: [0.18, 0.28, 0.18],
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-[-10%] top-[30%] w-[700px] h-[700px] bg-gradient-to-br from-[#d91e5a]/30 via-[#8b1e5a]/20 to-transparent rounded-full blur-[140px] pointer-events-none"
          />

          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.12, 0.22, 0.12],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute left-[-10%] bottom-[15%] w-[700px] h-[700px] bg-gradient-to-tr from-[#00d2ff]/25 via-[#1d4ed8]/20 to-transparent rounded-full blur-[140px] pointer-events-none"
          />

          {/* Ethereal Glowing Curved Chromatic Horizon Wave (Dribbble Signature) */}
          <motion.div
            animate={{
              y: [0, -5, 0],
              rotate: [-1.2, -1.6, -1.2],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-[220%] h-[4px] bottom-[37%] left-[-60%] pointer-events-none"
          >
            {/* The razor-thin iridescent beam */}
            <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#00f3ff] via-[#3b82f6] via-[#9333ea] via-[#ec4899] to-transparent shadow-[0_0_20px_#00f3ff,0_0_50px_#3b82f6,0_0_80px_#ec4899]" />
            {/* Diffuse secondary rainbow dispersion */}
            <div className="w-full h-[12px] -mt-1.5 bg-gradient-to-r from-transparent via-[#00f3ff]/40 via-[#3b82f6]/40 via-[#a855f7]/40 via-[#ec4899]/40 to-transparent blur-[8px]" />
          </motion.div>
        </motion.div>

        {/* Modal Window: Smoked Luxury Glass Container with Specular Top Highlight */}
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 16 }}
          transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: "linear-gradient(145deg, rgba(28, 30, 36, 0.96) 0%, rgba(14, 15, 19, 0.98) 100%)",
            boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 1px 0 rgba(255, 255, 255, 0.22), 0 35px 80px -15px rgba(0, 0, 0, 0.85)"
          }}
          className="relative w-full max-w-[420px] rounded-[28px] p-7 sm:p-8 backdrop-blur-2xl z-10 my-4 text-zinc-100"
        >
          {/* Top Row: Pill Switcher [Sign up | Sign in] + Circular Close Button */}
          <div className="flex items-center justify-between mb-6">
            {onboardingStep === "choice" ? (
              <div
                style={{
                  background: "rgba(10, 11, 14, 0.85)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.5)"
                }}
                className="inline-flex items-center p-1 rounded-full"
              >
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("signup");
                    cyberAudio.playClick();
                  }}
                  style={
                    authMode === "signup"
                      ? {
                          background: "linear-gradient(180deg, #2b2e36 0%, #1e2027 100%)",
                          border: "1px solid rgba(255, 255, 255, 0.18)",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.22)"
                        }
                      : {}
                  }
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-all cursor-pointer ${
                    authMode === "signup"
                      ? "text-white"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Sign up
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("signin");
                    cyberAudio.playClick();
                  }}
                  style={
                    authMode === "signin"
                      ? {
                          background: "linear-gradient(180deg, #2b2e36 0%, #1e2027 100%)",
                          border: "1px solid rgba(255, 255, 255, 0.18)",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.22)"
                        }
                      : {}
                  }
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-all cursor-pointer ${
                    authMode === "signin"
                      ? "text-white"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Sign in
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[11px] font-mono tracking-wider uppercase text-zinc-400">
                  {onboardingStep === "profile" && "Academic Onboarding"}
                  {onboardingStep === "portfolio" && "Student Passport"}
                  {onboardingStep === "edit" && "Edit Profile"}
                  {onboardingStep === "success" && "Passport Activated"}
                </span>
              </div>
            )}

            {/* Circular Close Button with Specular Ring */}
            <button
              onClick={onClose}
              style={{
                background: "linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.2)"
              }}
              className="w-8 h-8 rounded-full text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <X size={15} />
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Banner */}
          {saveSuccess && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center gap-2">
              <CheckCircle2 size={15} className="shrink-0" />
              <span>Changes saved successfully!</span>
            </div>
          )}

          {/* ====================================================================== */}
          {/* VIEW 1: SIGN UP & SIGN IN (Dribbble 1:1 Design)                        */}
          {/* ====================================================================== */}
          {onboardingStep === "choice" && (
            <div>
              <h2 className="text-xl font-semibold text-white tracking-tight mb-5">
                {authMode === "signup" ? "Create an account" : "Welcome back"}
              </h2>

              <form onSubmit={handleDirectAuthSubmit} className="space-y-3">
                {authMode === "signup" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative group">
                      <input
                        type="text"
                        required
                        placeholder="First name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        style={{
                          background: "linear-gradient(180deg, rgba(24, 25, 30, 0.95) 0%, rgba(16, 17, 21, 0.95) 100%)",
                          border: "1px solid rgba(255, 255, 255, 0.08)",
                          boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.5), 0 1px 0 rgba(255, 255, 255, 0.05)"
                        }}
                        className="w-full px-3.5 py-3 focus:border-white/30 focus:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_0_15px_rgba(255,255,255,0.08)] rounded-xl text-white placeholder-zinc-500 text-xs outline-none transition-all"
                      />
                    </div>
                    <div className="relative group">
                      <input
                        type="text"
                        required
                        placeholder="Last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        style={{
                          background: "linear-gradient(180deg, rgba(24, 25, 30, 0.95) 0%, rgba(16, 17, 21, 0.95) 100%)",
                          border: "1px solid rgba(255, 255, 255, 0.08)",
                          boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.5), 0 1px 0 rgba(255, 255, 255, 0.05)"
                        }}
                        className="w-full px-3.5 py-3 focus:border-white/30 focus:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_0_15px_rgba(255,255,255,0.08)] rounded-xl text-white placeholder-zinc-500 text-xs outline-none transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Email Field with Mail Icon */}
                <div className="relative group">
                  <Mail size={15} className="absolute left-3.5 top-3.5 text-zinc-500 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      background: "linear-gradient(180deg, rgba(24, 25, 30, 0.95) 0%, rgba(16, 17, 21, 0.95) 100%)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.5), 0 1px 0 rgba(255, 255, 255, 0.05)"
                    }}
                    className="w-full pl-10 pr-3.5 py-3 focus:border-white/30 focus:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_0_15px_rgba(255,255,255,0.08)] rounded-xl text-white placeholder-zinc-500 text-xs outline-none transition-all"
                  />
                </div>

                {/* Indian Phone Field: 🇮🇳 IN ▾ +91 */}
                {authMode === "signup" && (
                  <div
                    style={{
                      background: "linear-gradient(180deg, rgba(24, 25, 30, 0.95) 0%, rgba(16, 17, 21, 0.95) 100%)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.5), 0 1px 0 rgba(255, 255, 255, 0.05)"
                    }}
                    className="flex items-center focus-within:border-white/30 focus-within:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_0_15px_rgba(255,255,255,0.08)] rounded-xl overflow-hidden transition-all"
                  >
                    <div className="flex items-center gap-1.5 px-3 py-3 border-r border-white/[0.08] bg-black/20 text-xs text-zinc-300">
                      <svg className="w-4 h-3 rounded-[2px] shrink-0" viewBox="0 0 640 480">
                        <path fill="#FF9933" d="M0 0h640v160H0z" />
                        <path fill="#FFFFFF" d="M0 160h640v160H0z" />
                        <path fill="#138808" d="M0 320h640v160H0z" />
                        <circle cx="320" cy="240" r="38" fill="#000080" />
                        <circle cx="320" cy="240" r="32" fill="#FFFFFF" />
                        <circle cx="320" cy="240" r="8" fill="#000080" />
                      </svg>
                      <span className="text-[11px] font-mono text-zinc-300 font-semibold">IN</span>
                      <ChevronDown size={12} className="text-zinc-500 ml-0.5" />
                    </div>
                    <input
                      type="tel"
                      placeholder="+91 (982) 015-4321"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-3 bg-transparent text-white placeholder-zinc-500 text-xs outline-none"
                    />
                  </div>
                )}

                {/* Main Action Button (Solid White Pill with Specular Top Shine) */}
                <button
                  type="submit"
                  style={{
                    background: "linear-gradient(180deg, #ffffff 0%, #f1f2f5 100%)",
                    boxShadow: "0 4px 22px rgba(255, 255, 255, 0.22), inset 0 1px 0 #ffffff"
                  }}
                  className="w-full mt-2 py-3.5 text-black font-semibold text-xs rounded-xl transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99] hover:bg-zinc-100"
                >
                  {authMode === "signup" ? "Create an account" : "Sign in to account"}
                </button>
              </form>

              {/* Muted OR Divider */}
              <div className="relative flex items-center justify-center my-5">
                <div className="border-t border-white/[0.06] w-full" />
                <span className="bg-[#141518] px-3 text-[10px] uppercase tracking-wider text-zinc-500 font-medium shrink-0">
                  OR SIGN IN WITH
                </span>
                <div className="border-t border-white/[0.06] w-full" />
              </div>

              {/* Two Column OAuth: Google & GitHub */}
              <div className="grid grid-cols-2 gap-3">
                {/* Google Button */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  style={{
                    background: "linear-gradient(180deg, rgba(28, 30, 36, 0.9) 0%, rgba(18, 19, 24, 0.9) 100%)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 2px 6px rgba(0, 0, 0, 0.3)"
                  }}
                  className="py-3 px-4 hover:border-white/20 rounded-xl flex items-center justify-center transition-all cursor-pointer hover:scale-[1.01]"
                  title="Continue with Google"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                </button>

                {/* GitHub Button */}
                <button
                  type="button"
                  onClick={handleGithubLogin}
                  style={{
                    background: "linear-gradient(180deg, rgba(28, 30, 36, 0.9) 0%, rgba(18, 19, 24, 0.9) 100%)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 2px 6px rgba(0, 0, 0, 0.3)"
                  }}
                  className="py-3 px-4 hover:border-white/20 rounded-xl flex items-center justify-center transition-all cursor-pointer hover:scale-[1.01]"
                  title="Continue with GitHub"
                >
                  <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    />
                  </svg>
                </button>
              </div>

              {/* Terms notice */}
              <p className="text-zinc-500 text-[11px] text-center mt-4 leading-normal">
                By creating an account, you agree to our Terms & Service
              </p>

              {/* Required Support One-Liner */}
              <div className="mt-4 pt-3.5 border-t border-white/[0.08] text-center">
                <p className="text-[11px] text-zinc-400 flex items-center justify-center gap-1.5 flex-wrap">
                  <span>Problem in signing in your ID? Please reach out to:</span>
                  <a
                    href="tel:+918828069553"
                    className="text-cyan-400 hover:text-cyan-300 font-medium underline underline-offset-2 flex items-center gap-1"
                  >
                    <PhoneCall size={11} />
                    <span>Mayur Shewle +91 88280 69553</span>
                  </a>
                </p>
              </div>
            </div>
          )}

          {/* ====================================================================== */}
          {/* VIEW 2: ACADEMIC DETAILS & EDIT (Consistent luxury design)            */}
          {/* ====================================================================== */}
          {(onboardingStep === "profile" || onboardingStep === "edit") && (
            <form
              onSubmit={(e) => handleSubmitProfile(e, onboardingStep === "edit")}
              className="space-y-3.5 max-h-[70vh] overflow-y-auto custom-scrollbar pr-1"
            >
              <div>
                <h2 className="text-xl font-semibold text-white tracking-tight">
                  {onboardingStep === "edit" ? "Edit Academic Profile" : "Complete your profile"}
                </h2>
                <p className="text-zinc-400 text-xs mt-1">
                  Connect your student details for passes & certificates.
                </p>
              </div>

              {/* Names */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">First name</label>
                  <input
                    type="text"
                    required
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    style={{
                      background: "linear-gradient(180deg, rgba(24, 25, 30, 0.95) 0%, rgba(16, 17, 21, 0.95) 100%)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.5), 0 1px 0 rgba(255, 255, 255, 0.05)"
                    }}
                    className="w-full px-3.5 py-2.5 focus:border-white/30 rounded-xl text-white placeholder-zinc-500 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Last name</label>
                  <input
                    type="text"
                    required
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    style={{
                      background: "linear-gradient(180deg, rgba(24, 25, 30, 0.95) 0%, rgba(16, 17, 21, 0.95) 100%)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.5), 0 1px 0 rgba(255, 255, 255, 0.05)"
                    }}
                    className="w-full px-3.5 py-2.5 focus:border-white/30 rounded-xl text-white placeholder-zinc-500 text-xs outline-none"
                  />
                </div>
              </div>

              {/* Searchable Mumbai Colleges Dropdown */}
              <div className="relative" ref={collegeDropdownRef}>
                <label className="block text-[11px] text-zinc-400 mb-1 flex items-center justify-between">
                  <span>Mumbai College / Institute</span>
                  <span className="text-[10px] text-cyan-400 font-mono">50+ MMR Colleges</span>
                </label>
                <div className="relative">
                  <Building2 size={14} className="absolute left-3.5 top-3 text-cyan-400" />
                  <input
                    type="text"
                    required
                    placeholder="Search college (e.g. UDCS, VJTI, SPIT, DJSCE...)"
                    value={collegeSearch}
                    onFocus={() => setIsCollegeDropdownOpen(true)}
                    onChange={(e) => {
                      setCollegeSearch(e.target.value);
                      setIsCollegeDropdownOpen(true);
                      setCollege(e.target.value);
                    }}
                    style={{
                      background: "linear-gradient(180deg, rgba(24, 25, 30, 0.95) 0%, rgba(16, 17, 21, 0.95) 100%)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.5), 0 1px 0 rgba(255, 255, 255, 0.05)"
                    }}
                    className="w-full pl-9 pr-8 py-2.5 focus:border-cyan-400/50 rounded-xl text-white placeholder-zinc-500 text-xs outline-none transition-all"
                  />
                  <ChevronDown size={14} className="absolute right-3 top-3 text-zinc-500 pointer-events-none" />
                </div>

                {isCollegeDropdownOpen && (
                  <div className="absolute z-50 left-0 right-0 mt-1 max-h-52 overflow-y-auto bg-[#18191d] border border-white/[0.12] rounded-xl shadow-2xl custom-scrollbar py-1 divide-y divide-white/[0.04]">
                    {filteredColleges.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => handleSelectCollege(c)}
                        className={`px-3 py-2 hover:bg-white/[0.06] cursor-pointer flex items-center justify-between text-xs transition-colors ${
                          college === c.name ? "bg-white/[0.08] text-cyan-400" : "text-zinc-300"
                        }`}
                      >
                        <div>
                          <div className="font-medium flex items-center gap-1.5">
                            <span>{c.name}</span>
                            {college === c.name && <Check size={12} className="text-cyan-400" />}
                          </div>
                          <span className="text-[10px] text-zinc-500">{c.area} • {c.type}</span>
                        </div>
                        <span className="text-[10px] text-zinc-400 px-1.5 py-0.5 rounded bg-black/40">
                          {c.shortName}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {college === "Other" && (
                  <input
                    type="text"
                    required
                    placeholder="Type your unlisted college name..."
                    value={customCollege}
                    onChange={(e) => setCustomCollege(e.target.value)}
                    className="w-full mt-2 px-3.5 py-2.5 bg-[#18191d] border border-cyan-400/40 rounded-xl text-white placeholder-zinc-500 text-xs outline-none"
                  />
                )}
              </div>

              {/* Course Pursuing */}
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Course pursuing</label>
                <div className="relative">
                  <GraduationCap size={14} className="absolute left-3.5 top-3 text-zinc-500" />
                  <select
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    style={{
                      background: "linear-gradient(180deg, rgba(24, 25, 30, 0.95) 0%, rgba(16, 17, 21, 0.95) 100%)",
                      border: "1px solid rgba(255, 255, 255, 0.08)"
                    }}
                    className="w-full pl-9 pr-7 py-2.5 focus:border-white/30 rounded-xl text-white text-xs outline-none"
                  >
                    {STUDENT_COURSES.map((crs) => (
                      <option key={crs} value={crs} className="bg-zinc-900 text-white">
                        {crs}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Year of Study & Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Study year</label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    style={{
                      background: "linear-gradient(180deg, rgba(24, 25, 30, 0.95) 0%, rgba(16, 17, 21, 0.95) 100%)",
                      border: "1px solid rgba(255, 255, 255, 0.08)"
                    }}
                    className="w-full px-3 py-2.5 focus:border-white/30 rounded-xl text-white text-xs outline-none"
                  >
                    {ACADEMIC_YEARS.map((y) => (
                      <option key={y} value={y} className="bg-zinc-900 text-white">
                        {y}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">WhatsApp / Phone</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{
                      background: "linear-gradient(180deg, rgba(24, 25, 30, 0.95) 0%, rgba(16, 17, 21, 0.95) 100%)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.5), 0 1px 0 rgba(255, 255, 255, 0.05)"
                    }}
                    className="w-full px-3.5 py-2.5 focus:border-white/30 rounded-xl text-white placeholder-zinc-500 text-xs outline-none"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-between gap-3">
                {onboardingStep === "edit" ? (
                  <button
                    type="button"
                    onClick={() => setOnboardingStep("portfolio")}
                    className="px-4 py-2.5 rounded-xl border border-white/10 text-xs text-zinc-400 hover:text-white"
                  >
                    Back
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setOnboardingStep("choice")}
                    className="text-xs text-zinc-400 hover:text-white"
                  >
                    ← Switch method
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    background: "linear-gradient(180deg, #ffffff 0%, #f1f2f5 100%)",
                    boxShadow: "0 4px 22px rgba(255, 255, 255, 0.22), inset 0 1px 0 #ffffff"
                  }}
                  className="flex-1 py-3 text-black font-semibold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{onboardingStep === "edit" ? "Save Changes" : "Save & Activate Passport"}</span>
                  )}
                </button>
              </div>

              {/* Support One-Liner */}
              <div className="mt-3 pt-3 border-t border-white/[0.08] text-center">
                <p className="text-[11px] text-zinc-400 flex items-center justify-center gap-1.5 flex-wrap">
                  <span>Problem in signing in your ID? Contact:</span>
                  <a
                    href="tel:+918828069553"
                    className="text-cyan-400 hover:text-cyan-300 font-medium underline underline-offset-2 flex items-center gap-1"
                  >
                    <PhoneCall size={11} />
                    <span>Mayur Shewle +91 88280 69553</span>
                  </a>
                </p>
              </div>
            </form>
          )}

          {/* ====================================================================== */}
          {/* VIEW 3: STUDENT COMMAND PORTFOLIO (Passes, Stats, Edit)                */}
          {/* ====================================================================== */}
          {onboardingStep === "portfolio" && user && (
            <div className="space-y-4 max-h-[72vh] overflow-y-auto custom-scrollbar pr-1">
              {/* Minimalist User Card */}
              <div
                style={{
                  background: "linear-gradient(180deg, rgba(28, 30, 36, 0.95) 0%, rgba(18, 19, 24, 0.95) 100%)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.08)"
                }}
                className="p-4 rounded-2xl relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-12 h-12 rounded-xl object-cover border border-white/15"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center font-bold text-base text-white">
                        {user.name[0]}
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-sm text-white">{user.name}</h3>
                      <p className="text-[11px] text-zinc-400 truncate max-w-[200px]">
                        {user.college || "UDCS, University of Mumbai"}
                      </p>
                      <p className="text-[10px] text-cyan-400 font-mono mt-0.5">
                        {user.course || "M.Sc Computer Science"}
                      </p>
                    </div>
                  </div>

                  <div className="p-2 bg-white rounded-lg text-black">
                    <QrCode size={32} />
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-zinc-400">
                  <span>ID: {user.id}</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={11} /> VERIFIED
                  </span>
                </div>
              </div>

              {/* Event Stats Counter */}
              <div className="grid grid-cols-2 gap-3">
                <div
                  style={{
                    background: "rgba(22, 24, 29, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.08)"
                  }}
                  className="p-3 rounded-xl text-center"
                >
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-0.5">
                    Registered Passes
                  </span>
                  <span className="text-xl font-bold text-white flex items-center justify-center gap-1">
                    <Ticket size={16} className="text-cyan-400" />
                    <span>{myRegistrations.length}</span>
                  </span>
                </div>
                <div
                  style={{
                    background: "rgba(22, 24, 29, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.08)"
                  }}
                  className="p-3 rounded-xl text-center"
                >
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block mb-0.5">
                    Campus
                  </span>
                  <span className="text-xs font-semibold text-zinc-200 block truncate px-1">
                    MUMBAI MMR
                  </span>
                </div>
              </div>

              {/* Tickets List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-300 font-medium">
                  <span>Your Passes ({myRegistrations.length})</span>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      const el = document.getElementById("events");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <span>Browse Events</span>
                    <ExternalLink size={10} />
                  </button>
                </div>

                {myRegistrations.length > 0 ? (
                  myRegistrations.map((reg) => (
                    <div
                      key={reg.id}
                      style={{
                        background: "rgba(22, 24, 29, 0.8)",
                        border: "1px solid rgba(255, 255, 255, 0.06)"
                      }}
                      className="p-3 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-medium text-white">{reg.eventTitle}</div>
                        <div className="text-[10px] font-mono text-zinc-400 mt-0.5">
                          Code: <span className="text-amber-400">{reg.ticketCode}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        CONFIRMED
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-xl bg-[#18191d] border border-dashed border-white/[0.08] text-center text-xs text-zinc-500">
                    No active registrations yet.
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="px-3.5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-red-500/10 text-xs text-zinc-400 hover:text-red-400 transition-colors flex items-center gap-1.5"
                >
                  <LogOut size={13} />
                  <span>Sign out</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      cyberAudio.playClick();
                      setOnboardingStep("edit");
                    }}
                    className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white text-xs font-medium transition-all flex items-center gap-1.5"
                  >
                    <Edit3 size={13} />
                    <span>Edit Profile</span>
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    style={{
                      background: "linear-gradient(180deg, #ffffff 0%, #f1f2f5 100%)",
                      boxShadow: "0 4px 20px rgba(255, 255, 255, 0.2)"
                    }}
                    className="px-5 py-2.5 rounded-xl text-black font-semibold text-xs transition-all"
                  >
                    Done
                  </button>
                </div>
              </div>

              {/* Support One-Liner */}
              <div className="pt-2 border-t border-white/[0.06] text-center">
                <p className="text-[10px] text-zinc-400 flex items-center justify-center gap-1 flex-wrap">
                  <span>Problem in signing in your ID? Contact:</span>
                  <a
                    href="tel:+918828069553"
                    className="text-cyan-400 hover:text-cyan-300 font-medium underline underline-offset-2 flex items-center gap-1"
                  >
                    <PhoneCall size={10} />
                    <span>Mayur Shewle +91 88280 69553</span>
                  </a>
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
