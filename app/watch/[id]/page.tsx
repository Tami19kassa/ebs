import { UniversalPlayer } from "@/components/video/UniversalPlayer";
import { cmsApi } from "@/lib/cms-api";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Calendar, Clock, Star, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// Force fresh data on every request (important for media sites)
export const dynamic = 'force-dynamic';

interface WatchPageProps {
  params: Promise<{ id: string }>;
}

export default async function WatchPage({ params }: WatchPageProps) {
  // 1. Await the params (Next.js 15 Requirement)
  const { id } = await params;

  // 2. Fetch Data
  const movie = await cmsApi.getContentById(id);

  // 3. Handle 404
  if (!movie) {
    return notFound();
  }

  // 4. Select the best image for the player (Backdrop > Thumbnail)
  const playerImage = movie.backdropUrl || movie.thumbnailUrl || "";

  return (
    <div className="min-h-screen bg-ebs-dark text-white">
      {/* Navbar with simple static ticker for sub-pages */}
      <Navbar tickerText="Now Watching" />
      
      <div className="max-w-[1400px] mx-auto px-6 pt-32 pb-20 space-y-8">
        {/* Breadcrumb Navigation */}
        <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white hover:-translate-x-1 transition-all duration-300"
        >
          <ArrowLeft size={20} /> <span className="font-medium">Back to Browse</span>
        </Link>

        {/* 
           5. THE VIDEO PLAYER
           We pass the title for accessibility and the image for the custom overlay
        */}
        <div className="w-full shadow-2xl shadow-black/50 rounded-xl">
            <UniversalPlayer 
                url={movie.videoUrl || ""} 
                poster={playerImage}
                title={movie.title}
            />
        </div>

        {/* Movie Metadata Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 border-t border-white/5 pt-10">
            <div className="lg:col-span-2 space-y-6">
                <h1 className="text-4xl md:text-6xl font-heading font-bold text-white leading-tight">
                    {movie.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-gray-300 font-medium">
                    <span className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                        <Calendar size={14} className="text-ebs-crimson" /> {movie.year}
                    </span>
                    <span className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                        <Clock size={14} className="text-ebs-crimson" /> {movie.duration}
                    </span>
                    <span className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                        <Star size={14} className="text-ebs-gold fill-current" /> {movie.rating}
                    </span>
                    <div className="flex gap-2 ml-2">
                        {movie.categories.map(cat => (
                            <span key={cat} className="text-ebs-crimson font-bold uppercase tracking-wider text-xs">
                                {cat}
                            </span>
                        ))}
                    </div>
                </div>

                <p className="text-lg text-gray-400 leading-relaxed max-w-3xl">
                    {movie.description}
                </p>
            </div>

            {/* Sidebar / Recommendations Placeholder */}
            <div className="bg-gradient-to-br from-white/5 to-transparent p-8 rounded-2xl border border-white/5 h-fit">
                <h3 className="text-xl font-bold mb-6 border-l-4 border-ebs-crimson pl-4">
                    Up Next
                </h3>
                <div className="space-y-4">
                    <div className="h-20 bg-white/5 rounded-lg animate-pulse" />
                    <div className="h-20 bg-white/5 rounded-lg animate-pulse" />
                    <div className="h-20 bg-white/5 rounded-lg animate-pulse" />
                    <p className="text-xs text-gray-500 mt-4 text-center">
                        AI Recommendations Loading...
                    </p>
                </div>
            </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}