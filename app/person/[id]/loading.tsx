import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/Logo";

export default function PersonLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-base-950 text-ink-100">
      <header className="sticky top-0 z-30 flex items-center justify-between px-5 py-4 border-b border-base-800 bg-base-950/85 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-base-900 border border-base-700 text-ink-300"
            aria-label="Back to home"
          >
            <ArrowLeft size={16} />
          </Link>
          <Logo />
        </div>
      </header>

      <main className="flex-1 px-5 py-6 max-w-4xl mx-auto w-full flex flex-col gap-7 animate-pulse">
        {/* Person Profile Header Skeleton */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pt-2">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-base-850 border border-base-700 shrink-0" />
          <div className="flex flex-col items-center sm:items-start gap-2.5 flex-1">
            <div className="h-7 w-48 bg-base-850 rounded-md" />
            <div className="h-4 w-32 bg-base-850 rounded-md" />
            <div className="h-12 w-full max-w-xl bg-base-850 rounded-md mt-1" />
          </div>
        </div>

        {/* Latest Movie Hero Skeleton (same aspect-video size) */}
        <div className="flex flex-col gap-2">
          <div className="h-4 w-28 bg-base-850 rounded-md" />
          <div className="w-full aspect-video rounded-card bg-base-850 border border-base-700" />
        </div>

        {/* Catalog Tiles Skeleton */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-base-800 pb-3">
            <div className="h-6 w-36 bg-base-850 rounded-md" />
            <div className="h-7 w-52 bg-base-850 rounded-full" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col gap-2 rounded-card bg-base-900 border border-base-800 p-2.5"
              >
                <div className="w-full aspect-[2/3] rounded-lg bg-base-850" />
                <div className="h-3 w-3/4 bg-base-850 rounded mt-1" />
                <div className="h-2.5 w-1/2 bg-base-850 rounded" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
