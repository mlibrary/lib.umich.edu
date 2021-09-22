import React from 'react'

import { Heading, Icon, Text, COLORS, SPACING } from '@reusable'
import Link from './link'
import Hours from './todays-hours'
import icons from '../reusable/icons'
import Address from './address'
import LocationAnchoredLink from './location-anchored-link'

function LayoutWithIcon({ d, palette, children }) {
  return (
    <div
      css={{
        display: 'flex',
      }}
    >
      <div
        css={{
          marginRight: SPACING['S'],
        }}
      >
        <span
          css={{
            display: 'flex',
            background: COLORS[palette][100],
            color: COLORS[palette][300],
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '50%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Icon d={d} size={24} />
        </span>
      </div>
      <div>{children}</div>
    </div>
  )
}

export default function LocationAside({ node }) {
  const { field_phone_number, field_email, relationships } = node
  const buildingNode = relationships?.field_room_building
  const parentLocationNode = relationships?.field_parent_location?.relationships?.field_parent_location
  const locationNode = buildingNode
    ? buildingNode : parentLocationNode ? parentLocationNode : node

  return (
    <React.Fragment>
      <section
        aria-labelledby="todays-hours"
        css={{
          marginBottom: SPACING['3XL'],
        }}
      >
        <LayoutWithIcon d={icons['clock']} palette="indigo">
          <Heading
            level={2}
            size="M"
            id="todays-hours"
            css={{
              paddingTop: SPACING['2XS'],
              paddingBottom: SPACING['2XS'],
            }}
          >
            Hours
          </Heading>
          <Text>
            <Hours node={node} />
          </Text>
          <LocationAnchoredLink node={locationNode} />
        </LayoutWithIcon>
      </section>
      <address
        aria-label="Address and contact information"
        css={{
          '> *:not(:last-child)': {
            marginBottom: SPACING['3XL'],
          },
        }}
      >
        <LayoutWithIcon d={icons['address']} palette="orange">
          <Heading
            level={2}
            size="M"
            css={{
              paddingTop: SPACING['2XS'],
              paddingBottom: SPACING['2XS'],
            }}
          >
            Address
          </Heading>
          <Address node={node} directions={true} kind="full" />
        </LayoutWithIcon>

        <LayoutWithIcon d={icons['phone']} palette="maize">
          <Heading
            level={2}
            size="M"
            css={{
              paddingTop: SPACING['2XS'],
              paddingBottom: SPACING['2XS'],
            }}
          >
            Contact
          </Heading>
          <div css={{ '> p': { marginBottom: SPACING['2XS'] } }}>
            {field_phone_number && (
              <p>
                <Link to={'tel:' + field_phone_number}>
                  {field_phone_number}
                </Link>
              </p>
            )}
            {field_email && (
              <p>
                <Link to={'mailto:' + field_email}>{field_email}</Link>
              </p>
            )}
          </div>
        </LayoutWithIcon>
      </address>
    </React.Fragment>
  )
}
