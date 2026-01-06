"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { Play, Plus, Check } from "lucide-react";
import { MediaItem } from "@/data/cms";
import { Button } from "../ui/Button";
import { useAppStore } from "@/lib/store";
import Link from "next/link";

interface HeroSectionProps {
  featured: MediaItem;
}

const getYouTubeId = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
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
    // FIX: Hardcoded 'bg-[#0a0a0a]' ensures the video area is always dark
    <div ref={ref} className="relative h-screen md:h-[95vh] w-full overflow-hidden bg-[#0a0a0a]">
      
      <motion.div
        style={{ y: backgroundY, opacity: backgroundOpacity }}
        className="absolute inset-0 z-0"
      >
        {youtubeId ? (
          <div className="absolute inset-0 w-full h-full pointer-events-none scale-[3.5] md:scale-125">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtubeId}&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&disablekb=1`}
              className="w-full h-full object-cover"
              allow="autoplay; encrypted-media"
              style={{ pointerEvents: 'none' }} 
            />
          </div>
        ) : (
          <img
            src={(featured as any).backdropUrl || featured.thumbnailUrl}
            alt={featured.title}
            className="h-full w-full object-cover object-center"
          />
        )}

        {/* Gradient fades to BLACK on the sides/top to blend video */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black via-black/20 to-transparent" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/10 to-transparent" />
        
        {/* 
           MAGIC GRADIENT:
           This gradient sits at the very bottom.
           It fades from Transparent -> THEME COLOR (White in Light Mode, Black in Dark Mode).
           This ensures the video doesn't just "cut off" harshly.
        */}
        <div className="absolute bottom-0 left-0 right-0 h-32 z-20 bg-gradient-to-t from-[var(--bg-main)] to-transparent" />
      </motion.div>

      <div className="relative z-20 flex h-full max-w-7xl mx-auto flex-col justify-end pb-32 md:pb-24 px-6 md:px-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl space-y-4 md:space-y-6"
        >
          <motion.div variants={textVariants} className="flex items-center gap-3">
             <span className="bg-ebs-crimson text-white px-3 py-1 text-[10px] md:text-xs font-bold tracking-widest uppercase rounded-sm shadow-[0_0_15px_rgba(243,112,33,0.5)]">
               New Premiere
             </span>
             {/* FIX: Force text-gray-300 so it is readable on dark video */}
             <div className="flex items-center gap-2 text-gray-300 font-medium text-xs md:text-sm tracking-wide">
                <span>{featured.year}</span>
                <span className="text-ebs-crimson">•</span>
                <span>{featured.rating}</span>
             </div>
          </motion.div>

          {/* FIX: Force text-white */}
          <motion.h1
            variants={textVariants}
            className="font-heading text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tight drop-shadow-2xl"
          >
            {featured.title}
          </motion.h1>

          {/* FIX: Force text-gray-200 */}
          <motion.p
            variants={textVariants}
            className="text-sm md:text-xl text-gray-200 line-clamp-3 max-w-2xl leading-relaxed text-shadow-sm"
          >
            {featured.description}
          </motion.p>

          <motion.div variants={textVariants} className="flex flex-wrap gap-4 pt-2 md:pt-4">
            <Link href={`/watch/${featured.id}`}>
              <Button 
                variant="primary" 
                className="h-12 md:h-14 px-6 md:px-8 text-base md:text-lg hover:shadow-[0_0_20px_rgba(243,112,33,0.4)] transition-shadow"
              >
                <Play className="mr-2 h-5 w-5 fill-current" />
                Play with Sound
              </Button>
            </Link>

            <Button
              variant="secondary"
              onClick={handleListToggle}
              className="h-12 md:h-14 px-6 md:px-8 text-base md:text-lg group bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 text-white"
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