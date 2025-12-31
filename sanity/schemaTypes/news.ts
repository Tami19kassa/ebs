import { defineField, defineType } from 'sanity'

export const newsType = defineType({
  name: 'news',
  title: 'Newsroom',
  type: 'document',
  fields: [
    defineField({ name: 'headline', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'excerpt', type: 'text', rows: 2 }),
    defineField({ name: 'author', type: 'string' }),
    defineField({ name: 'publishedAt', type: 'datetime', initialValue: () => new Date().toISOString() }),
    defineField({ name: 'thumbnail', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'tag', type: 'string', title: 'Topic Tag' }),
  ],
})