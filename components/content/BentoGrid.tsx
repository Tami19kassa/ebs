"use client";
import { MediaItem } from "@/data/cms";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";

export const BentoGrid = ({ items }: { items: MediaItem[] }) => {
  // Ensure we have items
  if (!items || items.length === 0) return null;

  // Limit to 5 items for the perfect bento layout
  const displayItems = items.slice(0, 5);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[240px]">
      {displayItems.map((item, i) => {
        // Layout Logic:
        // Index 0: Large Square (Top Left) -> 2x2
        // Index 3: Wide Rectangle (Bottom) -> 2x1
        // Others: Standard Square -> 1x1
        const isLargeSquare = i === 0;
        const isWide = i === 3;
        
        const colSpan = isLargeSquare || isWide ? "md:col-span-2" : "md:col-span-1";
        const rowSpan = isLargeSquare ? "md:row-span-2" : "md:row-span-1";

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className={`
              relative rounded-2xl overflow-hidden group cursor-pointer 
              ${colSpan} ${rowSpan}
              bg-ebs-charcoal shadow-premium border border-black/5 dark:border-white/10
            `}
            whileHover={{ y: -5, zIndex: 10 }}
          >
            <Link href={`/watch/${item.id}`} className="block w-full h-full">
              {/* IMAGE LAYER */}
              <div className="relative w-full h-full">
                <Image
                  src={item.thumbnailUrl}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes={isLargeSquare ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
                />
                
                {/* 
                   CRITICAL FIX: 
                   Hardcoded 'from-black' gradient. 
                   This ensures text remains readable in Light Mode.
                */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
              </div>

              {/* CONTENT LAYER */}
              <div className="absolute inset-0 p-5 flex flex-col justify-end">
                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  
                  {/* Play Icon (Reveals on Hover) */}
                  <div className="flex items-center gap-2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-ebs-crimson text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg shadow-ebs-crimson/40">
                      <Play size={14} fill="currentColor" />
                    </div>
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">Watch</span>
                  </div>

                  {/* Title */}
                  <h3 className={`font-heading font-bold text-white leading-tight drop-shadow-md ${isLargeSquare ? 'text-3xl' : 'text-lg line-clamp-2'}`}>
                    {item.title}
                  </h3>
                  
                  {/* Metadata */}
                  <div className="flex items-center gap-2 text-gray-300 text-xs mt-1 font-medium">
                    <span className="text-ebs-crimson">{item.categories?.[0] || "Movie"}</span>
                    <span>•</span>
                    <span>{item.year}</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
};