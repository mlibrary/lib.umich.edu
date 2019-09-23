import React, { useState, useMemo, useEffect } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import {
  SPACING,
  Icon,
  TextInput,
  Button,
  Z_SPACE,
  COLORS,
} from '@umich-lib/core'
import VisuallyHidden from '@reach/visually-hidden'
import { Index } from 'elasticlunr'
import { useThrottle } from 'use-throttle'
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
  ComboboxOptionText,
} from '@reach/combobox'

export default function Search() {
  const [query, setQuery] = useState('')
  const results = useSearch(query)
  const handleChange = e => setQuery(e.target.value)

  return (
    <Combobox>
      <ComboboxInput
        aria-label="Search this site"
        onChange={handleChange}
        placeholder="Search this site"
        css={{
          fontSize: '1rem',
          margin: '0',
          border: 'solid 1px rgba(0,0,0,0.5)',
          boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.1)',
          borderRadius: '4px',
          padding: '0.5rem 0.75rem',
          width: '18rem',
          appearance: 'textfield',
          fontFamily: 'inherit',
          boxSizing: 'border-box',
        }}
        type="search"
        autocomplete="off"
      />
      {results && (
        <ComboboxPopover
          css={{
            background: 'white',
            border: `solid 1px ${COLORS.neutral['100']}`,
            ...Z_SPACE[16],
            zIndex: '1',
          }}
        >
          <ComboboxList aria-label="Results">
            {results.slice(0, 10).map((result, index) => (
              <ComboboxOption
                key={index}
                value={result.title}
                css={{
                  padding: `${SPACING['XS']} ${SPACING['M']}`,
                  borderBottom: `solid 1px ${COLORS.neutral['100']}`,
                  ['[data-user-value]']: {
                    fontWeight: '700',
                    background: COLORS.maize['200'],
                  },
                }}
              >
                <ComboboxOptionText />
              </ComboboxOption>
            ))}
          </ComboboxList>
        </ComboboxPopover>
      )}
    </Combobox>
  )
}

let index

function getOrCreateIndex() {
  const siteIndex = useIndex()

  if (index) {
    return index
  } else {
    index = Index.load(siteIndex)
    return index
  }
}

function useSearch(query) {
  const index = getOrCreateIndex()
  const throttledQuery = useThrottle(query, 100)

  return useMemo(() => {
    if (query.trim() === '') {
      return null
    } else {
      return index
        .search(query, { expand: true })
        .map(({ ref }) => index.documentStore.getDoc(ref))
    }
  }, [throttledQuery])
}

export const useIndex = () => {
  const { siteSearchIndex } = useStaticQuery(
    graphql`
      query SearchIndexQuery {
        siteSearchIndex {
          index
        }
      }
    `
  )
  return siteSearchIndex.index
}
