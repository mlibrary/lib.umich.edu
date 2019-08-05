import React from 'react'
import { graphql } from "gatsby"

import VisuallyHidden from '@reach/visually-hidden'

import Layout from "../components/layout"
import SEO from '../components/seo'
import PageHeader from '../components/page-header'
import PageHeaderMini from '../components/page-header-mini'
import HorizontalNavigation from '../components/horizontal-navigation'
import Panels from '../components/panels'

import processHorizontalNavigationData from '../components/utilities/process-horizontal-navigation-data'

function renderHorziontalNavigationCSS(isRootPage) {
  if (!isRootPage) {
    return {
      borderTop: 'none'
    }
  }

  return {}
}

function SectionTemplate({ data, ...rest }) {
  const {
    title,
    field_header_title,
    field_root_page_,
    body,
    fields,
    relationships
  } = data.page
  const parentNode = relationships.field_parent_page[0]
  const breadcrumb = fields.breadcrumb
  const isRootPage = field_root_page_ ? true : false

  /*
    Use the parent page if not the root
    for PageHeader summary and image.
  */
  const summary = isRootPage
    ? body.summary
    : parentNode.body.summary

  return (
    <Layout>
      <SEO title={title} />
      
      {isRootPage ? (
        <PageHeader
          breadcrumb={breadcrumb}
          title={field_header_title}
          summary={summary}
          image={relationships.field_media_image.relationships.field_media_image}
        />
      ) : (
        <PageHeaderMini
          breadcrumb={breadcrumb}
          title={field_header_title}
        />
      )}
      
      <HorizontalNavigation
        items={processHorizontalNavigationData({
          parentNodeOrderByDrupalId: rest.pageContext.parents,
          parentNodes: data.parents.edges,
          currentNode: data.page,
          childrenNodeOrderByDrupalId: rest.pageContext.children,
          childrenNodes: data.children.edges,
          isRootPage,
          parentNode
        })}
        css={renderHorziontalNavigationCSS(isRootPage)}
      />
      <VisuallyHidden><h1>{title}</h1></VisuallyHidden>
      <Panels
        data={relationships.field_panels}
      />
    </Layout>
  )
}

export default SectionTemplate

export const query = graphql`
  fragment BuildingFragment on node__building {
    title
    field_horizontal_nav_title
    drupal_id
    body {
      summary
    }
    fields {
      slug
      breadcrumb
    }
    field_building_address {
      locality
      address_line1
      postal_code
      administrative_area
    }
    relationships {
      field_media_image {
        relationships {
          field_media_image {
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
    }
  }

  fragment LocationFragment on node__location {
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
    field_address_is_different_from_
    relationships {
      field_media_image {
        relationships {
          field_media_image {
            localFile {
              childImageSharp {
                fluid(maxWidth: 1280, quality: 70) {
                  ...GatsbyImageSharpFluid_noBase64
                }
              }
            }
          }
        }
      }
      field_parent_location {
        field_building_address {
          locality
          address_line1
          postal_code
          administrative_area
        }
      }
    }
  }

  fragment RoomCardFragment on node__room {
    title
    body {
      summary
    }
    fields {
      slug
    }
    relationships {
      field_media_image {
        relationships {
          field_media_image {
            localFile {
              childImageSharp {
                fluid(maxWidth: 1280, quality: 70) {
                  ...GatsbyImageSharpFluid_noBase64
                }
              }
            }
          }
        }
      }
      field_room_building {
        field_building_address {
          locality
          address_line1
          postal_code
          administrative_area
        }
      }
    }
  }

  fragment SectionNodeFragment on node__section_page {
    title
    field_horizontal_nav_title
    fields {
      slug
    }
    body {
      summary
    }
    drupal_id
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
          ...BuildingFragment
        }
        ... on node__location {
          ...LocationFragment
        }
        ... on node__room {
          ...RoomCardFragment
        }
      } 
    }
  }

  query($slug: String!, $parents: [String], $children: [String]) {
    page: nodeSectionPage(fields: { slug: { eq: $slug } }) {
      title
      field_header_title
      field_horizontal_nav_title
      field_root_page_
      body {
        summary
      }
      fields {
        breadcrumb
        slug
      }
      relationships {
        field_parent_page {
          ... on node__section_page {
            ...SectionNodeFragment
          }
          ... on node__building {
            ...BuildingFragment
          }
        }
        field_media_image {
          relationships {
            field_media_image {
              localFile {
                childImageSharp {
                  fluid(maxWidth: 1280, quality: 70) {
                    ...GatsbyImageSharpFluid_noBase64
                  }
                }
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
    parents: allNodeSectionPage(filter: { drupal_id: { in: $parents } }) {
      edges {
        node {
          ...SectionNodeFragment
        }
      }
    }
    children: allNodeSectionPage(filter: { drupal_id: { in: $children } }) {
      edges {
        node {
          ...SectionNodeFragment
        }
      }
    }
  }
`