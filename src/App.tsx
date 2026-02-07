"use client";
import React, { useState, useEffect } from "react";
import NoiseBackground from "./components/layout/NoiseBackground";
import HUD from "./components/layout/HUD";
import LoginPage from "./app/login/page";
import SignupPage from "./app/signup/page";
import ForgotPassword from "./app/forgot-password/page";
import HomePage from "./app/(authenticated)/page";
import CreateSelectionPage from "./app/(authenticated)/create/page";
import CreateItineraryPage from "./app/(authenticated)/create/itinerary/page";
import CreatePackagePage from "./app/(authenticated)/create/package/page";
import CreatePostPage from "./app/(authenticated)/create/post/page";
import PostDetailPage from "./app/(authenticated)/post/page";
import ItineraryDetailPage from "./app/(authenticated)/itinerary/page";
import AuthenticatedLayout from "./app/(authenticated)/layout";
import SearchPage from "./app/(authenticated)/search/page";
import ProfilePage from "./app/(authenticated)/profile/page";
import ExplorePage from "./app/(authenticated)/explore/page";
import PaymentSuccessPage from "./app/(authenticated)/payment/success/page";
import { useAuthStore } from "./lib/store";
import { authApi } from "./lib/api";
import { User } from "./types/auth";

// Simple Router to handle navigation without full Next.js server
function Router() {
  // Initialize with a default path to prevent SSR "window not defined" error
  const [path, setPath] = useState("/");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Component is mounted on client, safe to use window
    setIsMounted(true);
    setPath(window.location.pathname);

    const handlePopState = () => setPath(window.location.pathname);

    // Intercept pushState to trigger re-renders
    const originalPushState = window.history.pushState;
    window.history.pushState = function (...args) {
      originalPushState.apply(this, args);
      setPath(window.location.pathname);
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.history.pushState = originalPushState;
    };
  }, []);

  // Prevent hydration mismatch by not rendering the router until mounted on client
  if (!isMounted) return null;

  // Helper to wrap routes with the AuthenticatedLayout
  const wrapAuth = (component: React.ReactNode) => (
    <AuthenticatedLayout>{component}</AuthenticatedLayout>
  );

  // Unauthenticated Routes
  if (path === "/login") return <LoginPage />;
  if (path === "/signup") return <SignupPage />;
  if (path === "/forgot-password") return <ForgotPassword />;
  if (path === "/payment/success") return <PaymentSuccessPage />;

  // Authenticated Routes
  if (path === "/create") return wrapAuth(<CreateSelectionPage />);
  if (path === "/create/itinerary") return wrapAuth(<CreateItineraryPage />);
  if (path === "/create/package") return wrapAuth(<CreatePackagePage />);
  if (path === "/create/post") return wrapAuth(<CreatePostPage />);
  if (path === "/search") return wrapAuth(<SearchPage />);
  if (path === "/profile") return wrapAuth(<ProfilePage />);
  if (path === "/explore") return wrapAuth(<ExplorePage />);

  // Dynamic Routes
  if (path.startsWith("/post/")) {
    const id = path.split("/")[2];
    if (id) return wrapAuth(<PostDetailPage id={id} />);
  }

  if (path.startsWith("/itinerary/")) {
    const id = path.split("/")[2];
    if (id) return wrapAuth(<ItineraryDetailPage id={id} />);
  }

  // Default to Home (also wrapped)
  return wrapAuth(<HomePage />);
}

function App({ children }: { children?: React.ReactNode }) {
  // Hydrate user profile on app load if token exists but user data is missing
  useEffect(() => {
    const hydrate = async () => {
      const token = localStorage.getItem("auth_token");
      const store = useAuthStore.getState();

      if (token && !store.user) {
        try {
          const profile = await authApi.getProfile();

          // Handle Avatar Placeholder
          if (!profile.avatar_url) {
            profile.avatar_url = "/avatars/default.jpg";
          }

          // Convert UserProfile to User type
          const user: User = {
            id: profile.id,
            email: "", // Profile endpoint doesn't return email
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

          // Update store
          store.login(token, user);
        } catch (e) {
          console.error("Failed to hydrate profile", e);
        }
      }
    };
    hydrate();
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-space-void text-white selection:bg-neon-lime/30 selection:text-neon-lime">
      <NoiseBackground />
      <HUD />
      <main className="relative z-10 w-full max-w-full">
        {children || <Router />}
      </main>
    </div>
  );
}

export default App;
