import React from 'react'
import { graphql } from 'gatsby'

import { Margins, Heading, SPACING, Text } from '@umich-lib/core'
import { Template, Top, Side, Content } from '../components/page-layout'
import SEO from '../components/seo'
import Breadcrumb from '../components/breadcrumb'
import Layout from '../components/layout'
import Prose from '../components/prose'
import HTML from '../components/html'
import Img from 'gatsby-image'

function ProfileTemplate({ data }) {
  console.log('data', data)
  const {
    field_user_work_title,
    field_user_display_name,
    field_user_pro_about,
    relationships,
  } = data.profile
  const { field_media_image } = relationships
  var image

  if (field_media_image) {
    image = {
      alt: field_media_image.field_media_image.alt,
      fluid:
        field_media_image.relationships.field_media_image.localFile
          .childImageSharp.fluid,
    }
  }

  const breadcrumbData = JSON.stringify([
    {
      text: 'Home',
      to: '/',
    },
    {
      text: field_user_display_name,
    },
  ])
  return (
    <Layout>
      <SEO title={field_user_display_name} />
      <Margins>
        <Template>
          <Top>
            <Breadcrumb data={breadcrumbData} />
          </Top>
          <Side>
            {image && (
              <Img
                fluid={image.fluid}
                alt={image.alt}
                css={{
                  width: '100%',
                }}
              />
            )}
          </Side>
          <Content>
            <Heading
              size="3XL"
              level={1}
              css={{
                marginBottom: SPACING['XS'],
              }}
            >
              {field_user_display_name}
            </Heading>
            <Text lede>{field_user_work_title}</Text>

            <Prose
              css={{
                marginTop: SPACING['XL'],
              }}
            >
              <Heading size="M">About me</Heading>
              <HTML html={field_user_pro_about.processed} />
            </Prose>
          </Content>
        </Template>
      </Margins>
    </Layout>
  )
}

export default ProfileTemplate

export const query = graphql`
  query($name: String!) {
    profile: userUser(name: { eq: $name }) {
      name
      field_user_display_name
      field_user_work_title
      field_user_pro_about {
        processed
      }
      relationships {
        field_media_image {
          drupal_internal__mid
          field_media_image {
            alt
          }
          relationships {
            field_media_image {
              localFile {
                childImageSharp {
                  fluid(maxWidth: 300) {
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
`
