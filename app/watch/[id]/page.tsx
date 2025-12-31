import { UniversalPlayer } from "@/components/video/UniversalPlayer";
import { cmsApi } from "@/lib/cms-api";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Calendar, Clock, Star, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// Force dynamic rendering so we get fresh data
export const dynamic = 'force-dynamic';

export default async function WatchPage({ params }: { params: Promise<{ id: string }> }) {
  // FIX: In Next.js 15, we must await the params object before using it
  const { id } = await params;

  // Fetch the specific movie using the ID
  const movie = await cmsApi.getContentById(id);

  // If ID is wrong or deleted, show 404
  if (!movie) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-ebs-dark text-white">
      <Navbar />
      
      <div className="max-w-[1400px] mx-auto px-6 pt-32 pb-20 space-y-8">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={20} /> Back to Browse
        </Link>

        {/* Video Player Section */}
        <div className="w-full">
            {movie.videoUrl ? (
                <UniversalPlayer url={movie.videoUrl} poster={movie.backdropUrl || movie.thumbnailUrl} />
            ) : (
                <div className="aspect-video bg-gray-900 flex items-center justify-center border border-white/10 rounded-xl">
                    <p className="text-gray-500">Video source not available</p>
                </div>
            )}
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left: Title & Desc */}
            <div className="lg:col-span-2 space-y-6">
                <h1 className="text-4xl md:text-5xl font-heading font-bold">{movie.title}</h1>
                
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300">
                    <span className="flex items-center gap-2"><Calendar size={16} className="text-ebs-crimson" /> {movie.year}</span>
                    <span className="flex items-center gap-2"><Clock size={16} className="text-ebs-crimson" /> {movie.duration}</span>
                    <span className="flex items-center gap-2"><Star size={16} className="text-ebs-gold" /> {movie.rating}</span>
                    <div className="flex gap-2">
                        {movie.categories.map(cat => (
                            <span key={cat} className="bg-white/10 px-3 py-1 rounded-full text-xs hover:bg-white/20 transition-colors">
                                {cat}
                            </span>
                        ))}
                    </div>
                </div>

                <p className="text-lg text-gray-400 leading-relaxed">
                    {movie.description}
                </p>
            </div>

            {/* Right: Sidebar (Next Up / Related) */}
            <div className="bg-white/5 p-6 rounded-2xl border border-white/5 h-fit">
                <h3 className="text-xl font-bold mb-6 border-l-4 border-ebs-crimson pl-3">More Like This</h3>
                <p className="text-gray-500 text-sm">
                    Coming Soon: AI Recommendation Engine integration.
                </p>
            </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}