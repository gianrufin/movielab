import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/Logo";
import { PWAInstallButton } from "@/components/PWAInstallButton";
import { PersonCatalog } from "@/components/PersonCatalog";
import { getPersonDetail } from "@/lib/person";

interface PersonPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PersonPageProps): Promise<Metadata> {
  const personId = parseInt(params.id, 10);
  if (Number.isNaN(personId)) return { title: "Person Not Found | MovieLab" };

  const person = await getPersonDetail(personId);
  if (!person) return { title: "Person Not Found | MovieLab" };

  return {
    title: `${person.name} — Film Catalog | MovieLab`,
    description: `Explore the complete movie catalog of ${person.name} (${person.knownForDepartment}) in chronological order on MovieLab.`,
    openGraph: {
      title: `${person.name} — Film Catalog`,
      description: `Complete filmography and latest releases for ${person.name}.`,
      images: person.profileUrl ? [{ url: person.profileUrl }] : undefined,
    },
  };
}

export default async function PersonPage({ params }: PersonPageProps) {
  const personId = parseInt(params.id, 10);
  if (Number.isNaN(personId)) {
    notFound();
  }

  const person = await getPersonDetail(personId);
  if (!person) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-base-950 text-ink-100">
      {/* Navigation Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-5 py-4 border-b border-base-800 bg-base-950/85 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-base-900 border border-base-700 text-ink-300 hover:text-ink-100 hover:border-base-600 transition-colors"
            aria-label="Back to home"
          >
            <ArrowLeft size={16} />
          </Link>
          <Logo />
        </div>

        <div className="flex items-center gap-2">
          <PWAInstallButton />
        </div>
      </header>

      {/* Main Person Film Catalog Content */}
      <main className="flex-1 py-6">
        <PersonCatalog person={person} />
      </main>
    </div>
  );
}
