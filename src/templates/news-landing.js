import React from 'react'
import { graphql } from 'gatsby'

import { Margins, Heading, SPACING } from '@umich-lib/core'
import VisuallyHidden from '@reach/visually-hidden'
import Layout from '../components/layout'
import SEO from '../components/seo'
import PageHeader from '../components/page-header'
import HTML from '../components/html'
import Panels from '../components/panels'
import Breadcrumb from '../components/breadcrumb'
import Card from '../components/card'
import {
  Template,
  TemplateSide,
  TemplateContent,
} from '../components/aside-layout'
import * as moment from 'moment'

export default function NewsLandingTemplate({ data }) {
  const node = data.page
  const newsMain = processNewsData(data.newsMain)
  const newsLibraryUpdates = processNewsData(data.newsLibraryUpdates)

  const {
    title,
    field_title_context,
    body,
    fields,
    relationships,
    drupal_internal__nid,
  } = node
  const description = body && body.summary ? body.summary : null

  return (
    <Layout drupalNid={drupal_internal__nid}>
      <SEO
        title={title}
        drupalNid={drupal_internal__nid}
        description={description}
      />
      <Margins>
        <Breadcrumb data={fields.breadcrumb} />
        <Heading
          size="3XL"
          level={1}
          css={{
            marginBottom: SPACING['S'],
          }}
        >
          {field_title_context}
        </Heading>
      </Margins>
      <Template>
        <TemplateContent>
          {body && (
            <div css={{ marginBottom: SPACING['XL'] }}>
              <HTML html={body.processed} />
            </div>
          )}

          {newsMain && (
            <React.Fragment>
              <VisuallyHidden>
                <Heading level={2}>Main news</Heading>
              </VisuallyHidden>
              <ol>
                {newsMain.map((item, i) => (
                  <li
                    key={'news-item-' + i}
                    css={{
                      marginBottom: SPACING['L'],
                    }}
                  >
                    <Card
                      href={item.href}
                      title={item.title}
                      subtitle={item.subtitle}
                      image={item.image}
                      horizontal
                    >
                      {item.description}
                    </Card>
                  </li>
                ))}
              </ol>
            </React.Fragment>
          )}
        </TemplateContent>

        <TemplateSide>
          <Heading
            size="L"
            level={2}
            css={{
              marginBottom: SPACING['L'],
            }}
          >
            Library Updates
          </Heading>
          {newsLibraryUpdates && (
            <ol>
              {newsLibraryUpdates.map((item, i) => (
                <li
                  key={'news-item-' + i}
                  css={{
                    marginBottom: SPACING['XL'],
                  }}
                >
                  <Card
                    href={item.href}
                    title={item.title}
                    subtitle={item.subtitle}
                  >
                    {item.description}
                  </Card>
                </li>
              ))}
            </ol>
          )}
        </TemplateSide>
      </Template>
    </Layout>
  )
}

function processNewsData(data) {
  if (!data) {
    return null
  }

  return data.edges.map(({ node }) => {
    const { title, created, body, relationships } = node
    const image =
      relationships?.field_media_image?.relationships?.field_media_image
        ?.localFile?.childImageSharp?.fluid

    return {
      title,
      subtitle: moment(created).format('MMMM Do, YYYY'),
      description: body.summary,
      href: '/',
      image,
    }
  })
}

export const query = graphql`
  query($slug: String!) {
    page: nodePage(fields: { slug: { eq: $slug } }) {
      ...pageFragment
    }
    newsMain: allNodeNews(
      filter: { field_news_type: { eq: "news_main" } }
      sort: { fields: created, order: DESC }
      limit: 15
    ) {
      edges {
        node {
          title
          body {
            summary
          }
          created
          relationships {
            field_media_image {
              relationships {
                field_media_image {
                  localFile {
                    childImageSharp {
                      fluid(maxWidth: 640) {
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
      totalCount
    }
    newsLibraryUpdates: allNodeNews(
      filter: { field_news_type: { eq: "library_updates" } }
      sort: { fields: created, order: DESC }
      limit: 15
    ) {
      edges {
        node {
          title
          body {
            summary
          }
          created
        }
      }
      totalCount
    }
  }
`
