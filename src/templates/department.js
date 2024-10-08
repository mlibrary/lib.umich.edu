/* eslint-disable id-length */
import { Content, Side, Template, Top } from '../components/page-layout';
import { Link as DSLink, Heading, Icon, List, Margins, SmallScreen, SPACING } from '../reusable';
import Breadcrumb from '../components/breadcrumb';
import { graphql } from 'gatsby';
import HorizontalNavigation from '../components/navigation/horizontal-navigation';
import Html from '../components/html';
import Link from '../components/link';
import LinkCallout from '../components/link-callout';
import Panels from '../components/panels';
import PropTypes from 'prop-types';
import Prose from '../components/prose';
import React from 'react';
import SearchEngineOptimization from '../components/seo';
import SideNavigation from '../components/navigation/side-navigation';
import { stringifyState } from '../utils/get-url-state';
import TemplateLayout from './template-layout';
import transformNodePanels from '../utils/transform-node-panels';
import useNavigationBranch from '../components/navigation/use-navigation-branch';

const processDepartmentInfo = ({ node, staffDirectorySlug }) => {
  const { relationships, field_email: fieldEmail, field_fax_number: fieldFaxNumber, title } = node;

  const leadership = relationships.field_department_head
    ? {
        content: (
          <>
            Leadership:
            {relationships.field_department_head.map((departmentHead, index, arr) => {
              return (
                <React.Fragment key={index}>
                  {index > 0 && arr.length !== 2 && ','}
                  {index > 0 && index + 1 === arr.length && ' and'}
                  {' '}
                  <Link to={`/users/${departmentHead.name}`}>
                    {departmentHead.field_user_display_name}
                  </Link>
                </React.Fragment>
              );
            })}
          </>
        ),
        icon: 'person_outline'
      }
    : null;

  const email = fieldEmail
    ? {
        content: (
          <>
            Email: <Link to={`mailto:${fieldEmail}`}>{fieldEmail}</Link>
          </>
        ),
        icon: 'mail_outline'
      }
    : null;

  const fax = fieldFaxNumber
    ? {
        content: <>Fax: {fieldFaxNumber}</>,
        d: 'M 18 3 V 7 H 6 V 3 Z M 21.6 9.52 a 3.16 3.16 0 0 0 -1.11 -1.1 A 2.93 2.93 0 0 0 19 8 H 5 a 2.91 2.91 0 0 0 -1.49 0.41 a 3.08 3.08 0 0 0 -1.11 1.1 A 3 3 0 0 0 2 11 v 6 H 6 v 4 H 18 V 17 h 4 V 11 A 3 3 0 0 0 21.6 9.52 Z M 16 19 H 8 V 14 h 8 Z m 3.74 -7.28 A 1 1 0 0 1 19 12 a 1 1 0 0 1 -0.7 -0.28 A 0.94 0.94 0 0 1 18 11 a 1.07 1.07 0 0 1 0.28 -0.73 A 0.91 0.91 0 0 1 19 10 a 1 1 0 0 1 0.73 0.31 A 1 1 0 0 1 20 11 A 0.92 0.92 0 0 1 19.73 11.71 Z'

      }
    : null;

  const org = relationships.field_media_file
    ? {
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
        icon: 'hierarchy'
      }
    : null;

  const directory = {
    content: (
      <>
        <Link
          to={`${staffDirectorySlug}?${stringifyState({ department: title })}`}
        >
          Staff directory
        </Link>
        {' '}
        for
        {' '}
        {title}
      </>
    ),
    icon: 'people_outline'
  };

  const deptartmentInfo = [leadership, email, fax, org, directory].filter(
    (info) => {
      return info !== null;
    }
  );

  return deptartmentInfo;
};

const DepartmentTemplate = ({ data }) => {
  const node = data.department;
  const {
    field_title_context: fieldTitleContext,
    body,
    fields,
    field_local_navigation: fieldLocalNavigation,
    field_make_an_appointment: fieldMakeAnAppointment,
    field_what_were_working_on: fieldWhatWereWorkingOn
  } = node;
  const navBranch = useNavigationBranch(fields.slug);
  const smallScreenBranch = useNavigationBranch(fields.slug, 'small');
  const smallScreenItems = smallScreenBranch
    ? smallScreenBranch.children
    : null;
  const departmentInfo = processDepartmentInfo({
    node,
    staffDirectorySlug: data.staffDirectoryNode.fields.slug
  });
  const { bodyPanels, fullPanels } = transformNodePanels({ node });
  return (
    <TemplateLayout node={node}>
      <Margins>
        <Template>
          <Top>
            <Breadcrumb data={fields.breadcrumb} />
          </Top>
          <Side>
            {fieldLocalNavigation && (
              <SideNavigation to={fields.slug} branch={navBranch} />
            )}
            {fieldLocalNavigation && smallScreenItems && (
              <SmallScreen>
                <div
                  css={{
                    margin: `0 -${SPACING.M}`
                  }}
                >
                  <HorizontalNavigation items={smallScreenItems} />
                </div>
              </SmallScreen>
            )}
          </Side>
          <Content>
            <Heading
              size='3XL'
              level={1}
              css={{
                marginBottom: SPACING.L
              }}
            >
              {fieldTitleContext}
            </Heading>
            <Prose>
              <Heading size='M' level={2}>
                Who we are
              </Heading>

              <List
                css={{
                  svg: {
                    marginRight: SPACING.XS
                  }
                }}
              >
                {departmentInfo.map(({ icon, d, content }, index) => {
                  return (
                    <li key={index}>
                      {d ? <Icon d={d} /> : <Icon icon={icon} />}
                      {content}
                    </li>
                  );
                })}
              </List>

              {fieldMakeAnAppointment && (
                <div
                  css={{
                    a: {
                      display: 'inline-block'
                    },
                    marginTop: SPACING['2XL']
                  }}
                >
                  <LinkCallout to={fieldMakeAnAppointment.uri} icon='today'>
                    Make an appointment with us
                  </LinkCallout>
                </div>
              )}

              {body && (
                <>
                  <Heading level={2} size='M'>
                    What we do
                  </Heading>
                  <Html html={body.processed} />
                </>
              )}

              {fieldWhatWereWorkingOn && (
                <>
                  <Heading level={2} size='M'>
                    What we&rsquo;re working on
                  </Heading>
                  <Html html={fieldWhatWereWorkingOn.processed} />
                </>
              )}
            </Prose>

            <Panels data={bodyPanels} />
          </Content>
        </Template>
      </Margins>

      <Panels data={fullPanels} />
    </TemplateLayout>
  );
};

DepartmentTemplate.propTypes = {
  data: PropTypes.object
};

export default DepartmentTemplate;

/* eslint-disable react/prop-types */
export const Head = ({ data }) => {
  return <SearchEngineOptimization data={data.department} />;
};
/* eslint-enable react/prop-types */

export const query = graphql`
  query ($slug: String!) {
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
`;
