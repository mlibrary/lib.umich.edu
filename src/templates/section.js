import { Heading, Margins, MEDIA_QUERIES } from '../reusable';
import { Template, TemplateContent, TemplateSide } from '../components/aside-layout';
import { graphql } from 'gatsby';
import HorizontalNavigation from '../components/navigation/horizontal-navigation';
import Html from '../components/html';
import Layout from '../components/layout';
import LocationAside from '../components/location-aside';
import PageHeader from '../components/page-header';
import PageHeaderMini from '../components/page-header-mini';
import Panels from '../components/panels';
import processHorizontalNavigationData from '../components/utilities/process-horizontal-navigation-data';
import PropTypes from 'prop-types';
import Prose from '../components/prose';
import React from 'react';
import SearchEngineOptimization from '../components/seo';
import transformNodePanels from '../utils/transform-node-panels';

const renderHorziontalNavigationCSS = (isRootPage) => {
  if (!isRootPage) {
    return {
      borderTop: 'none'
    };
  }

  return {};
};

const SectionTemplate = ({ data, ...rest }) => {
  const node = data.page;
  const {
    title,
    field_title_context: fieldTitleContext,
    field_header_title: fieldHeaderTitle,
    field_root_page_: fieldRootPage,
    body,
    fields,
    relationships,
    drupal_internal__nid: drupalInternalNid
  } = node;

  const [parentNode] = relationships.field_parent_page;
  const { breadcrumb } = fields;
  const isRootPage = Boolean(fieldRootPage);
  const pageHeaderImage
    = relationships.field_media_image
    && relationships.field_media_image.relationships.field_media_image;
  const hasBody = body && body.processed && body.processed.length;
  /*
   *Use the parent page if not the root
   *for PageHeader summary and image.
   */
  const summary = isRootPage ? body.summary : parentNode.body.summary;
  const { bodyPanels, fullPanels } = transformNodePanels({ node });

  return (
    <Layout drupalNid={drupalInternalNid}>
      {isRootPage
        ? (
            <PageHeader
              breadcrumb={breadcrumb}
              title={fieldHeaderTitle}
              summary={summary}
              image={pageHeaderImage}
            />
          )
        : (
            <PageHeaderMini breadcrumb={breadcrumb} title={fieldHeaderTitle} />
          )}
      <HorizontalNavigation
        items={processHorizontalNavigationData({
          childrenNodeOrderByDrupalId: rest.pageContext.children,
          childrenNodes: data.children.edges,
          currentNode: data.page,
          isRootPage,
          parentNode,
          parentNodeOrderByDrupalId: rest.pageContext.parents,
          parentNodes: data.parents.edges
        })}
        css={renderHorziontalNavigationCSS(isRootPage)}
      />

      {hasBody
        ? (
            <Template>
              <TemplateContent>
                <Prose>
                  <Heading level={1} size='L' data-page-heading>
                    <span className='visually-hidden'>{title}</span>
                    <span aria-hidden='true'>{fieldTitleContext}</span>
                  </Heading>

                  {body && <Html html={body.processed} />}
                </Prose>

                <Panels data={bodyPanels} />
              </TemplateContent>
              {relationships.field_design_template.field_machine_name
              === 'section_locaside'
              && parentNode && (
                <TemplateSide
                  css={{
                    display: 'none',
                    [MEDIA_QUERIES.LARGESCREEN]: {
                      display: 'block'
                    }
                  }}
                >
                  <LocationAside node={parentNode} />
                </TemplateSide>
              )}
            </Template>
          )
        : (
            <Margins>
              <Heading level={1} size='L' data-page-heading>
                <span className='visually-hidden'>{title}</span>
                <span aria-hidden='true'>{fieldTitleContext}</span>
              </Heading>
            </Margins>
          )}

      <Panels data={fullPanels} />
    </Layout>
  );
};

/* eslint-disable camelcase */
SectionTemplate.propTypes = {
  data: PropTypes.shape({
    children: PropTypes.shape({
      edges: PropTypes.any
    }),
    page: PropTypes.shape({
      body: PropTypes.shape({
        processed: PropTypes.shape({
          length: PropTypes.any
        }),
        summary: PropTypes.any
      }),
      drupal_internal__nid: PropTypes.any,
      field_header_title: PropTypes.any,
      field_root_page_: PropTypes.any,
      field_title_context: PropTypes.any,
      fields: PropTypes.shape({
        breadcrumb: PropTypes.any
      }),
      relationships: PropTypes.shape({
        field_design_template: PropTypes.shape({
          field_machine_name: PropTypes.string
        }),
        field_media_image: PropTypes.shape({
          relationships: PropTypes.shape({
            field_media_image: PropTypes.any
          })
        }),
        field_parent_page: PropTypes.any
      }),
      title: PropTypes.any
    }),
    parents: PropTypes.shape({
      edges: PropTypes.any
    })
  })
};
/* eslint-enable camelcase */

export default SectionTemplate;

export const Head = ({ data }) => {
  return <SearchEngineOptimization data={data.page} />;
};

Head.propTypes = {
  data: PropTypes.shape({
    page: PropTypes.any
  })
};

export const query = graphql`
  query ($slug: String!, $parents: [String], $children: [String]) {
    page: nodeSectionPage(fields: { slug: { eq: $slug } }) {
      ...sectionFragment
    }
    parents: allNodeSectionPage(filter: { drupal_id: { in: $parents } }) {
      edges {
        node {
          ...sectionCardFragment
        }
      }
    }
    children: allNodeSectionPage(filter: { drupal_id: { in: $children } }) {
      edges {
        node {
          ...sectionCardFragment
        }
      }
    }
  }
`;
