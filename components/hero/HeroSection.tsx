"use client";

import { useRef } from "react";
// 1. Import 'Variants' type here
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { Play, Info, Plus, Check } from "lucide-react";
import { MediaItem } from "@/data/cms";
import { Button } from "../ui/Button";
import { useAppStore } from "@/lib/store";
import Link from "next/link";

interface HeroSectionProps {
  featured: MediaItem;
}

export const HeroSection = ({ featured }: HeroSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useAppStore();
  const isListed = isInWatchlist(featured.id);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // 2. Add explicit ': Variants' type annotation to both objects
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const textVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 30, 
      filter: "blur(10px)" 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { 
        type: "spring", // Now TypeScript knows this is strictly "spring"
        damping: 20, 
        stiffness: 100 
      }
    },
  };

  const handleListToggle = () => {
    if (isListed) {
      removeFromWatchlist(featured.id);
    } else {
      addToWatchlist(featured);
    }
  };

  return (
    <div ref={ref} className="relative h-[95vh] w-full overflow-hidden bg-ebs-dark">
      <motion.div
        style={{ y: backgroundY, opacity: backgroundOpacity }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 z-10 bg-linear-to-r from-ebs-dark via-ebs-dark/50 to-transparent" />
        <div className="absolute inset-0 z-10 bg-linear-to-t from-ebs-dark via-ebs-dark/20 to-transparent" />

        <img
  // Use the specific backdrop if Sanity provided it, else thumbnail
  src={(featured as any).backdropUrl || featured.thumbnailUrl}
  alt={featured.title}
  className="h-full w-full object-cover object-center"
/>
        
        <div className="pointer-events-none absolute inset-0 z-10 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      </motion.div>

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
                <span className="text-ebs-crimson">•</span>
                <span>{featured.duration}</span>
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
            <Link href={`/watch/${featured.id}`}>
              <Button 
                variant="primary" 
                className="h-14 px-8 text-lg hover:shadow-[0_0_20px_rgba(214,44,44,0.4)] transition-shadow"
              >
                <Play className="mr-2 h-5 w-5 fill-current" />
                Watch Now
              </Button>
            </Link>

            <Button
              variant="secondary"
              onClick={handleListToggle}
              className="h-14 px-8 text-lg group bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20"
            >
              <motion.div
                initial={false}
                animate={{ rotate: isListed ? 360 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isListed ? (
                  <Check className="mr-2 h-5 w-5 text-green-400" />
                ) : (
                  <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-200" />
                )}
              </motion.div>
              {isListed ? "Added to List" : "My List"}
            </Button>
            
            <Button variant="ghost" className="h-14 px-6 text-lg hover:bg-white/5">
                <Info className="mr-2 h-5 w-5" />
                Details
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};