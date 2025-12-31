"use client";
import { MediaItem } from "@/data/cms";
import { motion, AnimatePresence } from "framer-motion";
import { PlayCircle, ThumbsUp, PlusCircle } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export const MovieCard = ({ data }: { data: MediaItem }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative aspect-video w-full cursor-pointer z-10"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.15, zIndex: 50, transition: { duration: 0.3 } }}
      layout
    >
      <div className="relative w-full h-full rounded-md overflow-hidden shadow-xl bg-ebs-charcoal">
        <Image
          src={data.thumbnailUrl}
          alt={data.title}
          fill
          className="object-cover"
        />
        
        {/* Hover Overlay with "Simulated" Video Preview */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm p-4 flex flex-col justify-end"
            >
                {/* Simulated Playing Video UI */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <PlayCircle className="w-12 h-12 text-white/80" />
               </div>

              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="space-y-2"
              >
                <h3 className="font-bold text-white text-sm">{data.title}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-300">
                    <span className="text-green-400 font-bold">98% Match</span>
                    <span className="border border-gray-500 px-1 rounded">{data.rating}</span>
                    <span>{data.duration}</span>
                </div>
                <div className="flex gap-4 pt-2">
                    <div className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center hover:border-white bg-white/10">
                        <PlayCircle size={16} />
                    </div>
                    <div className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center hover:border-white bg-white/10">
                        <PlusCircle size={16} />
                    </div>
                    <div className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center hover:border-white bg-white/10">
                        <ThumbsUp size={16} />
                    </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};