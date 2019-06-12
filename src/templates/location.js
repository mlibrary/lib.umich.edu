import React from 'react'
import { graphql } from "gatsby"

import {
  Heading,
  Text,
  Margins,
  SPACING
} from '@umich-lib/core'

import Layout from "../components/layout"
import PageHeader from '../components/page-header'
import Link from '../components/link'

function Feature({
  heading,
  palette,
  icon,
  id,
  children
}) {
  return (
    <section aria-labelledby={id} css={{
      marginBottom: SPACING['2XL']
    }}>
      <Heading id={id} size="M" level="2" css={{ marginBottom: SPACING['3XS'] }}>{heading}</Heading>
      {children}
    </section>
  )
}

/*
<Feature
id="todays-hours"
heading="Today's hours"
>
<Text><strong css={{ fontWeight: '800' }}>General</strong>: Open 24 hours</Text>
<Text><strong css={{ fontWeight: '800' }}>Askwith Media Library</strong>: 8am - 12am</Text>
<Link to="/" css={{ marginTop: SPACING['3XS'] }}>View all hours</Link>
</Feature>
*/

export default function({ data }) {
  const {
    title,
    body,
    fields,
    relationships,
    field_building_official_name,
    field_building_address
  } = data.page

  const {
    address_line1,
    locality,
    postal_code,
    administrative_area
  } = field_building_address

  const directions_base_url = "https://www.google.com/maps/dir/?api=1"
  const directions_destination_query = encodeURIComponent(`${field_building_official_name} ${address_line1} ${locality}, ${administrative_area} ${postal_code}`)

  return (
    <Layout>
      <PageHeader
        title={title}
        summary={body.summary}
        breadcrumb={fields.breadcrumb}
        imageData={relationships.field_image[0].localFile.childImageSharp.fluid}
        ariaLabel="Location description"
        css={{
          marginBottom: SPACING['2XL']
        }}
      />

      <Margins>
        <article aria-label="Hours, parking, access, and amenities">
          <Feature
            id="address"
            heading="Address"
          >
            <Text>{field_building_official_name}</Text>
            <Text>{address_line1}</Text>
            <Text>{locality}, {administrative_area} {postal_code}</Text>
            <Link to={directions_base_url + "&destination=" + directions_destination_query} css={{ marginTop: SPACING['3XS'] }}>View directions</Link>
          </Feature>
        </article>
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
        breadcrumb {
          to
          text
        }
      }
      field_building_official_name
      field_building_address {
        address_line1
        locality
        postal_code
        administrative_area
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