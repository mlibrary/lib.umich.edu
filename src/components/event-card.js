/* eslint-disable camelcase */
import {
  eventFormatWhen,
  eventFormatWhere,
  EXHIBIT_TYPES
} from '../utils/events';
import { Heading, Icon, MEDIA_QUERIES, SPACING, TYPOGRAPHY } from '../reusable';
import CardImage from '../reusable/card-image';
import Link from './link';
import React from 'react';

export default function EventCard (node) {
  const {
    displayImage = true,
    title,
    relationships,
    body,
    fields,
    fieldEventDateS,
    field_event_date_s_,
    hasBorder = true
  } = node;
  const image
    = relationships.field_media_image
      && relationships.field_media_image.relationships.field_media_image;
  const imageData = image
    ? image.localFile.childImageSharp.gatsbyImageData
    : null;
  const start = fieldEventDateS ? fieldEventDateS[0].value : field_event_date_s_[0].value;
  const end = fieldEventDateS ? fieldEventDateS[0].end_value : field_event_date_s_[0].end_value;
  const type = relationships.field_event_type.name;
  const isAnExhibit = EXHIBIT_TYPES.includes(type);
  const useBorder = hasBorder;
  const when = eventFormatWhen({
    end,
    kind: 'brief',
    start,
    type
  });
  const where = eventFormatWhere({
    kind: 'brief',
    node
  });
  const to = fields.slug;
  return (
    <section
      css={{
        borderBottom: useBorder ? `solid 1px var(--color-neutral-100)` : '',
        marginTop: SPACING.L,
        [MEDIA_QUERIES.L]: {
          display: displayImage ? 'grid' : 'block',
          gridGap: SPACING.M,
          gridTemplateColumns: `16rem 1fr `
        },
        paddingBottom: SPACING.L
      }}
    >
      {displayImage && <CardImage image={imageData} />}
      <div>
        <Heading
          size='S'
          level={3}
          css={{
            display: 'flex',
            flexDirection: 'column',
            marginBottom: SPACING['2XS']
          }}
        >
          <span css={{ order: 1 }}>
            <Link to={to} kind='description'>
              {title}
            </Link>
          </span>
          <span
            css={{
              color: 'var(--color-neutral-300)',
              display: 'block',
              marginTop: SPACING['3XS'],
              order: 0,
              ...TYPOGRAPHY['3XS']
            }}
          >
            {when}
          </span>
        </Heading>
        <p
          css={{
            color: 'var(--color-neutral-300)',
            marginTop: SPACING['2XS']
          }}
        >
          {body.summary}
        </p>

        <p
          css={{
            marginTop: SPACING['2XS']
          }}
        >
          <span
            css={{
              color: 'var(--color-neutral-300)',
              marginRight: SPACING.L
            }}
          >
            <Icon icon='address' />
            <span
              css={{
                marginLeft: SPACING.XS
              }}
            >
              <span className='visually-hidden'>Where: </span>
              {where.map((item) => {
                return item.label;
              })}
            </span>
          </span>
          {!isAnExhibit && (
            <span
              css={{
                color: 'var(--color-neutral-300)'
              }}
            >
              <Icon icon='sell' />
              <span
                css={{
                  marginLeft: SPACING.XS
                }}
              >
                <span className='visually-hidden'>Event type: </span>
                {type}
              </span>
            </span>
          )}
        </p>
      </div>
    </section>
  );
}
