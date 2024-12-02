/* eslint-disable no-underscore-dangle */
import { Alert, Icon, SPACING, TYPOGRAPHY, Z_SPACE } from '../reusable';
import React, { useEffect, useState } from 'react';
import { findAll } from 'highlight-words-core';
import { Link as GatsbyLink } from 'gatsby';
import HEADER_MEDIA_QUERIES from '../components/header/header-media-queries';
import Link from '../components/link';
import PropTypes from 'prop-types';
import useGoogleTagManager from '../hooks/use-google-tag-manager';

const lunr = require('lunr');

const cleanQueryStringForLunr = (str) => {
  let query = str;

  /*
   * Ignore quotation marks so they don't throw results -- LIBWEB-649
   * `""` => ``
   */
  query = query.replace(/['"]+/gu, '');

  return query;
};

export default function SiteSearch ({ label }) {
  const [query, setQuery] = useState('');
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);
  const [openResults, setOpenResults] = useState([]);

  useGoogleTagManager({
    eventName: 'siteSearch',
    value: query
  });

  useEffect(() => {
    // If the query changes, let results open again.
    if (!openResults) {
      setOpenResults(true);
    }

    if (!query || !window.__LUNR__) {
      setResults([]);
      return;
    }
    const lunrIndex = window.__LUNR__.en;

    try {
      const searchResults = lunrIndex.index.query((queryTerm) => {
        queryTerm.term(lunr.tokenizer(query), {
          boost: 3
        });
        queryTerm.term(lunr.tokenizer(query), {
          boost: 2,
          wildcard: lunr.Query.wildcard.TRAILING
        });
        if (query.length > 2) {
          queryTerm.term(lunr.tokenizer(query), {
            wildcard:
              // eslint-disable-next-line no-bitwise
              lunr.Query.wildcard.TRAILING | lunr.Query.wildcard.LEADING
          });
        }
      });

      setResults(
        searchResults.map(({ ref }) => {
          return {
            ...lunrIndex.store[ref],
            slug: ref.split(' /')[1]
          };
        })
      );

      setError(null);
    } catch (catchError) {
      if (catchError instanceof lunr.QueryParseError) {
        // eslint-disable-next-line id-length
        setError({ e: catchError, query });
      } else {
        // eslint-disable-next-line no-console
        console.warn('Site search error', catchError);
      }
    }
  }, [query]);

  const handleKeydown = (event) => {
    if (event.keyCode === 27) {
      // ESC key
      setOpenResults(false);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.addEventListener('keydown', handleKeydown);
    };
  });

  const handleChange = (event) => {
    return setQuery(cleanQueryStringForLunr(event.target.value));
  };
  return (
    <form
      css={{
        alignItems: 'center',
        display: 'flex',
        position: 'relative'
      }}
      onSubmit={(event) => {
        event.preventDefault();
        setOpenResults(true);
      }}
    >
      <Icon
        icon='search'
        size={20}
        data-site-search-icon
        css={{
          color: 'var(--color-neutral-300)',
          left: SPACING.XS,
          position: 'absolute'
        }}
      />
      <label
        css={{
          width: '100%'
        }}
      >
        <span className='visually-hidden'>
          <p>{label}.</p>
          <p>
            To access results, <KeyboardControlIntructions />.
          </p>
        </span>
        <input
          id='site-search-input'
          onChange={handleChange}
          placeholder={label}
          type='search'
          autoComplete='off'
          css={{
            '::placeholder': {
              color: 'var(--color-neutral-300)',
              opacity: 1
            },
            alignItems: 'center',
            appearance: 'textfield',
            background: 'none',
            border: `solid 1px var(--color-neutral-300)`,
            borderRadius: '2px',
            boxShadow: `inset 0 1px 4px rgba(0,0,0,0.1)`,
            boxSizing: 'border-box',
            fontFamily: 'inherit',
            fontSize: '1rem',
            padding: SPACING.XS,
            paddingLeft: `calc(18px + ${SPACING.S})`,
            width: '100%'
          }}
        />
      </label>

      <ResultsContainer
        results={results}
        query={query}
        error={error}
        openResults={openResults}
      />
    </form>
  );
}

SiteSearch.propTypes = {
  label: PropTypes.string
};

const ResultsSummary = ({ searching, noResults, resultCount }) => {
  if (noResults || !searching) {
    return null;
  }

  const resultText = `${resultCount} result${resultCount > 1 ? 's' : ''}`;

  return (
    <div className='visually-hidden' role='status'>
      <span>{resultText}</span>
    </div>
  );
};

