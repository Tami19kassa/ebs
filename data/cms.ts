// data/cms.ts

export type ContentType = 'movie' | 'series' | 'live' | 'news';

export interface MediaItem {
  id: string;
  title: string;
  description: string;
  type: ContentType;
  thumbnailUrl: string;
  backdropUrl?: string; 
  videoUrl?: string;
  rating?: string;
  year?: number;
  duration?: string;
  categories: string[];
  featured?: boolean;
  slug?: { current: string };
}

export interface NewsItem {
  id: string;
  headline: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  thumbnailUrl: string;
  tag: string;
}

// --- MOCK DATA ---

export const NEWS_DATA: NewsItem[] = [
  {
    id: 'n-1',
    headline: 'EBS Launches 8K Streaming Studio in Addis Ababa',
    excerpt: 'Setting a new standard for African broadcasting, the new facility promises crystal clear visuals for all future productions.',
    author: 'Yared M.',
    publishedAt: '2 hours ago',
    thumbnailUrl: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&q=80',
    tag: 'Technology'
  },
  {
    id: 'n-2',
    headline: 'The Return of "Sunday Night Live" Breaks Viewership Records',
    excerpt: 'Over 15 million concurrent viewers tuned in for the season premiere, crashing servers momentarily.',
    author: 'Sarah A.',
    publishedAt: 'Yesterday',
    thumbnailUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e63?auto=format&fit=crop&q=80',
    tag: 'Entertainment'
  },
  {
    id: 'n-3',
    headline: 'Exclusive: Behind the Scenes of "Rift Valley Rangers"',
    excerpt: 'How the production team managed to film lions in the wild without disturbing the ecosystem.',
    author: 'Dawit K.',
    publishedAt: '3 days ago',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80',
    tag: 'Production'
  }
];

export const CMS_DATA: MediaItem[] = [
  // ... Keep existing items and ADD these ...
  {
    id: 'hero-1',
    title: 'ADDIS HORIZON',
    description: 'In a city blending ancient tradition and cyberpunk future, one architect holds the key to the skyline.',
    type: 'movie',
    thumbnailUrl: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&q=80',
    videoUrl: '/videos/mock.m3u8',
    rating: 'PG-13',
    year: 2025,
    duration: '2h 15m',
    categories: ['Sci-Fi', 'Drama'],
    featured: true,
  },
  {
    id: 'orig-1',
    title: 'The Blue Nile',
    description: 'A cinematic journey down the longest river in the world.',
    type: 'series',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?auto=format&fit=crop&q=80',
    categories: ['Originals', 'Nature'],
    year: 2024,
    duration: '45m',
    rating: 'TV-14'
  },
  {
    id: 'orig-2',
    title: 'Coffee & Jazz',
    description: 'Late night conversations with the jazz legends of Ethiopia.',
    type: 'series',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80',
    categories: ['Originals', 'Music'],
    year: 2023,
    duration: '1h',
    rating: 'TV-MA'
  },
  {
    id: 'mov-1',
    title: 'Urban Rhythm',
    description: 'Dance battles take over the streets.',
    type: 'movie',
    thumbnailUrl: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&q=80',
    categories: ['Drama', 'Youth'],
    year: 2024,
    duration: '1h 50m',
    rating: 'PG-13'
  },
  {
    id: 'mov-2',
    title: 'The Runner',
    description: 'A biopic of a marathon legend.',
    type: 'movie',
    thumbnailUrl: 'https://images.unsplash.com/photo-1552674605-5d28c4e1902c?auto=format&fit=crop&q=80',
    categories: ['Drama', 'Sports'],
    year: 2022,
    duration: '2h 10m',
    rating: 'PG'
  },
  {
    id: 'live-1',
    title: 'Morning Show Live',
    description: 'Start your day with current events.',
    type: 'live',
    thumbnailUrl: 'https://images.unsplash.com/photo-1495020686667-45e86d4e610d?auto=format&fit=crop&q=80',
    categories: ['News', 'Live'],
    duration: 'LIVE',
    rating: 'TV-G'
  }
];