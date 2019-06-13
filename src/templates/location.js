import React from 'react'
import { graphql } from "gatsby"

import Layout from "../components/layout"
import PageHeader from '../components/page-header'
import LocationAside from '../components/location-aside'
import {
  Template,
  Content,
  Side
} from '../components/location-layout'

import {
  Margins
} from '@umich-lib/core'

export default function({ data }) {
  const {
    title,
    body,
    field_building_official_name,
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
        <Template>
          <Content>

          </Content>
          <Side>
            <LocationAside
              {...field_building_address}
              title={title}
              field_building_official_name={field_building_official_name}
            />
          </Side>
        </Template>
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
      field_building_official_name
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