ResultsSummary.propTypes = {
  noResults: PropTypes.bool,
  resultCount: PropTypes.number,
  searching: PropTypes.bool
};

const ResultsContainer = ({ results, query, error, openResults }) => {
  const searching = query.length > 0;
  const noResults = searching && results.length === 0;

  /*
   * Do not render results, if user just hit ESC.
   * This is reset when the query changes.
   */
  if (!openResults) {
    return null;
  }

  return (
    <React.Fragment>
      <ResultsSummary
        searching={searching}
        noResults={noResults}
        resultCount={results.length}
      />
      <ResultsList
        searching={searching}
        noResults={noResults}
        results={results}
        query={query}
        error={error}
      />
    </React.Fragment>
  );
};

ResultsContainer.propTypes = {
  error: PropTypes.bool,
  openResults: PropTypes.array,
  query: PropTypes.string,
  results: PropTypes.array
};

const ResultsList = ({ searching, noResults, results, query, error }) => {
  // If you're not searching, don't show anything.
  if (!searching) {
    return null;
  }

  if (noResults) {
    return (
      <Popover error={error}>
        <NoResults query={query} />
      </Popover>
    );
  }

  return (
    <Popover error={error}>
      <p
        css={{
          background: 'var(--color-blue-100)',
          borderBottom: `solid 1px var(--color-neutral-100)`,
          color: 'var(--color-neutral-300)',
          kbd: {
            background: 'white',
            border: `solid 1px var(--color-neutral-200)`,
            borderRadius: '4px',
            boxShadow: `0 1px 1px rgba(0, 0, 0, .2), 0 2px 0 0 rgba(255, 255, 255, .7) inset;`,
            display: 'inline-block',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            padding: `0 ${SPACING['2XS']}`
          },
          padding: `${SPACING.S} ${SPACING.L}`
        }}
        aria-hidden='true'
        data-site-search-keyboard-instructions
      >
        <KeyboardControlIntructions />
      </p>
      <ol>
        <li>
          <LibrarySearchScopeOption query={query} />
        </li>
        {results.slice(0, 100).map((result, index) => {
          return (
            <li
              key={index}
              value={result.title}
              css={{
                ':not(:last-child)': {
                  borderBottom: `solid 1px var(--color-neutral-100)`
                }
              }}
            >
              <GatsbyLink
                to={`/${result.slug}`}
                css={{
                  ':hover, :focus': {
                    '[data-title]': {
                      textDecoration: 'underline'
                    },
                    background: 'var(--color-teal-100)',
                    borderLeft: `solid 4px var(--color-teal-400)`,
                    outline: 'none',
                    paddingLeft: `calc(${SPACING.L} - 4px)`
                  },
                  display: 'block',
                  padding: `${SPACING.M} ${SPACING.L}`
                }}
                onClick={() => {
                  if (document.body.classList.contains('stop-scroll')) {
                    document.body.classList.remove('stop-scroll');
                  }
                }}
              >
                <ResultContent query={query} result={result} />
              </GatsbyLink>
            </li>
          );
        })}
      </ol>
    </Popover>
  );
};

ResultsList.propTypes = {
  error: PropTypes.string,
  noResults: PropTypes.bool,
  query: PropTypes.string,
  results: PropTypes.array,
  searching: PropTypes.bool
};

const KeyboardControlIntructions = () => {
  return (
    <React.Fragment>
      <kbd>tab</kbd>
      {' '}
      to navigate,
      <kbd>enter</kbd>
      {' '}
      to select,
      <kbd>esc</kbd>
      {' '}
      to
      dismiss
    </React.Fragment>
  );
};

