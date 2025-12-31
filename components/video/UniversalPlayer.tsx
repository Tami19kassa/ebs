"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Play } from "lucide-react";

// FIX: Switch back to standard "react-player" import to fix the module error.
// We keep 'as any' to prevent the Prop Type errors from before.
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false }) as any;

export const UniversalPlayer = ({ url, poster }: { url: string; poster: string }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="aspect-video bg-gray-900 rounded-xl" />;

  if (!url) {
    return (
      <div className="aspect-video bg-gray-900 flex items-center justify-center text-gray-500 border border-white/10 rounded-xl">
        No Video URL Found
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl group border border-white/10">
      <ReactPlayer
        url={url.trim()}
        width="100%"
        height="100%"
        controls={true}
        light={poster ? poster : false}
        playing={isPlaying}
        onClickPreview={() => setIsPlaying(true)}
        config={{
          youtube: {
             playerVars: { showinfo: 1, modestbranding: 1, rel: 0 }
          }
        }}
        playIcon={
          poster ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm group-hover:bg-black/20 transition-all cursor-pointer">
              <div className="w-20 h-20 bg-ebs-crimson rounded-full flex items-center justify-center pl-1 shadow-[0_0_30px_rgba(214,44,44,0.6)] scale-100 group-hover:scale-110 transition-transform duration-300">
                <Play className="fill-white text-white w-10 h-10" />
              </div>
            </div>
          ) : undefined
        }
      />
    </div>
  );
};