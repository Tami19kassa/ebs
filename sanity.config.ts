"use client";

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure' // Ensure this import is correct for your version
import { apiVersion, dataset, projectId } from './sanity/env'
import { schema } from './sanity/schemaTypes'

// Define the custom structure
const myStructure = (S: any) =>
  S.list()
    .title('EBS Premier+ Management')
    .items([
      // Singleton: Home Page
      S.listItem()
        .title('Home Page Config')
        .child(
          S.document()
            .schemaType('homePage')
            .documentId('homePage') // Fixed ID ensures only one exists
        ),
      S.divider(),
      // Standard Documents: Movies and News
      S.documentTypeListItem('movie').title('Movies & Series'),
      S.documentTypeListItem('news').title('News Articles'),
    ])

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({
      structure: myStructure,
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
})