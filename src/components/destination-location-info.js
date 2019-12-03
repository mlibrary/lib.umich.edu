import React from 'react'

import { SPACING } from '@umich-lib/core'

import IconText from '../components/icon-text'
import icons from '../maybe-design-system/icons'
import Hours from '../components/todays-hours'
import Link from '../components/link'

import { getFloor } from '../utils/location-utils'

export default function DestinationLocationInfo({ node }) {
  const { field_parent_location, field_room_building } = node.relationships

  const shouldDisplayHours =
    node.field_is_location_ && node.field_display_hours_

  const locationTitle = field_parent_location
    ? field_parent_location.title
    : field_room_building.title

  const phone_number = node.field_phone_number
  const email = node.field_booking_email
  const floor = getFloor({ node })
  const room = 'Room ' + node.field_room_number

  return (
    <div
      css={{
        '> *:not(:last-child)': {
          marginBottom: SPACING['M'],
        },
        marginBottom: SPACING['2XL'],
      }}
    >
      {shouldDisplayHours && (
        <p>
          <IconText icon="access_time">
            <span>
              Today: <Hours node={node} />
              <span css={{ display: 'block' }}>
                <Link to="/locations-and-hours/hours-view">View all hours</Link>
              </span>
            </span>
          </IconText>
        </p>
      )}
      <p>
        <IconText d={icons['address']}>
          <span>
            {locationTitle}, {floor}, {room}
            <span css={{ display: 'block' }}>
              <Link to="#">View floorplan (coming soon)</Link>
            </span>
          </span>
        </IconText>
      </p>
      {phone_number && (
        <p>
          <IconText d={icons['phone']}>
            <Link to={`tel:+1-${phone_number}`}>{phone_number}</Link>
          </IconText>
        </p>
      )}
      {email && (
        <p>
          <IconText icon="mail_outline">
            <Link to={`mailto:${email}`}>{email}</Link>
          </IconText>
        </p>
      )}
    </div>
  )
}
