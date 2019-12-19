import React, { useState, useEffect } from 'react'
import { navigate, Link } from 'gatsby'
import { SPACING, Z_SPACE, COLORS, Icon } from '@umich-lib/core'
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
  ComboboxOptionText,
} from '@reach/combobox'
import '@reach/dialog/styles.css'

export default function SiteSearch({ siteIndex }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  useEffect(() => {
    if (!query || !window.__LUNR__) {
      setResults([])
      return
    }
    const lunrIndex = window.__LUNR__['en']
    const searchResults = lunrIndex.index.search('*' + query + '*')

    setResults(
      searchResults.map(({ ref }) => {
        return lunrIndex.store[ref]
      })
    )
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
        aria-label="Search this site"
        css={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Icon
          icon="search"
          size={20}
          css={{
            position: 'absolute',
            left: SPACING['XS'],
            color: COLORS.neutral['300'],
          }}
        />
        <ComboboxInput
          aria-label="Search this site"
          onChange={handleChange}
          placeholder="Search this site"
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
            <ComboboxList
              persistSelection
              aria-label="Results"
              css={{
                position: 'absolute',
                top: '0',
                left: 0,
                zIndex: '999',
                width: '100%',
                background: 'white',
                ...Z_SPACE['16'],
                '[aria-selected="true"] a': {
                  background: COLORS.teal['100'],
                  borderLeft: `solid 4px ${COLORS.teal['400']}`,
                  paddingLeft: `calc(${SPACING['M']} - 4px)`,
                },
                '[data-reach-combobox-option]:not(:last-of-type)': {
                  borderBottom: `solid 1px ${COLORS.neutral['100']}`,
                },
              }}
            >
              <div
                css={{
                  borderBottom: `solid 1px`,
                  borderBottomColor: COLORS.neutral['100'],
                }}
              >
                {results.length === 0 ? (
                  <p
                    css={{
                      padding: `${SPACING['S']} ${SPACING['M']}`,
                      color: COLORS.neutral['300'],
                    }}
                  >
                    <span
                      css={{
                        display: 'block',
                        fontWeight: '600',
                        color: COLORS.neutral['400'],
                      }}
                    >
                      No results for "{query}".
                    </span>
                    <span
                      css={{
                        display: 'block',
                        fontSize: '0.875rem',
                        marginTop: SPACING['2XS'],
                      }}
                    >
                      Search tips: some terms require exact match. Try typing
                      the entire term, or use a different word or phrase.
                    </span>
                  </p>
                ) : (
                  <p
                    css={{
                      fontSize: '0.875rem',
                      padding: `${SPACING['S']} ${SPACING['M']}`,
                      color: COLORS.neutral['300'],
                      background: COLORS.blue['100'],
                    }}
                  >
                    ↑↓ to navigate, enter to select, esc to dismiss
                  </p>
                )}
              </div>
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
                  <Link
                    to={result.slug}
                    css={{
                      display: 'block',
                      padding: `${SPACING['S']} ${SPACING['M']}`,
                      ':hover [data-suggested-value]': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    <p>
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
                          fontSize: '0.875rem',
                          marginTop: SPACING['2XS'],
                        }}
                      >
                        {result.summary}
                      </p>
                    )}
                  </Link>
                </ComboboxOption>
              ))}
            </ComboboxList>
          )}
        </ComboboxPopover>
      </div>
    </Combobox>
  )
}
