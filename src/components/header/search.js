import React, { useState, useMemo, useEffect } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { SPACING, Icon, TextInput, Button } from '@umich-lib/core'
import VisuallyHidden from '@reach/visually-hidden'
import { Index } from 'elasticlunr'
import { useThrottle } from 'use-throttle'
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from '@reach/combobox'

export default function Search() {
  const [query, setQuery] = useState('')
  const results = useSearch(query)
  const handleChange = e => setQuery(e.target.value)

  return (
    <Combobox>
      <ComboboxInput aria-label="Search this site" onChange={handleChange} />
      {results && (
        <ComboboxPopover>
          <ComboboxList aria-label="Results">
            {results.slice(0, 10).map((result, index) => (
              <ComboboxOption key={index} value={result.title} />
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
