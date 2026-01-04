import { Suspense } from "react";
import { HeroSection } from "@/components/hero/HeroSection";
import { MovieCard } from "@/components/content/MovieCard";
import { BentoGrid } from "@/components/content/BentoGrid";
import { NewsSection } from "@/components/content/NewsSection";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { cmsApi } from "@/lib/cms-api";

const ScrollContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="flex gap-4 overflow-x-auto pb-8 pt-4 snap-x snap-mandatory no-scrollbar px-6 md:px-12 max-w-[1400px] mx-auto flex-nowrap w-full">
    {children}
  </div>
);

const SectionHeader = ({ title, sub }: { title: string; sub?: string }) => (
  <div className="mb-2 px-6 md:px-12 max-w-[1400px] mx-auto">
    <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
      <span className="w-1 h-6 bg-ebs-crimson rounded-full" />
      {title}
    </h2>
    {sub && <p className="text-gray-400 ml-4 text-xs md:text-sm">{sub}</p>}
  </div>
);

export default async function Home() {
  const [homeData, newsData] = await Promise.all([
    cmsApi.getHomePageData(),
    cmsApi.getNews()
  ]);

  const { heroItem, trending, originals, newReleases, kidsFamily, bentoGrid, liveSection, tickerText, recentLibrary } = homeData;

  return (
    <main className="min-h-screen bg-ebs-dark pb-20" id="home">
      <Navbar tickerText={tickerText} />
      
      {heroItem && <HeroSection featured={heroItem} />}

      <div className="relative z-20 space-y-12 -mt-16">
        
        {/* TRENDING */}
        {trending.length > 0 && (
          <section id="trending">
             <SectionHeader title="Trending Now" />
             <ScrollContainer>
                {trending.map((item) => (
                  // FIX 2: 'flex-none' is CRITICAL. It forces the browser to NOT squash the cards.
                  // 'min-w-[...]' sets the size.
                  <div key={item.id} className="flex-none min-w-[200px] md:min-w-[280px] snap-start">
                    <MovieCard data={item} />
                  </div>
                ))}
             </ScrollContainer>
          </section>
        )}

        {/* ORIGINALS */}
        {originals.length > 0 && (
          <section id="originals">
            <SectionHeader title="EBS Originals" sub="Exclusive Series" />
            <ScrollContainer>
                {originals.map((item) => (
                  <div key={item.id} className="flex-none min-w-[250px] md:min-w-[350px] snap-start">
                    <MovieCard data={item} />
                  </div>
                ))}
            </ScrollContainer>
          </section>
        )}

        {/* NEW RELEASES */}
        {newReleases.length > 0 && (
          <section>
             <SectionHeader title="New Releases" />
             <ScrollContainer>
                {newReleases.map((item) => (
                  <div key={item.id} className="flex-none min-w-[200px] md:min-w-[280px] snap-start">
                    <MovieCard data={item} />
                  </div>
                ))}
             </ScrollContainer>
          </section>
        )}

        {/* LIVE TV */}
        <section id="live" className="relative h-[400px] md:h-[500px] w-full bg-fixed bg-center bg-cover my-10 border-y border-white/10" 
           style={{ backgroundImage: `url('${liveSection.coverImage || "https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80"}')` }}
        >
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="text-center space-y-4 p-6">
                    <span className="text-ebs-crimson font-bold tracking-[0.2em] uppercase text-xs md:text-sm animate-pulse">● On Air Now</span>
                    <h2 className="text-4xl md:text-6xl font-heading font-bold text-white">{liveSection.title}</h2>
                    <p className="text-gray-300 max-w-lg mx-auto text-sm md:text-base">{liveSection.description}</p>
                    <button className="bg-white text-black font-bold px-8 py-3 rounded-full hover:scale-105 transition-transform">
                        WATCH LIVE
                    </button>
                </div>
            </div>
        </section>

        {/* RECENTLY ADDED (Full Library) */}
        {recentLibrary.length > 0 && (
          <section>
             <SectionHeader title="Recently Added" sub="Full Library" />
             <ScrollContainer>
                {recentLibrary.map((item) => (
                  <div key={item.id} className="flex-none min-w-[200px] md:min-w-[280px] snap-start">
                    <MovieCard data={item} />
                  </div>
                ))}
             </ScrollContainer>
          </section>
        )}

        {/* KIDS & FAMILY */}
        {kidsFamily.length > 0 && (
          <section>
             <SectionHeader title="Kids & Family" />
             <ScrollContainer>
                {kidsFamily.map((item) => (
                  <div key={item.id} className="flex-none min-w-[200px] md:min-w-[280px] snap-start">
                    <MovieCard data={item} />
                  </div>
                ))}
             </ScrollContainer>
          </section>
        )}

        {/* BENTO GRID */}
        {bentoGrid.length > 0 && (
          <section>
            <SectionHeader title="Curated Collections" />
            <div className="px-6 md:px-12 max-w-[1400px] mx-auto">
               <BentoGrid items={bentoGrid} />
            </div>
          </section>
        )}

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