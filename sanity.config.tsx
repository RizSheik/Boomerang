'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...tool]]/page.tsx` route
 */

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import {apiVersion, dataset, projectId} from './sanity/env'
import {schema} from './sanity/schemaTypes'
import {structure} from './sanity/structure'
import React from 'react'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema,
  plugins: [
    structureTool({structure}),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({defaultApiVersion: apiVersion}),
  ],
  studio: {
    components: {
      // Custom Studio navbar (header)
      navbar: function StudioNavbar() {
        return (
          <div className="w-full flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-[#0f2740]">
            <a
              href="/"
              className="flex items-center gap-2 transition"
              style={{textDecoration: 'none'}}
              onMouseEnter={(e) => {
                (e.currentTarget.querySelector('span') as HTMLSpanElement).style.color = '#1ee6ff'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget.querySelector('span') as HTMLSpanElement).style.color = '#e5f3ff'
              }}
            >
              <img src="/favicon.ico" alt="Logo" width={24} height={24} />
              <span style={{fontWeight: 800, color: '#e5f3ff', letterSpacing: 1}}>Boomerang Studio</span>
            </a>
            <a
              href="/"
              className="transition"
              style={{
                padding: '6px 12px',
                border: '1px solid rgba(229,231,235,0.5)',
                borderRadius: 6,
                fontWeight: 700,
                color: '#e5f3ff',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#163352'
                e.currentTarget.style.color = '#1ee6ff'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = '#e5f3ff'
              }}
            >
              Home
            </a>
          </div>
        )
      },
    },
  },
})
