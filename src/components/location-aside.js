import React from 'react'

import {
  Heading,
  Icon,
  Text,
  COLORS,
  SPACING
} from '@umich-lib/core'
import Link from './link'
import Hours from './hours'

const icon_paths = {
  'address': 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
  'phone': 'M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z',
  'check': 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
  'clock': 'M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20Zm.5-7.8L17,14.9l-.8,1.2L11,13V7h1.5Z'
}

function createGoogleMapsLink({ place_id, query }) {
  const place_query = place_id ? `&destination_place_id=${place_id}` : '' 

  return "https://www.google.com/maps/dir/?api=1" 
    + `&destination=${query}`
    + place_query
}

function LayoutWithIcon({ d, palette, children }) {
  return (
    <div css={{
      display: 'flex'
    }}>
      <div css={{
        marginRight: SPACING['S']
      }}>
        <span css={{
          display: 'flex',
          background: COLORS[palette][100],
          color: COLORS[palette][300],
          width: '2.5rem',
          height: '2.5rem',
          borderRadius: '50%',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Icon d={d} size={24} />
        </span>
      </div>
      <div>
        {children}
      </div>
    </div>
  )
}

export default function LocationAside({
  title,
  address_line1,
  administrative_area,
  locality,
  postal_code,
  field_phone_number,
  field_hours_open
}) {
  return (
    <React.Fragment>
      <address
        aria-label="Address and contact information"
        css={{
          '> *:not(:last-child)': {
            marginBottom: SPACING['3XL']
          }
        }}
      >
        <LayoutWithIcon d={icon_paths['clock']} palette="indigo">
          <Heading level="2" size="M" css={{
            paddingTop: SPACING['2XS'],
            paddingBottom: SPACING['2XS']
          }}>Hours</Heading>
          <Text><strong css={{ fontWeight: '700' }}>General:</strong> <Hours data={field_hours_open} /></Text>
          <Link to="/locations-and-hours/hours-view">View all hours</Link>
        </LayoutWithIcon>

        <LayoutWithIcon d={icon_paths['address']} palette="orange">
          <Heading level="2" size="M" css={{
            paddingTop: SPACING['2XS'],
            paddingBottom: SPACING['2XS']
          }}>Address</Heading>
          <Text>{title}</Text>
          <Text>{address_line1}</Text>
          <Text>{locality}, {administrative_area} {postal_code}</Text>
          <Link
            to={createGoogleMapsLink({
              query: `${title} ${address_line1} ${locality}`,
              place_id: null
            })}
          >View directions</Link>
        </LayoutWithIcon>

        <LayoutWithIcon d={icon_paths['phone']} palette="maize">
          <Heading level="2" size="M" css={{
            paddingTop: SPACING['2XS'],
            paddingBottom: SPACING['2XS']
          }}>Contact</Heading>
          <Link to="/">Ask a librarian</Link>
          <Text>{field_phone_number}</Text>
          <Link to="/">View staff directory</Link>
        </LayoutWithIcon>
      </address>
    </React.Fragment>
  )
}