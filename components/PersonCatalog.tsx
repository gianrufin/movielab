"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  Film,
  Calendar,
  MapPin,
  Clapperboard,
  Sparkles,
  Star,
  User,
} from "lucide-react";
import { PersonDetail, PersonMovieCredit } from "@/lib/types";
import { PersonHero } from "./PersonHero";

interface PersonCatalogProps {
  person: PersonDetail;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

function getRoleBadgeStyle(role: string): { bg: string; text: string; border: string } {
  const r = role.toLowerCase();
  if (r.includes("director")) {
    return { bg: "bg-emerald-950/80", text: "text-emerald-300", border: "border-emerald-500/40" };
  }
  if (r.includes("editor")) {
    return { bg: "bg-teal-950/80", text: "text-teal-300", border: "border-teal-500/40" };
  }
  if (r.includes("music") || r.includes("score") || r.includes("composer")) {
    return { bg: "bg-rose-950/80", text: "text-rose-300", border: "border-rose-500/40" };
  }
  if (r.includes("writer") || r.includes("screenplay") || r.includes("story")) {
    return { bg: "bg-purple-950/80", text: "text-purple-300", border: "border-purple-500/40" };
  }
  if (r.includes("producer")) {
    return { bg: "bg-amber-950/80", text: "text-amber-300", border: "border-amber-500/40" };
  }
  if (r.includes("cast")) {
    return { bg: "bg-sky-950/80", text: "text-sky-300", border: "border-sky-500/40" };
  }
  return { bg: "bg-base-800", text: "text-ink-300", border: "border-base-700" };
}

export function PersonCatalog({ person }: PersonCatalogProps) {
  const [selectedDept, setSelectedDept] = useState<string>("all");
  const [bioExpanded, setBioExpanded] = useState<boolean>(false);

  // Derive all unique departments from this person's movies
  const availableDepts = useMemo(() => {
    const depts = new Map<string, number>();
    for (const movie of person.movies) {
      for (const d of movie.departments) {
        depts.set(d, (depts.get(d) || 0) + 1);
      }
    }
    return Array.from(depts.entries()).map(([dept, count]) => ({ dept, count }));
  }, [person.movies]);

  // Filter movies by selected department, preserving chronological order (latest at top)
  const filteredMovies = useMemo(() => {
    if (selectedDept === "all") return person.movies;
    return person.movies.filter((m) => m.departments.includes(selectedDept));
  }, [person.movies, selectedDept]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="px-5 flex flex-col gap-7 max-w-4xl mx-auto pb-16"
    >
      {/* 1. Person Profile Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pt-2"
      >
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-base-850 border-2 border-base-700 shrink-0 shadow-xl flex items-center justify-center">
          {person.profileUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={person.profileUrl}
              alt={person.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={44} className="text-ink-600" />
          )}
        </div>

        <div className="flex flex-col items-center sm:items-start gap-2 text-center sm:text-left flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink-100">
              {person.name}
            </h1>
            <span className="rounded-pill bg-base-800 border border-base-700 px-2.5 py-0.5 text-xs font-semibold text-accent uppercase tracking-wider">
              {person.knownForDepartment}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-ink-400 flex-wrap justify-center sm:justify-start">
            {person.birthday && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={13} className="text-ink-500" />
                <span>Born {person.birthday.slice(0, 4)}</span>
              </span>
            )}
            {person.placeOfBirth && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={13} className="text-ink-500" />
                <span className="line-clamp-1">{person.placeOfBirth}</span>
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 text-ink-300 font-medium">
              <Clapperboard size={13} className="text-accent" />
              <span>{person.movies.length} Films Cataloged</span>
            </span>
          </div>

          {person.biography && (
            <div className="pt-1 max-w-2xl">
              <p
                className={`text-xs text-ink-300 leading-relaxed ${
                  bioExpanded ? "" : "line-clamp-2 sm:line-clamp-3"
                }`}
              >
                {person.biography}
              </p>
              {person.biography.length > 180 && (
                <button
                  onClick={() => setBioExpanded(!bioExpanded)}
                  className="mt-1 text-[11px] font-medium text-accent hover:underline cursor-pointer"
                >
                  {bioExpanded ? "Show less" : "Read full bio"}
                </button>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* 2. Top Hero: Person's Latest Movie (same size as movie trailer) */}
      {person.latestMovie && (
        <motion.div variants={itemVariants}>
          <PersonHero
            movie={person.latestMovie}
            personName={person.name}
            trailerYouTubeId={person.latestMovieTrailerId}
          />
        </motion.div>
      )}

      {/* 3. Chronological Film Catalog Section */}
      <motion.div variants={itemVariants} className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-base-800 pb-3">
          <div className="flex flex-col gap-0.5">
            <h2 className="font-display text-lg font-bold text-ink-100 flex items-center gap-2">
              <span>Film Catalog</span>
              <span className="text-xs font-mono text-ink-500 font-normal">
                ({filteredMovies.length})
              </span>
            </h2>
            <p className="text-xs text-ink-500">
              Chronological order • Latest at top, oldest at bottom
            </p>
          </div>

          {/* Department / Role Filter Tabs */}
          {availableDepts.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <button
                onClick={() => setSelectedDept("all")}
                className={`px-3 py-1.5 rounded-pill text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedDept === "all"
                    ? "bg-accent text-base-950 font-semibold shadow-sm"
                    : "bg-base-900 border border-base-700 text-ink-400 hover:text-ink-200 hover:border-base-600"
                }`}
              >
                All Works ({person.movies.length})
              </button>
              {availableDepts.map(({ dept, count }) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-3 py-1.5 rounded-pill text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    selectedDept === dept
                      ? "bg-accent text-base-950 font-semibold shadow-sm"
                      : "bg-base-900 border border-base-700 text-ink-400 hover:text-ink-200 hover:border-base-600"
                  }`}
                >
                  {dept} ({count})
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 4. Film Tiles Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {filteredMovies.map((movie) => (
            <Link
              key={movie.id}
              href={`/movie/${movie.id}`}
              className="group flex flex-col gap-2 rounded-card bg-base-900 border border-base-700/80 p-2.5 hover:border-accent/60 hover:bg-base-850 transition-all hover:-translate-y-1 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {/* Poster container with aspect-[2/3] */}
              <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden bg-base-950 border border-base-800 shrink-0">
                {movie.posterUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center text-ink-700">
                    <Film size={28} strokeWidth={1.5} />
                    <span className="text-[10px] text-ink-600 mt-1 line-clamp-2">
                      {movie.title}
                    </span>
                  </div>
                )}

                {/* Release Year Badge overlay */}
                <div className="absolute top-2 left-2 z-10">
                  <span className="rounded-md bg-base-950/85 backdrop-blur-md border border-base-700/70 px-1.5 py-0.5 text-[10px] font-semibold text-ink-200 font-mono shadow">
                    {movie.year}
                  </span>
                </div>

                {/* Vote Average badge overlay if available */}
                {movie.voteAverage != null && movie.voteAverage > 0 && (
                  <div className="absolute top-2 right-2 z-10">
                    <span className="inline-flex items-center gap-0.5 rounded-md bg-base-950/85 backdrop-blur-md border border-amber-500/40 px-1.5 py-0.5 text-[10px] font-bold text-amber-400 shadow">
                      <Star size={9} className="fill-current" />
                      <span>{movie.voteAverage}</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Title & Roles details */}
              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                <h3
                  className="text-xs font-semibold text-ink-100 group-hover:text-accent transition-colors line-clamp-2"
                  title={movie.title}
                >
                  {movie.title}
                </h3>

                {/* Role Badges: clearly indicates which is which (director, editor, music, producer, etc.) */}
                <div className="flex flex-wrap gap-1 mt-auto">
                  {movie.roles.slice(0, 3).map((role) => {
                    const style = getRoleBadgeStyle(role);
                    return (
                      <span
                        key={role}
                        className={`rounded px-1.5 py-0.5 text-[10px] font-medium border ${style.bg} ${style.text} ${style.border} line-clamp-1`}
                        title={role}
                      >
                        {role}
                      </span>
                    );
                  })}
                  {movie.roles.length > 3 && (
                    <span className="text-[10px] text-ink-500 px-1">
                      +{movie.roles.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
