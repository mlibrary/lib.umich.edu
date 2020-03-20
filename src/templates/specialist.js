import React, { useState, useEffect } from 'react'
import { graphql } from 'gatsby'
import {
  Heading,
  SPACING,
  Margins,
  TextInput,
  COLORS,
  Icon,
  Button,
  Alert,
  Text,
} from '@umich-lib/core'
import Img from 'gatsby-image'
import { useDebounce } from 'use-debounce'
import VisuallyHidden from '@reach/visually-hidden'
import PlainLink from '../components/plain-link'
import Breadcrumb from '../components/breadcrumb'
import MEDIA_QUERIES from '../maybe-design-system/media-queries'
import TemplateLayout from './template-layout'
import HTML from '../components/html'

const qs = require('qs')
const lunr = require('lunr')

export default function StaffDirectoryWrapper({ data, location, navigate }) {
  const node = data.page
  const { noResultsImage, allNodeDepartment, allStaff } = data

  const departments = allNodeDepartment.edges.reduce((acc, { node }) => {
    return {
      ...acc,
      [node.drupal_internal__nid]: node.title,
    }
  }, {})
  const staff = allStaff.edges.map(({ node }) => {
    return {
      ...node,
      department: departments[node.department_nid],
      division: departments[node.division_nid],
    }
  })

  return (
    <StaffDirectoryQueryContainer
      node={node}
      staff={staff}
      departments={departments}
      noResultsImage={noResultsImage}
      location={location}
      navigate={navigate}
    />
  )
}

function parseState(str) {
  return qs.parse(str, { ignoreQueryPrefix: true, format: 'RFC1738' })
}

function stringifyState(obj) {
  return qs.stringify(obj, { format: 'RFC1738' })
}

function getUrlState(search, keys) {
  const obj = parseState(search)
  // Build an obj with only the keys we care about
  // from the parsed URL state.
  const state = keys.reduce((memo, k) => {
    if (obj[k]) {
      memo = { [k]: obj[k], ...memo }
    }

    return memo
  }, {})

  return state
}

