"use client";
import { MediaItem } from "@/data/cms";
import { motion } from "framer-motion";
import { Play, Plus, ThumbsUp, Info } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAppStore } from "@/lib/store";

export const MovieCard = ({ data }: { data: MediaItem }) => {
  const { addToWatchlist, isInWatchlist } = useAppStore();
  const inList = isInWatchlist(data.id);

  // Fallback for ID/Slug navigation
  const linkHref = `/watch/${data.id || (data.slug?.current ? data.slug.current : "")}`;

  return (
    <motion.div
      className="relative aspect-[16/9] w-full cursor-pointer group z-0"
      whileHover={{ 
        scale: 1.15, 
        zIndex: 50,
        y: -10,
        transition: { duration: 0.3, ease: "circOut" } 
      }}
    >
      <Link href={linkHref}>
        {/* MAIN CONTAINER */}
        <div className="relative w-full h-full rounded-lg overflow-hidden bg-ebs-charcoal shadow-lg group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)] group-hover:ring-2 ring-ebs-crimson/50 transition-all duration-300">
          
          {/* IMAGE LAYER */}
          <div className="relative w-full h-full">
            <Image
              src={data.thumbnailUrl}
              alt={data.title}
              fill
              className="object-cover transition-all duration-500 group-hover:brightness-110"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
            {/* Cinematic Vignette Overlay (Always visible but stronger on hover) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
            
            {/* Top Right "HD" Badge */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="bg-black/60 backdrop-blur-md text-white text-[9px] font-bold px-1.5 py-0.5 rounded border border-white/20">4K</span>
            </div>
          </div>

          {/* HOVER CONTENT LAYER */}
          <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            
            {/* Action Buttons Row */}
            <div className="flex items-center gap-3 mb-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
               {/* Play Button */}
               <div className="bg-white text-black w-8 h-8 rounded-full flex items-center justify-center hover:bg-ebs-crimson hover:text-white hover:scale-110 transition-all shadow-lg">
                  <Play size={14} fill="currentColor" />
               </div>
               
               {/* My List Button */}
               <div 
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all hover:bg-white/20 ${inList ? 'border-ebs-crimson text-ebs-crimson' : 'border-gray-400 text-white'}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addToWatchlist(data);
                  }}
               >
                  {inList ? <ThumbsUp size={14} /> : <Plus size={16} />}
               </div>

               {/* Info Button (Visual only) */}
               <div className="ml-auto w-8 h-8 rounded-full border-2 border-gray-400 text-white flex items-center justify-center hover:bg-white/20 transition-all">
                  <Info size={16} />
               </div>
            </div>
            
            {/* Meta Data */}
            <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                <h3 className="font-heading font-bold text-white text-base md:text-lg leading-tight drop-shadow-lg mb-1">
                    {data.title}
                </h3>
                
                <div className="flex items-center flex-wrap gap-2 text-[10px] text-gray-300 font-medium">
                    <span className="text-green-400 font-bold tracking-wide">98% Match</span>
                    <span className="border border-gray-500 px-1 rounded text-[9px] bg-black/40">{data.rating}</span>
                    <span>{data.duration}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-white">{data.categories[0]}</span>
                </div>

                {/* Genre Tags (Mini) */}
                <div className="flex gap-2 mt-2">
                    {data.categories.slice(0, 2).map((cat) => (
                        <span key={cat} className="text-[9px] text-gray-400 flex items-center gap-1">
                            <span className="w-1 h-1 bg-ebs-crimson rounded-full"></span>
                            {cat}
                        </span>
                    ))}
                </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};