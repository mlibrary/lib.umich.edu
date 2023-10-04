import React from 'react';
import { graphql } from 'gatsby';
import { Heading, List, COLORS } from '../reusable';
import { Template, TemplateSide, TemplateContent } from '../components/aside-layout';
import Layout from '../components/layout';
import SearchEngineOptimization from '../components/seo';
import PageHeader from '../components/page-header';
import Prose from '../components/prose';
import HorizontalNavigation from '../components/navigation/horizontal-navigation';
import processHorizontalNavigationData from '../components/utilities/process-horizontal-navigation-data';
import Html from '../components/html';
import LocationAside from '../components/location-aside';
import Panels from '../components/panels';
import transformNodePanels from '../utils/transform-node-panels';
import getNode from '../utils/get-node';

export default function VisitTemplate ({ data, ...rest }) {
  const node = getNode(data);
  const {
    title,
    field_title_context,
    fields,
    relationships,
    drupal_internal__nid,
    body,
    field_root_page_,
    field_access
  } = node;
  const parentNode = relationships.field_parent_page[0];
  const isRootPage = !!field_root_page_;
  const { field_visit, field_amenities } = relationships;
  const { bodyPanels, fullPanels } = transformNodePanels({ node });

  return (
    <Layout drupalNid={drupal_internal__nid}>
      <header aria-label='Location description'>
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
          parentNodeOrderByDrupalId: rest.pageContext.parents,
          parentNodes: data.parents.edges,
          currentNode: node,
          childrenNodeOrderByDrupalId: rest.pageContext.children,
          childrenNodes: data.children.edges,
          isRootPage,
          parentNode
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
                <span aria-hidden='true'>{field_title_context}</span>
              </Heading>
              <HTMLList data={field_visit} />

              {field_access && (
                <>
                  <Heading level={2} size='M'>
                    Getting here
                  </Heading>

                  <Html html={field_access.processed} />
                </>
              )}

              {field_amenities?.length > 0 && (
                <>
                  <Heading level={2} size='M'>
                    Amenities
                  </Heading>
                  <List type='bulleted'>
                    {field_amenities.sort((a, b) => {
                      return a.weight - b.weight;
                    }).map(({ name, description }, i) => {
                      return (
                        <li key={i + name}>
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
            background: COLORS.blue['100']
          }
        }}
      >
        <Panels data={fullPanels} />
      </div>
    </Layout>
  );
}

export function Head ({ data }) {
  return <SearchEngineOptimization data={getNode(data)} />;
}

function HTMLList ({ data }) {
  const sorted = data.sort((a, b) => {
    const weightA = a.weight;
    const weightB = b.weight;

    if (weightA < weightB) {
      return -1;
    }

    if (weightA > weightB) {
      return 1;
    }

    return 0;
  });

  return (
    <List type='bulleted'>
      {sorted.map(({ description }, i) => {
        return (
          <li key={i + description.processed}>
            <Html html={description.processed} />
          </li>
        );
      })}
    </List>
  );
}

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