function StaffDirectoryQueryContainer({
  node,
  staff,
  departments,
  noResultsImage,
  location,
  navigate,
}) {
  const [urlState] = useState(
    getUrlState(location.search, ['query', 'category'])
  )
  const { body, fields, field_title_context } = node
  const [query, setQuery] = useState(urlState.query ? urlState.query : '')
  const [activeFilters, setActiveFilters] = useState(
    urlState.department ? { department: urlState.department } : {}
  )
  const [results, setResults] = useState([])
  const [stateString] = useDebounce(
    stringifyState({
      query: query.length > 0 ? query : undefined,
      department: activeFilters['department'],
    }),
    100
  )

  const image = noResultsImage

  useEffect(() => {
    navigate('?' + stateString, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateString])

  useEffect(() => {
    if (!window.__SDI__) {
      // create staff directory index if it does not exist
      window.__SDI__ = lunr(function() {
        this.ref('uniqname')
        this.field('name')
        this.field('uniqname')
        this.field('title')

        staff.forEach(function(person) {
          this.add(person)
        }, this)
      })
    }

    // Get the staff directory index
    const index = window.__SDI__

    try {
      const results = index
        .query(q => {
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
        .map(({ ref }) => {
          return staff.find(({ uniqname }) => uniqname === ref)
        })

      setResults(filterResults({ activeFilters, results }))
    } catch {
      return
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, activeFilters])

  function handleChange(e) {
    const { name, value } = e.target
    if (name === 'query') {
      setQuery(value)
      return
    }

    let activeFiltersCopy = { ...activeFilters }

    if (value.startsWith('All')) {
      delete activeFiltersCopy[name]
    } else {
      activeFiltersCopy = {
        ...activeFiltersCopy,
        [name]: value,
      }
    }

    setActiveFilters(activeFiltersCopy)
  }

  const filters = [
    {
      label: 'Department or division',
      name: 'department',
      options: ['All'].concat(
        Object.keys(departments)
          .map(d => departments[d])
          .sort()
      ),
    },
  ]

  function handleClear() {
    setQuery('')
    setActiveFilters({})
    setResults(staff)
  }

  return (
    <TemplateLayout node={node}>
      <Margins
        css={{
          marginBottom: SPACING['2XL'],
        }}
      >
        <Breadcrumb data={fields.breadcrumb} />
        <Heading
          size="3XL"
          level={1}
          css={{
            marginBottom: SPACING['XS'],
          }}
        >
          {field_title_context}
        </Heading>

        {body && (
          <div
            css={{
              marginBottom: SPACING['XL'],
            }}
          >
            <HTML html={body.processed} />{' '}
          </div>
        )}

        <StaffDirectory
          handleChange={handleChange}
          handleClear={handleClear}
          filters={filters}
          activeFilters={activeFilters}
          results={results}
          image={image}
          query={query}
        />
      </Margins>
    </TemplateLayout>
  )
}

const StaffDirectory = React.memo(function StaffDirectory({
  handleChange,
  handleClear,
  filters,
  results,
  image,
  query,
  activeFilters,
}) {
  const [show, setShow] = useState(20)
  const staffInView = results.slice(0, show)
  const resultsSummary = results.length
    ? `${results.length} results`
    : `No results`

  const showMoreText =
    show < results.length
      ? `Showing ${show} of ${results.length} results`
      : null

  function showMore() {
    setShow(results.length)
  }

  return (
    <React.Fragment>
      <div
        css={{
          display: 'grid',
          gridGap: SPACING['S'],
          [MEDIA_QUERIES['S']]: {
            gridTemplateColumns: `1fr auto auto`,
          },
          input: {
            lineHeight: '1.5',
            height: '40px',
          },
          marginBottom: SPACING['M'],
        }}
      >
        <TextInput
          id="search"
          labelText="Search by subject or specialty"
          name="query"
          value={query}
          onChange={e => {
            setShow(20)
            handleChange(e)
          }}
        />
        <Button
          css={{
            alignSelf: 'end',
          }}
        >
          Show Health Sciences only
        </Button>
        <Button
          kind="subtle"
          onClick={handleClear}
          css={{
            alignSelf: 'end',
          }}
        >
          Clear
        </Button>
      </div>

      {results.length > 0 && (
        <div
          tabIndex="0"
          css={{
            overflowX: 'auto',
          }}
          role="group"
          aria-labelledby="caption"
        >
          <table
            css={{
              width: '100%',
              minWidth: '840px',
              tableLayout: 'fixed',
              marginBottom: SPACING['XL'],
              'th, td': {
                padding: `${SPACING['S']} 0`,
                textAlign: 'left',
                borderBottom: `solid 1px ${COLORS.neutral['100']}`,
                verticalAlign: 'top',
              },
              'td:not(:last-of-type)': {
                paddingRight: SPACING['XL'],
              },
              th: {
                color: COLORS.neutral['300'],
              },
            }}
          >
            <caption
              id="caption"
              css={{
                textAlign: 'left',
              }}
            >
              <VisuallyHidden>
                <Alert>{resultsSummary}</Alert>
              </VisuallyHidden>

              <p
                css={{
                  '@media only screen and (min-width: 720px)': {
                    display: 'none',
                  },
                }}
              >
                (Scroll to see more)
              </p>
            </caption>
            <thead>
              <tr>
                <th>Subjects and specialties</th>
                <th colSpan="2">Contact</th>
                <th>Research guides</th>
              </tr>
            </thead>
            <tbody>
              {staffInView.map(({ uniqname, name, title, email, phone }) => (
                <tr key={uniqname}>
                  <td>[subjects and specialists]</td>
                  <td colSpan="2">
                    <div
                      css={{
                        display: 'flex',
                        alignItems: 'flex-start',
                      }}
                    >
                      <span>
                        <PlainLink
                          css={{
                            color: COLORS.teal['400'],
                            textDecoration: 'underline',
                            ':hover': {
                              textDecorationThickness: '2px',
                            },
                          }}
                          to={`/users/` + uniqname}
                        >
                          {name}
                        </PlainLink>
                        <span css={{ display: 'block' }}>{title}</span>
                      </span>
                    </div>
                  </td>
                  <td>[Research guides]</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showMoreText && (
        <>
          <p
            css={{
              marginBottom: SPACING['M'],
            }}
          >
            {showMoreText}
          </p>
          <Button onClick={showMore}>Show all</Button>
        </>
      )}

      {!results.length && <NoResults image={image} />}
    </React.Fragment>
  )
})

function NoResults({ image }) {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [hydrated])

  if (!hydrated) {
    return null
  }

  return (
    <div
      css={{
        [MEDIA_QUERIES['L']]: {
          display: 'grid',
          gridTemplateColumns: `2fr 3fr`,
          gridGap: SPACING['3XL'],
          alignItems: 'end',
        },
        marginBottom: SPACING['4XL'],
        marginTop: SPACING['2XL'],
      }}
    >
      <div
        css={{
          margin: 'auto 0',
        }}
      >
        <Heading size="L" level={2}>
          We couldn't find any results
        </Heading>
        <Text
          lede
          css={{
            marginTop: SPACING['XS'],
          }}
        >
          Consider searching with different keywords or using the department or
          division filter to browse.
        </Text>
      </div>

      <Img
        fluid={image.childImageSharp.fluid}
        alt=""
        css={{
          display: 'inline-block',
          maxWidth: '16rem',
          margin: '1rem auto',
          [MEDIA_QUERIES['L']]: {
            margin: '0',
            width: '100%',
            display: 'block',
            marginBottom: SPACING['L'],
          },
        }}
      />
    </div>
  )
}

function Select({ label, name, options, value, ...rest }) {
  return (
    <label>
      <span
        css={{
          display: 'block',
          marginBottom: SPACING['XS'],
        }}
      >
        {label}
      </span>
      <div
        css={{
          position: 'relative',
        }}
      >
        <select
          name={name}
          css={{
            // reset default <select> styles.
            display: 'block',
            width: '100%',
            appearance: 'none',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            boxShadow: 'none',
            background: 'transparent',
            backgroundImage: 'none',
            padding: `${SPACING['XS']} ${SPACING['XS']}`,
            paddingRight: `2rem`,
            border: `solid 1px ${COLORS.neutral['300']}`,
            borderRadius: '4px',
            lineHeight: '1.5',
            height: '40px',
          }}
          value={value ? value : 'All'}
          {...rest}
        >
          {options.map((opt, i) => (
            <option key={opt + i} id={name + opt} value={opt}>
              {opt}
            </option>
          ))}
          c
        </select>
        <Icon
          icon="expand_more"
          css={{
            position: 'absolute',
            right: SPACING['S'],
            bottom: SPACING['S'],
          }}
        />
      </div>
    </label>
  )
}

/*
  // Filter out results that do not
  // have a key/value that matches
  // all active filters.

  // Example of a result.
  {
    name: "Jon Earley",
    title: "User Interface Design Engineer",
    department: "Design and Discovery",
    division: "Library Information Technology"
  }

  // Example of active filters.
  {
    department: "Design and Discovery",
    division: "Library Information Technology"
  }
*/
function filterResults({ activeFilters, results }) {
  const filterKeys = Object.keys(activeFilters)

  // If no active filters, then just return all the results.
  if (filterKeys === 0) {
    return results
  }

  // Filter to results that have all active filters.
  return results.filter(result => {
    // Track how many filters apply to this result.
    let i = 0

    filterKeys.forEach(k => {
      // Oh but department is special.
      /*
        An active department filter must be searched for in 
        a user's "department" AND "division" field, since
        the those are actually the same from the data,
        but are displayed seperately and have their own fields
        on a user.
      */
      if (k === 'department') {
        if (
          result[k] === activeFilters[k] ||
          result['division'] === activeFilters[k]
        ) {
          i = i + 1
        }
      } else if (result[k] === activeFilters[k]) {
        i = i + 1
      }
    })

    return i === filterKeys.length
  })
}

export const query = graphql`
  query($slug: String!) {
    page: nodePage(fields: { slug: { eq: $slug } }) {
      ...pageFragment
    }
    allStaff(sort: { order: ASC, fields: name }) {
      edges {
        node {
          uniqname
          name
          title
          email
          phone
          department_nid
          division_nid
          image_mid
        }
      }
    }
    allNodeDepartment {
      edges {
        node {
          title
          drupal_internal__nid
        }
      }
    }
    noResultsImage: file(relativePath: { eq: "squirrel.png" }) {
      childImageSharp {
        fluid(maxWidth: 920) {
          ...GatsbyImageSharpFluid_noBase64
        }
      }
    }
  }
`
