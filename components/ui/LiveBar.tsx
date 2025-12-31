"use client";
import { X } from "lucide-react";
import { useState } from "react";

export const LiveBar = ({ text }: { text: string }) => {
  const [isVisible, setIsVisible] = useState(true);
  if (!isVisible || !text) return null; // Hide if no text from CMS

  return (
    <div className="relative w-full bg-ebs-crimson text-white text-[10px] md:text-xs font-bold py-2 px-4 flex items-center justify-center gap-4 tracking-widest uppercase z-[60]">
      <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
      <span className="truncate max-w-[200px] md:max-w-none">{text}</span>
      <button onClick={() => setIsVisible(false)} className="absolute right-4 hover:bg-black/20 p-1 rounded-full"><X size={14} /></button>
    </div>
  );
};