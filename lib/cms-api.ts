import { client, urlFor } from "@/sanity/client";
import { MediaItem, NewsItem } from "@/data/cms";

// --- TYPES ---
// These match the fields we defined in Sanity Schema
export interface HomePageData {
  tickerText: string;
  heroItem: MediaItem | null;
  trending: MediaItem[];
  originals: MediaItem[];
  newReleases: MediaItem[]; // Added
  kidsFamily: MediaItem[];  // Added
  bentoGrid: MediaItem[];
  liveSection: {
    title: string;
    description: string;
    coverImage: string;
  };
}

// --- MAPPERS ---
// Converts raw Sanity JSON into our clean App Interfaces

const mapSanityToMedia = (doc: any): MediaItem => {
  if (!doc) return {} as MediaItem; // Safety check
  
  return {
    id: doc._id,
    title: doc.title || "Untitled",
    description: doc.description || "",
    type: doc.type || "movie",
    
    // Images: Convert Sanity Image Object -> URL String
    thumbnailUrl: doc.thumbnail ? urlFor(doc.thumbnail).width(600).url() : "",
    backdropUrl: doc.backdrop ? urlFor(doc.backdrop).width(1920).url() : undefined, // High-res for Hero/Player
    
    videoUrl: doc.videoUrl || "",
    rating: doc.rating || "NR",
    year: doc.year || new Date().getFullYear(),
    duration: doc.duration || "",
    categories: doc.categories || [],
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
  
  // 1. Fetch the Master Homepage Configuration
  getHomePageData: async (): Promise<HomePageData> => {
    // GROQ Query: Fetches the Singleton 'homePage' and expands all the references (->)
    const query = `*[_type == "homePage"][0]{
      tickerText,
      heroMovie->,
      trendingList[]->,
      originalsList[]->,
      newReleases[]->,   
      kidsFamily[]->,    
      curatedCollections[]->,
      liveSection
    }`;

    // { cache: 'no-store' } forces Next.js to fetch fresh data on every reload
    const data = await client.fetch(query, {}, { cache: 'no-store' });

    // Fallbacks to prevent crashes if Sanity is empty
    if (!data) return {
      tickerText: "Welcome to EBS Premier+",
      heroItem: null,
      trending: [],
      originals: [],
      newReleases: [],
      kidsFamily: [],
      bentoGrid: [],
      liveSection: { title: "Live TV", description: "Stream Offline", coverImage: "" }
    };

    return {
      tickerText: data.tickerText || "",
      heroItem: data.heroMovie ? mapSanityToMedia(data.heroMovie) : null,
      
      // Map all lists (safely handle nulls with || [])
      trending: (data.trendingList || []).map(mapSanityToMedia),
      originals: (data.originalsList || []).map(mapSanityToMedia),
      newReleases: (data.newReleases || []).map(mapSanityToMedia),
      kidsFamily: (data.kidsFamily || []).map(mapSanityToMedia),
      bentoGrid: (data.curatedCollections || []).map(mapSanityToMedia),
      
      liveSection: {
        title: data.liveSection?.title || "EBS Live",
        description: data.liveSection?.description || "Watch Now",
        // Process the Live Section Background Image
        coverImage: data.liveSection?.coverImage 
          ? urlFor(data.liveSection.coverImage).width(1920).quality(80).url() 
          : ""
      }
    };
  },

  // 2. Fetch Latest News
  getNews: async (): Promise<NewsItem[]> => {
    const query = `*[_type == "news"] | order(publishedAt desc)[0...3]`;
    const data = await client.fetch(query, {}, { cache: 'no-store' });
    return data.map(mapSanityToNews);
  },

  // 3. Search Functionality (Used by Search Overlay)
  searchContent: async (term: string): Promise<MediaItem[]> => {
    // Matches title matching the term (case insensitive wildcard)
    const query = `*[_type == "movie" && title match "${term}*"]`;
    const data = await client.fetch(query, {}, { cache: 'no-store' });
    return data.map(mapSanityToMedia);
  },

  // 4. Single Movie Fetch (Used by Watch Page)
  getContentById: async (id: string): Promise<MediaItem | null> => {
    const query = `*[_type == "movie" && _id == $id][0]`;
    const data = await client.fetch(query, { id }, { cache: 'no-store' });
    return data ? mapSanityToMedia(data) : null;
  },
};