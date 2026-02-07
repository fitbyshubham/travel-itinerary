import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import HydrateStore from "@/components/HydrateStore";
import { Snackbar } from "@/components/ui/Snackbar";
import App from "../App";
import { MobileOnlyOverlay } from "@/components/layout/MobileOnlyOverlay";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Narfe",
  description: "Plan, discover, and book unforgettable trips",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Hydrate store on client */}
        <HydrateStore />

        <MobileOnlyOverlay />
        <App>{children}</App>

        <Snackbar />
      </body>
    </html>
  );
}
