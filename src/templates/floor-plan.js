import { Content, Side, Template, Top } from '../components/page-layout';
import { Heading, LINK_STYLES, Margins, SmallScreen, SPACING } from '../reusable';
import Breadcrumb from '../components/breadcrumb';
import { graphql } from 'gatsby';
import HorizontalNavigation from '../components/navigation/horizontal-navigation';
import Html from '../components/html';
import PropTypes from 'prop-types';
import React from 'react';
import SearchEngineOptimization from '../components/seo';
import SideNavigation from '../components/navigation/side-navigation';
import TemplateLayout from './template-layout';
import useNavigationBranch from '../components/navigation/use-navigation-branch';

const FloorPlanTemplate = ({ data }) => {
  const node = data.floorPlan;

  const { title, field_title_context: fieldTitleContext, body, fields, field_local_navigation: fieldLocalNavigation }
    = node;
  const { field_svg_image: fieldSvgImage, field_printable_image: fieldPrintableImage } = node.relationships;
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

            <p
              css={{
                marginTop: SPACING.L
              }}
            >
              <a
                href={fieldPrintableImage.localFile.publicURL}
                css={LINK_STYLES.default}
              >
                {title} PDF
              </a>
            </p>

            <img
              src={fieldSvgImage.localFile.publicURL}
              alt=''
              css={{
                display: 'block',
                marginTop: SPACING['2XL'],
                maxWidth: '38rem',
                width: '100%'
              }}
            />
          </Content>
        </Template>
      </Margins>
    </TemplateLayout>
  );
};

/* eslint-disable camelcase */
FloorPlanTemplate.propTypes = {
  data: PropTypes.shape({
    floorPlan: PropTypes.shape({
      body: PropTypes.shape({
        processed: PropTypes.any
      }),
      field_local_navigation: PropTypes.any,
      field_title_context: PropTypes.any,
      fields: PropTypes.shape({
        breadcrumb: PropTypes.any,
        slug: PropTypes.any
      }),
      relationships: PropTypes.shape({
        field_printable_image: PropTypes.shape({
          localFile: PropTypes.shape({
            publicURL: PropTypes.any
          })
        }),
        field_svg_image: PropTypes.shape({
          localFile: PropTypes.shape({
            publicURL: PropTypes.any
          })
        })
      }),
      title: PropTypes.any
    })
  })
};
/* eslint-enable camelcase */

export default FloorPlanTemplate;

/* eslint-disable react/prop-types */
export const Head = ({ data, location }) => {
  return <SearchEngineOptimization data={data.floorPlan} location={location} />;
};
/* eslint-enable react/prop-types */

export const query = graphql`
  query ($slug: String!) {
    floorPlan: nodeFloorPlan(fields: { slug: { eq: $slug } }) {
      ...floorPlanFragment
    }
  }
`;
