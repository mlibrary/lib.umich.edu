import React from 'react'
import {
  SPACING,
  Icon,
  MEDIA_QUERIES,
  TYPOGRAPHY,
  COLORS,
  Heading,
} from '@umich-lib/core'
import * as moment from 'moment'

import Link from '../link'
import icons from '../../reusable/icons'
import { displayHours } from '../../utils/hours'

const MEDIAQUERIES = {
  'XL': '@media only screen and (min-width: 1200px)',
  'L': '@media only screen and (min-width:920px)',
  'M': '@media only screen and (min-width: 720px)',
  'S': MEDIA_QUERIES.LARGESCREEN
}

export default function HoursLitePanel({ data }) {
  const {
    field_title
  } = data
  const hours = processHoursData(data.relationships.field_cards)

  return (
    <section>
      <Heading level={2} size="XL">{field_title}</Heading>

      <ol css={{
        marginTop: SPACING['L'],
        'li': {
          marginBottom: SPACING['S']
        }
      }}>
        {hours.map((h, i) => (
          <li key={i + h.text + h.to} css={{
            display: 'flex'
          }}>
            <span css={{
              display: 'inline',
              color: COLORS.maize['500'],
              width: '1.5rem',
              flexShrink: '0'
            }}>
              <Icon d={icons['clock']} />
            </span>
            <Link kind="list" to={h.to} css={{ flex: '1' }}>
              <span css={{
                display: 'inline'
              }}>
                <span css={{
                  [MEDIAQUERIES['M']]: {
                    marginRight: SPACING['XS']
                  }
                }}>{h.text}</span>
                <span css={{
                  display: 'block',
                  marginTop: SPACING['3XS'],
                  [MEDIAQUERIES['M']]: {
                    marginTop: '0',
                    display: 'inline-block'
                  },
                  ...TYPOGRAPHY['3XS'],
                  color: COLORS.neutral['300'],
                  textTransform: 'uppercase',
                  fontWeight: '700',
                  fontSize: '0.875rem',
                }}>{h.subText}</span>
              </span>
            </Link>
            </li>
          ))}
        <li>
          <Link kind="list-strong" to="/locations-and-hours" css={{
            marginLeft: '1.5rem'
          }}>
            View all hours and locations
          </Link>
        </li>
      </ol>
    </section>
  )
}

/*
const hoursDataExample = [
  {
    text: 'Hatcher Library',
    subText: 'Today: 8AM - 7PM',
    to: '/'
  },
  {
    text: 'Shapiro Library',
    subText: 'Today: Open 24 hours',
    to: '/'
  },
  {
    text: 'Art, Architecture & Engineering Library',
    subText: 'Today: 7AM - 11PM',
    to: '/'
  },
  {
    text: 'Taubman Health Sciences Library',
    subText: 'Today: 6AM - 11PM',
    to: '/'
  }
]
*/

function processHoursData(data) {
  const now = moment()
  const result = data.map(node => {
    return {
      text: node.title,
      subText: 'TODAY: ' + displayHours({node, now}),
      to: node.fields.slug
    }
  })

  return result
}