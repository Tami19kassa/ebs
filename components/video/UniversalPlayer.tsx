"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Play, Loader2, AlertCircle } from "lucide-react";
import dynamic from "next/dynamic";

// FIX: Switch back to standard "react-player" to resolve the module error.
// We keep the dynamic import to ensure it only loads on the client side.
const ReactPlayer = dynamic(() => import("react-player"), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-black flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-ebs-crimson animate-spin" />
    </div>
  )
}) as any;

interface UniversalPlayerProps {
  url: string;
  poster: string;
  title?: string;
}

export const UniversalPlayer = ({ url, poster, title }: UniversalPlayerProps) => {
  // STATE MANAGEMENT
  const [isClient, setIsClient] = useState(false); // To handle hydration
  const [isPlaying, setIsPlaying] = useState(false); // Have we started the video?
  const [hasError, setHasError] = useState(false); // Did the video fail?

  // HYDRATION FIX
  useEffect(() => {
    setIsClient(true);
  }, []);

  // EVENT HANDLER
  const handlePlay = () => {
    setIsPlaying(true);
  };

  if (!isClient) {
    return <div className="aspect-video w-full bg-ebs-charcoal rounded-xl animate-pulse border border-white/10" />;
  }

  // ERROR STATE
  if (!url || hasError) {
    return (
      <div className="aspect-video w-full bg-gray-900 rounded-xl flex flex-col items-center justify-center text-gray-400 border border-white/10">
        <AlertCircle className="w-10 h-10 mb-2 text-red-500" />
        <p>Video source unavailable</p>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10 group">
      
      {/* 
         THE "TRUE" PLAYER
         Only renders if isPlaying is true.
      */}
      {isPlaying ? (
        <div className="absolute inset-0 z-20">
          <ReactPlayer
            url={url}
            width="100%"
            height="100%"
            playing={true}
            controls={true}
            onError={(e: any) => {
              console.error("Video Error:", e);
              setHasError(true);
            }}
            config={{
              youtube: {
                playerVars: { 
                  showinfo: 0, 
                  rel: 0,
                  modestbranding: 1,
                  origin: typeof window !== 'undefined' ? window.location.origin : undefined
                }
              }
            }}
          />
        </div>
      ) : (
        /* 
           THE "POSTER" OVERLAY
           High-res image with custom play button
        */
        <div 
          className="absolute inset-0 z-10 cursor-pointer" 
          onClick={handlePlay}
        >
          {/* Background Image */}
          {poster ? (
            <Image
              src={poster}
              alt={title || "Video thumbnail"}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
          ) : (
             <div className="w-full h-full bg-gray-800" />
          )}

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />

          {/* Centered Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="relative">
                {/* Glowing Pulse Effect */}
                <div className="absolute inset-0 bg-ebs-crimson rounded-full animate-ping opacity-20 duration-1000" />
                
                {/* The Button */}
                <div className="relative w-20 h-20 md:w-24 md:h-24 bg-ebs-crimson/90 backdrop-blur-sm rounded-full flex items-center justify-center pl-2 shadow-[0_0_40px_rgba(214,44,44,0.5)] transform transition-transform duration-300 group-hover:scale-110 group-hover:bg-ebs-crimson">
                  <Play className="w-10 h-10 md:w-12 md:h-12 text-white fill-current" />
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};