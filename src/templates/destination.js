import React from 'react'
import { graphql } from 'gatsby'
import Img from 'gatsby-image'

import {
  Heading,
  SPACING,
  Margins,
  Text,
  SmallScreen,
  COLORS
} from '@umich-lib/core'

import { Template, Top, Side, Content } from '../components/page-layout'
import Breadcrumb from '../components/breadcrumb'
import TemplateLayout from './template-layout'
import getNode from '../utils/get-node'
import SideNavigation from '../components/navigation/side-navigation'
import HorizontalNavigation from '../components/navigation/horizontal-navigation'
import useNavigationBranch from '../components/navigation/use-navigation-branch'
import Panels from '../components/panels'
import HTML from '../components/html'
import IconText from '../components/icon-text'
import icons from '../reusable/icons'
import Hours from '../components/todays-hours'
import Link from '../components/link'

function DestinationTemplate({ data, ...rest }) {
  const node = getNode(data)
  const {
    title,
    fields,
    body,
    relationships,
    field_local_navigation
  } = node

  const navBranch = useNavigationBranch(fields.slug)
  const smallScreenBranch = useNavigationBranch(fields.slug, 'small')
  const smallScreenItems = smallScreenBranch ? smallScreenBranch.children : null

  const image =
    relationships.field_media_image &&
    relationships.field_media_image.relationships.field_media_image
  const imageData = image ? image.localFile.childImageSharp.fluid : null

  return (
    <TemplateLayout node={node}>
      <Margins>
        <Template>
          <Top>
            <Breadcrumb data={fields.breadcrumb} />
          </Top>
          <Side>
          {field_local_navigation && (
              <SideNavigation to={fields.slug} branch={navBranch} />
            )}
            {field_local_navigation && smallScreenItems && (
              <SmallScreen>
                <div
                  css={{
                    margin: `0 -${SPACING['M']}`,
                  }}
                >
                  <HorizontalNavigation items={smallScreenItems} />
                </div>
              </SmallScreen>
            )}
          </Side>
          <Content>
            <div css={{
              maxWidth: '38rem'
            }}>
              <Img
                css={{
                  width: '100%'
                }}
                fluid={imageData}
              />
              <Heading level={1} size="3XL" css={{
                marginTop: SPACING['S'],
                marginBottom: SPACING['L']
              }}>{title}</Heading>
              <Text lede css={{
                marginBottom: SPACING['XL']
              }}>{body.summary}</Text>

              <DestinationLocationInfo node={node} />
            </div>

            {body && <HTML html={body.processed} />}

            <Panels data={relationships.field_panels} />
          </Content>
        </Template>
      </Margins>
    </TemplateLayout>
  )
}

function DestinationLocationInfo({ node }) {
  const {
    field_parent_location,
    field_room_building,
    field_floor,
  } = node.relationships

  const locationTitle = field_parent_location
    ? field_parent_location.title
    : field_room_building.title

  const phone_number = node.field_phone_number
  const email = node.field_booking_email
  const floor_split = field_floor.name.split(" - ")
  const floor = floor_split[floor_split.length - 1]
  const room = "Room " + node.field_room_number

  return (
    <div css={{
      '> *:not(:last-child)': {
        marginBottom: SPACING['M']
      },
      marginBottom: SPACING['2XL'],
    }}>
      <p>
        <IconText icon="access_time">
          <span>
            Today: <Hours node={node} />
            <span css={{ display: 'block' }}><Link to="/locations-and-hours/hours-view">View all hours</Link></span>
          </span>
        </IconText>
      </p>
      <p>
        <IconText d={icons['address']}>
          <span>
            {locationTitle}, {floor}, {room}
            <span css={{ display: 'block' }}><Link to="#">View floorplan (coming soon)</Link></span>
          </span>
        </IconText>
      </p>
      <p>
        <IconText d={icons['phone']}>
          <Link to={`tel:+1-${phone_number}`}>{phone_number}</Link>
        </IconText>
      </p>
      <p>
        <IconText icon="mail_outline">
          <Link to={`mailto:${email}`}>{email}</Link>
        </IconText>
      </p>
    </div>
  )
}

export default DestinationTemplate

export const query = graphql`
  query($slug: String!) {
    page: nodePage(fields: { slug: { eq: $slug } }) {
      ...pageFragment
    }
    room: nodeRoom(fields: { slug: { eq: $slug } }) {
      ...roomFragment
    }
  }
`