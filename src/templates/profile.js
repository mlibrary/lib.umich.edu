import React from 'react'
import { graphql } from 'gatsby'

import { Margins, Heading, SPACING, Text, TYPOGRAPHY } from '@umich-lib/core'
import { Template, Top, Side, Content } from '../components/page-layout'
import SEO from '../components/seo'
import Breadcrumb from '../components/breadcrumb'
import Layout from '../components/layout'
import Link from '../components/link'
import HTML from '../components/html'
import Img from 'gatsby-image'

function ProfileTemplate({ data }) {
  console.log('data', data)
  const {
    field_user_work_title,
    field_user_display_name,
    field_user_pro_about,
    field_user_pronoun_object,
    field_user_pronoun_subject,
    field_user_pronoun_dependent_pos,
    field_user_pronoun_independent_p,
    field_user_email,
    field_user_phone,
    relationships,
  } = data.profile
  const { field_media_image, field_name_pronunciation } = relationships
  const pronouns = [
    field_user_pronoun_object,
    field_user_pronoun_subject,
    field_user_pronoun_dependent_pos,
    field_user_pronoun_independent_p,
  ].join('/')
  const phone = field_user_phone !== '000-000-0000' ? field_user_phone : null

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
          <Side
            css={{
              '> h2': {
                marginTop: SPACING['M'],
              },
            }}
          >
            {image && (
              <Img
                fluid={image.fluid}
                alt={image.alt}
                css={{
                  width: '100%',
                }}
              />
            )}

            {pronouns && (
              <React.Fragment>
                <Heading
                  level={2}
                  css={{
                    fontWeight: '700',
                  }}
                >
                  Pronouns
                </Heading>
                <Text>{pronouns}</Text>
              </React.Fragment>
            )}

            {field_user_email && (
              <React.Fragment>
                <Heading
                  level={2}
                  css={{
                    fontWeight: '700',
                  }}
                >
                  Email
                </Heading>
                <Text>{field_user_email}</Text>
              </React.Fragment>
            )}

            {phone && (
              <React.Fragment>
                <Heading
                  level={2}
                  css={{
                    fontWeight: '700',
                  }}
                >
                  Phone
                </Heading>
                <Link to={`tel:1-` + phone}>{phone}</Link>
              </React.Fragment>
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
            {field_user_work_title && <Text lede>{field_user_work_title}</Text>}

            {field_name_pronunciation && (
              <figure
                css={{
                  marginTop: SPACING['2XL'],
                  marginBottom: SPACING['XL'],
                }}
              >
                <figcaption
                  css={{
                    ...TYPOGRAPHY['S'],
                    marginBottom: SPACING['XS'],
                  }}
                >
                  Name pronunciation
                </figcaption>
                <audio
                  css={{
                    width: '100%',
                    maxWidth: '24rem',
                  }}
                  controls
                  src={field_name_pronunciation.localFile.publicURL}
                >
                  Your browser does not support the
                  <code>audio</code> element.
                </audio>
              </figure>
            )}

            {field_user_pro_about && (
              <React.Fragment>
                <Heading
                  size="S"
                  css={{
                    marginBottom: SPACING['XS'],
                  }}
                >
                  About me
                </Heading>
                <HTML html={field_user_pro_about.processed} />
              </React.Fragment>
            )}
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
      field_user_pronoun_object
      field_user_pronoun_subject
      field_user_pronoun_dependent_pos
      field_user_pronoun_independent_p
      field_user_email
      field_user_phone
      relationships {
        field_name_pronunciation {
          localFile {
            publicURL
          }
        }
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
