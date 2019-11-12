import React from 'react'
import Layout from '../components/layout'

import {
  Heading,
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
        marginBottom: SPACING['4XL']
      }}>
        <Breadcrumb data={JSON.stringify(breadcrumbData)} />
        <Heading size="3XL" level={1} css={{
          marginBottom: SPACING['L']
        }}>Site map</Heading>

        <Heading size="M" level={2} css={{
          marginTop: SPACING['XL']
        }}>Utility navigation</Heading>
        <ol>
          {secondary.map(({ text, to, children }) => (
            <li key={to} css={{
              margin: SPACING['S'],
              marginLeft: '0'
            }}>
              <Link to={to}>{text}</Link>
            </li>
          ))}
        </ol>

        <Heading size="M" level={2} css={{
          marginTop: SPACING['XL']
        }}>Main navigation</Heading>
        <div css={{
          '> ol': {
            [MEDIA_QUERIES.LARGESCREEN]: {
              columns: '2',
            },
            breakInside: 'avoid',
            '> li': {
              marginBottom: SPACING['4XL'],
            }
          },
          marginBottom: SPACING['4XL']
        }}>
          <NestLinkedList data={primary} />
        </div>
      </Margins>
    </Layout>
  )
}

function NestLinkedList({ data, ...rest }) {
  return (
    <ol css={{
      'li li': {
        marginLeft: SPACING['L']
      },
      '> li': {
        breakInside: 'avoid'
      }
    }} {...rest}>
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
