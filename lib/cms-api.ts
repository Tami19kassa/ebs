import { client, urlFor } from "@/sanity/client";
import { MediaItem, NewsItem } from "@/data/cms";

// --- TYPES ---
export interface HomePageData {
  tickerText: string;
  heroItem: MediaItem | null;
  trending: MediaItem[];
  originals: MediaItem[];
  bentoGrid: MediaItem[];
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
    videoUrl: doc.videoUrl || "",
    rating: doc.rating || "NR",
    year: doc.year || new Date().getFullYear(),
    duration: doc.duration || "",
    categories: doc.categories || [],
    featured: !!doc.backdrop,
    // Add backdropUrl if it exists
    ...((doc.backdrop) && { backdropUrl: urlFor(doc.backdrop).width(1920).url() })
  } as MediaItem & { backdropUrl?: string };
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
  // 1. Fetch Singleton Homepage
  getHomePageData: async (): Promise<HomePageData> => {
    const query = `*[_type == "homePage"][0]{
      tickerText,
      heroMovie->,
      trendingList[]->,
      originalsList[]->,
      curatedCollections[]->,
      liveSection
    }`;

    const data = await client.fetch(query);

    if (!data) return {
      tickerText: "Welcome to EBS Premier+",
      heroItem: null,
      trending: [],
      originals: [],
      bentoGrid: [],
      liveSection: { title: "Live TV", description: "Stream Offline", coverImage: "" }
    };

    return {
      tickerText: data.tickerText || "",
      heroItem: data.heroMovie ? mapSanityToMedia(data.heroMovie) : null,
      trending: (data.trendingList || []).map(mapSanityToMedia),
      originals: (data.originalsList || []).map(mapSanityToMedia),
      bentoGrid: (data.curatedCollections || []).map(mapSanityToMedia),
      liveSection: {
        title: data.liveSection?.title || "EBS Live",
        description: data.liveSection?.description || "Watch Now",
        coverImage: data.liveSection?.coverImage ? urlFor(data.liveSection.coverImage).url() : ""
      }
    };
  },

  // 2. Fetch News
  getNews: async (): Promise<NewsItem[]> => {
    const query = `*[_type == "news"] | order(publishedAt desc)[0...3]`;
    const data = await client.fetch(query);
    return data.map(mapSanityToNews);
  },

  // 3. Search Content (THIS WAS MISSING)
  searchContent: async (term: string): Promise<MediaItem[]> => {
    // GROQ query: Find movies where title matches the term (case insensitive)
    // The asterisk (*) after the term acts as a wildcard
    const query = `*[_type == "movie" && title match "${term}*"]`;
    const data = await client.fetch(query);
    return data.map(mapSanityToMedia);
  }
};