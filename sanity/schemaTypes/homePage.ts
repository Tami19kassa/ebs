import { defineField, defineType } from 'sanity'

export const homePageType = defineType({
  name: 'homePage',
  title: 'Home Page Configuration',
  type: 'document',
  fields: [
    defineField({ name: 'tickerText', title: 'Breaking News Ticker', type: 'string' }),
    defineField({ name: 'heroMovie', title: 'Hero Section Feature', type: 'reference', to: [{ type: 'movie' }] }),
    
    // SECTION 1
    defineField({
      name: 'trendingList',
      title: '1. Trending Section',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'movie' }] }]
    }),

    // SECTION 2
    defineField({
      name: 'originalsList',
      title: '2. EBS Originals Section',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'movie' }] }]
    }),

    // SECTION 3 (NEW)
    defineField({
      name: 'newReleases',
      title: '3. New Releases Section',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'movie' }] }]
    }),

    // SECTION 4 (NEW)
    defineField({
      name: 'kidsFamily',
      title: '4. Kids & Family Section',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'movie' }] }]
    }),

    // SECTION 5
    defineField({
      name: 'curatedCollections',
      title: '5. Bento Grid Discovery',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'movie' }] }]
    }),

    defineField({
        name: 'liveSection',
        title: 'Live TV Section',
        type: 'object',
        fields: [
            defineField({ name: 'title', type: 'string' }),
            defineField({ name: 'description', type: 'string' }),
            defineField({ 
              name: 'coverImage', 
              type: 'image', 
              title: 'Live Section Background Image', // <--- THIS CONTROLS THE IMAGE
              options: { hotspot: true }
            }),
        ]
    })
  ],
})