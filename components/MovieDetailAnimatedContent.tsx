"use client";

import { motion, type Variants } from "framer-motion";
import { Clock } from "lucide-react";
import { MovieDetail } from "@/lib/types";
import { HeroPoster } from "./HeroPoster";
import { RatingGrid } from "./RatingGrid";
import { ConsensusCard } from "./ConsensusCard";
import { CastSection } from "./CastSection";
import { WatchProvidersCard } from "./WatchProvidersCard";

interface MovieDetailAnimatedContentProps {
  movie: MovieDetail;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
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

export function MovieDetailAnimatedContent({ movie }: MovieDetailAnimatedContentProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="px-5 flex flex-col gap-6 max-w-2xl mx-auto"
    >
      {/* 1. Hero Poster & Media Header */}
      <motion.div variants={itemVariants} className="flex flex-col gap-4">
        <HeroPoster
          title={movie.title}
          backdropUrl={movie.backdropUrl}
          posterUrl={movie.posterUrl}
          trailerYouTubeId={movie.trailerYouTubeId}
        />

        <div className="flex flex-col gap-2">
          <div className="flex items-baseline gap-2.5 flex-wrap">
            <h1 className="font-display text-2xl font-semibold text-ink-100">{movie.title}</h1>
            <div className="inline-flex items-center gap-2 text-sm font-medium text-ink-400">
              <span>{movie.year}</span>
              {movie.runtime && (
                <>
                  <span className="text-base-600">•</span>
                  <span className="inline-flex items-center gap-1 text-ink-300">
                    <Clock size={13} className="text-ink-500 shrink-0" />
                    <span>{movie.runtime}</span>
                  </span>
                </>
              )}
            </div>
          </div>

          {movie.genres && movie.genres.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              {movie.genres.map((genre) => (
                <span
                  key={genre}
                  className="rounded-pill bg-base-800 border border-base-700/60 px-2.5 py-0.5 text-xs text-ink-300 font-medium"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* 2. Rating Grid (Ratings section) */}
      <motion.div variants={itemVariants}>
        <RatingGrid ratings={movie.ratings} />
      </motion.div>

      {/* 3. Movie Overview */}
      {movie.overview && (
        <motion.p variants={itemVariants} className="text-sm leading-relaxed text-ink-300">
          {movie.overview}
        </motion.p>
      )}

      {/* 4. Consensus Card (Audience & Critic Consensus) */}
      <motion.div variants={itemVariants}>
        <ConsensusCard consensus={movie.consensus} />
      </motion.div>

      {/* 5. Cast Section (Top Cast) */}
      {movie.cast && movie.cast.length > 0 && (
        <motion.div variants={itemVariants}>
          <CastSection cast={movie.cast} />
        </motion.div>
      )}

      {/* 6. Where to Watch (Streaming & Purchase) */}
      <motion.div variants={itemVariants}>
        <WatchProvidersCard providers={movie.watchProviders} title={movie.title} />
      </motion.div>
    </motion.div>
  );
}
