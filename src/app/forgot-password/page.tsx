"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowLeft, Globe, CheckCircle2, Compass, Plane } from "lucide-react";
import NoiseBackground from "../../components/layout/NoiseBackground";
import { showSnackbar } from "../../components/ui/Snackbar";

type FormState = "idle" | "loading" | "success" | "error";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage("Please enter your passport email.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    // Simulate API call
    setTimeout(() => {
      if (email.includes("error")) {
        setStatus("error");
        setErrorMessage("This passport is not in our registry.");
        showSnackbar("This passport is not in our registry.");
      } else {
        setStatus("success");
      }
    }, 2000);
  };

  const resetForm = () => {
    setStatus("idle");
    setEmail("");
    setErrorMessage("");
  };

  // Cast motion components
  const MotionDiv = motion.div as any;
  const MotionButton = motion.button as any;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#000411] text-white">
      <NoiseBackground />

      {/* Subtle travel patterns overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <svg width="100%" height="100%" viewBox="0 0 800 800">
           <path d="M50 50 Q 200 150 400 50 T 750 150" stroke="white" fill="transparent" strokeDasharray="5,10" />
           <circle cx="50" cy="50" r="2" fill="white" />
           <circle cx="750" cy="150" r="2" fill="white" />
        </svg>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-6 py-12">
        <MotionDiv
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-[440px] p-10 rounded-[2.5rem] backdrop-blur-3xl bg-white/[0.01] border border-white/5 shadow-[0_24px_80px_rgba(0,0,0,0.6)] relative overflow-hidden"
        >
          {/* Glassmorphism accents */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-neon-blue/10 rounded-full blur-[60px]" />

          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Check Your Mail</h2>
                <p className="text-sm text-white/40 leading-relaxed mb-10">
                  A rescue link has been sent to <span className="text-white font-bold">{email}</span>. Follow it to find your way back.
                </p>

                <div className="space-y-4">
                  <MotionButton
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => router.push("/login")}
                    className="w-full h-14 rounded-2xl bg-white text-black text-sm font-bold shadow-xl"
                  >
                    RETURN TO BASE
                  </MotionButton>
                  <button
                    onClick={resetForm}
                    className="text-xs font-bold text-white/30 hover:text-white transition-colors"
                  >
                    TRY ANOTHER PASSPORT
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="text-center mb-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10 mb-6 shadow-xl relative">
                    <Compass className="w-8 h-8 text-white/80" />
                  </div>
                  <h1 className="text-2xl font-bold text-white tracking-tight mb-3">
                    Find Your Way Back
                  </h1>
                  <p className="text-sm font-medium text-white/40 max-w-[280px] mx-auto leading-relaxed">
                    Lost your map key? Enter your passport email to receive a rescue message.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[11px] font-bold text-white/50 uppercase tracking-widest ml-1">
                      <Globe className="w-3 h-3" />
                      <span>Passport (Email)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="where_to@reach.com"
                        className={`w-full h-14 rounded-2xl px-5 text-sm text-white bg-white/[0.03] border ${
                          errorMessage ? "border-red-500/50" : "border-white/10"
                        } focus:outline-none focus:border-white/30 focus:bg-white/[0.07] transition-all placeholder:text-white/10`}
                        required
                      />
                    </div>
                    {errorMessage && (
                      <p className="text-[10px] font-medium text-red-500/80 pl-2">{errorMessage}</p>
                    )}
                  </div>

                  <MotionButton
                    whileHover={{ scale: 1.01, y: -2 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={status === "loading"}
                    className="group w-full h-14 rounded-2xl bg-white text-black text-sm font-bold tracking-wide transition-all shadow-xl flex items-center justify-center gap-3 relative overflow-hidden"
                  >
                    {status === "loading" ? (
                      <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    ) : (
                      <>
                        <Mail className="w-4 h-4" />
                        <span>SEND RESCUE MESSAGE</span>
                      </>
                    )}
                  </MotionButton>
                </form>

                <div className="mt-8 text-center flex justify-center">
                  <button
                    onClick={() => router.push("/login")}
                    className="group flex items-center gap-2 text-xs font-bold text-white/30 hover:text-white transition-all"
                  >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span>BACK TO BASE</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </MotionDiv>
      </div>
    </div>
  );
}

