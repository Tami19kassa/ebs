import { client, urlFor } from "@/sanity/client";
import { MediaItem, NewsItem } from "@/data/cms";

// --- TYPES ---
export interface HomePageData {
  tickerText: string;
  heroItem: MediaItem | null;
  trending: MediaItem[];
  originals: MediaItem[];
  newReleases: MediaItem[];
  kidsFamily: MediaItem[];
  bentoGrid: MediaItem[];
  // NEW: Automatic list
  recentLibrary: MediaItem[]; 
  liveSection: {
    title: string;
    description: string;
    coverImage: string;
  };
}

// --- MAPPERS ---
const mapSanityToMedia = (doc: any): MediaItem => {
  if (!doc) return {} as MediaItem;
  return {
    id: doc._id,
    title: doc.title || "Untitled",
    description: doc.description || "",
    type: doc.type || "movie",
    thumbnailUrl: doc.thumbnail ? urlFor(doc.thumbnail).width(600).url() : "",
    backdropUrl: doc.backdrop ? urlFor(doc.backdrop).width(1920).url() : undefined,
    videoUrl: doc.videoUrl || "",
    rating: doc.rating || "NR",
    year: doc.year || new Date().getFullYear(),
    duration: doc.duration || "",
    categories: doc.categories || [],
    slug: doc.slug,
    featured: !!doc.backdrop, 
  };
};

const mapSanityToNews = (doc: any): NewsItem => ({
  id: doc._id,
  headline: doc.headline || "No Headline",
  excerpt: doc.excerpt || "",
  author: doc.author || "Editorial Team",
  publishedAt: doc.publishedAt ? new Date(doc.publishedAt).toLocaleDateString() : "",
  thumbnailUrl: doc.thumbnail ? urlFor(doc.thumbnail).width(600).url() : "",
  tag: doc.tag || "General",
});

// --- API METHODS ---
export const cmsApi = {
  
  getHomePageData: async (): Promise<HomePageData> => {
    // Query 1: Your Manual Configuration (Hero, Trending, etc)
    const configQuery = `*[_type == "homePage"][0]{
      tickerText,
      heroMovie->,
      trendingList[]->,
      originalsList[]->,
      newReleases[]->,   
      kidsFamily[]->,    
      curatedCollections[]->,
      liveSection
    }`;

    // Query 2: AUTOMATIC "Recently Added" (Fetches last 20 movies)
    // We fetch everything needed to map it to MediaItem
    const recentQuery = `*[_type == "movie"] | order(_createdAt desc)[0...20]{
      _id, title, description, type, thumbnail, backdrop, videoUrl, rating, year, duration, categories, slug
    }`;

    // Run both queries in parallel for speed
    const [configData, recentData] = await Promise.all([
      client.fetch(configQuery, {}, { cache: 'no-store' }),
      client.fetch(recentQuery, {}, { cache: 'no-store' })
    ]);

    // Defaults
    const safeConfig = configData || {};

    return {
      tickerText: safeConfig.tickerText || "Welcome to EBS Premier+",
      heroItem: safeConfig.heroMovie ? mapSanityToMedia(safeConfig.heroMovie) : null,
      
      // Manual Lists
      trending: (safeConfig.trendingList || []).map(mapSanityToMedia),
      originals: (safeConfig.originalsList || []).map(mapSanityToMedia),
      newReleases: (safeConfig.newReleases || []).map(mapSanityToMedia),
      kidsFamily: (safeConfig.kidsFamily || []).map(mapSanityToMedia),
      bentoGrid: (safeConfig.curatedCollections || []).map(mapSanityToMedia),
      
      // Automatic List (The fix for your issue)
      recentLibrary: recentData.map(mapSanityToMedia),
      
      liveSection: {
        title: safeConfig.liveSection?.title || "EBS Live",
        description: safeConfig.liveSection?.description || "Watch Now",
        coverImage: safeConfig.liveSection?.coverImage 
          ? urlFor(safeConfig.liveSection.coverImage).width(1920).url() 
          : ""
      }
    };
  },

  // Update News to fetch 12 items instead of 3
  getNews: async (): Promise<NewsItem[]> => {
    const query = `*[_type == "news"] | order(publishedAt desc)[0...11]`;
    const data = await client.fetch(query, {}, { cache: 'no-store' });
    return data.map(mapSanityToNews);
  },

  searchContent: async (term: string): Promise<MediaItem[]> => {
    const query = `*[_type == "movie" && title match "${term}*"]`;
    const data = await client.fetch(query, {}, { cache: 'no-store' });
    return data.map(mapSanityToMedia);
  },

  getContentById: async (id: string): Promise<MediaItem | null> => {
    const query = `*[_type == "movie" && _id == $id][0]`;
    const data = await client.fetch(query, { id }, { cache: 'no-store' });
    return data ? mapSanityToMedia(data) : null;
  },
};