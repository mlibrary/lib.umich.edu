import React from 'react'
import Layout from '../components/layout'

import {
  Heading,
  Text,
  SPACING,
  Margins,
  COLORS,
  MEDIA_QUERIES
} from '@umich-lib/core'
import SEO from '../components/seo'
import Breadcrumb from '../components/breadcrumb'
import Link from '../components/link'
import useNavigationData from '../hooks/use-navigation-data'

const breadcrumbData = [
  {
    text: 'Home',
    to: '/'
  },
  {
    text: 'Site map'
  }
]

export default function SiteMap() {
  const {
    primary,
    secondary
  } = useNavigationData()

  return (
    <Layout>
      <SEO title="Site map" />
      <Margins css={{
        'ol ol': {
          borderLeft: `solid 1px ${COLORS['blue']['200']}`
        },
        '> ol': {
          [MEDIA_QUERIES.LARGESCREEN]: {
            columns: '2',
          },
          breakInside: 'avoid',
        },
        marginBottom: SPACING['4XL']
      }}>
        <Breadcrumb data={JSON.stringify(breadcrumbData)} />
        <Heading size="3XL" level={1} css={{
          marginBottom: SPACING['L']
        }}>Site map</Heading>

        <Heading size="M" level={2} css={{
          marginTop: SPACING['XL']
        }}>Utility navigation</Heading>
        <NestLinkedList data={secondary} />

        <Heading size="M" level={2} css={{
          marginTop: SPACING['XL']
        }}>Main navigation</Heading>
        <NestLinkedList data={primary} />
      </Margins>
    </Layout>
  )
}

function NestLinkedList({ data }) {
  return (
    <ol css={{
      listStyleType: 'decimal',
      listStylePosition: 'inside', 
      'li li': {
        marginLeft: SPACING['XL']
      },
      '> li': {
        breakInside: 'avoid'
      }
    }}>
      {data.map(({ text, to, children }) => (
        <li key={to} css={{
          margin: SPACING['S'],
          marginLeft: '0'
        }}>
          <Link to={to}>{text}</Link>
          {children && (<NestLinkedList data={children} />)}
        </li>
      ))}
    </ol>
  )
}
