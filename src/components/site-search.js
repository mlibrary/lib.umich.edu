import React, { useState, useMemo, useEffect } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { Index } from 'elasticlunr'
import {
  SPACING,
  Icon,
  TextInput,
  Button,
  Z_SPACE,
  Margins,
  MEDIA_QUERIES,
  COLORS,
  Heading
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

function BrowserOnly({ children }) {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    if (!hydrated) {
      setHydrated(true)
    }
  }, [hydrated])

  if (!hydrated) {
    return null
  }

  return children
}

export default function SiteSearchWrapper() {
  return (
    <BrowserOnly>
      <SiteSearch />
    </BrowserOnly>
  )
}

function SiteSearch() {
  const [query, setQuery] = useState('')
  const results = useSearch(query)
  const [open, setOpen] = useState(false)
  const handleChange = e => setQuery(e.target.value)

  return (
    <React.Fragment>
      <div
        role="search"
        aria-label="Sitewide"
      >
        <Button
          type="submit"
          kind="primary"
          onClick={() => setOpen(true)}
        >
          <span css={{
            height: '100%'
          }}>
            <Icon icon="search" size={20} />
          </span>
          <VisuallyHidden>Search this site</VisuallyHidden>
        </Button>
      </div>
      <DialogOverlay
        isOpen={open}
        onDismiss={() => setOpen(false)}
        css={{
          '[data-reach-dialog-content]': {
            borderRadius: '2px',
            width: '100%',
            ...Z_SPACE[16],
            [MEDIA_QUERIES.LARGESCREEN]: {
              maxWidth: '80%'
            },
            padding: '0',
            'input': {
              padding: `${SPACING['S']} ${SPACING['M']}`,
              fontSize: '1.2rem',
              boxShadow: 'none',
              border: 'none'
            }
          }
        }}
      >
        <Margins>
          <DialogContent>
            <Combobox onSelect={item => console.log('item selected', item)}>
              <div css={{
                display: 'flex',
                alignItems: 'center',
                padding: SPACING['S'],
              }}>
                <span css={{
                  height: '100%',
                  padding: `${SPACING['S']} ${SPACING['M']}`
                }}>
                  <Icon icon="search" size={24} />
                </span>
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
                    width: '100%',
                    appearance: 'textfield',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                  }}
                  type="search"
                  autoComplete="off"
                  autocomplete={false}
                />
                <Button
                  type="submit"
                  kind="subtle"
                  onClick={() => setOpen(false)}
                  css={{
                    padding: `${SPACING['S']} ${SPACING['M']}`,
                    marginLeft: SPACING['S'],
                  }}
                >
                  <Icon icon="close" size={24} />
                  <VisuallyHidden>Close</VisuallyHidden>
                </Button>
              </div>
              {results && (
                <ComboboxPopover portal={false}>
                  <ComboboxList
                    aria-label="Results"
                    css={{
                      borderTop: `solid 2px ${COLORS.neutral['100']}`,
                      '[aria-selected="true"]': {
                        background: COLORS.blue['100'],
                        borderLeftColor: COLORS.teal['400']
                      },
                      paddingBottom: SPACING['S']
                    }}
                  >
                    <Heading
                      level={2}
                      size="3XS"
                      css={{
                        padding: `${SPACING['M']} ${SPACING['M']}`,
                        paddingBottom: SPACING['XS']
                      }}
                    >Results</Heading>
                    {results.length === 0 && (
                      <p css={{
                        padding: `${SPACING['S']} ${SPACING['M']}`,
                      }}>No results match your search.</p>
                    )}
                    {results.slice(0, 10).map((result, index) => (
                      <ComboboxOption
                        key={index}
                        value={result.title}
                        css={{
                          padding: `${SPACING['S']} ${SPACING['M']}`,
                          paddingLeft: `calc(${SPACING['M']} - 4px)`,
                          borderBottom: `solid 1px ${COLORS.neutral['100']}`,
                          borderLeft: `solid 4px`,
                          borderLeftColor: 'transparent',
                          '[data-user-value]': {
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
          </DialogContent>
        </Margins>
      </DialogOverlay>
    </React.Fragment>
  )
}

let searchIndex

function getOrCreateIndex(siteIndex) {
  if (searchIndex) {
    return searchIndex
  } else {
    searchIndex = Index.load(siteIndex)
    return searchIndex
  }
}

function useSearch(query) {
  const siteIndex = useIndex()
  const index = getOrCreateIndex(siteIndex)

  return useMemo(() => {
    if (query.trim() === '') {
      return null
    } else {
      return index
        .search(query, { expand: true })
        .map(({ ref }) => index.documentStore.getDoc(ref))
    }
  }, [query])
}

const useIndex = () => {
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