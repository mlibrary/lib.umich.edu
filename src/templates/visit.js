import { Heading, List } from '../reusable';
import { Template, TemplateContent, TemplateSide } from '../components/aside-layout';
import getNode from '../utils/get-node';
import { graphql } from 'gatsby';
import HorizontalNavigation from '../components/navigation/horizontal-navigation';
import Html from '../components/html';
import Layout from '../components/layout';
import LocationAside from '../components/location-aside';
import PageHeader from '../components/page-header';
import Panels from '../components/panels';
import processHorizontalNavigationData from '../components/utilities/process-horizontal-navigation-data';
import PropTypes from 'prop-types';
import Prose from '../components/prose';
import React from 'react';
import SearchEngineOptimization from '../components/seo';
import transformNodePanels from '../utils/transform-node-panels';

export default function VisitTemplate ({ data, ...rest }) {
  const node = getNode(data);
  const {
    title,
    field_title_context: fieldTitleContext,
    fields,
    relationships,
    drupal_internal__nid: drupalInternalNid,
    body,
    field_root_page_: fieldRootPage,
    field_access: fieldAccess
  } = node;
  const [parentNode] = relationships.field_parent_page;
  const isRootPage = Boolean(fieldRootPage);
  const { field_visit: fieldVisit, field_amenities: fieldAmenities } = relationships;
  const { bodyPanels, fullPanels } = transformNodePanels({ node });
  return (
    <Layout drupalNid={drupalInternalNid}>
      <header>
        <PageHeader
          breadcrumb={fields.breadcrumb}
          title={title}
          summary={body ? body.summary : null}
          image={
            relationships.field_media_image.relationships.field_media_image
          }
        />
      </header>
      <HorizontalNavigation
        items={processHorizontalNavigationData({
          childrenNodeOrderByDrupalId: rest.pageContext.children,
          childrenNodes: data.children.edges,
          currentNode: node,
          isRootPage,
          parentNode,
          parentNodeOrderByDrupalId: rest.pageContext.parents,
          parentNodes: data.parents.edges
        })}
      />
      <section aria-label='Hours, parking, and amenities'>
        <Template>
          <TemplateSide>
            <LocationAside node={node} />
          </TemplateSide>
          <TemplateContent>
            <Prose>
              <Heading
                level={1}
                size='XL'
                css={{
                  fontWeight: '600'
                }}
                data-page-heading
              >
                <span className='visually-hidden'>{title}</span>
                <span aria-hidden='true'>{fieldTitleContext}</span>
              </Heading>

              {fieldVisit?.length > 0 && (
                <>
                  <List type='bulleted'>
                    {fieldVisit.sort((sortLeft, sortRight) => {
                      return sortLeft.weight - sortRight.weight;
                    }).map(({ description }, iterator) => {
                      return (
                        <li key={iterator + description.processed}>
                          <Html html={description.processed} />
                        </li>
                      );
                    })}
                  </List>
                </>
              )}

              {fieldAccess?.processed && (
                <>
                  <Heading level={2} size='M'>
                    Getting here
                  </Heading>

                  <Html html={fieldAccess.processed} />
                </>
              )}

              {fieldAmenities?.length > 0 && (
                <>
                  <Heading level={2} size='M'>
                    Amenities
                  </Heading>
                  <List type='bulleted'>
                    {fieldAmenities.sort((sortLeft, sortRight) => {
                      return sortLeft.weight - sortRight.weight;
                    }).map(({ name, description }, iterator) => {
                      return (
                        <li key={iterator + name}>
                          {description
                            ? (
                                <Html html={description.processed} />
                              )
                            : (
                                <>{name}</>
                              )}
                        </li>
                      );
                    })}
                  </List>
                </>
              )}
            </Prose>

            <Panels data={bodyPanels} />
          </TemplateContent>
        </Template>
      </section>

      <div
        css={{
          'section:nth-of-type(odd)': {
            background: 'var(--color-blue-100)'
          }
        }}
      >
        <Panels data={fullPanels} />
      </div>
    </Layout>
  );
}

VisitTemplate.propTypes = {
  data: PropTypes.object
};

/* eslint-disable react/prop-types */
export const Head = ({ data }) => {
  return <SearchEngineOptimization data={getNode(data)} />;
};
/* eslint-enable react/prop-types */

export const query = graphql`
  query ($slug: String!, $parents: [String], $children: [String]) {
    building: nodeBuilding(fields: { slug: { eq: $slug } }) {
      ...buildingFragment
    }
    room: nodeRoom(fields: { slug: { eq: $slug } }) {
      ...roomFragment
    }
    location: nodeLocation(fields: { slug: { eq: $slug } }) {
      ...locationFragment
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
