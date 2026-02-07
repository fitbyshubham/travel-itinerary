"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "../../lib/api";
import { useAuthStore } from "../../lib/store";
import { User } from "../../types/auth";
import { showSnackbar } from "../../components/ui/Snackbar";
import { Plane } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const MotionButton = motion.button;

  const { token, user } = useAuthStore();

  useEffect(() => {
    if (token && user) {
      router.push("/");
    }
  }, [token, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await authApi.login({ email, password });
      const accessToken = res.session.access_token;

      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", accessToken);
      }

      const profile = await authApi.getProfile();

      if (!profile.avatar_url) {
        profile.avatar_url = "/avatars/default.jpg";
      }

      const user: User = {
        id: profile.id,
        email: email,
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
    } catch (err: unknown) {
      let message = "The path is blocked. Check your credentials.";
      if (err instanceof Error) {
        try {
          const errorObj = JSON.parse(err.message);
          message = errorObj.message || message;
        } catch {
          if (err.message && !err.message.startsWith("{")) {
            message = err.message;
          }
        }
      }
      showSnackbar(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0A0E1A] text-white flex flex-col items-center">
      {/* Background Gradient & Glows */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1E3A8A] via-[#0A0E1A] to-[#0A0E1A]" />
      <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.15)_0%,transparent_50%)]" />

      <div className="relative z-10 w-full max-w-[400px] px-6 py-16 flex flex-col items-center min-h-screen">
        {/* Logo Section */}
        <div className="flex items-center gap-2 mb-20 animate-fade-in">
          <div className="relative w-10 h-10 flex items-center justify-center">
             <div className="absolute inset-0 bg-white/20 blur-md rounded-lg" />
             <div className="relative w-full h-full bg-white rounded-xl rotate-12 flex items-center justify-center">
                <Plane className="w-6 h-6 text-[#1E3A8A] -rotate-12" />
             </div>
          </div>
          <span className="text-3xl font-bold tracking-tight">Narfe</span>
        </div>

        {/* Welcome Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-3">Hi There!</h1>
          <p className="text-white/60 text-sm">Please enter required details.</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Passport (Email address)"
              className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl px-5 text-sm focus:outline-none focus:border-white/20 focus:bg-white/[0.08] transition-all placeholder:text-white/30"
              required
            />
          </div>
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Secret Route (Password)"
              className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl px-5 text-sm focus:outline-none focus:border-white/20 focus:bg-white/[0.08] transition-all placeholder:text-white/30"
              required
            />
          </div>

          <div className="w-full text-right">
            <button
              type="button"
              onClick={() => router.push("/forgot-password")}
              className="text-xs font-semibold text-white/60 hover:text-white transition-colors"
            >
              Forgot Password?
            </button>
          </div>

          <MotionButton
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-gradient-to-r from-[#6366F1] to-[#06B6D4] rounded-full text-black font-bold text-sm shadow-lg shadow-blue-500/20 disabled:opacity-50 mt-6"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin mx-auto" />
            ) : (
              "Log In"
            )}
          </MotionButton>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-white/40">
            Create an account?{" "}
            <button
              onClick={() => router.push("/signup")}
              className="text-white font-bold hover:underline"
            >
              Sign Up
            </button>
          </p>
        </div>

        {/* Bottom Policy Links */}
        <div className="mt-auto pt-8 flex gap-4 text-[10px] text-white/30 font-medium">
          <button className="hover:text-white transition-colors leading-none border-b border-white/10 pb-0.5">Terms of Service</button>
          <span className="leading-none text-white/10">|</span>
          <button className="hover:text-white transition-colors leading-none border-b border-white/10 pb-0.5">Privacy Policy</button>
        </div>
      </div>

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}


