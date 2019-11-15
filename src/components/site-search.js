import React, { useState } from 'react'
import { StaticQuery, graphql, navigate, Link } from 'gatsby'
import { Index } from 'elasticlunr'
import {
  SPACING,
  Icon,
  Button,
  Z_SPACE,
  Margins,
  COLORS,
  Heading,
  TYPOGRAPHY
} from '@umich-lib/core'
import VisuallyHidden from '@reach/visually-hidden'
import { DialogOverlay, DialogContent } from "@reach/dialog"
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
  ComboboxOptionText,
} from '@reach/combobox'
import "@reach/dialog/styles.css"

import getTransitionCSS from '../utils/transition'

export default function SiteSearchWrapper() {
  return (
    <StaticQuery
      query={graphql`
        query SiteSearchIndex {
          siteSearchIndex {
            index
          }
        }
      `}
      render={data => (
        <SiteSearch siteIndex={data.siteSearchIndex.index} />
      )}
    />
  )
}

let searchIndex

function SiteSearch({ siteIndex }) {
  const [query, setQuery] = useState('')
  const results = useSearch(query, siteIndex)
  const handleChange = e => setQuery(e.target.value)
  
  function handleSelect(term) {
    const page = results.find(r => r.title === term)
    navigate(page.slug)
  }

  return (
    <Combobox onSelect={item => handleSelect(item)}>
      <div role="search" aria-label="Search this site" css={{
        display: 'flex',
        alignItems: 'center',
      }}>
        <ComboboxInput
          aria-label="Search this site"
          onChange={handleChange}
          placeholder="Search this site"
          css={{
            fontSize: '1rem',
            border: 'solid 1px rgba(0,0,0,0.5)',
            boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.1)',
            borderRadius: '4px',
            padding: `${SPACING['XS']} ${SPACING['S']}`,
            width: '100%',
            appearance: 'textfield',
            fontFamily: 'inherit',
            boxSizing: 'border-box',
          }}
          type="search"
          autoComplete="off"
        />
      </div>
      {results && (
        <ComboboxPopover portal={false} css={{
          position: 'relative',
        }}>
          <ComboboxList
            persistSelection
            aria-label="Results"
            css={{
              position: 'absolute',
              top: '0',
              zIndex: '999',
              width: '100%',
              background: 'white',
              ...Z_SPACE['16'],
              '[aria-selected="true"]': {
                background: COLORS.teal['400'],
                color: 'white',
                fontWeight: '700',
                '[data-user-value]': {
                  background: 'transparent'
                }
              },
              '[data-reach-combobox-option]:not(:last-of-type)': {
                borderBottom: `solid 1px ${COLORS.neutral['100']}`,
              }
            }}
          >
            {results.length === 0 && (
              <p css={{
                padding: SPACING['S'],
                color: COLORS.neutral['300']
              }}>No results found.</p>
            )}
            {results.slice(0, 10).map((result, index) => (
              <ComboboxOption
                key={index}
                value={result.title}
                css={{
                  '[data-user-value]': {
                    fontWeight: '700',
                    background: COLORS.maize['200']
                  },
                }}
              >
                <Link to={result.slug} css={{
                  display: 'block',
                  padding: SPACING['S'],
                  ":hover": {
                    textDecoration: 'underline'
                  }
                }}><ComboboxOptionText /></Link>
              </ComboboxOption>
            ))}
          </ComboboxList>
        </ComboboxPopover>
      )}
    </Combobox>
  )
}

function getOrCreateIndex(siteIndex) {
  if (searchIndex) {
    return searchIndex
  } else {
    searchIndex = Index.load(siteIndex)
    return searchIndex
  }
}

function useSearch(query, siteIndex) {
  const index = getOrCreateIndex(siteIndex)

  if (query.trim() === '') {
    return null
  } else {
    return index
      .search(query, { expand: true })
      .map(({ ref }) => index.documentStore.getDoc(ref))
  }
}