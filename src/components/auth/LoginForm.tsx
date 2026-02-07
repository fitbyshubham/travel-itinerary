// app/login/page.tsx
"use client";

import { useState } from "react";

export default function LoginPage() {
  const [remember, setRemember] = useState(false);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md">
        <h1 className="text-heading text-text-dark mb-8">
          Sign in to Google Travel
        </h1>

        <form className="space-y-6">
          {/* Email Field */}
          <div className="relative">
            <input
              type="email"
              id="email"
              className="input-field"
              placeholder=" "
              required
            />
            <label htmlFor="email" className="input-label">
              Email
            </label>
          </div>

          {/* Password Field */}
          <div className="relative">
            <input
              type="password"
              id="password"
              className="input-field"
              placeholder=" "
              required
            />
            <label htmlFor="password" className="input-label">
              Password
            </label>
          </div>

          {/* Remember & Forgot Row */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <label htmlFor="remember" className="sr-only">
                Remember me
              </label>
              <ToggleSwitch
                id="remember"
                checked={remember}
                onChange={setRemember}
              />
              <span className="text-text-gray text-body">Remember me</span>
            </div>

            <a
              href="#"
              className="text-primary hover:underline hover:text-primary/80 transition-colors"
              aria-label="Forgot password"
            >
              Forgot password?
            </a>
          </div>

          {/* Error Message Placeholder */}
          <div
            id="error"
            className="hidden text-error text-body mt-1"
            role="alert"
          >
            Invalid email or password
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-primary text-white rounded-lg font-bold text-body transform transition-transform duration-200 active:scale-[0.98] active:opacity-90"
            aria-label="Sign in"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

// Custom Toggle Switch Component
function ToggleSwitch({
  id,
  checked,
  onChange,
}: {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={id}
        className="sr-only"
        checked={checked}
        onChange={() => onChange(!checked)}
        aria-labelledby={`${id}-label`}
      />
      <label
        htmlFor={id}
        className={`relative flex items-center cursor-pointer w-16 h-9 rounded-full p-1 transition-colors ${
          checked ? "bg-primary" : "bg-text-gray/20"
        }`}
        aria-live="polite"
      >
        <span
          className={`bg-white w-7 h-7 rounded-full transform transition-transform ${
            checked ? "translate-x-7" : ""
          }`}
          aria-hidden="true"
        />
        <span className="sr-only" id={`${id}-label`}>
          {checked ? "Remember me enabled" : "Remember me disabled"}
        </span>
      </label>
    </div>
  );
}
