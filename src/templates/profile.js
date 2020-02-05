import React from 'react'
import { graphql } from 'gatsby'

import {
  Margins,
  Heading,
  SPACING,
  Text,
  TYPOGRAPHY,
  List,
  LargeScreen,
  SmallScreen,
} from '@umich-lib/core'
import { Template, Top, Side, Content } from '../components/page-layout'
import SEO from '../components/seo'
import Breadcrumb from '../components/breadcrumb'
import Layout from '../components/layout'
import Link from '../components/link'
import HTML from '../components/html'
import Img from 'gatsby-image'

function ProfileTemplate({ data }) {
  const {
    field_user_work_title,
    field_user_display_name,
    field_user_pro_about,
    field_user_pronoun_object,
    field_user_pronoun_subject,
    field_user_pronoun_dependent_pos,
    field_user_pronoun_independent_p,
    field_languages_spoken,
    field_user_email,
    field_user_phone,
    field_user_orcid_id,
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
          <Side>
            <SmallScreen>
              <div
                css={{
                  marginBottom: SPACING['XL'],
                }}
              >
                <ProfileHeader {...data.profile} />
              </div>
            </SmallScreen>

            <div
              css={{
                marginBottom: SPACING['2XL'],
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
                    borderRadius: '2px',
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
                  <Link to={`mailto:` + field_user_email}>
                    {field_user_email}
                  </Link>
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
              {field_user_orcid_id && (
                <React.Fragment>
                  <Heading
                    level={2}
                    css={{
                      fontWeight: '700',
                    }}
                  >
                    ORCID ID
                  </Heading>
                  <Text>{field_user_orcid_id}</Text>
                </React.Fragment>
              )}
            </div>
          </Side>
          <Content>
            <LargeScreen>
              <ProfileHeader {...data.profile} />
            </LargeScreen>

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

            {field_languages_spoken && (
              <React.Fragment>
                <Heading
                  size="S"
                  css={{
                    marginBottom: SPACING['XS'],
                  }}
                >
                  About me
                </Heading>
                <List type="bulleted">
                  {field_languages_spoken.map(lang => (
                    <li>{lang}</li>
                  ))}
                </List>
              </React.Fragment>
            )}
          </Content>
        </Template>
      </Margins>
    </Layout>
  )
}

function ProfileHeader({ field_user_display_name, field_user_work_title }) {
  return (
    <React.Fragment>
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

      <div
        css={{
          '& > a:not(:last-of-type):first-of-type': {
            marginRight: '0.75rem',
          },
        }}
      >
        <Link to="">Design and Discovery</Link>
        <Link to="">Library Information Technology</Link>
      </div>
    </React.Fragment>
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
      field_user_orcid_id
      field_languages_spoken
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
`
