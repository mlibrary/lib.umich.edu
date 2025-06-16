import { Button, Heading, Margins, MEDIA_QUERIES, SPACING, TYPOGRAPHY } from '../reusable';
import { graphql, Link, useStaticQuery } from 'gatsby';
import React, { useCallback, useState } from 'react';
import { Template, TemplateContent, TemplateSide } from '../components/aside-layout';
import Breadcrumb from '../components/breadcrumb';
import Card from '../components/Card';
import CheckboxGroup from '../components/checkbox-group';
import Collapsible from '../components/collapsible';
import { GatsbyImage } from 'gatsby-plugin-image';
import Html from '../components/html';
import PropTypes from 'prop-types';
import SearchEngineOptimization from '../components/seo';
import TemplateLayout from './template-layout';
import NoResults from '../components/no-results';

const getBuildingName = (edge) => {
  return (
    edge.node.relationships?.field_parent_location?.title
    || edge.node.relationships?.field_room_building?.title
    || ''
  );
};

const getSpaceFeatures = (edge) => {
  return edge.node.field_space_features || '';
};

const getCampusAndBuilding = (edge) => {
  let campus = '';
  let building = '';
  if (edge.node.__typename === 'node__location') {
    campus = edge.node.relationships?.field_parent_location?.relationships?.field_building_campus?.field_campus_official_name || '';
    building = edge.node.relationships?.field_parent_location?.title || '';
  } else if (edge.node.__typename === 'node__room') {
    campus = edge.node.relationships?.field_room_building?.relationships?.field_building_campus?.field_campus_official_name || '';
    building = edge.node.relationships?.field_room_building?.title || '';
  }
  return { building, campus };
};

const getNoiseLevel = (edge) => {
  return edge.node.field_noise_level || '';
};

const Badge = ({ label, onDismiss }) => {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: 'var(--color-teal-100)',
        color: 'var(--color-teal-700)',
        borderRadius: '1em',
        padding: '0.25em 0.75em',
        marginRight: 8,
        marginBottom: 8,
        fontSize: '0.95em',
        fontWeight: 500
      }}
    >
      {label}
      <button
        onClick={onDismiss}
        style={{
          background: 'none',
          border: 'none',
          color: 'inherit',
          marginLeft: 6,
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '1em',
          lineHeight: 1
        }}
        aria-label={`Remove filter ${label}`}
        type='button'
      >
        ×
      </button>
    </span>
  );
};

