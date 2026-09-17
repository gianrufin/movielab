import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

// Space Grotesk ships on Google Fonts, so next/font handles it natively.
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0e1117",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "MovieLab",
  description: "Search a film. See what IMDb, Rotten Tomatoes, and Letterboxd actually think.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MovieLab",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
};

import { PWARegistration } from "@/components/PWARegistration";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <body>
        <PWARegistration />
        {children}
      </body>
    </html>
  );
}