const LibrarySearchScopeOption = ({ query }) => {
  return (
    <a
      href={`https://search.lib.umich.edu/everything?query=${query}&utm_source=lib-site-search`}
      css={{
        ':hover, :focus': {
          '[data-title]': {
            textDecoration: 'underline'
          },
          background: 'var(--color-teal-100)',
          borderLeft: `solid 4px var(--color-teal-400)`,
          outline: 'none',
          paddingLeft: `calc(${SPACING.L} - 4px)`
        },
        alignItems: 'center',
        borderBottom: `solid 1px var(--color-neutral-100)`,
        display: 'grid',
        gridGap: SPACING.S,
        gridTemplateColumns: 'auto 1fr auto',
        padding: `${SPACING.M} ${SPACING.L}`
      }}
    >
      <Icon
        icon='search'
        size={24}
        data-site-search-icon
        css={{
          color: 'var(--color-neutral-300)',
          left: SPACING.XS
        }}
      />
      <p
        data-title
        css={{
          ...TYPOGRAPHY.XS,
          mark: {
            background: `var(--color-maize-200)!important`,
            fontWeight: '700'
          },
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
      >
        <span className='visually-hidden'>Search: </span>
        {query}
      </p>
      <span
        css={{
          display: 'inline-block',
          ...TYPOGRAPHY['3XS'],
          background: 'var(--color-blue-100)',
          border: `solid 1px var(--color-neutral-100)`,
          borderRadius: '4px',
          padding: `0 ${SPACING['2XS']}`
        }}
      >
        Find materials
      </span>
    </a>
  );
};

LibrarySearchScopeOption.propTypes = {
  query: PropTypes.string
};

const ResultContent = ({ query, result }) => {
  return (
    <React.Fragment>
      <p>
        <span
          data-title
          css={{
            ...TYPOGRAPHY.XS,
            mark: {
              background: `var(--color-maize-200)!important`,
              fontWeight: '700'
            }
          }}
        >
          <HighlightText query={query} text={result.title} />
        </span>
        {result.tag && (
          <span
            css={{
              color: 'var(--color-neutral-300)',
              fontSize: '14px',
              fontWeight: 'bold',
              letterSpacing: '1.25px',
              marginLeft: SPACING.XS,
              textTransform: 'uppercase'
            }}
          >
            ● {result.tag}
          </span>
        )}
        {result.isNews && (
          <span
            css={{
              color: 'var(--color-neutral-300)',
              fontSize: '14px',
              fontWeight: 'bold',
              letterSpacing: '1.25px',
              marginLeft: SPACING.XS
            }}
          >
            ● NEWS
          </span>
        )}
      </p>
      {result.summary && (
        <p
          css={{
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
            color: 'var(--color-neutral-300)',
            display: '-webkit-box',
            mark: {
              background: 'none',
              fontWeight: '600'
            },
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          <HighlightText query={query} text={result.summary} />
        </p>
      )}
    </React.Fragment>
  );
};

ResultContent.propTypes = {
  query: PropTypes.string,
  result: PropTypes.object
};

/**
 * Renders the value as text but with spans wrapping the
 * matching and non-matching segments of text.
 */
const HighlightText = ({ query, text }) => {
  // Escape regexp special characters in `str`
  const escapeRegexp = (str) => {
    return String(str).replace(/(?:[.*+?=^!:${}()|[\]/\\])/gu, '\\$1');
  };

  const chunks = findAll({
    searchWords: escapeRegexp(query || '').split(/\s+/u),
    textToHighlight: text
  });

  const highlightedText = chunks.map((chunk, index) => {
    const { end, highlight, start } = chunk;
    const textChunk = text.substr(start, end - start);

    if (highlight) {
      return <mark key={`highlight-${index}`}>{textChunk}</mark>;
    }
    return <React.Fragment key={`text-${index}`}>{textChunk}</React.Fragment>;
  });

  return highlightedText;
};

const NoResults = ({ query }) => {
  return (
    <p
      css={{
        color: 'var(--color-neutral-300)',
        padding: SPACING.L
      }}
    >
      <span
        css={{
          color: 'var(--color-neutral-400)',
          display: 'block',
          ...TYPOGRAPHY.XS
        }}
      >
        No results found for:
        {' '}
        <span
          css={{
            fontWeight: '700'
          }}
        >
          {query}
        </span>
      </span>
      <span
        css={{
          display: 'block'
        }}
      >
        Try
        {' '}
        <Link to='https://search.lib.umich.edu/everything?utm_source=lib-site-search'>
          Library Search
        </Link>
        {' '}
        for books, articles, and more.
      </span>
    </p>
  );
};

NoResults.propTypes = {
  query: PropTypes.string
};

const Popover = ({ children, error }) => {
  return (
    <div
      css={{
        ...Z_SPACE['16'],
        background: 'white',
        border: `solid 1px var(--color-neutral-100)`,
        borderRadius: '2px',
        maxHeight: '70vh',
        overflow: 'hidden',
        overflowY: 'auto',
        position: 'absolute',
        right: 0,
        top: 'calc(44px + 0.25rem)',
        width: '100%',
        zIndex: '999',
        [HEADER_MEDIA_QUERIES.LARGESCREEN]: {
          width: 'calc(100% + 12rem)'
        }
      }}
    >
      <div
        css={{
          borderBottom: `solid 1px`,
          borderBottomColor: 'var(--color-neutral-100)'
        }}
      >
        {error && <Alert intent='error'>{error.error.message}</Alert>}
        {children}
      </div>
    </div>
  );
};

Popover.propTypes = {
  children: PropTypes.node,
  error: PropTypes.object
};
