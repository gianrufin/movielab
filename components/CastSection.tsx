import Link from "next/link";
import { CastMember } from "@/lib/types";
import { Users, User } from "lucide-react";

interface CastSectionProps {
  cast?: CastMember[] | null;
}

export function CastSection({ cast }: CastSectionProps) {
  if (!cast || cast.length === 0) return null;

  return (
    <section id="cast-section" className="flex flex-col gap-3.5">
      <div className="flex items-center gap-2">
        <Users size={17} className="text-accent shrink-0" />
        <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-400">
          Top Cast
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {cast.slice(0, 12).map((member) => (
          <Link
            key={`${member.id}-${member.character}`}
            href={`/person/${member.id}`}
            className="group flex flex-col items-center text-center p-3 rounded-card bg-base-900 border border-base-700/70 hover:border-accent/60 hover:bg-base-850 transition-all hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full overflow-hidden bg-base-800 border border-base-700 mb-2.5 shrink-0 flex items-center justify-center group-hover:border-accent/80 transition-colors">
              {member.profileUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={member.profileUrl}
                  alt={member.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-108"
                />
              ) : (
                <User size={26} className="text-ink-600" />
              )}
            </div>
            <p
              className="text-xs font-medium text-ink-100 group-hover:text-accent transition-colors line-clamp-1 w-full"
              title={member.name}
            >
              {member.name}
            </p>
            {member.character && (
              <p
                className="text-[11px] text-ink-500 line-clamp-1 w-full mt-0.5"
                title={member.character}
              >
                {member.character}
              </p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
