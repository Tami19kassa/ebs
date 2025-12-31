import { defineField, defineType } from 'sanity'

export const movieType = defineType({
  name: 'movie',
  title: 'Content Library',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: Rule => Rule.required() }),
    defineField({ 
      name: 'slug', 
      type: 'slug', 
      options: { source: 'title', maxLength: 96 },
      validation: Rule => Rule.required()
    }),
    defineField({ name: 'description', type: 'text', rows: 3 }),
    defineField({
      name: 'type',
      type: 'string',
      options: { list: ['movie', 'series', 'live'] },
      initialValue: 'movie'
    }),
    defineField({ 
      name: 'thumbnail', 
      title: 'Poster / Thumbnail',
      type: 'image', 
      options: { hotspot: true } 
    }),
    defineField({ 
      name: 'backdrop', 
      title: 'Cinematic Backdrop (Hero Image)',
      type: 'image', 
      options: { hotspot: true } 
    }),
    defineField({ name: 'videoUrl', title: 'Stream URL (.m3u8)', type: 'url' }),
    defineField({ name: 'rating', type: 'string', title: 'Age Rating' }), 
    defineField({ name: 'year', type: 'number' }),
    defineField({ name: 'duration', type: 'string' }),
    defineField({ 
      name: 'categories', 
      type: 'array', 
      of: [{ type: 'string' }],
      options: { list: ['Drama', 'Sci-Fi', 'Documentary', 'Action', 'Comedy', 'News'] }
    }),
    defineField({ name: 'isOriginal', title: 'EBS Original?', type: 'boolean', initialValue: false }),
  ],
  preview: {
    select: { title: 'title', media: 'thumbnail', subtitle: 'type' }
  }
})