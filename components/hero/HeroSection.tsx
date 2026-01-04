"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { Play, Info, Plus, Check } from "lucide-react";
import { MediaItem } from "@/data/cms";
import { Button } from "../ui/Button";
import { useAppStore } from "@/lib/store";
import Link from "next/link";

interface HeroSectionProps {
  featured: MediaItem;
}

// Utility to get YouTube ID
const getYouTubeId = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export const HeroSection = ({ featured }: HeroSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useAppStore();
  const isListed = isInWatchlist(featured.id);
  const youtubeId = getYouTubeId(featured.videoUrl || "");

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const textVariants: Variants = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    visible: { 
      opacity: 1, y: 0, filter: "blur(0px)",
      transition: { type: "spring", damping: 20, stiffness: 100 }
    },
  };

  const handleListToggle = () => {
    if (isListed) removeFromWatchlist(featured.id);
    else addToWatchlist(featured);
  };

  return (
    <div ref={ref} className="relative h-[95vh] w-full overflow-hidden bg-ebs-dark">
      {/* BACKGROUND LAYER */}
      <motion.div
        style={{ y: backgroundY, opacity: backgroundOpacity }}
        className="absolute inset-0 z-0"
      >
        {/* VIDEO BACKGROUND (Autoplay, Muted, Loop) */}
        {youtubeId ? (
          <div className="absolute inset-0 w-full h-full pointer-events-none scale-125">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtubeId}&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&disablekb=1`}
              className="w-full h-full object-cover"
              allow="autoplay; encrypted-media"
              style={{ pointerEvents: 'none' }} 
            />
          </div>
        ) : (
          /* Fallback Image */
          <img
            src={(featured as any).backdropUrl || featured.thumbnailUrl}
            alt={featured.title}
            className="h-full w-full object-cover object-center"
          />
        )}

        {/* Cinematic Gradients (Make text readable) */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-ebs-dark via-ebs-dark/40 to-transparent" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-ebs-dark via-ebs-dark/10 to-transparent" />
      </motion.div>

      {/* CONTENT LAYER */}
      <div className="relative z-20 flex h-full max-w-7xl mx-auto flex-col justify-end pb-24 px-6 md:px-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl space-y-6"
        >
          <motion.div variants={textVariants} className="flex items-center gap-3">
             <span className="bg-ebs-crimson text-white px-3 py-1 text-xs font-bold tracking-widest uppercase rounded-sm shadow-[0_0_15px_rgba(214,44,44,0.5)]">
               New Premiere
             </span>
             <div className="flex items-center gap-2 text-gray-300 font-medium text-sm tracking-wide">
                <span>{featured.year}</span>
                <span className="text-ebs-crimson">•</span>
                <span>{featured.rating}</span>
             </div>
          </motion.div>

          <motion.h1
            variants={textVariants}
            className="font-heading text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tight drop-shadow-2xl"
          >
            {featured.title}
          </motion.h1>

          <motion.p
            variants={textVariants}
            className="text-lg md:text-xl text-gray-200 line-clamp-3 max-w-2xl leading-relaxed text-shadow-sm"
          >
            {featured.description}
          </motion.p>

          <motion.div variants={textVariants} className="flex flex-wrap gap-4 pt-4">
            {/* Watch Link goes to the page with sound enabled */}
            <Link href={`/watch/${featured.id}`}>
              <Button 
                variant="primary" 
                className="h-14 px-8 text-lg hover:shadow-[0_0_20px_rgba(214,44,44,0.4)] transition-shadow"
              >
                <Play className="mr-2 h-5 w-5 fill-current" />
                Play with Sound
              </Button>
            </Link>

            <Button
              variant="secondary"
              onClick={handleListToggle}
              className="h-14 px-8 text-lg group bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20"
            >
              {isListed ? (
                <Check className="mr-2 h-5 w-5 text-green-400" />
              ) : (
                <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-200" />
              )}
              {isListed ? "Added" : "My List"}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};