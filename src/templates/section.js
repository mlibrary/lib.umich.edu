import React from 'react'
import { graphql } from "gatsby"

import {
  Heading,
  Margins,
  SPACING
} from '@umich-lib/core'

import Layout from "../components/layout"
import SEO from '../components/seo'
import PageHeader from '../components/page-header'
import HorizontalNavigation from '../components/horizontal-navigation'
import Panels from '../components/panels'

function SectionTemplate({ data, ...rest }) {
  const {
    title,
    field_header_title,
    field_horizontal_nav_title,
    fields,
    body,
    relationships
  } = data.page

  const breadcrumb = relationships.field_parent_page[0].fields.breadcrumb 
  const nav = [
    {
      to: fields.slug,
      text: field_horizontal_nav_title
    }
  ]

  return (
    <Layout>
      <SEO title={title} />
      <PageHeader
        headingLevel={2}
        breadcrumb={breadcrumb}
        title={field_header_title}
        summary={body ? body.summary : null}
        image={relationships.field_image}
      />
      <HorizontalNavigation data={nav} />
      <Margins>
        <Heading
          size="L"
          level="1"
          css={{
            marginTop: SPACING['3XL'],
            marginBottom: `-${SPACING['L']}`
          }}
        >{field_horizontal_nav_title}</Heading>
      </Margins>
      <Panels data={relationships.field_panels} />
    </Layout>
  )
}

export default SectionTemplate

export const query = graphql`
  fragment BuildingCardFragment on node__building {
    title
    body {
      summary
    }
    fields {
      slug
    }
    field_building_address {
      locality
      address_line1
      postal_code
      administrative_area
    }
    relationships {
      field_image {
        localFile {
          childImageSharp {
            fluid(maxWidth: 600, quality: 70) {
              ...GatsbyImageSharpFluid_noBase64
            }
          }
        }
      }
    }
  }

  fragment CardPanelFragment on paragraph__card_panel {
    field_title
    id
    relationships {
      field_card_template {
        field_machine_name
      }
      field_cards {
        ... on node__building {
          ...BuildingCardFragment
        }
      } 
    }
  }

  query($slug: String!) {
    page: nodeSectionPage(fields: { slug: { eq: $slug } }) {
      title
      field_header_title
      field_horizontal_nav_title
      body {
        summary
      }
      fields {
        breadcrumb
        slug
      }
      relationships {
        field_parent_page {
          ... on node__page {
            fields {
              breadcrumb
            }
          }
          ... on node__building {
            fields {
              breadcrumb
            }
          }
        }
        field_image {
          localFile {
            childImageSharp {
              fluid(maxWidth: 1280, quality: 70) {
                ...GatsbyImageSharpFluid_noBase64
              }
            }
          }
        }
        field_panels {
          ... on paragraph__card_panel {
            ...CardPanelFragment
          }
          ... on paragraph__text_panel {
            field_title
            id
            relationships {
              field_text_template {
                field_machine_name
              }
              field_text_card {
                field_title
                field_body {
                  processed
                }
              }
            }
          }
        }
      }
    }
  }
`