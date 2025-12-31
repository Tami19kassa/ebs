"use client";
import { useState, useRef, useEffect } from "react";
import { Maximize, Play, Pause, Volume2, Settings } from "lucide-react";

export default function Player({ src }: { src: string }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Simulation of playback progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (playing) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [playing]);

  return (
    <div className="relative w-full aspect-video bg-black group overflow-hidden rounded-xl border border-white/10">
      {/* Placeholder for actual <video> tag implementing HLS.js */}
      <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
        <p className="text-gray-500 font-mono text-sm">
            STREAMING SOURCE: {src} <br/> 
            <span className="text-xs opacity-50">HLS ADAPTIVE BITRATE SIMULATION ACTIVE</span>
        </p>
      </div>

      {/* Custom Controls Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
        {/* Progress Bar */}
        <div className="w-full h-1 bg-gray-600 rounded-full mb-4 cursor-pointer overflow-hidden">
            <div className="h-full bg-ebs-crimson" style={{ width: `${progress}%` }} />
        </div>

        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button onClick={() => setPlaying(!playing)} className="text-white hover:text-ebs-crimson transition-colors">
                    {playing ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}
                </button>
                <div className="flex items-center gap-2 group/vol">
                    <Volume2 className="text-white w-5 h-5" />
                    <div className="w-0 overflow-hidden group-hover/vol:w-20 transition-all duration-300">
                        <div className="h-1 bg-white rounded-full w-full ml-2"></div>
                    </div>
                </div>
                <span className="text-xs text-gray-300 font-mono">12:34 / 45:00</span>
            </div>

            <div className="flex items-center gap-4 text-white">
                <button className="hover:rotate-90 transition-transform duration-500">
                    <Settings className="w-5 h-5" />
                </button>
                <Maximize className="w-5 h-5 cursor-pointer hover:scale-110" />
            </div>
        </div>
      </div>
    </div>
  );
}