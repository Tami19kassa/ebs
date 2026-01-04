"use client";
import { useState } from "react";
import Image from "next/image";
import { Play, AlertCircle } from "lucide-react";

/**
 * UTILITY: Robust YouTube ID Extractor
 * Handles:
 * - https://www.youtube.com/watch?v=ID
 * - https://www.youtube.com/shorts/ID
 * - https://youtu.be/ID
 * - https://www.youtube.com/embed/ID
 */
const getYouTubeId = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

interface UniversalPlayerProps {
  url: string;
  poster: string;
  title?: string;
}

export const UniversalPlayer = ({ url, poster, title }: UniversalPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  const youtubeId = getYouTubeId(url);
  // If we found an ID, it's YouTube. Otherwise treat as raw video file.
  const isYouTube = !!youtubeId;

  if (!url) {
    return (
      <div className="aspect-video w-full bg-gray-900 rounded-xl flex flex-col items-center justify-center text-gray-500 border border-white/10">
        <AlertCircle className="w-10 h-10 mb-2 text-red-500" />
        <p>Video source unavailable</p>
      </div>
    );
  }

  if (isPlaying) {
    return (
      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10">
        {isYouTube ? (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&modestbranding=1&rel=0&showinfo=0`}
            title={title || "Video player"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        ) : (
          <video src={url} controls autoPlay className="w-full h-full object-contain" />
        )}
      </div>
    );
  }

  return (
    <div 
      className="relative w-full aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-white/10 group cursor-pointer"
      onClick={() => setIsPlaying(true)}
    >
      {poster ? (
        <Image
          src={poster}
          alt={title || "Video thumbnail"}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        />
      ) : (
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
      )}
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-ebs-crimson rounded-full animate-ping opacity-20 duration-1000" />
          <div className="relative w-20 h-20 md:w-24 md:h-24 bg-ebs-crimson/90 backdrop-blur-sm rounded-full flex items-center justify-center pl-2 shadow-[0_0_40px_rgba(214,44,44,0.5)] transform transition-transform duration-300 group-hover:scale-110 group-hover:bg-ebs-crimson">
            <Play className="w-10 h-10 md:w-12 md:h-12 text-white fill-current" />
          </div>
        </div>
      </div>
    </div>
  );
};