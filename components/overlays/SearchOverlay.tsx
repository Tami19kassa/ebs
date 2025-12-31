"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search as SearchIcon } from "lucide-react";
import { useAppStore } from "@/lib/store";
// FIX: Import cmsApi so the search function works
import { cmsApi } from "@/lib/cms-api"; 
import { MediaItem } from "@/data/cms";
import { MovieCard } from "../content/MovieCard";

export const SearchOverlay = () => {
  const { isSearchOpen, toggleSearch } = useAppStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleSearch = async () => {
      if (query.length > 1) {
        setLoading(true);
        try {
          // This line was causing the error because cmsApi wasn't imported
          const data = await cmsApi.searchContent(query);
          setResults(data);
        } catch (error) {
          console.error("Search failed:", error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    };
    
    // Debounce to prevent searching on every single keystroke
    const timer = setTimeout(handleSearch, 500);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-ebs-dark/95 backdrop-blur-xl pt-24 px-6 overflow-y-auto"
        >
          {/* Close Button */}
          <button 
            onClick={() => toggleSearch(false)}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-8 h-8 text-white" />
          </button>

          <div className="max-w-6xl mx-auto space-y-8 min-h-[50vh]">
            {/* Search Input */}
            <div className="relative group">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-8 h-8 group-focus-within:text-ebs-crimson transition-colors" />
                <input
                    autoFocus
                    type="text"
                    placeholder="Search titles, genres, or news..."
                    className="w-full bg-transparent border-b-2 border-gray-700 text-3xl md:text-5xl font-heading font-bold p-6 pl-16 text-white placeholder:text-gray-700 focus:border-ebs-crimson focus:outline-none transition-colors"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center py-10">
                <div className="w-10 h-10 border-4 border-ebs-crimson border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {/* Results Grid */}
            {!loading && results.length > 0 && (
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-20"
               >
                  {results.map(item => (
                      <div key={item.id} onClick={() => toggleSearch(false)}>
                        <MovieCard data={item} />
                      </div>
                  ))}
               </motion.div>
            )}
            
            {/* Empty State */}
            {!loading && results.length === 0 && query.length > 1 && (
                <div className="text-center py-20">
                    <p className="text-gray-500 text-xl">No results found for "{query}"</p>
                    <p className="text-gray-600 text-sm mt-2">Try searching for "News" or "Drama"</p>
                </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};