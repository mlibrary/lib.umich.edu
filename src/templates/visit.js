import React from 'react'
import { graphql } from "gatsby"
import VisuallyHidden from "@reach/visually-hidden";

import {
  Margins,
  Heading,
  List,
  SPACING,
  MEDIA_QUERIES,
  COLORS
} from '@umich-lib/core'

import Layout from "../components/layout"
import SEO from '../components/seo'
import PageHeader from '../components/page-header'
import Prose from "../components/prose"
import HorizontalNavigation from '../components/horizontal-navigation'
import processHorizontalNavigationData from '../components/utilities/process-horizontal-navigation-data'
import HTML from '../components/html'
import LocationAside from '../components/location-aside'

export default function VisitTemplate({ data, ...rest }) {
  /*
    Is the data a room, building, or location?
  */
  const page = data.building ? data.building
    : data.location ? data.location
    : data.room ? data.room : null

  const {
    title,
    field_horizontal_nav_title,
    fields,
    relationships,
    drupal_internal__nid,
    body,
    field_root_page_,
    field_access
  } = page
  const parentNode = relationships.field_parent_page[0]
  const isRootPage = field_root_page_ ? true : false
  const {
    field_visit,
    field_parking,
    field_amenities,
  } = relationships

  return (
    <Layout drupalNid={drupal_internal__nid}>
      <SEO title={title} />
      <main>
        <header aria-label="Location description">
          <PageHeader
            breadcrumb={fields.breadcrumb}
            title={title}
            summary={body ? body.summary : null}
            image={relationships.field_media_image.relationships.field_media_image}
          />
        </header>
        <HorizontalNavigation
          items={processHorizontalNavigationData({
            parentNodeOrderByDrupalId: rest.pageContext.parents,
            parentNodes: data.parents.edges,
            currentNode: page,
            childrenNodeOrderByDrupalId: rest.pageContext.children,
            childrenNodes: data.children.edges,
            isRootPage,
            parentNode
          })}
        />
        <Margins>
          <section aria-label="Hours, parking, access, and amenities">
            <Template>
              <TemplateSide> 
                <LocationAside node={page} />
              </TemplateSide>
              <TemplateContent>
                <Prose>
                  <Heading level="1" size="L">
                    <VisuallyHidden>{title}</VisuallyHidden>
                    <span aria-hidden="true">{field_horizontal_nav_title}</span>
                  </Heading>
                  <HTMLList data={field_visit} />

                  <Heading level="2" size="M">Getting here</Heading>
                  <Heading level="3" size="2XS" css={{ fontWeight: '700' }}>Parking</Heading>
                  <HTMLList data={field_parking} />

                  <Heading level="3" size="2XS" css={{ fontWeight: '700' }}>Access</Heading>
                  <HTML html={field_access.processed} />

                  <Heading level="2" size="M">Amentities</Heading>
                  <List type="bulleted">
                    {field_amenities.map(({name}, i) => <li key={i + name}>{name}</li>)}
                  </List>
                </Prose>
              </TemplateContent>
            </Template>
          </section>
        </Margins>
      </main>
    </Layout>
  )
}

function HTMLList({ data }) {
  return (
    <List type="bulleted">
      {data.map(({description}, i) => <li key={i + description.processed}><HTML html={description.processed} /></li>)}
    </List>
  )
}

function Template({ children, ...rest }) {
  return (
    <div
      css={{
        paddingTop: SPACING['XL'],
        paddingBottom: SPACING['XL'],
        [MEDIA_QUERIES.LARGESCREEN]: {
          paddingTop: SPACING['3XL'],
          paddingBottom: SPACING['3XL'],
          display: "grid",
          gridTemplateAreas: `
            "content side"
          `,
          gridTemplateColumns: `1fr calc(21rem + ${SPACING['4XL']}) `
        }
      }}
      {...rest}
    >
      {children}
    </div>
  )
}

function TemplateSide({ children, ...rest }) {
  return (
    <aside
      css={{
        [MEDIA_QUERIES.LARGESCREEN]: {
          gridArea: 'side',
          marginLeft: SPACING['3XL'],
          paddingLeft: SPACING['3XL'],
          borderLeft: `solid 1px ${COLORS.neutral['100']}`,
          borderBottom: 'none'
        },
        borderBottom: `solid 1px ${COLORS.neutral['100']}`,
        paddingBottom: SPACING['2XL'],
        marginBottom: SPACING['2XL']
      }}
      {...rest}
    >
      {children}
    </aside>
  )
}

function TemplateContent({ children, ...rest }) {
  return (
    <div
      css={{
        [MEDIA_QUERIES.LARGESCREEN]: {
          maxWidth: '38rem',
          gridArea: 'content',
        },
        marginBottom: SPACING['XL']
      }}
      {...rest}
    >
      {children}
    </div>
  )
}

export const query = graphql`
  query($slug: String!, $parents: [String], $children: [String]) {
    building: nodeBuilding(fields: { slug: { eq: $slug } }) {
      ...BuildingFragment
    }
    room: nodeRoom(fields: { slug: { eq: $slug } }) {
      ...RoomFragment
    }
    location: nodeLocation(fields: { slug: { eq: $slug } }) {
      ...LocationFragment
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