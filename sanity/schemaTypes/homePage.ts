import { defineField, defineType } from 'sanity'

export const homePageType = defineType({
  name: 'homePage',
  title: 'Home Page Configuration',
  type: 'document',
  fields: [
    defineField({
      name: 'tickerText',
      title: 'Breaking News Ticker (Red Bar)',
      type: 'string',
      description: 'Text displayed in the top red bar.'
    }),
    defineField({
      name: 'heroMovie',
      title: 'Hero Section Feature',
      type: 'reference',
      to: [{ type: 'movie' }],
      description: 'Select the movie/show to display at the very top.'
    }),
    defineField({
      name: 'trendingList',
      title: 'Trending Section',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'movie' }] }],
      description: 'Manually curate the Trending list.'
    }),
    defineField({
      name: 'originalsList',
      title: 'EBS Originals Section',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'movie' }] }]
    }),
    defineField({
      name: 'curatedCollections',
      title: 'Bento Grid Discovery',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'movie' }] }],
      validation: Rule => Rule.max(5).warning('Best visual results with 4-5 items.')
    }),
    defineField({
        name: 'liveSection',
        title: 'Live TV Section Info',
        type: 'object',
        fields: [
            defineField({ name: 'title', type: 'string' }),
            defineField({ name: 'description', type: 'string' }),
            defineField({ name: 'coverImage', type: 'image' }),
        ]
    })
  ],
})