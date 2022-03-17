import { graphql } from 'gatsby';

export const query = graphql`
  fragment userFragment on user__user {
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
    field_physical_address_public_
    field_mailing_address {
      address_line1
      address_line2
      locality
      administrative_area
      postal_code
    }
    field_user_make_an_appointment {
      uri
    }
    field_user_url {
      __typename
      title
      uri
    }
    field_linkedin {
      __typename
      uri
    }
    field_facebook {
      __typename
      uri
    }
    field_instagram {
      __typename
      uri
    }
    field_slideshare {
      __typename
      uri
    }
    field_twitter {
      __typename
      uri
    }
    relationships {
      field_office_location {
        ... on node__building {
          title
        }
        ... on node__location {
          title
        }
      }
      field_name_pronunciation {
        localFile {
          publicURL
        }
      }
      field_user_department {
        field_title_context
        path {
          alias
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
`;
