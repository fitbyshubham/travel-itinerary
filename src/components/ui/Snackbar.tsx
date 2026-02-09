// src/components/ui/Snackbar.tsx
"use client";

import { useEffect, useState } from "react";

let globalShowSnackbar: ((message: string) => void) | null = null;

export const Snackbar = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    globalShowSnackbar = (msg: string) => {
      setMessage(msg);
      setOpen(true);
      setTimeout(() => setOpen(false), 3000);
    };
  }, []);

  if (!open) return null;

  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-neon-purple to-neon-blue text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in border border-white/20">
      {message}
    </div>
  );
};

// Call this to show error
export const showSnackbar = (message: string) => {
  if (globalShowSnackbar) globalShowSnackbar(message);
};

// Add fade animation
const styles = `
  @keyframes fade-in {
    0% { opacity: 0; transform: translate(-50%, 10px); }
    100% { opacity: 1; transform: translate(-50%, 0); }
  }
  .animate-fade-in {
    animation: fade-in 0.3s ease-out;
  }
`;
