import { graphql } from "gatsby"
import React from "react"
import Layout from "../components/layout"
import HTML from "../components/html"
import styled from '@emotion/styled'
import {
  Margins,
  Heading,
  SPACING,
  Alert,
  Text,
  MEDIA_QUERIES
} from '@umich-lib/core'
import Breadcrumb from '../components/breadcrumb'
import Link from '../components/link'
import SideNavigation from '../components/side-navigation'

const Prose = styled('div')({
  '> *:not(:last-child)': {
    marginBottom: SPACING['L']
  }
})

const PageTemplate = ({ data }) => {
  const {
    title,
    body,
    fields
  } = data.page

  return (
    <Layout>
      <Margins>
        <div css={{
          [MEDIA_QUERIES.LARGESCREEN]: {
            display: "grid",
            gridTemplateAreas: `
              "breadcrumb breadcrumb"
              "sidenav content"
            `,
            gridTemplateColumns: `calc(240px + ${SPACING['4XL']}) 1fr`,
            gridTemplateRows: "auto 1fr",
          }
        }}>
          <div css={{
            gridArea: 'breadcrumb'
          }}>
            <Breadcrumb data={fields.breadcrumb} />
          </div>
          <main
            style={{
              maxWidth: '38rem',
              gridArea: 'content'
            }}
          >
            <Prose>
              <Heading size={"3XL"}>{title}</Heading>
              {body && body.format === 'basic_html' ? (
                <React.Fragment>
                  {body.summary && (
                    <Text lede>{body.summary}</Text>
                  )}
                  <HTML html={body.value} />
                </React.Fragment>
              ) : (
                <Alert intent="warning">
                  <span style={{ fontSize: '1rem' }}>
                    This page does not have body content.
                  </span>
                </Alert>
              )}
            </Prose>
          </main>
          <aside css={{
            gridArea: 'sidenav',
            marginRight: SPACING['3XL']
          }}>
            <SideNavigation data={data.parents} />
          </aside>
        </div>
      </Margins>
    </Layout>
  )
}

export default PageTemplate

export const query = graphql`
  query($slug: String!, $parents: [String] ) {
    page: nodePage(fields: { slug: { eq: $slug } }) {
      title
      body {
        value
        format
        summary
      }
      fields {
        breadcrumb {
          to
          text
        }
      }
    }
    parents: allNodePage(filter: {
      drupal_id: {
        in: $parents
      }
    }) {
      edges {
        node {
          id
          title
          fields {
            slug
          }
        }
      }
    }
  }
`