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
import BackgroundImage from 'gatsby-background-image'
import VisuallyHidden from '@reach/visually-hidden'
import Link from '../components/link'
import PlainLink from '../components/plain-link'
import Breadcrumb from '../components/breadcrumb'
import MEDIA_QUERIES from '../maybe-design-system/media-queries'
import TemplateLayout from './template-layout'
import HTML from '../components/html'

const lunr = require('lunr')

export default function StaffDirectoryWrapper({ data }) {
  const node = data.page
  const { noResultsImage, allNodeDepartment, allStaff, allStaffImages } = data

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
  const staffImages = allStaffImages.edges.reduce((acc, { node }) => {
    const img = node.relationships.field_media_image

    return {
      ...acc,
      [img.drupal_internal__mid]: {
        alt: img.field_media_image.alt,
        ...img.relationships.field_media_image.localFile,
      },
    }
  }, {})

  return (
    <StaffDirectoryQueryContainer
      node={node}
      staff={staff}
      departments={departments}
      noResultsImage={noResultsImage}
      staffImages={staffImages}
    />
  )
}

function StaffDirectoryQueryContainer({
  node,
  staff,
  departments,
  noResultsImage,
  staffImages,
}) {
  const { body, fields, field_title_context } = node
  const [query, setQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState({})
  const [results, setResults] = useState([])
  const image = noResultsImage

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
    setResults([])
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
          handleClear={handleClear}
          filters={filters}
          activeFilters={activeFilters}
          results={results}
          image={image}
          staffImages={staffImages}
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
  staffImages,
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
            gridTemplateColumns: `3fr 2fr auto`,
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
          value={query}
          onChange={e => {
            setShow(20)
            handleChange(e)
          }}
        />
        {filters.map(({ label, name, options }) => (
          <Select
            label={label}
            name={name}
            options={options}
            onChange={e => handleChange(e)}
            value={activeFilters[name]}
          />
        ))}
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
              minWidth: '720px',
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
                <th
                  css={{
                    paddingLeft: `calc(43px + ${SPACING['L']}) !important`,
                  }}
                >
                  Name
                </th>
                <th>Contact info</th>
                <th>Title</th>
                <th>Department or division</th>
              </tr>
            </thead>
            <tbody>
              {staffInView.map(
                ({
                  uniqname,
                  name,
                  title,
                  email,
                  phone,
                  department,
                  division,
                  image_mid,
                }) => (
                  <tr key={uniqname}>
                    <td>
                      <div
                        css={{
                          display: 'flex',
                          alignItems: 'flex-start',
                        }}
                      >
                        <span
                          css={{
                            display: 'inline-block',
                            width: '43px',
                            marginRight: SPACING['L'],
                            lineHeight: '0',
                          }}
                        >
                          <StaffPhoto
                            mid={image_mid}
                            staffImages={staffImages}
                          />
                        </span>
                        <PlainLink
                          css={{
                            color: COLORS.teal['400'],
                            textDecoration: 'underline',
                            ':hover': {
                              textDecorationThickness: '2px',
                            },
                          }}
                          to={`staff/` + uniqname}
                        >
                          {name}
                        </PlainLink>
                      </div>
                    </td>
                    <td>
                      <span css={{ display: 'block' }}>
                        <Link to={`mailto:` + email} kind="subtle">
                          {email}
                        </Link>
                      </span>
                      {phone && (
                        <span>
                          {phone && (
                            <Link to={`tel:1-` + phone} kind="subtle">
                              {phone}
                            </Link>
                          )}
                        </span>
                      )}
                    </td>
                    <td>{title}</td>
                    <td>
                      {department && (
                        <Link to="#" kind="subtle">
                          {department}
                        </Link>
                      )}

                      {!department && division && (
                        <Link to="#" kind="subtle">
                          {division}
                        </Link>
                      )}
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

function StaffPhoto({ mid, staffImages }) {
  const img = staffImages[mid]

  if (!img) {
    return (
      <svg
        viewBox="0 0 222 293"
        xmlns="http://www.w3.org/2000/svg"
        css={{
          borderRadius: '2px',
        }}
      >
        <mask fill="#fff">
          <path d="m0 0h220v271h-220z" fill="#fff" fill-rule="evenodd" />
        </mask>
        <g fill="none" fill-rule="evenodd">
          <path d="m.5 0h221v293h-221z" fill="#e5e9ed" />
          <path
            d="m229.835666 270.963166-119.330133.036834-119.34122233-.036834c-1.08129908.036834-2.46757997-47.562366 10.34165522-58.474545 12.94786321-11.013473 28.07680841-5.829037 57.34581831-20.277314 5.2401416-2.578405 13.6410037-6.492056 15.8313274-12.919651 2.3751612-6.943277-.1571118-15.728271-1.6173276-18.104088-22.5492445-36.880401-23.9826589-64.8837223-22.9568111-79.0649503 2.4583381-34.0349474 25.9798275-55.1226177 60.3965601-55.1226177 34.406567 0 57.928057 21.0876703 60.386395 55.1226177 1.024923 14.181228-.407567 42.1845493-22.956811 79.0649503-1.460216 2.375817-3.984172 11.160811-1.617328 18.104088 2.189399 6.427595 10.600428 10.341246 15.830403 12.919651 29.269934 14.448277 44.398879 9.263841 57.346743 20.277314 12.808311 10.912179 11.42203 58.511379 10.340731 58.474545"
            fill="#b2bec9"
            mask="url(#a)"
            transform="translate(1 22)"
          />
        </g>
      </svg>
    )
  }

  return (
    <BackgroundImage
      aria-hidden="true"
      data-card-image
      tag="div"
      fluid={img.childImageSharp.fluid}
      alt={img.alt}
      css={{
        width: '43px',
        height: '57px',
        backgroundColor: COLORS.blue['100'],
        borderRadius: '2px',
        overflow: 'hidden',
      }}
    />
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
          image_mid
        }
      }
    }
    allStaffImages: allUserUser(
      filter: {
        relationships: {
          field_media_image: { drupal_internal__mid: { ne: null } }
        }
      }
    ) {
      edges {
        node {
          relationships {
            field_media_image {
              drupal_internal__mid
              field_media_image {
                alt
              }
              relationships {
                field_media_image {
                  localFile {
                    childImageSharp {
                      fluid(maxWidth: 120) {
                        ...GatsbyImageSharpFluid_noBase64
                      }
                    }
                  }
                }
              }
            }
          }
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
