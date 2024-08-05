import { Content, Side, Template, Top } from '../components/page-layout';
import { Heading, Margins, SmallScreen, SPACING } from '../reusable';
import Breadcrumb from '../components/breadcrumb';
import { graphql } from 'gatsby';
import HorizontalNavigation from '../components/navigation/horizontal-navigation';
import Html from '../components/html';
import Panels from '../components/panels';
import PropTypes from 'prop-types';
import React from 'react';
import SearchEngineOptimization from '../components/seo';
import SideNavigation from '../components/navigation/side-navigation';
import TemplateLayout from './template-layout';
import transformNodePanels from '../utils/transform-node-panels';
import useNavigationBranch from '../components/navigation/use-navigation-branch';

const BasicTemplate = ({ data }) => {
  let node = null;
  if (data.page) {
    node = data.page;
  } else if (data.room) {
    node = data.room;
  }
  const { field_title_context: fieldTitleContext, body, fields, field_local_navigation: fieldLocalNavigation } = node;
  const { bodyPanels, fullPanels } = transformNodePanels({ node });
  const navBranch = useNavigationBranch(fields.slug);
  const smallScreenBranch = useNavigationBranch(fields.slug, 'small');
  const smallScreenItems = smallScreenBranch
    ? smallScreenBranch.children
    : null;

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
            {body && <Html html={body.processed} />}
            <Panels data={bodyPanels} />
          </Content>
        </Template>
      </Margins>
      <Panels data={fullPanels} />
    </TemplateLayout>
  );
};

BasicTemplate.propTypes = {
  data: PropTypes.shape({
    page: PropTypes.any,
    room: PropTypes.any
  })
};

export default BasicTemplate;

/* eslint-disable react/prop-types */
export const Head = ({ data }) => {
  let node = null;

  if (data.page) {
    node = data.page;
  } else if (data.room) {
    node = data.room;
  }

  return <SearchEngineOptimization data={node} />;
};
/* eslint-enable react/prop-types */

export const query = graphql`
  query ($slug: String!) {
    page: nodePage(fields: { slug: { eq: $slug } }) {
      ...pageFragment
    }
    room: nodeRoom(fields: { slug: { eq: $slug } }) {
      ...roomFragment
    }
  }
`;
