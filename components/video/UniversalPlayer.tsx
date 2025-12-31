"use client";
import dynamic from "next/dynamic";
import { Play } from "lucide-react";

// Load ReactPlayer dynamically
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false }) as any;

export const UniversalPlayer = ({ url, poster }: { url: string; poster: string }) => {
  return (
    <div className="relative w-full aspect-video bg-gray-900 rounded-xl overflow-hidden border border-white/10 shadow-2xl group">
      
      {/* Fallback pattern */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      
      <ReactPlayer
        url={url}
        width="100%"
        height="100%"
        controls={true}
        light={poster ? poster : false} 
        playing={false} 
        config={{
          youtube: {
            playerVars: { showinfo: 1, modestbranding: 1 }
          }
        }}
        playIcon={
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm group-hover:bg-black/20 transition-all">
             <div className="w-20 h-20 bg-ebs-crimson rounded-full flex items-center justify-center pl-1 shadow-[0_0_30px_rgba(214,44,44,0.6)] scale-100 group-hover:scale-110 transition-transform duration-300">
                <Play className="fill-white text-white w-10 h-10" />
             </div>
          </div>
        }
      />
    </div>
  );
};