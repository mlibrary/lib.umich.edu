import React from 'react'

import {
  Heading,
  Icon,
  Text,
  COLORS,
  SPACING
} from '@umich-lib/core'
import Link from './link'
import Hours from './todays-hours'
import icons from '../reusable/icons'

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


function getAddressData(node) {
  const {
    field_address_is_different_from_,
    field_building_address
  } = node
  const {
    field_parent_location,
    field_room_building,
  } = node.relationships

  if (field_address_is_different_from_ === false) {
    return field_parent_location.field_building_address
  }

  return field_building_address ? field_building_address
  : field_room_building ? field_room_building.field_building_address
  : field_parent_location ? field_parent_location.field_building_address
  : {}
}

export default function LocationAside({ node }) {
  const {
    title,
    field_phone_number,
    field_email
  } = node
  const {
    address_line1,
    locality,
    administrative_area,
    postal_code
  } = getAddressData(node)
  
  return (
    <React.Fragment>
      <section
        aria-labelledby="todays-hours"
        css={{
          marginBottom: SPACING['3XL']
        }}
      >
        <LayoutWithIcon d={icons['clock']} palette="indigo">
          <Heading level={2} size="M" id="todays-hours" css={{
            paddingTop: SPACING['2XS'],
            paddingBottom: SPACING['2XS']
          }}>Hours</Heading>
          <Text><Hours node={node} /></Text>
          <Link to="/locations-and-hours/hours-view">View all hours</Link>
        </LayoutWithIcon>
      </section>
      <address
        aria-label="Address and contact information"
        css={{
          '> *:not(:last-child)': {
            marginBottom: SPACING['3XL']
          }
        }}
      >
        <LayoutWithIcon d={icons['address']} palette="orange">
          <Heading level={2} size="M" css={{
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

        <LayoutWithIcon d={icons['phone']} palette="maize">
          <Heading level={2} size="M" css={{
            paddingTop: SPACING['2XS'],
            paddingBottom: SPACING['2XS']
          }}>Contact</Heading>
          <div css={{ '> p': { marginBottom: SPACING['2XS'] } }}>
            {field_phone_number && <p><Link to={"tel:" + field_phone_number}>{field_phone_number}</Link></p>}
            {field_email && <p><Link to={"mailto:" + field_email}>{field_email}</Link></p>}
          </div>
        </LayoutWithIcon>
      </address>
    </React.Fragment>
  )
}