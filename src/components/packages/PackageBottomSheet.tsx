"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  X,
  Globe,
  Lock,
  Calendar,
  Box,
  CheckCircle2,
  Loader2,
  Map,
  ChevronRight,
  CreditCard,
} from "lucide-react";
import type { Package } from "@/types/package";
import { packageApi } from "@/lib/api";
import { showSnackbar } from "@/components/ui/Snackbar";

interface PackageBottomSheetProps {
  pkg: Package;
  onClose: () => void;
}

export const PackageBottomSheet: React.FC<PackageBottomSheetProps> = ({
  pkg,
  onClose,
}) => {
  const router = useRouter();
  const coverImage =
    pkg.uploads?.find((u) => u.type === "image")?.signed_url ||
    pkg.cover_image_url;
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "waiting">("idle");

  useEffect(() => {
    let pollInterval: NodeJS.Timeout;

    if (paymentStatus === "waiting") {
      pollInterval = setInterval(async () => {
        try {
          // Poll specifically for this package's status or refresh purchased list
          const response = await packageApi.listPurchased();
          const purchasedList = Array.isArray(response)
            ? response
            : "packages" in response && Array.isArray(response.packages)
              ? response.packages
              : [];

          const isPurchased = purchasedList.some((p) => p.id === pkg.id);

          if (isPurchased) {
            clearInterval(pollInterval);
            // Navigate to success page
            router.push("/payment/success");
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 3000);
    }

    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [paymentStatus, pkg.id]);

  const handleBook = async () => {
    setPaymentStatus("processing");
    try {
      // 1. Open a new window immediately to avoid popup blockers
      const paymentWindow = window.open("", "_blank");
      
      if (!paymentWindow) {
        throw new Error("POPUP_BLOCKED // PLEASE_ALLOW_POPUPS");
      }
      
      paymentWindow.document.write(`
        <html>
          <head><title>Secure Gateway</title></head>
          <body style="background-color: #000411; color: white; display: flex; align-items: center; justify-content: center; height: 100vh; font-family: monospace;">
            <div style="text-align: center;">
              <h3>INITIALIZING SECURE CONNECTION...</h3>
              <p>Please wait while we redirect you to the payment gateway.</p>
            </div>
          </body>
        </html>
      `);

      // 2. Initiate checkout process
      const response = await packageApi.createCheckout(pkg.id);

      if (response && response.checkout_url) {
        // 3. Redirect the new window to Stripe
        paymentWindow.location.href = response.checkout_url;
        
        // 4. Update state to start polling
        setPaymentStatus("waiting");
        showSnackbar("Payment window opened. Please complete the transaction.");
      } else {
        paymentWindow.close();
        throw new Error("SECURE_GATEWAY_UNAVAILABLE");
      }
    } catch (error: any) {
      console.error("Booking failed", error);
      setPaymentStatus("idle");
      showSnackbar(error.message || "Failed to initiate checkout process");
    }
  };

  const navigateToItinerary = (id: string) => {
    router.push(`/itinerary/${id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="w-full max-w-lg bg-[#050A15] border border-white/10 rounded-t-2xl sm:rounded-2xl overflow-hidden max-h-[85vh] flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Handle / Button */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-white/20 rounded-full sm:hidden" />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-colors border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cover Image */}
        <div className="relative h-56 shrink-0 bg-white/5">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={pkg.title}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Box className="w-12 h-12 text-white/10" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050A15] to-transparent opacity-90" />

          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex gap-2 mb-2">
              <div
                className={`px-2 py-0.5 rounded text-[9px] font-tech uppercase tracking-wider border backdrop-blur-md flex items-center gap-1 w-fit ${
                  pkg.visibility === "public"
                    ? "bg-black/60 border-neon-lime/30 text-neon-lime"
                    : "bg-black/60 border-white/10 text-white/50"
                }`}
              >
                {pkg.visibility === "public" ? (
                  <Globe className="w-2.5 h-2.5" />
                ) : (
                  <Lock className="w-2.5 h-2.5" />
                )}
                {pkg.visibility}
              </div>

              {pkg.purchased_at && (
                <div className="px-2 py-0.5 rounded text-[9px] font-tech uppercase tracking-wider border backdrop-blur-md flex items-center gap-1 w-fit bg-neon-blue/10 border-neon-blue/30 text-neon-blue">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  Purchased
                </div>
              )}
            </div>
            <h2 className="text-2xl font-sans font-medium text-white">
              {pkg.title}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto pb-40">
          {/* Price & Meta */}
          <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl">
            <div className="flex flex-col">
              <span className="text-[10px] font-tech text-white/30 uppercase tracking-widest">
                Pricing
              </span>
              <span className="text-xl font-mono text-neon-lime">
                {pkg.price
                  ? `${pkg.price.toLocaleString()} ${pkg.currency || "EUR"}`
                  : "Contact for Price"}
              </span>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-tech text-white/30 uppercase tracking-widest">
                Created
              </span>
              <div className="flex items-center gap-1.5 text-xs text-white/60 font-mono mt-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  {new Date(pkg.created_at || Date.now()).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-white/80">
              Package Details
            </h3>
            <p className="text-sm text-white/60 font-light leading-relaxed whitespace-pre-wrap">
              {pkg.description}
            </p>
          </div>

          {/* Linked Itinerary Info */}
          {pkg.itineraries && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-white/80">
                Includes Itinerary
              </h3>
              <div className="p-4 bg-white/[0.02] border border-white/10 rounded-xl space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center shrink-0">
                    <Map className="w-5 h-5 text-neon-blue" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-white mb-1">
                      {pkg.itineraries.title}
                    </h4>
                    {pkg.itineraries.description && (
                      <p className="text-xs text-white/50 line-clamp-2">
                        {pkg.itineraries.description}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => navigateToItinerary(pkg.itineraries!.id)}
                  className="w-full py-2.5 bg-neon-blue/10 hover:bg-neon-blue/20 border border-neon-blue/30 text-neon-blue rounded-lg text-xs font-tech font-bold flex items-center justify-center gap-2 transition-all"
                >
                  VIEW ITINERARY <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action Footer - Redirect to Stripe */}
        {!pkg.purchased_at && (
          <div className="p-4 border-t border-white/10 bg-[#050A15] shrink-0">
            {paymentStatus === "waiting" ? (
              <div className="flex flex-col gap-2 w-full">
                <div className="w-full py-4 bg-neon-blue/10 border border-neon-blue/30 rounded-xl flex items-center justify-center gap-3 animate-pulse">
                   <Loader2 className="w-4 h-4 text-neon-blue animate-spin" />
                   <span className="font-tech text-xs text-neon-blue tracking-widest">
                     WAITING_FOR_PAYMENT...
                   </span>
                </div>
                <button 
                  onClick={() => window.location.reload()} // Simple reload to force state update if polling fails
                  className="w-full py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-tech text-white/50 hover:text-white hover:bg-white/10 transition-colors uppercase tracking-widest"
                >
                  I have completed the payment
                </button>
              </div>
            ) : (
                <button
                  onClick={handleBook}
                  disabled={paymentStatus === 'processing'}
                  className="group w-full py-4 bg-white text-black font-bold text-sm rounded-xl hover:bg-neon-lime transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(204,255,0,0.2)]"
                >
                  {paymentStatus === 'processing' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="font-tech text-xs tracking-widest">
                        INITIALIZING...
                      </span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>SECURE CHECKOUT</span>
                    </>
                  )}
                </button>
            )}
           {paymentStatus === "waiting" && (
              <p className="text-center text-[10px] text-white/30 mt-2 font-mono">
                Please complete payment in the new tab
              </p>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
