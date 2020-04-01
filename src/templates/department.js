import React from 'react'
import { graphql } from 'gatsby'

import {
  Margins,
  Heading,
  SPACING,
  SmallScreen,
  List,
  Icon,
  Link as DSLink,
} from '@umich-lib/core'
import { Template, Top, Side, Content } from '../components/page-layout'
import HTML from '../components/html'
import Breadcrumb from '../components/breadcrumb'
import SideNavigation from '../components/navigation/side-navigation'
import HorizontalNavigation from '../components/navigation/horizontal-navigation'
import TemplateLayout from './template-layout'
import useNavigationBranch from '../components/navigation/use-navigation-branch'
import IconText from '../components/icon-text'
import Prose from '../components/prose'
import Link from '../components/link'
import LinkCallout from '../components/link-callout'
import { stringifyState } from '../utils/get-url-state'

function DepartmentTemplate({ data }) {
  const node = data.department
  const {
    field_title_context,
    body,
    fields,
    field_local_navigation,
    field_make_an_appointment,
    field_what_were_working_on,
  } = node
  const navBranch = useNavigationBranch(fields.slug)
  const smallScreenBranch = useNavigationBranch(fields.slug, 'small')
  const smallScreenItems = smallScreenBranch ? smallScreenBranch.children : null
  const departmentInfo = processDepartmentInfo({
    node,
    staffDirectorySlug: data.staffDirectoryNode.fields.slug,
  })

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
            <Heading
              size="3XL"
              level={1}
              css={{
                marginBottom: SPACING['L'],
              }}
            >
              {field_title_context}
            </Heading>
            <Prose>
              <Heading size="M" level={2}>
                Department information
              </Heading>

              <List
                css={{
                  svg: {
                    marginRight: SPACING['XS'],
                  },
                }}
              >
                {departmentInfo.map(({ icon, content }) => (
                  <li>
                    <Icon icon={icon} />
                    {content}
                  </li>
                ))}
              </List>

              {field_make_an_appointment && (
                <div
                  css={{
                    marginTop: SPACING['2XL'],
                    a: {
                      display: 'inline-block',
                    },
                  }}
                >
                  <LinkCallout to={field_make_an_appointment.uri} icon="today">
                    Make an appointment with us
                  </LinkCallout>
                </div>
              )}

              {body && (
                <React.Fragment>
                  <Heading level={2} size="M">
                    What we do
                  </Heading>
                  <HTML html={body.processed} />
                </React.Fragment>
              )}

              {field_what_were_working_on && (
                <React.Fragment>
                  <Heading level={2} size="M">
                    What we're working on
                  </Heading>
                  <HTML html={field_what_were_working_on.processed} />
                </React.Fragment>
              )}
            </Prose>
          </Content>
        </Template>
      </Margins>
    </TemplateLayout>
  )
}

export default DepartmentTemplate

function processDepartmentInfo({ node, staffDirectorySlug }) {
  const { relationships, field_email, field_fax_number, title } = node

  const leadership = relationships.field_department_head
    ? {
        icon: 'person_outline',
        content: (
          <React.Fragment>
            Leadership:{' '}
            <Link to={'/users/' + relationships.field_department_head.name}>
              {relationships.field_department_head.field_user_display_name}
            </Link>
          </React.Fragment>
        ),
      }
    : null
  const email = field_email
    ? {
        icon: 'mail_outline',
        content: (
          <React.Fragment>
            Email: <Link to={'mailto:' + field_email}>{field_email}</Link>
          </React.Fragment>
        ),
      }
    : null

  const fax = field_fax_number
    ? {
        icon: 'mail_outline',
        content: <React.Fragment>Fax: {field_fax_number}</React.Fragment>,
      }
    : null

  const org = relationships.field_media_file
    ? {
        icon: 'hierarchy',
        content: (
          <DSLink
            href={
              relationships.field_media_file.relationships.field_media_file
                .localFile.publicURL
            }
          >
            Organization chart
          </DSLink>
        ),
      }
    : null

  const directory = {
    icon: 'people_outline',
    content: (
      <React.Fragment>
        <Link
          to={staffDirectorySlug + '?' + stringifyState({ department: title })}
        >
          Staff directory
        </Link>{' '}
        for {title}
      </React.Fragment>
    ),
  }

  const deptartmentInfo = [leadership, email, fax, org, directory].filter(
    info => info !== null
  )

  return deptartmentInfo
}

export const query = graphql`
  query($slug: String!) {
    department: nodeDepartment(fields: { slug: { eq: $slug } }) {
      ...departmentFragment
    }
    staffDirectoryNode: nodePage(
      relationships: {
        field_design_template: { field_machine_name: { eq: "staff_directory" } }
      }
    ) {
      fields {
        slug
      }
    }
  }
`
