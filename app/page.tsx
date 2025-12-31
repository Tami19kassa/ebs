import { Suspense } from "react";
import { HeroSection } from "@/components/hero/HeroSection";
import { MovieCard } from "@/components/content/MovieCard";
import { BentoGrid } from "@/components/content/BentoGrid";
import { NewsSection } from "@/components/content/NewsSection";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar"; // Navbar is now imported here to pass props!
import { cmsApi } from "@/lib/cms-api";

// Helper components
const SectionHeader = ({ title, sub }: { title: string; sub?: string }) => (
  <div className="mb-6 px-6 md:px-12 max-w-[1400px] mx-auto">
    <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
      <span className="w-1.5 h-8 bg-ebs-crimson rounded-full" />
      {title}
    </h2>
    {sub && <p className="text-gray-400 ml-5 mt-1 text-sm">{sub}</p>}
  </div>
);

const ScrollContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="flex gap-5 overflow-x-auto pb-8 pt-2 snap-x snap-mandatory no-scrollbar px-6 md:px-12 max-w-[1400px] mx-auto">
    {children}
  </div>
);

export default async function Home() {
  // 1. Fetch The Config
  const [homeData, newsData] = await Promise.all([
    cmsApi.getHomePageData(),
    cmsApi.getNews()
  ]);

  const { heroItem, trending, originals, bentoGrid, liveSection, tickerText } = homeData;

  return (
    <main className="min-h-screen bg-ebs-dark" id="home">
      {/* Pass dynamic ticker text to Navbar */}
      <Navbar tickerText={tickerText} />
      
      {/* Safe Check: Only render Hero if Editor selected one */}
      {heroItem ? (
        <HeroSection featured={heroItem} />
      ) : (
        <div className="h-[50vh] flex items-center justify-center text-gray-500">
          <p>Please configure a Hero Item in Sanity Studio</p>
        </div>
      )}

      <div className="relative z-20 space-y-24 pb-20 -mt-20">
        
        {/* TRENDING */}
        {trending.length > 0 && (
          <section id="trending">
             <SectionHeader title="Trending Now" sub="Curated picks for this week" />
             <ScrollContainer>
                {trending.map((item) => (
                  <div key={item.id} className="min-w-[280px] md:min-w-[350px] snap-start">
                    <MovieCard data={item} />
                  </div>
                ))}
             </ScrollContainer>
          </section>
        )}

        {/* ORIGINALS */}
        {originals.length > 0 && (
          <section id="originals" className="bg-linear-to-b from-ebs-purple/20 to-transparent py-10">
            <SectionHeader title="EBS Originals" sub="Exclusive stories" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 md:px-12 max-w-[1400px] mx-auto">
              {originals.map(item => <MovieCard key={item.id} data={item} />)}
            </div>
          </section>
        )}

        {/* BENTO GRID */}
        {bentoGrid.length > 0 && (
          <section>
            <SectionHeader title="Editors' Collections" />
            <div className="px-6 md:px-12 max-w-[1400px] mx-auto">
               <BentoGrid items={bentoGrid} />
            </div>
          </section>
        )}

        {/* LIVE TV SECTION (Dynamic) */}
        <section id="live" className="relative h-[500px] w-full bg-fixed bg-center bg-cover" 
           style={{ backgroundImage: `url('${liveSection.coverImage || "https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80"}')` }}
        >
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <div className="text-center space-y-6 p-6">
                    <span className="text-ebs-crimson font-bold tracking-[0.2em] uppercase">On Air Now</span>
                    <h2 className="text-5xl font-heading font-bold text-white">{liveSection.title}</h2>
                    <p className="text-gray-300 max-w-lg mx-auto">{liveSection.description}</p>
                    <button className="bg-white text-black font-bold px-8 py-4 rounded hover:scale-105 transition-transform">
                        WATCH LIVE
                    </button>
                </div>
            </div>
        </section>

        {/* NEWS */}
        {newsData.length > 0 && (
          <div id="news">
              <NewsSection news={newsData} />
          </div>
        )}
        
      </div>

      <Footer />
    </main>
  );
}