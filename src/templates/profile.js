/* eslint-disable camelcase */
import { Content, Side, Template, Top } from '../components/page-layout';
import { Heading, Icon, LargeScreen, List, Margins, MEDIA_QUERIES, SmallScreen, SPACING, Text, TYPOGRAPHY } from '../reusable';
import Breadcrumb from '../components/breadcrumb';
import { GatsbyImage } from 'gatsby-plugin-image';
import { graphql } from 'gatsby';
import Html from '../components/html';
import LANGUAGES from '../utils/languages';
import Layout from '../components/layout';
import Link from '../components/link';
import LinkCallout from '../components/link-callout';
import PropTypes from 'prop-types';
import React from 'react';
import SearchEngineOptimization from '../components/seo';
import StaffPhotoPlaceholder from '../components/staff-photo-placeholder';

const ProfileTemplate = ({ data }) => {
  const {
    field_user_display_name,
    field_user_pro_about,
    field_user_pronoun_subject,
    field_user_pronoun_object,
    field_user_pronoun_dependent_pos,
    field_user_pronoun_independent_p,
    field_languages_spoken,
    field_user_email,
    field_user_phone,
    field_user_orcid_id,
    field_mailing_address,
    field_user_url,
    relationships,
    field_user_make_an_appointment,
    field_physical_address_public_
  } = data.profile;
  const { field_media_image, field_name_pronunciation } = relationships;
  const { office } = data.staff;
  const pronouns_data = [
    field_user_pronoun_subject,
    field_user_pronoun_object,
    field_user_pronoun_dependent_pos,
    field_user_pronoun_independent_p
  ];

  const phone = field_user_phone === '000-000-0000' ? null : field_user_phone;

  /**
   * Take pronouns and create sets.
   *
   * Responsibilities:
   * - Make sets by '/' delimiter.
   * - Remove duplicates in a set.
   *
   * Input:
   *
   * [
   *   "She/They",
   *   "Her/Them",
   *   "Her/Their",
   *   "Hers/Theirs"
   * ]
   *
   * Result:
   *
   * [
   *   "She/Her/Hers",
   *   "They/Them/Their/Theirs"
   * ]
   */
  const processPronouns = (pronouns) => {
    const cleaned = pronouns.filter((pronoun) => {
      return typeof pronoun === 'string';
    });

    // They don't have any.
    if (cleaned.length === 0) {
      return null;
    }

    const matrix = cleaned.map((pronoun) => {
      return pronoun.split('/');
    });
    const transposed = matrix.reduce(
      (prev, next) => {
        return next.map((item, index) => {
          return (prev[index] || []).concat(next[index]);
        });
      },
      []
    );
    const formatted = transposed.map((set) => {
      return set
        // eslint-disable-next-line id-length
        .filter((v, i, arr) => {
          return v && arr.indexOf(v) === i;
        })
        .join('/');
    }
    );

    return formatted;
  };

  const pronouns = processPronouns(pronouns_data);

  let image = null;

  if (field_media_image) {
    image = {
      alt: field_media_image.field_media_image.alt,
      imageData:
        field_media_image.relationships.field_media_image.localFile
          .childImageSharp.gatsbyImageData
    };
  }

  const breadcrumbData = JSON.stringify([
    {
      text: 'Home',
      to: '/'
    },
    {
      text: field_user_display_name
    }
  ]);
  return (
    <Layout>
      <Margins>
        <Template>
          <Top>
            <Breadcrumb data={breadcrumbData} />
          </Top>
          <Side>
            <SmallScreen>
              <div
                css={{
                  marginBottom: SPACING.XL
                }}
              >
                <ProfileHeader {...data.profile} />
              </div>
            </SmallScreen>

            <div
              css={{
                '> h2': {
                  marginTop: SPACING.M
                },
                background: 'var(--color-blue-100)',
                margin: `0 -${SPACING.M}`,
                marginBottom: SPACING['2XL'],
                padding: SPACING.M,
                [MEDIA_QUERIES.S]: {
                  margin: 0
                }
              }}
            >
              {image
                ? (
                    <GatsbyImage
                      image={image.imageData}
                      alt={image.alt}
                      css={{
                        aspectRatio: '2 / 3',
                        borderRadius: '2px',
                        width: '100%'
                      }}
                    />
                  )
                : (
                    <StaffPhotoPlaceholder />
                  )}

              {pronouns && (
                <React.Fragment>
                  <Heading
                    level={2}
                    size='2XS'
                    css={{
                      fontWeight: '700'
                    }}
                  >
                    Pronouns
                  </Heading>
                  {pronouns.map((set, index) => {
                    return (
                      <Text key={`pronouns${index}`}>{set}</Text>
                    );
                  })}
                </React.Fragment>
              )}

              {field_user_email && (
                <React.Fragment>
                  <Heading
                    level={2}
                    size='2XS'
                    css={{
                      fontWeight: '700'
                    }}
                  >
                    Email
                  </Heading>
                  <Link to={`mailto:${field_user_email}`}>
                    {field_user_email}
                  </Link>
                </React.Fragment>
              )}

              {phone && (
                <React.Fragment>
                  <Heading
                    level={2}
                    size='2XS'
                    css={{
                      fontWeight: '700'
                    }}
                  >
                    Phone
                  </Heading>
                  <Link to={`tel:1-${phone}`}>{phone}</Link>
                </React.Fragment>
              )}

              {office && field_physical_address_public_ && (
                <React.Fragment>
                  <Heading
                    level={2}
                    size='2XS'
                    css={{
                      fontWeight: '700'
                    }}
                  >
                    Office
                  </Heading>
                  {office}
                </React.Fragment>
              )}

              {field_mailing_address && (
                <React.Fragment>
                  <Heading
                    level={2}
                    size='2XS'
                    css={{
                      fontWeight: '700'
                    }}
                  >
                    Mailing address
                  </Heading>
                  <MailingAddress {...field_mailing_address} />
                </React.Fragment>
              )}

              {field_user_orcid_id && (
                <React.Fragment>
                  <Heading
                    level={2}
                    size='2XS'
                    css={{
                      fontWeight: '700'
                    }}
                  >
                    ORCID ID
                  </Heading>
                  <Text>{field_user_orcid_id}</Text>
                </React.Fragment>
              )}

              <SocialLinks {...data.profile} />
            </div>
          </Side>
          <Content>
            <LargeScreen>
              <ProfileHeader {...data.profile} />
            </LargeScreen>

            {field_user_make_an_appointment && (
              <div
                css={{
                  // eslint-disable-next-line id-length
                  a: {
                    display: 'inline-block'
                  },
                  marginTop: SPACING['2XL']
                }}
              >
                <LinkCallout
                  to={field_user_make_an_appointment.uri}
                  icon='today'
                >
                  Make an appointment
                </LinkCallout>
              </div>
            )}

            {field_name_pronunciation && (
              <figure
                css={{
                  marginBottom: SPACING.XL,
                  marginTop: SPACING['2XL']
                }}
              >
                <figcaption
                  css={{
                    ...TYPOGRAPHY.S,
                    marginBottom: SPACING.XS
                  }}
                >
                  Name pronunciation
                </figcaption>
                { }
                <audio
                  css={{
                    maxWidth: '24rem',
                    width: '100%'
                  }}
                  controls
                  src={field_name_pronunciation.localFile.publicURL}
                >
                  Your browser does not support the
                  <code>audio</code>
                  {' '}
                  element.
                </audio>
              </figure>
            )}

            <div
              css={{
                '> h2': {
                  marginBottom: SPACING.XS,
                  marginTop: SPACING.XL
                }
              }}
            >
              {field_user_pro_about && (
                <React.Fragment>
                  <Heading size='S' level={2}>
                    About me
                  </Heading>
                  <Html
                    html={field_user_pro_about.processed}
                    css={{
                      marginBottom: SPACING.XL
                    }}
                  />
                </React.Fragment>
              )}

              {field_languages_spoken && (
                <React.Fragment>
                  <Heading size='S' level={2}>
                    Languages
                  </Heading>
                  <p>
                    {field_languages_spoken
                      .map((lang) => {
                        return LANGUAGES[lang].name;
                      })
                      .join(', ')}
                  </p>
                </React.Fragment>
              )}

              {field_user_url && field_user_url.length > 0 && (
                <React.Fragment>
                  <Heading size='S' level={2}>
                    My links
                  </Heading>

                  <List type='bulleted'>
                    {field_user_url.map(({ uri, title }) => {
                      return (
                        <li key={uri + title}>
                          <Link to={uri}>{unescape(title)}</Link>
                        </li>
                      );
                    })}
                  </List>
                </React.Fragment>
              )}
            </div>
          </Content>
        </Template>
      </Margins>
    </Layout>
  );
};

