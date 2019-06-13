import React from 'react'

import {
  Heading,
  Icon,
  Text,
  COLORS,
  SPACING
} from '@umich-lib/core'
import Link from './Link'

const icon_paths = {
  'address': 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'
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
        marginRight: SPACING['M']
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

export default function({
  title,
  address_line1,
  administrative_area,
  locality,
  postal_code
}) {
  return (
    <React.Fragment>
      <address aria-label="Address and contact information">
        <LayoutWithIcon d={icon_paths['address']} palette="orange">
          <Heading level="2" size="L">{title}</Heading>
          <Text>{title}</Text>
          <Text>{address_line1}</Text>
          <Text>{locality}, {administrative_area} {postal_code}</Text>
          <Link to={createGoogleMapsLink({
            query: `${title} ${address_line1} ${locality}`,
            place_id: null
          })}>View directions</Link>
        </LayoutWithIcon>
      </address>
    </React.Fragment>
  )
}