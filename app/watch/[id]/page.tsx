import { UniversalPlayer } from "@/components/video/UniversalPlayer";
import { cmsApi } from "@/lib/cms-api";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Calendar, Clock, Star, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

interface WatchPageProps {
  params: Promise<{ id: string }>;
}

export default async function WatchPage({ params }: WatchPageProps) {
  const { id } = await params;
  const movie = await cmsApi.getContentById(id);

  if (!movie) {
    return notFound();
  }

  // Fallback image logic
  const playerImage = movie.backdropUrl || movie.thumbnailUrl || "";

  return (
    // FIX: Using 'bg-ebs-dark' (which maps to var(--bg-main)) instead of hardcoded 'bg-ebs-dark' if it was black.
    // Ensure your globals.css defines --bg-main correctly for light mode.
    <div className="min-h-screen bg-ebs-dark pb-20">
      <Navbar tickerText="Now Watching" />
      
      <div className="max-w-[1400px] mx-auto px-6 pt-32 space-y-8">
        {/* Back Button */}
        <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-muted hover:text-ebs-crimson hover:-translate-x-1 transition-all duration-300 font-medium"
        >
          <ArrowLeft size={20} /> Back to Browse
        </Link>

        {/* Video Player Container */}
        <div className="w-full shadow-2xl shadow-black/20 rounded-xl overflow-hidden">
            <UniversalPlayer 
                url={movie.videoUrl || ""} 
                poster={playerImage}
                title={movie.title}
            />
        </div>

        {/* Metadata Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 border-t border-gray-500/10 pt-10">
            <div className="lg:col-span-2 space-y-6">
                {/* FIX: Title text uses 'text-foreground' (White in Dark, Black in Light) */}
                <h1 className="text-4xl md:text-6xl font-heading font-bold text-foreground leading-tight">
                    {movie.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm font-medium">
                    {/* FIX: Badges use 'text-foreground' and 'bg-ebs-charcoal' (adapts to light/dark) */}
                    <span className="flex items-center gap-2 px-3 py-1 bg-ebs-charcoal text-foreground rounded-full border border-gray-500/20">
                        <Calendar size={14} className="text-ebs-crimson" /> {movie.year}
                    </span>
                    <span className="flex items-center gap-2 px-3 py-1 bg-ebs-charcoal text-foreground rounded-full border border-gray-500/20">
                        <Clock size={14} className="text-ebs-crimson" /> {movie.duration}
                    </span>
                    <span className="flex items-center gap-2 px-3 py-1 bg-ebs-charcoal text-foreground rounded-full border border-gray-500/20">
                        <Star size={14} className="text-ebs-crimson fill-current" /> {movie.rating}
                    </span>
                    <div className="flex gap-2 ml-2">
                        {movie.categories.map(cat => (
                            <span key={cat} className="text-ebs-crimson font-bold uppercase tracking-wider text-xs">
                                {cat}
                            </span>
                        ))}
                    </div>
                </div>

                {/* FIX: Description uses 'text-muted' (Gray in Dark, Dark Gray in Light) */}
                <p className="text-lg text-muted leading-relaxed max-w-3xl">
                    {movie.description}
                </p>
            </div>

            {/* Sidebar Placeholder */}
            <div className="bg-ebs-charcoal p-8 rounded-2xl border border-gray-500/10 h-fit shadow-premium">
                <h3 className="text-xl font-bold mb-6 border-l-4 border-ebs-crimson pl-4 text-foreground">
                    Up Next
                </h3>
                <div className="space-y-4">
                    <div className="h-20 bg-gray-500/10 rounded-lg animate-pulse" />
                    <div className="h-20 bg-gray-500/10 rounded-lg animate-pulse" />
                    <div className="h-20 bg-gray-500/10 rounded-lg animate-pulse" />
                </div>
            </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}