"use client";
import { MediaItem } from "@/data/cms";
import { motion } from "framer-motion";
import { PlayCircle, PlusCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link"; // Import Link
import { useAppStore } from "@/lib/store"; // Import store for watchlist

export const MovieCard = ({ data }: { data: MediaItem }) => {
  const { addToWatchlist } = useAppStore();

  return (
    // WRAP EVERYTHING IN A LINK
    <Link href={`/watch/${data.id || data.slug?.current}`}> 
      <motion.div
        className="relative aspect-video w-full cursor-pointer group rounded-md overflow-hidden bg-ebs-charcoal border border-white/5"
        whileHover={{ scale: 1.05, zIndex: 10 }}
        transition={{ duration: 0.2 }}
      >
        {/* Thumbnail Image */}
        <Image
          src={data.thumbnailUrl}
          alt={data.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Hover Content */}
        <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex gap-3 mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
             <button className="bg-white text-black p-2 rounded-full hover:bg-ebs-crimson hover:text-white transition-colors">
                <PlayCircle size={20} />
             </button>
             <button 
                className="bg-black/50 text-white p-2 rounded-full border border-white/20 hover:border-white transition-colors"
                onClick={(e) => {
                  e.preventDefault(); // Stop click from going to Link
                  addToWatchlist(data);
                }}
             >
                <PlusCircle size={20} />
             </button>
          </div>
          
          <h3 className="font-bold text-white text-sm md:text-base leading-tight drop-shadow-md">
            {data.title}
          </h3>
          <div className="flex items-center gap-2 text-[10px] text-gray-300 mt-1">
             <span className="text-green-400 font-bold">98% Match</span>
             <span className="border border-gray-500 px-1 rounded text-[9px]">{data.rating}</span>
             <span>{data.duration}</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};