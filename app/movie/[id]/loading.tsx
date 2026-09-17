import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/Logo";

export default function MovieDetailLoading() {
  return (
    <main className="min-h-screen pb-16">
      <header className="flex items-center justify-between px-5 py-5">
        <Link href="/" aria-label="Back to search">
          <ArrowLeft size={20} className="text-ink-500 hover:text-ink-200 transition-colors" strokeWidth={1.75} />
        </Link>
        <Logo />
        <span className="w-5" />
      </header>

      <div className="px-5 flex flex-col gap-6 max-w-2xl mx-auto animate-pulse">
        {/* Hero Poster skeleton */}
        <div className="relative aspect-[16/9] w-full rounded-card overflow-hidden bg-base-800/80 border border-base-700/60 flex items-center justify-center">
          <div className="h-10 w-10 rounded-full bg-base-700/60" />
        </div>

        {/* Title & metadata skeleton */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="h-7 w-56 rounded-md bg-base-800" />
            <div className="h-5 w-20 rounded-md bg-base-800/70" />
          </div>
          <div className="flex items-center gap-2 pt-0.5">
            <div className="h-5 w-16 rounded-full bg-base-800/80" />
            <div className="h-5 w-24 rounded-full bg-base-800/80" />
            <div className="h-5 w-20 rounded-full bg-base-800/80" />
          </div>
        </div>

        {/* Rating Grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex flex-col gap-3 p-4 rounded-card bg-base-900 border border-base-700/70"
            >
              <div className="flex items-center justify-between">
                <div className="h-4 w-16 rounded bg-base-800" />
                <div className="h-3 w-10 rounded bg-base-800/60" />
              </div>
              <div className="h-8 w-20 rounded bg-base-800" />
              <div className="h-3 w-14 rounded bg-base-800/50" />
            </div>
          ))}
        </div>

        {/* Overview skeleton */}
        <div className="flex flex-col gap-2">
          <div className="h-4 w-full rounded bg-base-800/80" />
          <div className="h-4 w-11/12 rounded bg-base-800/80" />
          <div className="h-4 w-4/5 rounded bg-base-800/70" />
        </div>

        {/* Consensus Card skeleton */}
        <div className="flex flex-col gap-3.5 p-5 rounded-card bg-base-900 border border-base-700/80">
          <div className="flex items-center justify-between">
            <div className="h-4 w-32 rounded bg-base-800" />
            <div className="h-3 w-16 rounded bg-base-800/60" />
          </div>
          <div className="h-4 w-5/6 rounded bg-base-800/90" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="h-24 rounded-lg bg-base-800/60" />
            <div className="h-24 rounded-lg bg-base-800/60" />
          </div>
        </div>

        {/* Cast skeleton */}
        <div className="flex flex-col gap-3">
          <div className="h-4 w-24 rounded bg-base-800" />
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2 p-3 rounded-card bg-base-900 border border-base-800">
                <div className="w-14 h-14 rounded-full bg-base-800" />
                <div className="h-3 w-14 rounded bg-base-800" />
                <div className="h-2.5 w-10 rounded bg-base-800/60" />
              </div>
            ))}
          </div>
        </div>

        {/* Watch providers skeleton */}
        <div className="h-24 rounded-card bg-base-900 border border-base-700/60" />
      </div>
    </main>
  );
}
