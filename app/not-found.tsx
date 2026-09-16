import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 px-5 text-center">
      <Logo />
      <h2 className="font-display text-2xl font-semibold text-ink-100">Film Not Found</h2>
      <p className="text-sm text-ink-500">We couldn&apos;t locate this title.</p>
      <Link
        href="/"
        className="rounded-pill border border-base-700 bg-base-900 px-4 py-2 text-sm text-ink-300 hover:border-base-600 hover:text-ink-100 transition-colors"
      >
        Back to search
      </Link>
    </main>
  );
}
