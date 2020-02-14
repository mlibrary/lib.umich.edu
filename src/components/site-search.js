import React, { useState, useEffect } from 'react'
import { navigate, Link as GatsbyLink } from 'gatsby'
import {
  SPACING,
  Z_SPACE,
  COLORS,
  Icon,
  Alert,
  TYPOGRAPHY,
} from '@umich-lib/core'
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
  ComboboxOptionText,
} from '@reach/combobox'
import '@reach/dialog/styles.css'
import Link from '../components/link'
import HEADER_MEDIA_QUERIES from '../components/header/header-media-queries'

const lunr = require('lunr')

export default function SiteSearch({ label }) {
  const [query, setQuery] = useState('')
  const [error, setError] = useState(null)
  const [results, setResults] = useState([])

  useEffect(() => {
    if (!query || !window.__LUNR__) {
      setResults([])
      return
    }
    const lunrIndex = window.__LUNR__['en']

    try {
      const searchResults = lunrIndex.index.query(q => {
        q.term(lunr.tokenizer(query), {
          boost: 3,
        })
        q.term(lunr.tokenizer(query), {
          boost: 2,
          wildcard: lunr.Query.wildcard.TRAILING,
        })
        if (query.length > 2) {
          q.term(lunr.tokenizer(query), {
            wildcard:
              lunr.Query.wildcard.TRAILING | lunr.Query.wildcard.LEADING,
          })
        }
      })

      setResults(
        searchResults.map(({ ref }) => {
          return {
            ...lunrIndex.store[ref],
            slug: ref.split(' /')[1],
          }
        })
      )

      setError(null)
    } catch (e) {
      if (e instanceof lunr.QueryParseError) {
        setError({ query: query, error: e })
        return
      } else {
        console.log('Site search error', e)
      }
    }
  }, [query])

  const handleChange = e => setQuery(e.target.value)

  function handleSelect(term) {
    const page = results.find(r => r.title === term)
    navigate(page.slug)
  }

  return (
    <Combobox onSelect={item => handleSelect(item)}>
      <div
        role="search"
        aria-label={label}
        css={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Icon
          icon="search"
          size={20}
          data-site-search-icon
          css={{
            position: 'absolute',
            left: SPACING['XS'],
            color: COLORS.neutral['300'],
          }}
        />
        <ComboboxInput
          aria-label={label}
          onChange={handleChange}
          placeholder={label}
          type="search"
          autoComplete="off"
          autocomplete={false}
          css={{
            fontSize: '1rem',
            appearance: 'textfield',
            fontFamily: 'inherit',
            boxSizing: 'border-box',
            width: '100%',
            background: 'none',
            borderRadius: '2px',
            padding: SPACING['XS'],
            paddingLeft: `calc(18px + ${SPACING['S']})`,
            border: `solid 1px ${COLORS.neutral['300']}`,
            alignItems: 'center',
            boxShadow: `inset 0 1px 4px rgba(0,0,0,0.1)`,
            '::placeholder': {
              color: COLORS.neutral['300'],
              opacity: 1,
            },
          }}
        />
        <ComboboxPopover>
          {results && (
            <div
              data-site-search-popover-container
              css={{
                position: 'absolute',
                top: '0.25rem',
                right: 0,
                background: 'white',
                zIndex: '999',
                width: '100%',
                ...Z_SPACE['16'],
                maxHeight: '70vh',
                overflow: 'hidden',
                overflowY: 'auto',
                border: `solid 1px ${COLORS.neutral['100']}`,
                borderRadius: '2px',
                [HEADER_MEDIA_QUERIES.LARGESCREEN]: {
                  width: 'calc(100% + 12rem)',
                },
              }}
            >
              <div
                css={{
                  borderBottom: `solid 1px`,
                  borderBottomColor: COLORS.neutral['100'],
                }}
              >
                {error ? (
                  <Alert intent="error">{error.error.message}</Alert>
                ) : results.length === 0 ? (
                  <p
                    css={{
                      padding: SPACING['L'],
                      color: COLORS.neutral['300'],
                    }}
                  >
                    <span
                      css={{
                        display: 'block',
                        color: COLORS.neutral['400'],
                        ...TYPOGRAPHY['XS'],
                      }}
                    >
                      No results found for:{' '}
                      <span
                        css={{
                          fontWeight: '700',
                        }}
                      >
                        {query}
                      </span>
                    </span>
                    <span
                      css={{
                        display: 'block',
                      }}
                    >
                      Try{' '}
                      <Link to="https://search.lib.umich.edu/">
                        Library Search
                      </Link>{' '}
                      for books, articles, and more.
                    </span>
                  </p>
                ) : (
                  <p
                    css={{
                      padding: `${SPACING['S']} ${SPACING['L']}`,
                      color: COLORS.neutral['300'],
                      background: COLORS.blue['100'],
                    }}
                  >
                    ↑↓ to navigate, enter to select, esc to dismiss
                  </p>
                )}
              </div>
              <ComboboxList
                persistSelection
                aria-label="Results"
                css={{
                  '[aria-selected="true"] a': {
                    background: COLORS.teal['100'],
                    borderLeft: `solid 4px ${COLORS.teal['400']}`,
                    paddingLeft: `calc(${SPACING['L']} - 4px)`,
                  },
                  '[data-reach-combobox-option]:not(:last-of-type)': {
                    borderBottom: `solid 1px ${COLORS.neutral['100']}`,
                  },
                }}
              >
                {results.slice(0, 10).map((result, index) => (
                  <ComboboxOption
                    key={index}
                    value={result.title}
                    css={{
                      '[data-user-value]': {
                        fontWeight: '700',
                        background: COLORS.maize['200'],
                      },
                    }}
                  >
                    <GatsbyLink
                      to={result.slug}
                      css={{
                        display: 'block',
                        padding: `${SPACING['M']} ${SPACING['L']}`,
                        ':hover [data-title]': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      <p
                        data-title
                        css={{
                          ...TYPOGRAPHY['XS'],
                        }}
                      >
                        <ComboboxOptionText />
                      </p>
                      {result.summary && (
                        <p
                          css={{
                            display: '-webkit-box',
                            color: COLORS.neutral['300'],
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            '-webkit-line-clamp': '2',
                            '-webkit-box-orient': 'vertical',
                          }}
                        >
                          {result.summary}
                        </p>
                      )}
                    </GatsbyLink>
                  </ComboboxOption>
                ))}
              </ComboboxList>
            </div>
          )}
        </ComboboxPopover>
      </div>
    </Combobox>
  )
}
