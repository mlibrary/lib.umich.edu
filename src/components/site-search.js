import React, { useState, useEffect } from 'react'
import { StaticQuery, graphql, navigate, Link } from 'gatsby'
import { Index } from 'elasticlunr'
import {
  SPACING,
  Icon,
  Button,
  Z_SPACE,
  Margins,
  MEDIA_QUERIES,
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
    <StaticQuery
      query={graphql`
        query SiteSearchIndex {
          siteSearchIndex {
            index
          }
        }
      `}
      render={data => (
        <BrowserOnly>
          <SiteSearch siteIndex={data.siteSearchIndex.index} />
        </BrowserOnly>
      )}
    />
  )
}

function SiteSearch({ siteIndex }) {
  const [query, setQuery] = useState('')
  const results = useSearch(query, siteIndex)
  const [open, setOpen] = useState(false)
  const handleChange = e => setQuery(e.target.value)
  
  function handleSelect(term) {
    const page = results.find(r => r.title === term)
    navigate(page.slug)
  }

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
              ...TYPOGRAPHY['XS'],
              padding: `${SPACING['S']} ${SPACING['M']}`,
              boxShadow: 'none',
              border: 'none'
            }
          }
        }}
      >
        <Margins>
          <DialogContent>
            <Combobox onSelect={item => handleSelect(item)}>
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
                        background: COLORS.teal['400'],
                        color: 'white',
                        fontWeight: '700',
                        '[data-user-value]': {
                          background: 'transparent'
                        }
                      },
                      paddingBottom: SPACING['S']
                    }}
                  >
                    <Heading
                      level={2}
                      size="3XS"
                      css={{
                        padding: `${SPACING['M']} ${SPACING['M']}`,
                        paddingBottom: SPACING['XS'],
                        color: COLORS.neutral['300']
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
                          ...TYPOGRAPHY['XS'],
                          borderBottom: `solid 1px ${COLORS.neutral['100']}`,
                          '[data-user-value]': {
                            fontWeight: '700',
                            background: COLORS.maize['200']
                          },
                        }}
                      >
                        <Link to={result.slug} css={{
                          display: 'block',
                          padding: `${SPACING['S']} ${SPACING['M']}`,
                          paddingLeft: `${SPACING['M']}`,
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