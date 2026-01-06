"use client";
import { MediaItem } from "@/data/cms";
import { motion } from "framer-motion";
import { Play, Plus, ThumbsUp, Info } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils"; // Ensure you have a utils file or remove this wrapper

export const MovieCard = ({ data, className }: { data: MediaItem; className?: string }) => {
  const { addToWatchlist, isInWatchlist } = useAppStore();
  
  // Safe check for ID. If missing, don't render (prevents crashes)
  if (!data?.id) return null;

  const inList = isInWatchlist(data.id);
  const linkHref = `/watch/${data.id}`;

  return (
    <motion.div
      // FIX 1: Default to 'aspect-video' (Landscape) so it ALWAYS has height.
      // FIX 2: Allow 'className' prop to override this (e.g., for Vertical Posters).
      className={`relative w-full cursor-pointer group z-0 ${className || "aspect-video"}`}
      whileHover={{ 
        scale: 1.05, 
        zIndex: 50,
        y: -8,
        transition: { duration: 0.3, ease: "circOut" } 
      }}
    >
      <Link href={linkHref} className="block w-full h-full">
        {/* 
           VISUALS:
           - bg-ebs-charcoal: Adapts to White/Dark based on theme.
           - shadow-premium: Gives that colored glow in light mode.
           - border: Adds a crisp edge definition.
        */}
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-ebs-charcoal shadow-premium border border-border group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] group-hover:border-ebs-crimson/50 transition-all duration-300">
          
          {/* IMAGE */}
          <div className="relative w-full h-full">
            <Image
              src={data.thumbnailUrl || "/placeholder.jpg"} // Fallback image
              alt={data.title}
              fill
              className="object-cover transition-all duration-700 group-hover:brightness-110 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
            
            {/* 
                FIX 3: THEME-AWARE GRADIENT
                We use the CSS variable --bg-overlay which stays dark at the bottom 
                even in Light Mode, ensuring the white text is readable.
            */}
            <div className="absolute inset-0 bg-[image:var(--bg-overlay)] opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
            
            {/* 4K Badge */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-[-10px] group-hover:translate-y-0">
                <span className="bg-black/60 backdrop-blur-md text-white text-[9px] font-bold px-2 py-1 rounded border border-white/20 tracking-wider">
                  4K
                </span>
            </div>
          </div>

          {/* HOVER CONTENT */}
          <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            
            {/* Buttons */}
            <div className="flex items-center gap-3 mb-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
               <div className="bg-white text-black w-10 h-10 rounded-full flex items-center justify-center hover:bg-ebs-crimson hover:text-white hover:scale-110 transition-all shadow-lg cursor-pointer">
                  <Play size={18} fill="currentColor" className="ml-1" />
               </div>
               
               <button 
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all hover:bg-white/20 backdrop-blur-sm ${inList ? 'border-ebs-crimson text-ebs-crimson' : 'border-gray-300 text-white'}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addToWatchlist(data);
                  }}
               >
                  {inList ? <ThumbsUp size={18} /> : <Plus size={20} />}
               </button>
            </div>
            
            {/* Text Info */}
            <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                {/* 
                   CRITICAL: Text is forced WHITE because it lives on top of the dark video/image overlay. 
                   It ignores the Light Theme text color.
                */}
                <h3 className="font-heading font-bold text-white text-lg leading-tight drop-shadow-lg mb-1 line-clamp-1">
                    {data.title}
                </h3>
                
                <div className="flex items-center flex-wrap gap-3 text-[11px] text-gray-200 font-medium">
                    <span className="text-green-400 font-bold tracking-wide">98% Match</span>
                    <span className="border border-gray-400 px-1.5 py-0.5 rounded text-[10px] bg-black/40 backdrop-blur-md">
                      {data.rating || 'PG'}
                    </span>
                    <span>{data.duration || '1h 30m'}</span>
                    <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-ebs-crimson rounded-full"></span>
                        {data.categories?.[0] || 'Drama'}
                    </span>
                </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};