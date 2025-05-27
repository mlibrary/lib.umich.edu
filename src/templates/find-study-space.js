import { Heading, Margins, MEDIA_QUERIES, SPACING, TYPOGRAPHY } from '../reusable';
import CardImage from '../reusable/card-image';
import Card from '../components/Card';
import Breadcrumb from '../components/breadcrumb';
import Collapsible from '../components/collapsible';
import { graphql } from 'gatsby';
import Html from '../components/html';
import PropTypes from 'prop-types';
import React from 'react';
import SearchEngineOptimization from '../components/seo';
import TemplateLayout from './template-layout';
import { Template, TemplateContent, TemplateSide } from '../components/aside-layout';
import transformNodePanels from '../utils/transform-node-panels';

const FindStudySpaceTemplate = ({ data }) => {
  // Get all study spaces from locations and rooms, combine them, then sort them alphabetically
  const allStudySpaces = data.locations.edges.concat(data.rooms.edges);
  allStudySpaces.sort((a, b) => {
    const titleA = a.node.title.toLowerCase();
    const titleB = b.node.title.toLowerCase();

    if (titleA < titleB) {
      return -1;
    }
    if (titleA > titleB) {
      return 1;
    }
    return 0;
  });
  let node = null;
  if (data.page) {
    node = data.page;
  } else if (data.room) {
    node = data.room;
  }
  const { field_title_context: fieldTitleContext, body, fields } = node;

  return (
    <TemplateLayout node={node}>
      <Margins
        css={{
          marginBottom: SPACING['2XL']
        }}
      >
        <Breadcrumb data={fields.breadcrumb} />
        <Heading
          size='3XL'
          level={1}
          css={{
            marginBottom: SPACING.S
          }}
        >
          {fieldTitleContext}
        </Heading>

        {body && (
          <div
            css={{
              marginBottom: SPACING.XL
            }}
          >
            <Html html={body.processed} />{' '}
          </div>
        )}
      </Margins>
      <Template contentSide='right'>
        <TemplateSide
          css={{
            'div:first-of-type':
            {
              border: 'none !important'
            }
          }}
          contentSide='right'
        >
          <div css={{
            color: 'var(--color-neutral-300)',
            fontWeight: 'bold',
            marginBottom: SPACING.M
          }}
          >
            FILTER BY
          </div>
          <div css={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: SPACING.M
          }}
          >
            <input
              css={{
                accentColor: 'var(--color-teal-400)',
                height: '18px',
                marginRight: '0.75rem',
                width: '18px',
                marginLeft: 0
              }}
              type='checkbox'
              id='bookableSpacesOnly'
              name='bookableSpaceOnly'
            />
            <label
              css={{
                color: 'var(--color-neutral-400)',
                fontSize: '1rem',
                fontWeight: 'normal'
              }}
              htmlFor='bookableSpacesOnly'
            >
              Bookable spaces only
            </label>
          </div>
          <Collapsible title='Locations'>
            <div css={{
              display: 'flex',
              flexFlow: 'column wrap',
              gap: '1rem'
            }}
            >
              <div css={{
                alignItems: 'center',
                display: 'flex'
              }}
              >
                <input
                  css={{
                    accentColor: 'var(--color-teal-400)',
                    height: '18px',
                    marginRight: '0.75rem',
                    width: '18px'
                  }}
                  type='checkbox'
                  id='cheese'
                  name='topping'
                />
                <label
                  css={{
                    color: 'var(--color-neutral-400)',
                    fontSize: '1rem',
                    fontWeight: 'normal'
                  }}
                  htmlFor='cheese'
                >
                  Extra Cheese
                </label>
              </div>
              <div css={{
                alignItems: 'center',
                display: 'flex'
              }}
              >
                <input
                  css={{
                    accentColor: 'var(--color-teal-400)',
                    height: '18px',
                    marginRight: '0.75rem',
                    width: '18px'
                  }}
                  type='checkbox'
                  id='green'
                  name='topping'
                />
                <label
                  css={{
                    color: 'var(--color-neutral-400)',
                    fontSize: '1rem',
                    fontWeight: 'normal'
                  }}
                  htmlFor='green'
                >
                  Green pepper
                </label>
              </div>
              <div css={{
                alignItems: 'center',
                display: 'flex'
              }}
              >
                <input
                  css={{
                    accentColor: 'var(--color-teal-400)',
                    height: '18px',
                    marginRight: '0.75rem',
                    width: '18px'
                  }}
                  type='checkbox'
                  id='onion'
                  name='topping'
                />
                <label
                  css={{
                    color: 'var(--color-neutral-400)',
                    fontSize: '1rem',
                    fontWeight: 'normal'
                  }}
                  htmlFor='onion'
                >
                  Onion
                </label>
              </div>
              <div css={{
                alignItems: 'center',
                display: 'flex'
              }}
              >
                <input
                  css={{
                    accentColor: 'var(--color-teal-400)',
                    height: '18px',
                    marginRight: '0.75rem',
                    width: '18px'
                  }}
                  type='checkbox'
                  id='brocc'
                  name='topping'
                />
                <label
                  css={{
                    color: 'var(--color-neutral-400)',
                    fontSize: '1rem',
                    fontWeight: 'normal'
                  }}
                  htmlFor='brocc'
                >
                  Broccoli
                </label>
              </div>
              <div css={{
                alignItems: 'center',
                display: 'flex'
              }}
              >
                <input
                  css={{
                    accentColor: 'var(--color-teal-400)',
                    height: '18px',
                    marginRight: '0.75rem',
                    width: '18px'
                  }}
                  type='checkbox'
                  id='pepp'
                  name='topping'
                />
                <label
                  css={{
                    color: 'var(--color-neutral-400)',
                    fontSize: '1rem',
                    fontWeight: 'normal'
                  }}
                  htmlFor='pepp'
                >
                  Pepperoni
                </label>
              </div>
              <div css={{
                alignItems: 'center',
                display: 'flex'
              }}
              >
                <input
                  css={{
                    accentColor: 'var(--color-teal-400)',
                    height: '18px',
                    marginRight: '0.75rem',
                    width: '18px'
                  }}
                  type='checkbox'
                  id='pina'
                  name='topping'
                />
                <label
                  css={{
                    color: 'var(--color-neutral-400)',
                    fontSize: '1rem',
                    fontWeight: 'normal'
                  }}
                  htmlFor='pina'
                >
                  Pineapple
                </label>
              </div>
            </div>

          </Collapsible>
          <hr css={{
            display: 'block',
            height: '1px',
            border: 0,
            borderTop: '1px solid var(--color-neutral-100)',
            margin: '1em 0',
            padding: 0
          }}
          />
          <Collapsible title='Noise levels'>
            <div css={{
              display: 'flex',
              flexFlow: 'column wrap',
              gap: '1rem'
            }}
            >
              <div css={{
                alignItems: 'center',
                display: 'flex'
              }}
              >
                <input
                  css={{
                    accentColor: 'var(--color-teal-400)',
                    height: '18px',
                    marginRight: '0.75rem',
                    width: '18px'
                  }}
                  type='checkbox'
                  id='cheese'
                  name='topping'
                />
                <label
                  css={{
                    color: 'var(--color-neutral-400)',
                    fontSize: '1rem',
                    fontWeight: 'normal'
                  }}
                  htmlFor='cheese'
                >
                  Extra Cheese
                </label>
              </div>
              <div css={{
                alignItems: 'center',
                display: 'flex'
              }}
              >
                <input
                  css={{
                    accentColor: 'var(--color-teal-400)',
                    height: '18px',
                    marginRight: '0.75rem',
                    width: '18px'
                  }}
                  type='checkbox'
                  id='green'
                  name='topping'
                />
                <label
                  css={{
                    color: 'var(--color-neutral-400)',
                    fontSize: '1rem',
                    fontWeight: 'normal'
                  }}
                  htmlFor='green'
                >
                  Green pepper
                </label>
              </div>
              <div css={{
                alignItems: 'center',
                display: 'flex'
              }}
              >
                <input
                  css={{
                    accentColor: 'var(--color-teal-400)',
                    height: '18px',
                    marginRight: '0.75rem',
                    width: '18px'
                  }}
                  type='checkbox'
                  id='onion'
                  name='topping'
                />
                <label
                  css={{
                    color: 'var(--color-neutral-400)',
                    fontSize: '1rem',
                    fontWeight: 'normal'
                  }}
                  htmlFor='onion'
                >
                  Onion
                </label>
              </div>
              <div css={{
                alignItems: 'center',
                display: 'flex'
              }}
              >
                <input
                  css={{
                    accentColor: 'var(--color-teal-400)',
                    height: '18px',
                    marginRight: '0.75rem',
                    width: '18px'
                  }}
                  type='checkbox'
                  id='brocc'
                  name='topping'
                />
                <label
                  css={{
                    color: 'var(--color-neutral-400)',
                    fontSize: '1rem',
                    fontWeight: 'normal'
                  }}
                  htmlFor='brocc'
                >
                  Broccoli
                </label>
              </div>
              <div css={{
                alignItems: 'center',
                display: 'flex'
              }}
              >
                <input
                  css={{
                    accentColor: 'var(--color-teal-400)',
                    height: '18px',
                    marginRight: '0.75rem',
                    width: '18px'
                  }}
                  type='checkbox'
                  id='pepp'
                  name='topping'
                />
                <label
                  css={{
                    color: 'var(--color-neutral-400)',
                    fontSize: '1rem',
                    fontWeight: 'normal'
                  }}
                  htmlFor='pepp'
                >
                  Pepperoni
                </label>
              </div>
              <div css={{
                alignItems: 'center',
                display: 'flex'
              }}
              >
                <input
                  css={{
                    accentColor: 'var(--color-teal-400)',
                    height: '18px',
                    marginRight: '0.75rem',
                    width: '18px'
                  }}
                  type='checkbox'
                  id='pina'
                  name='topping'
                />
                <label
                  css={{
                    color: 'var(--color-neutral-400)',
                    fontSize: '1rem',
                    fontWeight: 'normal'
                  }}
                  htmlFor='pina'
                >
                  Pineapple
                </label>
              </div>
            </div>
          </Collapsible>
          <hr css={{
            display: 'block',
            height: '1px',
            border: 0,
            borderTop: '1px solid var(--color-neutral-100)',
            margin: '1em 0',
            padding: 0
          }}
          />
          <Collapsible title='Features'>
            <div css={{
              display: 'flex',
              flexFlow: 'column wrap',
              gap: '1rem'
            }}
            >
              <div css={{
                alignItems: 'center',
                display: 'flex'
              }}
              >
                <input
                  css={{
                    accentColor: 'var(--color-teal-400)',
                    height: '18px',
                    marginRight: '0.75rem',
                    width: '18px'
                  }}
                  type='checkbox'
                  id='cheese'
                  name='topping'
                />
                <label
                  css={{
                    color: 'var(--color-neutral-400)',
                    fontSize: '1rem',
                    fontWeight: 'normal'
                  }}
                  htmlFor='cheese'
                >
                  Extra Cheese
                </label>
              </div>
              <div css={{
                alignItems: 'center',
                display: 'flex'
              }}
              >
                <input
                  css={{
                    accentColor: 'var(--color-teal-400)',
                    height: '18px',
                    marginRight: '0.75rem',
                    width: '18px'
                  }}
                  type='checkbox'
                  id='green'
                  name='topping'
                />
                <label
                  css={{
                    color: 'var(--color-neutral-400)',
                    fontSize: '1rem',
                    fontWeight: 'normal'
                  }}
                  htmlFor='green'
                >
                  Green pepper
                </label>
              </div>
              <div css={{
                alignItems: 'center',
                display: 'flex'
              }}
              >
                <input
                  css={{
                    accentColor: 'var(--color-teal-400)',
                    height: '18px',
                    marginRight: '0.75rem',
                    width: '18px'
                  }}
                  type='checkbox'
                  id='onion'
                  name='topping'
                />
                <label
                  css={{
                    color: 'var(--color-neutral-400)',
                    fontSize: '1rem',
                    fontWeight: 'normal'
                  }}
                  htmlFor='onion'
                >
                  Onion
                </label>
              </div>
              <div css={{
                alignItems: 'center',
                display: 'flex'
              }}
              >
                <input
                  css={{
                    accentColor: 'var(--color-teal-400)',
                    height: '18px',
                    marginRight: '0.75rem',
                    width: '18px'
                  }}
                  type='checkbox'
                  id='brocc'
                  name='topping'
                />
                <label
                  css={{
                    color: 'var(--color-neutral-400)',
                    fontSize: '1rem',
                    fontWeight: 'normal'
                  }}
                  htmlFor='brocc'
                >
                  Broccoli
                </label>
              </div>
              <div css={{
                alignItems: 'center',
                display: 'flex'
              }}
              >
                <input
                  css={{
                    accentColor: 'var(--color-teal-400)',
                    height: '18px',
                    marginRight: '0.75rem',
                    width: '18px'
                  }}
                  type='checkbox'
                  id='pepp'
                  name='topping'
                />
                <label
                  css={{
                    color: 'var(--color-neutral-400)',
                    fontSize: '1rem',
                    fontWeight: 'normal'
                  }}
                  htmlFor='pepp'
                >
                  Pepperoni
                </label>
              </div>
              <div css={{
                alignItems: 'center',
                display: 'flex'
              }}
              >
                <input
                  css={{
                    accentColor: 'var(--color-teal-400)',
                    height: '18px',
                    marginRight: '0.75rem',
                    width: '18px'
                  }}
                  type='checkbox'
                  id='pina'
                  name='topping'
                />
                <label
                  css={{
                    color: 'var(--color-neutral-400)',
                    fontSize: '1rem',
                    fontWeight: 'normal'
                  }}
                  htmlFor='pina'
                >
                  Pineapple
                </label>
              </div>
            </div>
          </Collapsible>
        </TemplateSide>

        <TemplateContent css={{
          marginLeft: SPACING['2XL'],
          marginRight: '0 !important'
        }}
        >
          <section
            css={{
              marginBottom: SPACING.XL,
              [MEDIA_QUERIES.L]: {
                display: 'grid',
                gridGap: SPACING.M,
                gridTemplateColumns: `18.75rem 1fr `
              }
            }}
          >
            {allStudySpaces.map((edge, index) => {
              const cardImage = edge.node.relationships?.field_media_image?.relationships?.field_media_image?.localFile?.childImageSharp.gatsbyImageData;
              const cardAlt = edge.node.relationships?.field_media_image?.field_media_image?.alt;
              const cardTitle = edge.node.fields.title;
              const cardSummary = edge.node.body.summary;
              return (
                <div key={index}>
                  <CardImage image={cardImage} alt={cardAlt} />
                  <div>
                    <Heading
                      size='S'
                      level={2}
                      css={{
                        marginBottom: SPACING['2XS']
                      }}
                    >
                      {cardTitle}
                      <span
                        css={{
                          color: 'var(--color-neutral-300)',
                          display: 'block',
                          marginTop: SPACING['3XS'],
                          ...TYPOGRAPHY['3XS']
                        }}
                      >
                        {cardSummary}
                      </span>
                    </Heading>
                    {cardSummary}
                  </div>
                </div>
              );
            })}
          </section>
        </TemplateContent>
      </Template>
    </TemplateLayout>
  );
};

