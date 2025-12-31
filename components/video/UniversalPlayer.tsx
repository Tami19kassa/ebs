"use client";
import dynamic from "next/dynamic";

// FIX: We add 'as any' at the end. 
// This tells TypeScript: "Treat this component as untyped. Accept ALL props."
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false }) as any;

export const UniversalPlayer = ({ url, poster }: { url: string; poster: string }) => {
  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-white/10 shadow-2xl group">
      <ReactPlayer
        url={url}
        width="100%"
        height="100%"
        controls={true}
        light={poster} 
        playing={true}
        config={{
          youtube: {
            playerVars: { showinfo: 1, modestbranding: 1 }
          }
        }}
        playIcon={
          <div className="w-20 h-20 bg-ebs-crimson/90 rounded-full flex items-center justify-center pl-2 shadow-[0_0_30px_rgba(214,44,44,0.6)] group-hover:scale-110 transition-transform cursor-pointer">
            <svg viewBox="0 0 24 24" fill="white" className="w-10 h-10">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        }
      />
    </div>
  );
};