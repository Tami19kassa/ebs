"use client";
import { useState, useEffect } from "react";
import { Play, Loader2, AlertCircle } from "lucide-react";
import dynamic from "next/dynamic";

// 1. STANDARD IMPORT with 'as any' to silence TypeScript
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
  const [isClient, setIsClient] = useState(false);

  // Hydration Fix
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="aspect-video w-full bg-ebs-charcoal rounded-xl animate-pulse border border-white/10" />;
  }

  // Error Check
  if (!url) {
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
         THE FIX: We use the library's native 'light' prop.
         This tells ReactPlayer: "Show this image first, and when clicked, YOU handle the video loading."
         This guarantees the video plays immediately on click.
      */}
      <ReactPlayer
        url={url}
        width="100%"
        height="100%"
        controls={true}
        playing={true} // This tells it to autoplay ONLY after the user clicks the thumbnail
        
        // 1. Pass the poster image here. 
        // If no poster, we pass 'true' which attempts to fetch the default YouTube thumbnail.
        light={poster ? poster : true}
        
        // 2. We pass your Custom Button into the player itself.
        playIcon={
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors w-full h-full">
             <div className="relative">
                {/* Glowing Pulse Effect */}
                <div className="absolute inset-0 bg-ebs-crimson rounded-full animate-ping opacity-20 duration-1000" />
                
                {/* The Button */}
                <div className="relative w-20 h-20 md:w-24 md:h-24 bg-ebs-crimson/90 backdrop-blur-sm rounded-full flex items-center justify-center pl-2 shadow-[0_0_40px_rgba(214,44,44,0.5)] transform transition-transform duration-300 group-hover:scale-110 group-hover:bg-ebs-crimson">
                  <Play className="w-10 h-10 md:w-12 md:h-12 text-white fill-current" />
                </div>
             </div>
          </div>
        }
        
        // 3. Simple Config
        config={{
          youtube: {
            playerVars: { 
              showinfo: 0, 
              rel: 0,
              modestbranding: 1
            }
          }
        }}
      />
    </div>
  );
};