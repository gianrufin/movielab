import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

// Space Grotesk ships on Google Fonts, so next/font handles it natively.
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MovieLab",
  description: "Search a film. See what IMDb, Rotten Tomatoes, and Letterboxd actually think.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <head>
        {/*
          Clash Display is distributed by Fontshare, not Google Fonts, so it
          can't go through next/font/google. Self-host it instead for
          production (download the woff2 from fontshare.com/fonts/clash-display
          into /public/fonts and swap this <link> for an @font-face block in
          globals.css) — the CDN link below is fine for prototyping only.
        */}
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@600,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