const FindStudySpaceTemplate = ({ data }) => {
  const allStudySpaces = data.locations.edges.concat(data.rooms.edges);

  allStudySpaces.sort((left, right) => {
    const titleA = left.node.title.toLowerCase();
    const titleB = right.node.title.toLowerCase();
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

  const campusBuildingMap = {};
  allStudySpaces.forEach((edge) => {
    const { campus, building } = getCampusAndBuilding(edge);
    if (campus && building) {
      if (!campusBuildingMap[campus]) {
        campusBuildingMap[campus] = new Set();
      }
      campusBuildingMap[campus].add(building);
    }
  });

  const campusesWithBuildings = Object.entries(campusBuildingMap).map(
    ([campus, buildingsSet]) => {
      return {
        buildings: Array.from(buildingsSet).sort(),
        campus
      };
    }
  );

  const allSpaceFeaturesList = Array.from(
    new Set(allStudySpaces.flatMap(getSpaceFeatures).filter(Boolean))
  );

  const allNoiseLevels = Array.from(
    new Set(allStudySpaces.map(getNoiseLevel).filter(Boolean))
  );

  const [bookableOnly, setBookableOnly] = useState(false);
  const [show, setShow] = useState(6);
  const [selectedCampuses, setSelectedCampuses] = useState({});
  const [selectedFeatures, setSelectedFeatures] = useState({});
  const [selectedNoiseLevels, setSelectedNoiseLevels] = useState({});

  const handleBookableChange = () => {
    return setBookableOnly((isBookable) => {
      return !isBookable;
    });
  };

  const handleCampusChange = (campus, building, setAll = null) => {
    setSelectedCampuses((prev) => {
      const updated = { ...prev };
      const campusObj = campusesWithBuildings.find((campusNode) => {
        return campusNode.campus === campus;
      });

      if (building === null) {
        campusObj.buildings.forEach((buildingNode) => {
          updated[`${campus}:${buildingNode}`] = setAll;
        });
      } else {
        const key = `${campus}:${building}`;
        updated[key] = !prev[key];
      }

      return updated;
    });
  };

  const handleFeatureChange = (feature) => {
    console.log('hi');
    setSelectedFeatures((prev) => {
      return {
        ...prev,
        [feature]: !prev[feature]
      };
    });
  };

  const handleNoiseLevelChange = (level) => {
    setSelectedNoiseLevels((prev) => {
      return {
        ...prev,
        [level]: !prev[level]
      };
    });
  };

  const clearAllFilters = () => {
    setBookableOnly(false);
    setSelectedCampuses({});
    setSelectedFeatures({});
    setSelectedNoiseLevels({});
  };

  const filteredStudySpaces = allStudySpaces.filter((edge) => {
    if (bookableOnly && !edge.node.field_bookable_study_space) {
      return false;
    }

    if (Object.values(selectedCampuses).some(Boolean)) {
      const { campus, building } = getCampusAndBuilding(edge);
      const campusChecked = selectedCampuses[campus];
      const buildingChecked = selectedCampuses[`${campus}:${building}`];
      if (!campusChecked && !buildingChecked) {
        return false;
      }
    }

    if (Object.values(selectedFeatures).some(Boolean)) {
      const features = getSpaceFeatures(edge);
      const hasFeature = Object.entries(selectedFeatures).some(
        ([feature, checked]) => {
          return checked && features.includes(feature);
        }
      );
      if (!hasFeature) {
        return false;
      }
    }

    if (Object.values(selectedNoiseLevels).some(Boolean)) {
      const noiseLevel = getNoiseLevel(edge);
      if (!selectedNoiseLevels[noiseLevel]) {
        return false;
      }
    }

    return true;
  });

  let resultsSummary = null;
  let showMoreOrLessButton = null;

  if (filteredStudySpaces.length > 0) {
    if (filteredStudySpaces.length > 6) {
      resultsSummary = (
        <p>
          Showing {Math.min(show, filteredStudySpaces.length)} of {filteredStudySpaces.length}
        </p>
      );
    } else {
      resultsSummary = (
        <p>
          Showing {filteredStudySpaces.length} result{filteredStudySpaces.length > 1 ? 's' : ''}
        </p>
      );
    }
  }

  if (filteredStudySpaces.length > 6) {
    const showMore = () => {
      return setShow(filteredStudySpaces.length);
    };
    const showLess = () => {
      return setShow(6);
    };

    showMoreOrLessButton = (
      <>
        {show < filteredStudySpaces.length
          ? (
              <Button onClick={showMore}>Show all</Button>
            )
          : (
              <Button onClick={showLess}>Show less</Button>
            )}
      </>
    );
  }

  const getActiveBadges = useCallback(() => {
    const badges = [];

    if (bookableOnly) {
      badges.push({
        key: 'bookableOnly',
        label: 'Bookable spaces only',
        onDismiss: () => {
          return setBookableOnly(false);
        }
      });
    }

    Object.entries(selectedCampuses).forEach(([key, checked]) => {
      if (checked) {
        const [campus, building] = key.split(':');
        if (building) {
          badges.push({
            key: `building-${key}`,
            label: `${building} (${campus})`,
            onDismiss: () => {
              return setSelectedCampuses((prev) => {
                return { ...prev, [key]: false };
              });
            }
          });
        } else {
          badges.push({
            key: `campus-${key}`,
            label: campus,
            onDismiss: () => {
              return setSelectedCampuses((prev) => {
                return { ...prev, [key]: false };
              });
            }
          });
        }
      }
    });

    Object.entries(selectedFeatures).forEach(([feature, checked]) => {
      if (checked) {
        badges.push({
          key: `feature-${feature}`,
          label: feature,
          onDismiss: () => {
            return setSelectedFeatures((prev) => {
              return { ...prev, [feature]: false };
            });
          }
        });
      }
    });

    Object.entries(selectedNoiseLevels).forEach(([level, checked]) => {
      if (checked) {
        badges.push({
          key: `noise-${level}`,
          label: level,
          onDismiss: () => {
            return setSelectedNoiseLevels((prev) => {
              return { ...prev, [level]: false };
            });
          }
        });
      }
    });

    return badges;
  }, [bookableOnly, selectedCampuses, selectedFeatures, selectedNoiseLevels]);

  const activeBadges = getActiveBadges();

  return (
    <TemplateLayout node={node}>
      <Margins css={{ marginBottom: SPACING['2XL'] }}>
        <Breadcrumb data={fields.breadcrumb} />
        <Heading
          size='3XL'
          level={1}
          css={{ marginBottom: SPACING.S }}
        >
          {fieldTitleContext}
        </Heading>
        {body && (
          <div css={{ marginBottom: SPACING.XL }}>
            <Html html={body.processed} />{' '}
          </div>
        )}
      </Margins>
      <Template contentSide='right'>
        <TemplateSide
          css={{
            'div:first-of-type': { border: 'none !important' }
          }}
          contentSide='right'
        >
          <div
            css={{
              color: 'var(--color-neutral-300)',
              fontWeight: 'bold',
              marginBottom: SPACING.M
            }}
          >
            FILTER BY
          </div>
          <div
            css={{
              alignItems: 'center',
              display: 'flex',
              flexFlow: 'row wrap',
              marginBottom: SPACING.M
            }}
          >
            <input
              css={{
                accentColor: 'var(--color-teal-400)',
                height: '18px',
                marginLeft: 0,
                marginRight: '0.75rem',
                width: '18px'
              }}
              type='checkbox'
              id='bookableSpacesOnly'
              name='bookableSpaceOnly'
              checked={bookableOnly}
              onChange={handleBookableChange}
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
            <CheckboxGroup
              options={campusesWithBuildings}
              selected={selectedCampuses}
              onChange={handleCampusChange}
              isNested={true}
              getParentKey={(parent) => {
                return parent.campus;
              }}
              getChildren={(parent) => {
                return parent.buildings;
              }}
              getChildKey={(child, parent) => {
                return `${parent.campus}:${child}`;
              }}
              labelRenderer={(val) => {
                return typeof val === 'string' ? val : val.campus;
              }}
            />
          </Collapsible>
          <hr
            css={{
              border: 0,
              borderTop: '1px solid var(--color-neutral-100)',
              display: 'block',
              height: '1px',
              margin: '1em 0',
              padding: 0
            }}
          />
          <Collapsible title='Noise Level'>
            <CheckboxGroup
              options={allNoiseLevels}
              selected={selectedNoiseLevels}
              onChange={handleNoiseLevelChange}
              isNested={false}
              labelRenderer={(val) => {
                return val;
              }}
            />
          </Collapsible>
          <hr
            css={{
              border: 0,
              borderTop: '1px solid var(--color-neutral-100)',
              display: 'block',
              height: '1px',
              margin: '1em 0',
              padding: 0
            }}
          />
          <Collapsible title='Features'>
            <CheckboxGroup
              options={allSpaceFeaturesList}
              selected={setSelectedFeatures}
              onChange={handleFeatureChange}
              isNested={false}
              labelRenderer={(val) => {
                return val;
              }}
            />
          </Collapsible>
        </TemplateSide>
        <TemplateContent
          css={{
            marginLeft: SPACING['2XL'],
            marginRight: '0 !important'
          }}
        >
          {activeBadges.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              {activeBadges.map((badge) => {
                return (
                  <Badge key={badge.key} label={badge.label} onDismiss={badge.onDismiss} />
                );
              })}
              <button
                type='button'
                onClick={clearAllFilters}
                style={{
                  background: 'none',
                  display: 'block',
                  border: 'none',
                  color: 'var(--color-teal-700)',
                  marginLeft: 8,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontSize: '1em',
                  fontWeight: 500
                }}
              >
                Clear all active filters
              </button>
            </div>
          )}
          {filteredStudySpaces.length === 0
            ? (
                <NoFassResults
                  image={data.fassNoResults.childImageSharp.gatsbyImageData}
                  alt='No study spaces found'
                >

                </NoFassResults>
              )
            : (
                <>
                  { resultsSummary }
                  <ol
                    css={{
                      [MEDIA_QUERIES.S]: {
                        display: 'grid',
                        gridGap: `${SPACING.XL} ${SPACING.M}`,
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))'
                      }
                    }}
                  >
                    {filteredStudySpaces.slice(0, show).map((edge, index) => {
                      const cardImage = edge.node.relationships?.field_media_image?.relationships?.field_media_image?.localFile?.childImageSharp?.gatsbyImageData;
                      const cardAlt = edge.node.relationships?.field_media_image?.field_media_image?.alt;
                      const cardTitle = edge.node.title;
                      const cardSummary = edge.node.body.summary;
                      const buildingName = getBuildingName(edge);
                      return (
                        <li key={index}>
                          <Card image={cardImage} alt={cardAlt} href={edge.node.fields.slug}>
                            <span
                              css={{
                                color: 'var(--color-neutral-300)',
                                display: 'block',
                                marginTop: SPACING['3XS'],
                                ...TYPOGRAPHY['3XS']
                              }}
                            >
                              {buildingName}
                            </span>
                            <Heading
                              size='S'
                              level={2}
                              css={{
                                marginBottom: SPACING['2XS']
                              }}
                            >
                              {cardTitle}
                            </Heading>
                            {cardSummary}
                          </Card>
                        </li>
                      );
                    })}
                  </ol>
                  {showMoreOrLessButton}
                </>
              )}
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

const NoFassResults = ({ image, alt, children }) => {
  return (
    <div style={{ margin: '2rem 0' }}>
      <div>
        <Heading level={2} size='L' style={{ marginBottom: '1rem' }}>
          We couldn&apos;t find what you&apos;re looking for.
        </Heading>
        We couldn&apos;t find any results that match your chosen filters. Try removing a filter or find information about other library spaces with cafes, computing resources, and more.
        <ol>
          <li>
            <Link to='/library-spaces'>Computing and Technology</Link>
          </li>
          <li>
            <Link to='/library-spaces'>Cafes</Link>
          </li>
          <li>
            <Link to='/library-spaces'>Study Rooms</Link>
          </li>
        </ol>
      </div>
      {image && (
        <GatsbyImage
          image={image}
          alt={alt}
          style={{ margin: '1.5rem auto' }}
        />
      )}
    </div>
  );
};

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
          ...roomFragment
        }
      }
    }
    locations: allNodeLocation(
      filter: {relationships: {field_design_template: {field_machine_name: {in: ["study_space"]}}}}
    ) {
      edges {
        node {
          ...locationFragment
        }
      }
    }
    fassNoResults: file(relativePath: { eq: "fass-no-results.png" }) {
      childImageSharp {
        gatsbyImageData(width: 920, placeholder: NONE, layout: CONSTRAINED)
      }
    }
  }
`;
