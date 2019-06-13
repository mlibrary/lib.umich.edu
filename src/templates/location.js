import React from 'react'
import { graphql } from "gatsby"

import {
  Margins,
  SPACING,
  MEDIA_QUERIES,
  COLORS
} from '@umich-lib/core'

import Layout from "../components/layout"
import PageHeader from '../components/page-header'
import LocationAside from '../components/location-aside'

export default function({ data }) {
  const {
    title,
    body,
    field_building_address,
    fields,
    relationships
  } = data.page

  return (
    <Layout>
      <PageHeader
        title={title}
        summary={body.summary}
        breadcrumb={fields.breadcrumb}
        imageData={relationships.field_image[0].localFile.childImageSharp.fluid}
        ariaLabel="Location description"
      />

      <Margins>
        <div
          css={{
            marginTop: SPACING['2XL'],
            [MEDIA_QUERIES.LARGESCREEN]: {
              display: "grid",
              gridTemplateAreas: `
                "content side"
              `,
              gridTemplateColumns: `1fr calc(300px + ${SPACING['4XL']})`,
            }
          }}
        >
          <section css={{ gridArea: 'content' }}>

          </section>
          <section
            css={{
              gridArea: 'side',
              [MEDIA_QUERIES.LARGESCREEN]: {
                paddingLeft: SPACING['XL'],
                marginLeft: SPACING['2XL'],
                borderLeft: `solid 1px ${COLORS.neutral[100]}`
              }
            }}
          >
            <LocationAside {...field_building_address} title={title} />
          </section>
        </div>
      </Margins>
    </Layout>
  )

}

export const query = graphql`
  query($slug: String! ) {
    page: nodeBuilding(fields: { slug: { eq: $slug } }) {
      title
      body {
        value
        format
        summary
      }
      fields {
        breadcrumb
      }
      field_building_address {
        address_line1
        administrative_area
        locality
        postal_code
      }
      relationships {
        field_image {
          localFile {
            childImageSharp {
              fluid(quality: 90, maxWidth: 1280) {
                ...GatsbyImageSharpFluid_withWebp
              }
            }
          }
        }
      }
    }
  }
`