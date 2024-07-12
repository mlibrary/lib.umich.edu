import { Content, Side, Template, Top } from '../components/page-layout';
import { Heading, Margins, SmallScreen, SPACING, Text } from '../reusable';
import Breadcrumb from '../components/breadcrumb';
import DestinationLocationInfo from '../components/destination-location-info';
import { GatsbyImage } from 'gatsby-plugin-image';
import getNode from '../utils/get-node';
import { graphql } from 'gatsby';
import HorizontalNavigation from '../components/navigation/horizontal-navigation';
import Html from '../components/html';
import Panels from '../components/panels';
import PropTypes from 'prop-types';
import React from 'react';
import SearchEngineOptimization from '../components/seo';
import SideNavigation from '../components/navigation/side-navigation';
import TemplateLayout from './template-layout';
import useNavigationBranch from '../components/navigation/use-navigation-branch';

const DestinationTemplate = ({ data }) => {
  const node = getNode(data);
  const {
    field_title_context: fieldTitleContext,
    fields,
    body,
    relationships,
    field_local_navigation: fieldLocalNavigation
  } = node;

  const navBranch = useNavigationBranch(fields.slug);
  const smallScreenBranch = useNavigationBranch(fields.slug, 'small');
  const smallScreenItems = smallScreenBranch
    ? smallScreenBranch.children
    : null;
  const image
    = relationships.field_media_image
    && relationships.field_media_image.relationships.field_media_image;
  const imageData = image
    ? image.localFile.childImageSharp.gatsbyImageData
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
            <div
              css={{
                maxWidth: '38rem'
              }}
            >
              <Heading
                level={1}
                size='3XL'
                css={{
                  marginBottom: SPACING.L,
                  marginTop: SPACING.S
                }}
              >
                {fieldTitleContext}
              </Heading>
              <Text
                lede
                css={{
                  marginBottom: SPACING.XL
                }}
              >
                {body.summary}
              </Text>

              <DestinationLocationInfo node={node} />

              <GatsbyImage
                image={imageData}
                css={{
                  borderRadius: '2px',
                  marginBottom: SPACING['2XL'],
                  width: '100%'
                }}
                alt=''
              />
            </div>

            {body && <Html html={body.processed} />}

            <Panels data={relationships.field_panels} />
          </Content>
        </Template>
      </Margins>
    </TemplateLayout>
  );
};

DestinationTemplate.propTypes = {
  data: PropTypes.any
};

export default DestinationTemplate;

/* eslint-disable react/prop-types */
export const Head = ({ data }) => {
  return <SearchEngineOptimization data={getNode(data)} />;
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
    location: nodeLocation(fields: { slug: { eq: $slug } }) {
      ...locationFragment
    }
  }
`;
