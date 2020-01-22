import React from 'react'
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
import VisuallyHidden from '@reach/visually-hidden'

export default function StaffDirectoryContainer() {
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

  return <StaffDirectory filters={filters} staff={staff} />
}

function StaffDirectory({ filters, staff }) {
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
            },
            marginBottom: SPACING['XL'],
          }}
        >
          <TextInput
            id="search"
            labelText="Search by name, uniqname, or title"
          />
          {filters.map(({ label, name, options }) => (
            <Select label={label} name={name} options={options} />
          ))}
        </div>

        <table
          css={{
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
            <VisuallyHidden>Staff Directory</VisuallyHidden> {staff.length}{' '}
            results
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
            {staff.map(({ uniqname, name, title, email, phone }) => (
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