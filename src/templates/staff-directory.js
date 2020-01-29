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
  List,
  Text,
} from '@umich-lib/core'
import Img from 'gatsby-image'
import VisuallyHidden from '@reach/visually-hidden'
import Link from '../components/link'
import Prose from '../components/prose'
import Breadcrumb from '../components/breadcrumb'
import useDebounce from '../hooks/use-debounce'
import MEDIA_QUERIES from '../maybe-design-system/media-queries'
import TemplateLayout from './template-layout'
import HTML from '../components/html'

const lunr = require('lunr')

export default function StaffDirectoryContainer({ data }) {
  const node = data.page
  const { file, allNodeDepartment, allStaff } = data
  const { body, fields, field_title_context } = node
  const [query, setQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState({})
  const [results, setResults] = useState([])
  const debouncedQuery = useDebounce(query, 250)
  const image = file
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

    if (!debouncedQuery) {
      setResults(filterResults({ activeFilters, results: staff }))
      return
    }

    // Get the staff directory index
    const index = window.__SDI__

    try {
      const results = index.search(debouncedQuery).map(({ ref }) => {
        return staff.find(({ uniqname }) => uniqname === ref)
      })

      setResults(filterResults({ activeFilters, results }))
    } catch {
      return
    }
  }, [debouncedQuery, activeFilters])

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
      label: 'Department or Division',
      name: 'department',
      options: ['All'].concat(
        Object.keys(departments)
          .map(d => departments[d])
          .sort()
      ),
    },
  ]

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
            marginBottom: SPACING['XL'],
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
          filters={filters}
          results={results}
          image={image}
        />
      </Margins>
    </TemplateLayout>
  )
}

const StaffDirectory = React.memo(function StaffDirectory({
  handleChange,
  filters,
  results,
  image,
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
            gridTemplateColumns: `3fr 2fr`,
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
          labelText="Search by name, uniqname, or title"
          name="query"
          onChange={e => handleChange(e)}
        />
        {filters.map(({ label, name, options }) => (
          <Select
            label={label}
            name={name}
            options={options}
            onChange={e => handleChange(e)}
          />
        ))}
      </div>

      {results.length > 0 && (
        <div
          tabindex="0"
          css={{
            overflowX: 'auto',
          }}
          role="group"
          aria-labeledby="caption"
        >
          <table
            css={{
              width: '100%',
              minWidth: '720px',
              tableLayout: 'fixed',
              marginBottom: SPACING['XL'],
              'th, td': {
                padding: `${SPACING['XS']} 0`,
                textAlign: 'left',
                borderBottom: `solid 1px ${COLORS.neutral['100']}`,
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
                  ['@media only screen and (min-width: 720px)']: {
                    display: 'none',
                  },
                }}
              >
                (Scroll to see more)
              </p>
            </caption>
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact info</th>
                <th>Title</th>
                <th>Department</th>
              </tr>
            </thead>
            <tbody>
              {staffInView.map(
                ({ uniqname, name, title, email, phone, department }) => (
                  <tr key={uniqname}>
                    <td>
                      <Link to={`staff/` + uniqname}>{name}</Link>
                    </td>
                    <td>
                      <span css={{ display: 'block' }}>
                        <Link to={`mailto:` + email} kind="subtle">
                          {email}
                        </Link>
                      </span>
                      {phone && (
                        <span>
                          <Link to={`tel:1-` + phone} kind="subtle">
                            {phone}
                          </Link>
                        </span>
                      )}
                    </td>
                    <td>{title}</td>
                    <td>
                      <Link to="#" kind="subtle">
                        {department}
                      </Link>
                    </td>
                  </tr>
                )
              )}
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
          gridTemplateColumns: `3fr 2fr`,
          gridGap: SPACING['4XL'],
        },
        marginBottom: SPACING['2XL'],
      }}
    >
      <Prose>
        <Heading size="L" level={2}>
          We couldn't find any results
        </Heading>

        <Text lede>
          Consider the following search techniques to help you get the results
          you're looking for.
        </Text>

        <List
          type="bulleted"
          css={{
            strong: {
              fontWeight: '600',
            },
          }}
        >
          <li>
            <strong>"Lib*"</strong> to find anything that begins with "Lib" or{' '}
            <strong>"L*y"</strong> to find anything that begins with "L" and
            ends with "y" .
          </li>
          <li>
            <strong>"title:librarian"</strong> to find people with "librarian"
            in their title.
          </li>
          <li>
            <strong>"+map -digital"</strong> if it must contain "map" and not
            contain "digital".
          </li>
        </List>
      </Prose>

      <Img
        fluid={image.childImageSharp.fluid}
        alt=""
        css={{
          maxWidth: '18rem',
          margin: '1rem auto',
          [MEDIA_QUERIES['L']]: {
            margin: '0',
            marginBottom: SPACING['L'],
          },
        }}
      />
    </div>
  )
}

function Select({ label, name, options, ...rest }) {
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
          {...rest}
        >
          {options.map(opt => (
            <option id={name + opt} value={opt}>
              {opt}
            </option>
          ))}
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
    allStaff(sort: { order: ASC, fields: uniqname }) {
      edges {
        node {
          uniqname
          name
          title
          email
          phone
          department_nid
          division_nid
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
    file(relativePath: { eq: "squirrel.png" }) {
      childImageSharp {
        fluid(maxWidth: 920) {
          ...GatsbyImageSharpFluid_noBase64
        }
      }
    }
  }
`
