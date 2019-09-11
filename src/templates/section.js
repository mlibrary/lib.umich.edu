import React from 'react'
import { graphql } from 'gatsby'

import VisuallyHidden from '@reach/visually-hidden'

import { Heading, Margins, MEDIA_QUERIES, SPACING } from '@umich-lib/core'

import {
  Template,
  TemplateSide,
  TemplateContent,
} from '../components/aside-layout'
import Prose from '../components/prose'
import Layout from '../components/layout'
import SEO from '../components/seo'
import PageHeader from '../components/page-header'
import PageHeaderMini from '../components/page-header-mini'
import HorizontalNavigation from '../components/horizontal-navigation'
import Panels from '../components/panels'
import HTML from '../components/html'
import LocationAside from '../components/location-aside'

import processHorizontalNavigationData from '../components/utilities/process-horizontal-navigation-data'

function renderHorziontalNavigationCSS(isRootPage) {
  if (!isRootPage) {
    return {
      borderTop: 'none',
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
    field_horizontal_nav_title,
    fields,
    relationships,
    drupal_internal__nid,
  } = data.page

  const parentNode = relationships.field_parent_page[0]
  const breadcrumb = fields.breadcrumb
  const isRootPage = field_root_page_ ? true : false
  const pageHeaderImage =
    relationships.field_media_image &&
    relationships.field_media_image.relationships.field_media_image
  const hasBody = body && body.processed && body.processed.length
  /*
    Use the parent page if not the root
    for PageHeader summary and image.
  */
  const summary = isRootPage ? body.summary : parentNode.body.summary

  return (
    <Layout drupalNid={drupal_internal__nid}>
      <SEO title={title} />

      {isRootPage ? (
        <PageHeader
          breadcrumb={breadcrumb}
          title={field_header_title}
          summary={summary}
          image={pageHeaderImage}
        />
      ) : (
        <PageHeaderMini breadcrumb={breadcrumb} title={field_header_title} />
      )}
      <HorizontalNavigation
        items={processHorizontalNavigationData({
          parentNodeOrderByDrupalId: rest.pageContext.parents,
          parentNodes: data.parents.edges,
          currentNode: data.page,
          childrenNodeOrderByDrupalId: rest.pageContext.children,
          childrenNodes: data.children.edges,
          isRootPage,
          parentNode,
        })}
        css={renderHorziontalNavigationCSS(isRootPage)}
      />

      {hasBody ? (
        <Template>
          <TemplateContent>
            <Prose>
              <Heading level={1} size="L">
                <VisuallyHidden>{title}</VisuallyHidden>
                <span aria-hidden="true">{field_horizontal_nav_title}</span>
              </Heading>

              {body && <HTML html={body.processed} />}
            </Prose>
          </TemplateContent>
          {relationships.field_design_template.field_machine_name ===
            'section_locaside' &&
            parentNode && (
              <TemplateSide
                css={{
                  display: 'none',
                  [MEDIA_QUERIES.LARGESCREEN]: {
                    display: 'block',
                  },
                }}
              >
                <LocationAside node={parentNode} />
              </TemplateSide>
            )}
        </Template>
      ) : (
        <Margins>
          <Heading level={1} size="L">
            <VisuallyHidden>{title}</VisuallyHidden>
            <span aria-hidden="true">{field_horizontal_nav_title}</span>
          </Heading>
        </Margins>
      )}

      <Panels data={relationships.field_panels} />
    </Layout>
  )
}

export default SectionTemplate

export const query = graphql`
  fragment PageFragment on node__page {
    title
    field_local_navigation
    drupal_id
    drupal_internal__nid
    fields {
      breadcrumb
    }
    body {
      processed
    }
    relationships {
      field_parent_page {
        ... on node__page {
          title
          fields {
            slug
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

  fragment BuildingFragment on node__building {
    title
    field_horizontal_nav_title
    drupal_id
    drupal_internal__nid
    field_root_page_
    field_phone_number
    field_email
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
    field_access {
      processed
    }
    relationships {
      field_media_image {
        relationships {
          field_media_image {
            localFile {
              childImageSharp {
                fluid(maxWidth: 1280, quality: 70) {
                  ...GatsbyImageSharpFluid_withWebp_noBase64
                }
              }
            }
          }
        }
      }
      field_hours_open {
        ...HoursFragment
      }
      field_parent_page {
        ...SectionNodeFragment
      }
      field_parking {
        description {
          processed
        }
      }
      field_visit {
        description {
          processed
        }
      }
      field_amenities {
        name
      }
    }
  }

  fragment HoursFragment on Node {
    ... on Node {
      __typename
    }
    ... on paragraph__labor_day_holiday_hours {
      field_date_range {
        value
        end_value
      }
      field_hours_open {
        comment
        day
        starthours
        endhours
      }
    }
    ... on paragraph__fall_and_winter_semester_hours {
      field_date_range {
        value
        end_value
      }
      field_hours_open {
        comment
        day
        starthours
        endhours
      }
    }
    ... on paragraph__fall_study_break {
      field_date_range {
        value
        end_value
      }
      field_hours_open {
        comment
        day
        starthours
        endhours
      }
    }
    ... on paragraph__thanksgiving_break_hours {
      field_date_range {
        value
        end_value
      }
      field_hours_open {
        comment
        day
        starthours
        endhours
      }
    }
    ... on paragraph__fall_exam_hours {
      field_date_range {
        value
        end_value
      }
      field_hours_open {
        comment
        day
        starthours
        endhours
      }
    }
    ... on paragraph__winter_break_hours {
      field_date_range {
        value
        end_value
      }
      field_hours_open {
        comment
        day
        starthours
        endhours
      }
    }
    ... on paragraph__intersession_after_new_year {
      field_date_range {
        value
        end_value
      }
      field_hours_open {
        comment
        day
        starthours
        endhours
      }
    }
    ... on paragraph__spring_break_hours {
      field_date_range {
        value
        end_value
      }
      field_hours_open {
        comment
        day
        starthours
        endhours
      }
    }
    ... on paragraph__winter_exam_hours {
      field_date_range {
        value
        end_value
      }
      field_hours_open {
        comment
        day
        starthours
        endhours
      }
    }
    ... on paragraph__intersession_after_winter_exams {
      field_date_range {
        value
        end_value
      }
      field_hours_open {
        comment
        day
        starthours
        endhours
      }
    }
    ... on paragraph__memorial_day_holiday_hours {
      field_date_range {
        value
        end_value
      }
      field_hours_open {
        comment
        day
        starthours
        endhours
      }
    }
    ... on paragraph__spring_term_hours {
      field_date_range {
        value
        end_value
      }
      field_hours_open {
        comment
        day
        starthours
        endhours
        comment
      }
    }
    ... on paragraph__july_4_holiday_hours {
      field_date_range {
        value
        end_value
      }
      field_hours_open {
        comment
        day
        starthours
        endhours
      }
    }
    ... on paragraph__summer_term_hours {
      field_date_range {
        value
        end_value
      }
      field_hours_open {
        comment
        day
        starthours
        endhours
      }
    }
    ... on paragraph__intersession_after_summer_exams {
      field_date_range {
        value
        end_value
      }
      field_hours_open {
        comment
        day
        starthours
        endhours
      }
    }
    ... on paragraph__hours_exceptions {
      field_date_range {
        value
        end_value
      }
      field_hours_open {
        comment
        day
        starthours
        endhours
      }
    }
    ... on paragraph__hours_exceptions {
      field_date_range {
        value
        end_value
      }
      field_hours_open {
        comment
        day
        starthours
        endhours
        comment
      }
    }
  }

  fragment LocationFragment on node__location {
    title
    field_horizontal_nav_title
    drupal_id
    drupal_internal__nid
    field_root_page_
    field_phone_number
    field_email
    field_address_is_different_from_
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
    field_access {
      processed
    }
    field_address_is_different_from_
    relationships {
      field_media_image {
        relationships {
          field_media_image {
            localFile {
              childImageSharp {
                fluid(maxWidth: 1280, quality: 70) {
                  ...GatsbyImageSharpFluid_withWebp_noBase64
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
      field_parent_page {
        ... on node__section_page {
          ...SectionNodeFragment
        }
      }
      field_parking {
        description {
          processed
        }
      }
      field_visit {
        description {
          processed
        }
      }
      field_amenities {
        name
      }
      field_hours_open {
        ...HoursFragment
      }
    }
  }

  fragment RoomFragment on node__room {
    title
    field_horizontal_nav_title
    drupal_id
    drupal_internal__nid
    field_root_page_
    field_phone_number
    field_email
    field_hours_different_from_build
    body {
      summary
    }
    fields {
      slug
      breadcrumb
    }
    field_access {
      processed
    }
    relationships {
      field_room_building {
        relationships {
          field_hours_open {
            ...HoursFragment
          }
        }
      }
      field_media_image {
        relationships {
          field_media_image {
            localFile {
              childImageSharp {
                fluid(maxWidth: 1280, quality: 70) {
                  ...GatsbyImageSharpFluid_withWebp_noBase64
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
      field_hours_open {
        ...HoursFragment
      }
      field_parent_page {
        ... on node__section_page {
          ...SectionNodeFragment
        }
      }
      field_parking {
        description {
          processed
        }
      }
      field_visit {
        description {
          processed
        }
      }
      field_amenities {
        name
      }
    }
  }

  fragment SectionNodeFragment on node__section_page {
    title
    field_horizontal_nav_title
    drupal_internal__nid
    drupal_id
    fields {
      slug
    }
    body {
      summary
    }
    drupal_id
  }

  fragment HoursPanelFragment on paragraph__hours_panel {
    ... on Node {
      __typename
    }
    relationships {
      field_parent_card {
        ...BuildingFragment
        ...LocationFragment
      }
      field_cards {
        ... on Node {
          __typename
          ...LocationFragment
          ...RoomFragment
        }
      }
    }
  }

  fragment CardPanelFragment on paragraph__card_panel {
    field_title
    drupal_id
    id
    relationships {
      field_card_template {
        field_machine_name
      }
      field_cards {
        ...BuildingFragment
        ...LocationFragment
        ...RoomFragment
      }
    }
  }

  fragment SectionFragment on node__section_page {
    title
    field_header_title
    field_horizontal_nav_title
    field_root_page_
    drupal_internal__nid
    body {
      summary
      processed
    }
    fields {
      breadcrumb
      slug
    }
    relationships {
      field_parent_page {
        ...SectionNodeFragment
        ...LocationFragment
        ...BuildingFragment
      }
      field_design_template {
        field_machine_name
      }
      field_media_image {
        relationships {
          field_media_image {
            localFile {
              childImageSharp {
                fluid(maxWidth: 1280, quality: 70) {
                  ...GatsbyImageSharpFluid_withWebp_noBase64
                }
              }
            }
          }
        }
      }
      field_panels {
        ...CardPanelFragment
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
        ... on paragraph__hours_panel {
          ...HoursPanelFragment
        }
      }
    }
  }

  query($slug: String!, $parents: [String], $children: [String]) {
    page: nodeSectionPage(fields: { slug: { eq: $slug } }) {
      ...SectionFragment
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
