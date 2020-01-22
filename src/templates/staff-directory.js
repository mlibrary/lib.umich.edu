import React, { useState, useEffect } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import {
  Heading,
  SPACING,
  Margins,
  TextInput,
  COLORS,
  Icon,
} from '@umich-lib/core'
import Layout from '../components/layout'
import SEO from '../components/seo'
import Link from '../components/link'
import Breadcrumb from '../components/breadcrumb'
import useDebounce from '../hooks/use-debounce'

const lunr = require('lunr')

export default function StaffDirectoryContainer() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const debouncedQuery = useDebounce(query, 250)

  const staffData = useStaticQuery(graphql`
    {
      allStaff(sort: { order: ASC, fields: uniqname }) {
        edges {
          node {
            uniqname
            name
            title
            email
            phone
          }
        }
      }
    }
  `)

  // Flatten it out a bit for presentation
  const staff = staffData.allStaff.edges.map(({ node }) => {
    return {
      ...node,
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
      setResults(staff)
      return
    }

    // Get the staff directory index
    const index = window.__SDI__

    try {
      const results = index.search(debouncedQuery).map(({ ref }) => {
        return staff.find(({ uniqname }) => uniqname === ref)
      })

      setResults(results)
    } catch {
      return
    }
  }, [debouncedQuery])

  function handleChange(e) {
    if (e.target.name === 'query') {
      setQuery(e.target.value)
    }
  }

  const filters = [
    {
      label: 'Department',
      name: 'department',
      options: ['All departments'],
    },
    {
      label: 'Division',
      name: 'division',
      options: ['All divisions'],
    },
  ]

  return (
    <StaffDirectory
      handleChange={handleChange}
      filters={filters}
      staff={staff}
      results={results}
    />
  )
}

function StaffDirectory({ handleChange, filters, staff, results }) {
  const staffInView = results.slice(0, 20)

  return (
    <Layout>
      <SEO title="Staff Directory" />
      <Margins
        css={{
          marginBottom: SPACING['4XL'],
        }}
      >
        <Breadcrumb
          data={JSON.stringify([
            {
              text: 'Home',
              to: '/',
            },
            {
              text: 'About Us',
              to: '/about-us',
            },
            {
              text: 'Staff Directory',
            },
          ])}
        />
        <Heading
          size="3XL"
          level={1}
          css={{
            marginBottom: SPACING['L'],
          }}
        >
          Staff Directory
        </Heading>

        <div
          css={{
            display: 'grid',
            gridTemplateColumns: `2fr 1fr 1fr`,
            gridGap: SPACING['S'],
            input: {
              lineHeight: '1.5',
              height: '40px',
            },
            marginBottom: SPACING['XL'],
          }}
        >
          <TextInput
            id="search"
            labelText="Search by name, uniqname, or title"
            name="query"
            onChange={e => handleChange(e)}
          />
          {filters.map(({ label, name, options }) => (
            <Select label={label} name={name} options={options} />
          ))}
        </div>

        <table
          css={{
            width: '100%',
            tableLayout: 'fixed',
            'th, td': {
              padding: `${SPACING['S']} 0`,
              paddingRight: SPACING['L'],
              textAlign: 'left',
              borderBottom: `solid 1px ${COLORS.neutral['100']}`,
            },
            th: {
              color: COLORS.neutral['300'],
            },
          }}
        >
          <caption>
            {results.length ? (
              <p>{results.length} results</p>
            ) : (
              <p>No results.</p>
            )}
          </caption>
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact info</th>
              <th colSpan="2">Title</th>
              <th>Department</th>
            </tr>
          </thead>
          <tbody>
            {staffInView.map(({ uniqname, name, title, email, phone }) => (
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
                <td colSpan="2">{title}</td>
                <td>[todo]</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Margins>
    </Layout>
  )
}

function Select({ label, name, options }) {
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
            border: 'none',
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
