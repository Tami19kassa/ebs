"use client";
import { MediaItem } from "@/data/cms";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const BentoGrid = ({ items }: { items: MediaItem[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[200px]">
      {items.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          className={cn(
            "relative rounded-xl overflow-hidden group cursor-pointer border border-white/10",
            i === 0 || i === 3 ? "md:col-span-2 md:row-span-2" : "md:col-span-1 md:row-span-1"
          )}
        >
          <img
            src={item.thumbnailUrl}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
         <div className="absolute inset-0 bg-linear-to-t from-ebs-dark via-transparent to-transparent opacity-90" />
          <div className="absolute bottom-0 left-0 p-6">
            <h3 className={cn("font-heading font-bold text-white group-hover:text-ebs-crimson transition-colors", 
                (i === 0 || i === 3) ? "text-3xl" : "text-lg")}>
              {item.title}
            </h3>
            <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0">
                {item.categories.join(' • ')}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};