import { eventFormatWhen, eventFormatWhere } from '../utils/events';
import { Heading, Margins, SPACING, TYPOGRAPHY } from '../reusable';
import { Template, TemplateContent, TemplateSide } from '../components/aside-layout';
import Breadcrumb from '../components/breadcrumb';
import createGoogleMapsURL from '../components/utilities/create-google-maps-url';
import { GatsbyImage } from 'gatsby-plugin-image';
import { graphql } from 'gatsby';
import Html from '../components/html';
import Link from '../components/link';
import PropTypes from 'prop-types';
import React from 'react';
import SearchEngineOptimization from '../components/seo';
import Share from '../components/share';
import TemplateLayout from './template-layout';
import useFloorPlan from '../hooks/use-floor-plan';

const EventTemplate = ({ data }) => {
  const node = data.event;
  const { field_title_context: fieldTitleContext, body, fields, relationships } = node;
  const { slug } = fields;
  const image
    = relationships?.field_media_image?.relationships.field_media_image;
  const imageAlt = relationships?.field_media_image?.field_media_image?.alt || '';
  const imageData = image
    ? image.localFile.childImageSharp.gatsbyImageData
    : null;
  const imageCaptionHTML
    = relationships?.field_media_image?.field_image_caption?.processed;
  const contact = relationships?.field_library_contact;
  const eventContacts = relationships?.field_non_library_event_contact;
  return (
    <TemplateLayout node={node}>
      <Margins>
        <Breadcrumb data={fields.breadcrumb} />
      </Margins>
      <Template asideWidth='25rem'>
        <TemplateContent>
          <Heading
            level={1}
            size='3XL'
            css={{
              marginBottom: SPACING.XL,
              marginTop: SPACING.S
            }}
          >
            {fieldTitleContext}
          </Heading>
          <EventMetadata data={node} />
          {body && <Html html={body.processed} />}
        </TemplateContent>
        <TemplateSide
          css={{
            '> div': {
              border: 'none'
            }
          }}
        >
          {imageData && (
            <figure
              css={{
                marginBottom: SPACING.XL,
                maxWidth: '38rem'
              }}
            >
              <GatsbyImage
                image={imageData}
                css={{
                  borderRadius: '2px',
                  width: '100%'
                }}
                alt={imageAlt}
              />
              {imageCaptionHTML && (
                <figcaption
                  css={{
                    color: 'var(--color-neutral-300)',
                    paddingTop: SPACING.S
                  }}
                >
                  <Html html={imageCaptionHTML} />
                </figcaption>
              )}
            </figure>
          )}

          <Share
            url={`https://www.lib.umich.edu${slug}`}
            title={fieldTitleContext}
          />

          {contact && (
            <>
              <h2
                css={{
                  borderTop: `solid 1px var(--color-neutral-100)`,
                  fontSize: '1rem',
                  fontWeight: '600',
                  marginBottom: SPACING['2XS'],
                  marginTop: SPACING.L,
                  paddingTop: SPACING.L
                }}
              >
                Library contact
              </h2>
              <p>
                <Link to={`/users/${contact.name}`}>
                  {contact.field_user_display_name}
                </Link>
                {' · '}
                <a
                  href={`mailto:${contact.field_user_email}`}
                  css={{
                    textDecoration: 'underline'
                  }}
                >
                  {contact.field_user_email}
                </a>
              </p>
            </>
          )}

          {eventContacts && eventContacts.length > 0 && (
            <>
              <h2
                css={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  marginBottom: SPACING['2XS'],
                  paddingTop: SPACING.L
                }}
              >
                Event contact
              </h2>
              {eventContacts.map((eventContact, index) => {
                return (
                  <p key={index}>
                    {`${eventContact.field_first_name} ${eventContact.field_last_name}`}
                    {' · '}
                    <a
                      href={`mailto:${eventContact.field_email}`}
                      css={{
                        textDecoration: 'underline'
                      }}
                    >
                      {eventContact.field_email}
                    </a>
                  </p>
                );
              })}
            </>
          )}

          <p
            css={{
              borderTop: `solid 1px var(--color-neutral-100)`,
              marginTop: SPACING.L,
              paddingTop: SPACING.L
            }}
          >
            Library events are free and open to the public, and we are committed
            to making them accessible to attendees. If you anticipate needing
            accommodations to participate, please notify the listed contact with
            as much notice as possible.
          </p>
        </TemplateSide>
      </Template>
    </TemplateLayout>
  );
};

