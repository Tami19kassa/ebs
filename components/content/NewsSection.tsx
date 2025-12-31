"use client";
import { NewsItem } from "@/data/cms";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Tag } from "lucide-react";
import Image from "next/image";

export const NewsSection = ({ news }: { news: NewsItem[] }) => {
  const mainArticle = news[0];
  const sideArticles = news.slice(1, 3);

  return (
    <section className="py-20 border-t border-white/5 bg-ebs-charcoal/30">
        <div className="max-w-[1400px] mx-auto px-6">
            <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-heading font-bold text-white">Latest News</h2>
                <button className="text-ebs-crimson text-sm font-bold flex items-center gap-2 hover:gap-3 transition-all">
                    VIEW ALL NEWS <ArrowRight size={16} />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-auto lg:h-[500px]">
                {/* Main Feature Article */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 relative group cursor-pointer overflow-hidden rounded-2xl"
                >
                    <Image 
                        src={mainArticle.thumbnailUrl} 
                        alt={mainArticle.headline} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ebs-dark via-ebs-dark/50 to-transparent" />
                    
                    <div className="absolute bottom-0 left-0 p-8 w-full max-w-2xl">
                        <div className="flex items-center gap-3 text-xs font-bold mb-3">
                            <span className="bg-ebs-crimson text-white px-2 py-1 rounded-sm">{mainArticle.tag}</span>
                            <span className="text-gray-300 flex items-center gap-1"><Clock size={12} /> {mainArticle.publishedAt}</span>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-heading font-bold text-white mb-3 leading-tight group-hover:text-ebs-crimson transition-colors">
                            {mainArticle.headline}
                        </h3>
                        <p className="text-gray-300 line-clamp-2 text-lg mb-4">{mainArticle.excerpt}</p>
                        <span className="text-sm text-gray-400">By {mainArticle.author}</span>
                    </div>
                </motion.div>

                {/* Sidebar Articles */}
                <div className="flex flex-col gap-8 h-full">
                    {sideArticles.map((item, i) => (
                        <motion.div 
                            key={item.id}
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex-1 relative group cursor-pointer bg-ebs-charcoal rounded-xl overflow-hidden flex flex-row lg:flex-col border border-white/5 hover:border-ebs-crimson/50 transition-colors"
                        >
                            <div className="relative w-1/3 lg:w-full h-full lg:h-48">
                                <Image src={item.thumbnailUrl} alt={item.headline} fill className="object-cover" />
                            </div>
                            <div className="p-5 flex flex-col justify-center w-2/3 lg:w-full">
                                <span className="text-ebs-crimson text-xs font-bold mb-2 uppercase tracking-wider">{item.tag}</span>
                                <h4 className="text-lg font-bold text-white leading-snug mb-2 group-hover:text-ebs-crimson transition-colors line-clamp-2">
                                    {item.headline}
                                </h4>
                                <span className="text-xs text-gray-500 mt-auto">{item.publishedAt}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    </section>
  );
};