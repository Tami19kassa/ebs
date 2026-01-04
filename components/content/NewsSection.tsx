"use client";
import { NewsItem } from "@/data/cms";
import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import Image from "next/image";

export const NewsSection = ({ news }: { news: NewsItem[] }) => {
  if (!news || news.length === 0) return null;

  // 1. Split content: 1 Main Feature, the rest are Grid Items
  const mainArticle = news[0];
  const otherArticles = news.slice(1); // Takes everyone else (up to API limit)

  return (
    <section className="py-20 border-t border-white/5 bg-ebs-charcoal/30">
        <div className="max-w-[1400px] mx-auto px-6">
            <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-heading font-bold text-white">Latest News</h2>
                <button className="text-ebs-crimson text-sm font-bold flex items-center gap-2 hover:gap-3 transition-all">
                    VIEW ARCHIVE <ArrowRight size={16} />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* --- MAIN FEATURE (Left Side) --- */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 relative h-[400px] md:h-[500px] group cursor-pointer overflow-hidden rounded-2xl border border-white/10"
                >
                    <Image 
                        src={mainArticle.thumbnailUrl} 
                        alt={mainArticle.headline} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    
                    <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full max-w-2xl">
                        <div className="flex items-center gap-3 text-xs font-bold mb-3">
                            <span className="bg-ebs-crimson text-white px-2 py-1 rounded-sm">{mainArticle.tag}</span>
                            <span className="text-gray-300 flex items-center gap-1"><Clock size={12} /> {mainArticle.publishedAt}</span>
                        </div>
                        <h3 className="text-2xl md:text-4xl font-heading font-bold text-white mb-3 leading-tight group-hover:text-ebs-crimson transition-colors">
                            {mainArticle.headline}
                        </h3>
                        <p className="text-gray-300 line-clamp-2 text-sm md:text-lg">{mainArticle.excerpt}</p>
                    </div>
                </motion.div>

                {/* --- SIDEBAR LIST (Right Side) --- */}
                <div className="flex flex-col gap-4 h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {otherArticles.map((item, i) => (
                        <motion.div 
                            key={item.id}
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group/item border border-transparent hover:border-white/5"
                        >
                            <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                                <Image src={item.thumbnailUrl} alt={item.headline} fill className="object-cover" />
                            </div>
                            <div className="flex flex-col justify-center">
                                <span className="text-ebs-crimson text-[10px] font-bold uppercase tracking-wider mb-1">{item.tag}</span>
                                <h4 className="text-sm font-bold text-white leading-snug group-hover/item:text-ebs-crimson transition-colors line-clamp-2">
                                    {item.headline}
                                </h4>
                                <span className="text-xs text-gray-500 mt-2">{item.publishedAt}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    </section>
  );
};