EventTemplate.propTypes = {
  data: PropTypes.object
};

/*
 *Details the events:
 *- Dates and times
 *- Location and directions
 *- Registration link
 *- Event type.
 */
const EventMetadata = ({ data }) => {
  // eslint-disable-next-line no-underscore-dangle
  const dates = data.field_event_date_s_;
  const eventType = data.relationships.field_event_type.name;
  const registrationLink
    = data.field_registration_link && data.field_registration_link.uri
      ? {
          label: 'Register to attend',
          to: data.field_registration_link.uri
        }
      : null;
  const series = data.relationships.field_event_series?.name;
  const when = dates.map((date) => {
    const start = new Date(date.value);
    const end = new Date(date.end_value);

    return eventFormatWhen({
      end,
      kind: 'full',
      start,
      type: eventType
    });
  });
  const where = eventFormatWhere({ node: data });

  const buildingId = data.relationships.field_event_building?.id;
  const floorId = data.relationships.field_event_room?.relationships.field_floor?.id;

  const floorPlan = useFloorPlan(buildingId && floorId ? buildingId : null, floorId && buildingId ? floorId : null);

  return (
    <table
      css={{
        marginBottom: SPACING.XL,
        maxWidth: '38rem',
        textAlign: 'left',
        th: {
          fontWeight: '600',
          paddingRight: SPACING.M,
          paddingTop: SPACING.S,
          width: '20%',
          ...TYPOGRAPHY['3XS']
        },
        'th, td': {
          borderBottom: `solid 1px var(--color-neutral-100)`,
          padding: SPACING.M,
          paddingLeft: '0'
        },
        'tr:first-of-type > th': {
          paddingTop: '0'
        },
        width: '100%'

      }}
    >
      <caption className='visually-hidden'>Event details</caption>
      <tbody>
        <tr>
          <th scope='row'>When</th>
          <td
            css={{
              'p + p': {
                marginTop: SPACING.XS
              }
            }}
          >
            {when.map((str, index) => {
              return (
                <p key={index}>{str}</p>
              );
            })}
          </td>
        </tr>
        {where && where.length > 0 && (
          <tr>
            <th scope='row'>Where</th>
            <td
              css={{
                'p + p:not(.margin-top-none)': {
                  marginTop: SPACING.XS
                }
              }}
            >
              {where.map(({ label, href, className, css }, index) => {
                if (href) {
                  return (
                    <span key={index} className={className}>
                      <Link to={href}>{label}</Link>
                    </span>
                  );
                }
                return (
                  <div css={css} key={index} className={className}>{label}</div>
                );
              })}
              {where.map(({ locality }, index) => {
                if (locality) {
                  return (
                    <Link
                      key={index}
                      to={createGoogleMapsURL({
                        placeId: null,
                        query: locality
                      })}
                    >
                      View directions
                    </Link>
                  );
                }
                return null;
              })}
              {floorPlan && floorPlan.fields && (
                <span css={{ display: 'block' }}>
                  <Link to={floorPlan.fields.slug}>View floorplan</Link>
                </span>
              )}
            </td>
          </tr>
        )}
        {registrationLink && (
          <tr>
            <th scope='row'>Registration</th>
            <td>
              <Link to={registrationLink.to}>{registrationLink.label}</Link>
            </td>
          </tr>
        )}
        <tr>
          <th scope='row'>Event type</th>
          <td>{eventType}</td>
        </tr>

        {series && (
          <tr>
            <th scope='row'>Series</th>
            <td>{series}</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

EventMetadata.propTypes = {
  data: PropTypes.object
};

/* eslint-disable react/prop-types */
export const Head = ({ data }) => {
  return <SearchEngineOptimization data={data.event} />;
};
/* eslint-enable react/prop-types */

export default EventTemplate;

export const query = graphql`
  query ($slug: String!) {
    event: nodeEventsAndExhibits(fields: { slug: { eq: $slug } }) {
      ...eventFragment
    }
  }
`;