ProfileTemplate.propTypes = {
  data: PropTypes.shape({
    profile: PropTypes.shape({
      field_languages_spoken: PropTypes.shape({
        map: PropTypes.func
      }),
      field_mailing_address: PropTypes.any,
      field_physical_address_public_: PropTypes.any,
      field_user_display_name: PropTypes.any,
      field_user_email: PropTypes.any,
      field_user_make_an_appointment: PropTypes.shape({
        uri: PropTypes.any
      }),
      field_user_orcid_id: PropTypes.any,
      field_user_phone: PropTypes.string,
      field_user_pro_about: PropTypes.shape({
        processed: PropTypes.any
      }),
      field_user_pronoun_dependent_pos: PropTypes.any,
      field_user_pronoun_independent_p: PropTypes.any,
      field_user_pronoun_object: PropTypes.any,
      field_user_pronoun_subject: PropTypes.any,
      field_user_url: PropTypes.shape({
        length: PropTypes.number,
        map: PropTypes.func
      }),
      relationships: PropTypes.shape({
        field_media_image: PropTypes.shape({
          field_media_image: PropTypes.shape({
            alt: PropTypes.any
          }),
          relationships: PropTypes.shape({
            field_media_image: PropTypes.shape({
              localFile: PropTypes.shape({
                childImageSharp: PropTypes.shape({
                  gatsbyImageData: PropTypes.any
                })
              })
            })
          })
        }),
        field_name_pronunciation: PropTypes.shape({
          localFile: PropTypes.shape({
            publicURL: PropTypes.any
          })
        })
      })
    }),
    staff: PropTypes.shape({
      office: PropTypes.any
    })
  })
};

