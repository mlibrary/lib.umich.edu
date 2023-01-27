import React from 'react';
import { graphql } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';
import { Heading, SPACING, Margins, Text, SmallScreen } from '../reusable';
import { Template, Top, Side, Content } from '../components/page-layout';
import Breadcrumb from '../components/breadcrumb';
import TemplateLayout from './template-layout';
import getNode from '../utils/get-node';
import SideNavigation from '../components/navigation/side-navigation';
import HorizontalNavigation from '../components/navigation/horizontal-navigation';
import useNavigationBranch from '../components/navigation/use-navigation-branch';
import Panels from '../components/panels';
import Html from '../components/html';
import DestinationLocationInfo from '../components/destination-location-info';

function DestinationTemplate({ data, ...rest }) {
  const node = getNode(data);
  const {
    field_title_context,
    fields,
    body,
    relationships,
    field_local_navigation,
  } = node;

  const navBranch = useNavigationBranch(fields.slug);
  const smallScreenBranch = useNavigationBranch(fields.slug, 'small');
  const smallScreenItems = smallScreenBranch
    ? smallScreenBranch.children
    : null;
  const image =
    relationships.field_media_image &&
    relationships.field_media_image.relationships.field_media_image;
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
            <div
              css={{
                maxWidth: '38rem',
              }}
            >
              <Heading
                level={1}
                size="3XL"
                css={{
                  marginTop: SPACING['S'],
                  marginBottom: SPACING['L'],
                }}
              >
                {field_title_context}
              </Heading>
              <Text
                lede
                css={{
                  marginBottom: SPACING['XL'],
                }}
              >
                {body.summary}
              </Text>

              <DestinationLocationInfo node={node} />

              <GatsbyImage
                image={imageData}
                css={{
                  width: '100%',
                  borderRadius: '2px',
                  marginBottom: SPACING['2XL'],
                }}
                alt=""
              />
            </div>

            {body && <Html html={body.processed} />}

            <Panels data={relationships.field_panels} />
          </Content>
        </Template>
      </Margins>
    </TemplateLayout>
  );
}

export default DestinationTemplate;

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
