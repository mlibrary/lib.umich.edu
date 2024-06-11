import React from 'react';
import { graphql } from 'gatsby';
import { Heading, Margins, SmallScreen, SPACING } from '../reusable';
import { Content, Side, Template, Top } from '../components/page-layout';
import SearchEngineOptimization from '../components/seo';
import Html from '../components/html';
import Breadcrumb from '../components/breadcrumb';
import SideNavigation from '../components/navigation/side-navigation';
import HorizontalNavigation from '../components/navigation/horizontal-navigation';
import Panels from '../components/panels';
import TemplateLayout from './template-layout';
import useNavigationBranch from '../components/navigation/use-navigation-branch';
import transformNodePanels from '../utils/transform-node-panels';

function BasicTemplate ({ data, ...rest }) {
  const node = data.page ? data.page : data.room ? data.room : null;
  const { field_title_context, body, fields, field_local_navigation } = node;
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
            {field_local_navigation && (
              <SideNavigation to={fields.slug} branch={navBranch} />
            )}
            {field_local_navigation && smallScreenItems && (
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
              {field_title_context}
            </Heading>
            {body && <Html html={body.processed} />}
            <Panels data={bodyPanels} />
          </Content>
        </Template>
      </Margins>
      <Panels data={fullPanels} />
    </TemplateLayout>
  );
}

export default BasicTemplate;

export function Head ({ data }) {
  return <SearchEngineOptimization data={data.page ? data.page : data.room ? data.room : null} />;
}

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