const ProfileHeader = ({
  field_user_display_name,
  field_user_work_title,
  relationships
}) => {
  const { field_user_department } = relationships;
  const depts = [...field_user_department].reverse();

  return (
    <React.Fragment>
      <Heading
        size='3XL'
        level={1}
        css={{
          marginBottom: SPACING.XS
        }}
      >
        {field_user_display_name}
      </Heading>
      {field_user_work_title && <Text lede>{field_user_work_title}</Text>}
      {depts && depts.map((department, index) => {
        return (
          <span key={index}>
            {index > 0 && ' · '}
            <Link to={department.path.alias}>
              {department.field_title_context}
            </Link>
          </span>
        );
      })}
    </React.Fragment>
  );
};

ProfileHeader.propTypes = {
  field_user_display_name: PropTypes.any,
  field_user_work_title: PropTypes.any,
  relationships: PropTypes.shape({
    field_user_department: PropTypes.any
  })
};

const SocialLinks = ({
  field_linkedin,
  field_facebook,
  field_instagram,
  field_slideshare,
  field_twitter
}) => {
  const links = [
    field_linkedin,
    field_facebook,
    field_instagram,
    field_slideshare,
    field_twitter
  ].filter((linkItem) => {
    return linkItem && linkItem.uri;
  });

  if (links.length === 0) {
    return null;
  }

  return (
    <div
      css={{
        '> a': {
          ':not(:last-of-type)': {
            marginRight: SPACING.S
          },
          display: 'inline-block',
          marginTop: SPACING.S
        }
      }}
    >
      {links.map((sl) => {
        // User__userField_linkedin -> linkedin
        // eslint-disable-next-line no-underscore-dangle
        const icon = sl.__typename.substr(16);
        return <SocialLink to={sl.uri} icon={icon} label={icon} key={sl.uri} />;
      })}
    </div>
  );
};

SocialLinks.propTypes = {
  field_facebook: PropTypes.any,
  field_instagram: PropTypes.any,
  field_linkedin: PropTypes.any,
  field_slideshare: PropTypes.any,
  field_twitter: PropTypes.any
};

const SocialLink = ({ to, icon, label }) => {
  return (
    <a
      href={to}
      css={{
        color: 'var(--color-neutral-300)'
      }}
    >
      <Icon icon={icon} size={24} />
      <span className='visually-hidden'>{label}</span>
    </a>
  );
};

SocialLink.propTypes = {
  icon: PropTypes.any,
  label: PropTypes.any,
  to: PropTypes.any
};

const MailingAddress = ({
  address_line1,
  locality,
  administrative_area,
  postal_code
}) => {
  return (
    <React.Fragment>
      <Text>{address_line1}</Text>
      <Text>
        {locality}, {administrative_area} {postal_code}
      </Text>
    </React.Fragment>
  );
};

MailingAddress.propTypes = {
  address_line1: PropTypes.any,
  administrative_area: PropTypes.any,
  locality: PropTypes.any,
  postal_code: PropTypes.any
};

export default ProfileTemplate;

/* eslint-disable react/prop-types */
export const Head = ({ data }) => {
  return <SearchEngineOptimization data={data.profile} titleField='field_user_display_name' />;
};
/* eslint-enable react/prop-types */

export const query = graphql`
  query ($name: String!) {
    staff(uniqname: { eq: $name }) {
      office
    }
    profile: userUser(name: { eq: $name }) {
      ...userFragment
    }
  }
`;
