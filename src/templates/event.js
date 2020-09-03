import React from 'react'
import { graphql } from 'gatsby'
import Img from 'gatsby-image'
import * as moment from 'moment'
import { Margins, Heading, SPACING, COLORS, TYPOGRAPHY } from '@umich-lib/core'
import {
  Template,
  TemplateSide,
  TemplateContent,
} from '../components/aside-layout'
import TemplateLayout from './template-layout'
import HTML from '../components/html'
import Breadcrumb from '../components/breadcrumb'
import Link from '../components/link'
import Share from '../components/share'

/*
  TODO:
  - [ ] Add events to build as a template.
  - [ ] Figure out how to reuse the share stuff with the news template.
  - [ ] Figure out Add to calendar button.
  - [ ] Figure out contact... that's probably somewhere else also.
  - [ ] Add event statement.
  - [ ] There is that date, directions, and type thing at the top.
*/

export default function EventTemplate({ data }) {
  const node = data.event
  const { field_title_context, body, fields, relationships } = node
  const { slug } = fields
  const image =
    relationships?.field_media_image?.relationships.field_media_image
  const imageData = image ? image.localFile.childImageSharp.fluid : null
  const imageCaptionHTML =
    relationships?.field_media_image?.field_image_caption?.processed

  return (
    <TemplateLayout node={node}>
      <Margins>
        <Breadcrumb data={fields.breadcrumb} />
      </Margins>
      <Template asideWidth={'25rem'}>
        <TemplateContent>
          <Heading
            level={1}
            size="3XL"
            css={{
              marginTop: SPACING['S'],
              marginBottom: SPACING['XL'],
            }}
          >
            {field_title_context}
          </Heading>
          <EventMetadata data={node} />
          {body && <HTML html={body.processed} />}
        </TemplateContent>
        <TemplateSide
          css={{
            '> div': {
              border: 'none',
            },
          }}
        >
          {imageData && (
            <figure
              css={{
                maxWidth: '38rem',
                marginBottom: SPACING['XL'],
              }}
            >
              <Img
                css={{
                  width: '100%',
                  borderRadius: '2px',
                }}
                fluid={imageData}
              />
              {imageCaptionHTML && (
                <figcaption
                  css={{
                    paddingTop: SPACING['S'],
                    color: COLORS.neutral['300'],
                  }}
                >
                  <HTML html={imageCaptionHTML} />
                </figcaption>
              )}
            </figure>
          )}

          <Share
            url={'https://www.lib.umich.edu' + slug}
            title={field_title_context}
          />

          <p
            css={{
              borderTop: `solid 1px ${COLORS.neutral['100']}`,
              marginTop: SPACING['L'],
              paddingTop: SPACING['L'],
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
  )
}

/*
  Details the events:
  - Dates and times
  - Location and directions
  - Registration link
  - Event type.
*/
function EventMetadata({ data }) {
  const dates = data.field_event_date_s_
  const eventType = data.relationships.field_event_type.name
  const registrationLink =
    data.field_registration_required &&
    data.field_registration_link &&
    data.field_registration_link.uri
      ? {
          label: 'Register to attend',
          to: data.field_registration_link.uri,
        }
      : null

  /**
   * WHEN
   * One of potentially many:
   * ['Friday, July 19, 2020 from 9am - 4pm']
   */
  const when = dates.map(date => {
    const start = moment(date.value)
    const end = moment(date.end_value)
    // Is the start and end on the same day?
    if (start.isSame(end, 'day')) {
      return (
        start.format('dddd, MMMM D, YYYY [from] h:mma [-] ') +
        end.format('h:mma')
      )
    }

    // Other use caes...
    // eg, logic to handle an event going from say Friday 10pm to Saturday at 2am.
    return 'n/a'
  })

  return (
    <table
      css={{
        textAlign: 'left',
        marginBottom: SPACING['XL'],
        th: {
          paddingTop: SPACING['S'],
          paddingRight: SPACING['M'],
          fontWeight: '600',
          ...TYPOGRAPHY['3XS'],
        },
        'tr:first-of-type > th': {
          paddingTop: '0',
        },
        width: '100%',
        'th, td': {
          padding: SPACING['M'],
          paddingLeft: '0',
          borderBottom: `solid 1px ${COLORS.neutral[100]}`,
        },
      }}
    >
      <caption class="visually-hidden">Event details</caption>
      <tr>
        <th scope="row">When</th>
        <td>
          {when.map(str => (
            <p>{str}</p>
          ))}
        </td>
      </tr>
      <tr>
        <th scope="row">Where</th>
        <td>TODO</td>
      </tr>
      {registrationLink && (
        <tr>
          <th scope="row">Registration</th>
          <td>
            <Link to={registrationLink.to}>{registrationLink.label}</Link>
          </td>
        </tr>
      )}
      <tr>
        <th scope="row">Event type</th>
        <td>{eventType}</td>
      </tr>
    </table>
  )
}

export const query = graphql`
  query($slug: String!) {
    event: nodeEventsAndExhibits(fields: { slug: { eq: $slug } }) {
      ...eventFragment
    }
  }
`
