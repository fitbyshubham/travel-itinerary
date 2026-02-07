"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "../../lib/api";
import { useAuthStore } from "../../lib/store";
import { User as BackendUser } from "../../types/auth";
import { showSnackbar } from "../../components/ui/Snackbar";
import {
  ChevronRight,
  Plane
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SignupPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    gender: "male" as "male" | "female" | "other",
    country: "EU",
    preferred_currency: "EUR",
    is_creator: false,
    bio: "",
  });

  const [errors, setErrors] = useState<Partial<typeof formData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const MotionDiv = motion.div;
  const MotionButton = motion.button;

  const updateField = (name: string, value: string | boolean) => {
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((p) => ({ ...p, [name]: undefined }));
    }
  };

  const validateStep1 = () => {
    const e: Partial<typeof formData> = {};
    if (!formData.email) e.email = "Your passport needs an email.";
    if (!formData.password || formData.password.length < 8)
      e.password = "Your secret key must be at least 8 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const handleBack = () => setStep(1);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await authApi.signup(formData);

      if (res.session?.access_token) {
        const accessToken = res.session.access_token;
        if (typeof window !== "undefined") {
          localStorage.setItem("auth_token", accessToken);
        }

        const profile = await authApi.getProfile();
        if (!profile.avatar_url) profile.avatar_url = "/avatars/default.jpg";

        const user: BackendUser = {
          id: profile.id,
          email: formData.email,
          name: profile.name,
          avatar_url: profile.avatar_url,
          gender: profile.gender,
          country: profile.country,
          preferred_currency: profile.preferred_currency,
          is_creator: profile.is_creator,
          bio: profile.bio || "",
          user_metadata: {
            name: profile.name,
            avatar_url: profile.avatar_url,
            gender: profile.gender,
            country: profile.country,
            preferred_currency: profile.preferred_currency,
            is_creator: profile.is_creator,
            bio: profile.bio || "",
          },
          created_at: profile.created_at,
          updated_at: profile.updated_at,
        };

        useAuthStore.getState().login(accessToken, user);
        router.push("/");
      } else {
        showSnackbar("Welcome aboard! Please check your email to verify your path.");
        router.push("/login");
      }
    } catch (err: any) {
      let message = "The path is blocked. Try another route.";
      try {
        const errorObj = JSON.parse(err.message);
        message = errorObj.message || message;
      } catch {
        if (err.message && !err.message.startsWith("{")) message = err.message;
      }
      showSnackbar(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0A0E1A] text-white flex flex-col items-center">
      {/* Background Gradient & Glows */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1E3A8A] via-[#0A0E1A] to-[#0A0E1A]" />
      <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.15)_0%,transparent_50%)]" />

      <div className="relative z-10 w-full max-w-[400px] px-6 py-12 flex flex-col items-center min-h-screen">
        {/* Logo Section */}
        <div className="flex items-center gap-2 mb-12">
          <div className="relative w-10 h-10 flex items-center justify-center">
             <div className="absolute inset-0 bg-white/20 blur-md rounded-lg" />
             <div className="relative w-full h-full bg-white rounded-xl rotate-12 flex items-center justify-center">
                <Plane className="w-6 h-6 text-[#1E3A8A] -rotate-12" />
             </div>
          </div>
          <span className="text-3xl font-bold tracking-tight">Narfe</span>
        </div>

        {/* Header */}
        <div className="text-center mb-10 w-full">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {step === 1 ? "Start Journey" : "Your Passport"}
          </h1>
          <p className="text-white/40 text-sm leading-relaxed max-w-[280px] mx-auto">
            {step === 1
              ? "Join the global fellowship of travelers."
              : "Finalize your journey across the globe."}
          </p>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mt-6">
            <div className={`h-1 w-6 rounded-full transition-all duration-300 ${step === 1 ? "bg-white" : "bg-white/10"}`} />
            <div className={`h-1 w-6 rounded-full transition-all duration-300 ${step === 2 ? "bg-white" : "bg-white/10"}`} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <MotionDiv
              key="step1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="w-full space-y-4"
            >
              <InputField
                placeholder="Passport (Email address)"
                type="email"
                value={formData.email}
                onChange={(v: string) => updateField("email", v)}
                error={errors.email}
              />
              <InputField
                placeholder="Secret Route (Password)"
                type="password"
                value={formData.password}
                onChange={(v: string) => updateField("password", v)}
                error={errors.password}
              />

              <MotionButton
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleNext}
                className="w-full h-14 bg-gradient-to-r from-[#6366F1] to-[#06B6D4] rounded-full text-black font-bold text-sm shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 mt-4"
              >
                <span>Continue Expedition</span>
                <ChevronRight className="w-4 h-4" />
              </MotionButton>
            </MotionDiv>
          ) : (
            <MotionDiv
              key="step2"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="w-full space-y-4"
            >
              <InputField
                placeholder="Traveler Name"
                value={formData.name}
                onChange={(v: string) => updateField("name", v)}
              />

              <div className="relative">
                <select
                  value={formData.gender}
                  onChange={(e) => updateField("gender", e.target.value)}
                  className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl px-5 text-sm focus:outline-none focus:border-white/20 focus:bg-white/[0.08] transition-all text-white/80 appearance-none cursor-pointer"
                >
                  <option value="male">Male Traveler</option>
                  <option value="female">Female Traveler</option>
                  <option value="other">Non-Binary / Private</option>
                </select>
                <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-white/20 text-[10px]">▼</div>
              </div>

              <div className="p-5 bg-white/5 border border-white/5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[13px] font-bold text-white/80">Become a Guide</span>
                    <span className="text-[11px] text-white/30">Share paths with the fellowship</span>
                  </div>
                  <Switch
                    checked={formData.is_creator}
                    onChange={(v: boolean) => updateField("is_creator", v)}
                  />
                </div>
                {formData.is_creator && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => updateField("bio", e.target.value)}
                      className="w-full min-h-[90px] rounded-xl p-4 text-sm text-white bg-black/20 border border-white/10 focus:outline-none focus:border-white/30 resize-none transition-all placeholder:text-white/10 mt-2"
                      placeholder="Tell your traveler's tale..."
                    />
                  </motion.div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleBack}
                  className="flex-1 h-14 bg-white/5 hover:bg-white/10 rounded-full text-white/60 font-bold text-sm transition-colors border border-white/5"
                >
                  Back
                </button>
                <MotionButton
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex-[2] h-14 bg-gradient-to-r from-[#6366F1] to-[#06B6D4] rounded-full text-black font-bold text-sm shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    "Arrive & Join"
                  )}
                </MotionButton>
              </div>
            </MotionDiv>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-white/40">
            Fellow traveler?{" "}
            <button
              onClick={() => router.push("/login")}
              className="text-white font-bold hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

interface InputFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

function InputField({ value, onChange, error, ...rest }: InputFieldProps) {
  return (
    <div className="w-full space-y-1">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...rest}
        className={`w-full h-14 bg-white/5 border ${error ? 'border-red-500/50' : 'border-white/5'} rounded-2xl px-5 text-sm focus:outline-none focus:border-white/20 focus:bg-white/[0.08] transition-all placeholder:text-white/30`}
      />
      {error && <p className="text-[10px] text-red-500/80 pl-2">{error}</p>}
    </div>
  );
}

interface SwitchProps {
  checked: boolean;
  onChange: (value: boolean) => void;
}

function Switch({ checked, onChange }: SwitchProps) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? "bg-[#06B6D4]" : "bg-white/10"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}