FindStudySpaceTemplate.propTypes = {
  data: PropTypes.shape({
    page: PropTypes.any,
    room: PropTypes.any
  })
};

export default FindStudySpaceTemplate;

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
    rooms: allNodeRoom(
      filter: {relationships: {field_design_template: {field_machine_name: {in: ["study_space"]}}}}
    ) {
      edges {
        node {
          title
          fields {
            slug
            title
            children
            parents
          }
          drupal_internal__nid
          body {
            summary
          }
          relationships {
            field_design_template {
              field_machine_name
            }
            field_media_image {
              relationships {
                field_media_image {
                  localFile {
                    childImageSharp {
                      gatsbyImageData
                    }
                  }
                }
              }
              field_media_image {
                alt
              }
            }
            field_room_building {
              relationships {
                field_building_campus {
                  field_campus_official_name
                }
              }
            }
          }
        }
      }
    }
    locations: allNodeLocation(
      filter: {relationships: {field_design_template: {field_machine_name: {in: ["study_space"]}}}}
    ) {
      edges {
        node {
          title
          fields {
            slug
            title
            children
            parents
          }
          drupal_internal__nid
          body {
            summary
          }
          relationships {
            field_design_template {
              field_machine_name
            }
            field_parent_location {
              relationships {
                field_building_campus {
                  field_campus_official_name
                }
              }
            }
            field_media_image {
              field_media_image {
                alt
              }
            }
          }
          field_space_features
          field_noise_level
        }
      }
    }
  }
`;

const FindStudySpaceResults = ({ allStudySpaces }) => {
  console.log(allStudySpaces);
};
