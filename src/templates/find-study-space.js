import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Button, Heading, Icon, Margins, MEDIA_QUERIES, SPACING, TYPOGRAPHY } from '../reusable';
import getUrlState, { stringifyState } from '../utils/get-url-state';
import { ORDERED_SPACE_FEATURES, SPACE_FEATURES_ICON_MAP } from '../constants/space-features';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Template, TemplateContent, TemplateSide } from '../components/aside-layout';
import Breadcrumb from '../components/breadcrumb';
import Card from '../components/card';
import CheckboxGroup from '../components/checkbox-group';
import Collapsible from '../components/collapsible';
import { GatsbyImage } from 'gatsby-plugin-image';
import { graphql } from 'gatsby';
import Html from '../components/html';
import PlainLink from '../components/plain-link';
import PropTypes from 'prop-types';
import SearchEngineOptimization from '../components/seo';
import { sentenceCase } from 'change-case';
import SpaceFeaturesIcons from '../components/space-features-list';
import TemplateLayout from './template-layout';
import { titleCase } from 'title-case';
import { useLocation } from '@reach/router';

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

const featureLabelRenderer = (featureKey) => {
  return (
    <>
      <Icon css={{ color: 'var(--color-teal-400)' }} icon={SPACE_FEATURES_ICON_MAP[featureKey]} style={{ marginRight: 8 }} />
      {sentenceCase(featureKey)}
    </>
  );
};

const SpaceFeatures = ({ spaceFeatures }) => {
  return <SpaceFeaturesIcons spaceFeatures={spaceFeatures} inline />;
};

SpaceFeatures.propTypes = {
  spaceFeatures: PropTypes.array
};

const NoiseLevel = ({ noiseLevel }) => {
  return noiseLevel === ''
    ? null
    : (
        <div css={{
          alignItems: 'center',
          color: 'var(--color-neutral-300)',
          display: 'flex',
          gap: [SPACING.XS] }}
        >
          <Icon icon='volume_up' size={18} />
          <span css={{ fontWeight: 'bold' }}>
            Noise Level: {sentenceCase(noiseLevel)}
          </span>
        </div>
      );
};

NoiseLevel.propTypes = {
  noiseLevel: PropTypes.string
};

const getCampusAndBuilding = (edge) => {
  let location = null;
  const { __typename: typeName } = edge.node;
  const { field_parent_location: fieldParentLocation, field_room_building: fieldRoomBuilding } = edge.node.relationships || {};

  if (typeName === 'node__location') {
    location = fieldParentLocation;
  } else if (typeName === 'node__room') {
    location = fieldRoomBuilding;
  }

  return {
    building: location?.title || '',
    campus: location?.relationships?.field_building_campus?.field_campus_official_name || ''
  };
};

const getNoiseLevel = (edge) => {
  return edge.node.field_noise_level || '';
};

const Tag = ({ label, onDismiss }) => {
  return (
    <button
      css={{
        '&:active': {
          background: 'var(--color-teal-400)',
          border: 'solid 2px var(--color-teal-400)',
          color: 'white'
        },
        '&:hover': {
          border: 'solid 2px var(--color-teal-400)'
        },
        alignItems: 'center',
        background: 'var(--color-teal-100)',
        border: '2px solid var(--color-teal-200)',
        borderRadius: '1rem',
        color: 'var(--color-neutral-400)',
        cursor: 'pointer',
        display: 'flex',
        fontSize: '0.9rem',
        fontWeight: 500,
        gap: '4px',
        marginBottom: 8,
        marginRight: 8,
        padding: '0.25rem 0.75rem'
      }}
      onClick={onDismiss}
      aria-label={`Select to remove filter: ${label}`}
    >
      {label}
      <svg role='img' aria-hidden='true' focusable='false' xmlns='http://www.w3.org/2000/svg' height='16px' viewBox='0 0 24 24' width='16px' fill='#212B36'>
        <path d='M0 0h24v24H0z' fill='none'></path>
        <path d='M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z'></path>
      </svg>
    </button>
  );
};

Tag.propTypes = {
  label: PropTypes.any,
  onDismiss: PropTypes.any
};

const FILTER_KEYS = ['campuses', 'features', 'noise', 'showAll'];
const isBrowser = typeof window !== 'undefined';
const locationSearch = isBrowser ? window.location.search : '';
const urlState = getUrlState(locationSearch, FILTER_KEYS);

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

  const campusToBuildings = {};
  campusesWithBuildings.forEach(({ campus, buildings }) => {
    campusToBuildings[campus] = buildings;
  });

  const existingFeatures = new Set(allStudySpaces.flatMap(getSpaceFeatures).filter(Boolean));
  const allSpaceFeaturesList = ORDERED_SPACE_FEATURES.filter((feature) => {
    return existingFeatures.has(feature);
  });

  const allNoiseLevels = Array.from(
    new Set(allStudySpaces.map(getNoiseLevel).filter(Boolean))
  );

  const [showAll, setShowAll] = useState(Boolean(urlState.showAll));
  const [show, setShow] = useState(6);
  const [selectedCampuses, setSelectedCampuses] = useState(
    (urlState.campuses || []).reduce((acc, key) => {
      return { ...acc, [key]: true };
    }, {})
  );
  const [selectedFeatures, setSelectedFeatures] = useState(
    (urlState.features || []).reduce((acc, key) => {
      return { ...acc, [key]: true };
    }, {})
  );
  const [selectedNoiseLevels, setSelectedNoiseLevels] = useState(
    (urlState.noise || []).reduce((acc, key) => {
      return { ...acc, [key]: true };
    }, {})
  );

  const location = useLocation();

  const [queryString, setQueryString] = useState(location.search);

  const CardWithLocation = (props) => {
    return (
      <Card
        {...props}
        state={{
          findStudySpaceQuery: queryString,
          fromFindStudySpace: true
        }}
      />
    );
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
        updated[campus] = setAll;
      } else {
        const key = `${campus}:${building}`;
        updated[key] = !prev[key];
        const allChecked = campusObj.buildings.every((buildingName) => {
          return updated[`${campus}:${buildingName}`];
        });
        updated[campus] = allChecked;
      }
      return updated;
    });
  };

  const handleFeatureChange = (feature) => {
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
    setSelectedCampuses({});
    setSelectedFeatures({});
    setSelectedNoiseLevels({});
  };

  const filteredStudySpaces = allStudySpaces.filter((edge) => {
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
      const hasAllSelectedFeatures = Object.entries(selectedFeatures)
        .filter(([, checked]) => {
          return checked;
        })
        .every(([feature]) => {
          return features.includes(feature);
        });
      if (!hasAllSelectedFeatures) {
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

  // Show all / show 6 button
  useEffect(() => {
    setShow(showAll ? filteredStudySpaces.length : 6);
  }, [filteredStudySpaces.length, showAll]);

  let resultsSummary = null;
  let showMoreOrLessButton = null;

  if (filteredStudySpaces.length > 0) {
    let resultsSummaryText = `${filteredStudySpaces.length} result${filteredStudySpaces.length > 1 ? 's' : ''}`;
    if (filteredStudySpaces.length > 6) {
      resultsSummaryText = `${showAll ? filteredStudySpaces.length : Math.min(show, filteredStudySpaces.length)} of ${filteredStudySpaces.length} results`;
    }
    resultsSummary = (
      <p aria-live='polite' css={{ marginBottom: SPACING.M }}>
        Showing {resultsSummaryText}
      </p>
    );
  }

  if (filteredStudySpaces.length > 6) {
    const showMore = () => {
      setShowAll(true);
      setShow(filteredStudySpaces.length);
    };
    const showLess = () => {
      setShowAll(false);
      setShow(6);
    };

    const canShowMore = !showAll && show < filteredStudySpaces.length;
    showMoreOrLessButton = (
      <Button css={{ marginTop: SPACING.L }} onClick={canShowMore ? showMore : showLess}>Show {canShowMore ? 'all' : 'less'}</Button>
    );
  }

  const shouldReduceMotion = useReducedMotion();

  const getActiveFilterTags = useCallback(() => {
    const tags = [];

    Object.entries(campusToBuildings).forEach(([campus, buildings]) => {
      const allBuildingsSelected = buildings.every(
        (building) => {
          return selectedCampuses[`${campus}:${building}`];
        }
      );
      if (selectedCampuses[campus] && allBuildingsSelected) {
        tags.push({
          key: `campus-${campus}`,
          label: campus,
          onDismiss: () => {
            return setSelectedCampuses((prev) => {
              const updated = { ...prev, [campus]: false };
              campusToBuildings[campus].forEach(
                (building) => {
                  updated[`${campus}:${building}`] = false;
                }
              );
              return updated;
            });
          }
        });
      } else {
        buildings.forEach((building) => {
          if (selectedCampuses[`${campus}:${building}`]) {
            tags.push({
              key: `building-${campus}:${building}`,
              label: `${campus}, ${building}`,
              onDismiss: () => {
                return setSelectedCampuses((prev) => {
                  return {
                    ...prev,
                    [`${campus}:${building}`]: false
                  };
                });
              }
            });
          }
        });
      }
    });

    // Features
    Object.entries(selectedFeatures).forEach(([feature, checked]) => {
      if (checked) {
        tags.push({
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

    // Noise levels
    Object.entries(selectedNoiseLevels).forEach(([level, checked]) => {
      if (checked) {
        tags.push({
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

    return tags;
  }, [selectedCampuses, selectedFeatures, selectedNoiseLevels, campusToBuildings]);

  const activeFilterTags = getActiveFilterTags();

  // Back / forward button to keep active filters (do we need this?)
  const didInit = useRef(false);

  useEffect(() => {
    if (!isBrowser || !didInit.current) {
      return;
    }
    const stateObj = {};

    const campuses = Object.entries(selectedCampuses)
      .filter(([, value]) => {
        return value;
      })
      .map(([key]) => {
        return key;
      });
    if (campuses.length) {
      stateObj.campuses = campuses;
    }

    const features = Object.entries(selectedFeatures)
      .filter(([, value]) => {
        return value;
      })
      .map(([key]) => {
        return key;
      });
    if (features.length) {
      stateObj.features = features;
    }

    const noise = Object.entries(selectedNoiseLevels)
      .filter(([, value]) => {
        return value;
      })
      .map(([key]) => {
        return key;
      });
    if (noise.length) {
      stateObj.noise = noise;
    }

    if (showAll) {
      stateObj.showAll = 1;
    }

    const stateString = stringifyState(stateObj);
    const to = stateString.length > 0 ? `?${stateString}` : window.location.pathname;
    window.history.replaceState({}, '', to);
    setQueryString(stateString.length > 0 ? `?${stateString}` : '');
  }, [selectedCampuses, selectedFeatures, selectedNoiseLevels, showAll]);

  useEffect(() => {
    if (!isBrowser) {
      return;
    }
    const onPopState = () => {
      const newUrlState = getUrlState(window.location.search, FILTER_KEYS);
      setShowAll(Boolean(newUrlState.showAll));
      setSelectedCampuses(
        (newUrlState.campuses || []).reduce((acc, key) => {
          return { ...acc, [key]: true };
        }, {})
      );
      setSelectedFeatures(
        (newUrlState.features || []).reduce((acc, key) => {
          return { ...acc, [key]: true };
        }, {})
      );
      setSelectedNoiseLevels(
        (newUrlState.noise || []).reduce((acc, key) => {
          return { ...acc, [key]: true };
        }, {})
      );
    };

    if (!didInit.current) {
      onPopState();
      didInit.current = true;
    }

    window.addEventListener('popstate', onPopState);
    window.removeEventListener('popstate', onPopState);
  }, []);

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
      <Template css={{ gap: '2rem' }}contentSide='right'>
        <TemplateSide
          css={{
            'div:first-of-type': {
              border: 'none !important',
              paddingBottom: '0'
            },
            maxWidth: '25rem'
          }}
          contentSide='right'
        >
          <div
            css={{
              ...TYPOGRAPHY['3XS'],
              color: 'var(--color-neutral-300)',
              marginBottom: SPACING.M
            }}
          >
            FILTER BY
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
          <Collapsible title='Noise Levels'>
            <CheckboxGroup
              options={allNoiseLevels}
              selected={selectedNoiseLevels}
              onChange={handleNoiseLevelChange}
              isNested={false}
              labelRenderer={sentenceCase}
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
              selected={selectedFeatures}
              onChange={handleFeatureChange}
              isNested={false}
              labelRenderer={featureLabelRenderer}
            />
          </Collapsible>
        </TemplateSide>
        <TemplateContent
          css={{
            marginRight: '0 !important'
          }}
        >
          {activeFilterTags.length > 0 && (
            <div style={{ marginBottom: SPACING.L }}>
              <div css={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>
                {activeFilterTags.map((tag) => {
                  let { label } = tag;
                  if (tag.key && tag.key.startsWith('campus-')) {
                    if (selectedCampuses[tag.label]) {
                      label = `Location: ${titleCase(label)}`;
                    } else {
                      return null;
                    }
                  } else if (tag.key && tag.key.startsWith('building-')) {
                    const match = tag.key.match(/^building-(?:[^:]+):(?:.+)$/u);
                    const campus = match ? match[1] : null;
                    if (campus && selectedCampuses[campus]) {
                      return null;
                    }
                    label = `Location: ${titleCase(label)}`;
                  } else if (tag.key && tag.key.startsWith('feature-')) {
                    label = `Feature: ${sentenceCase(label)}`;
                  } else if (tag.key && tag.key.startsWith('noise-')) {
                    label = `Noise level: ${sentenceCase(label)}`;
                  }
                  return (
                    <Tag key={tag.key} label={label} onDismiss={tag.onDismiss} />
                  );
                })}
              </div>
              <button
                type='button'
                onClick={clearAllFilters}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-neutral-300)',
                  cursor: 'pointer',
                  display: 'block',
                  textDecoration: 'underline'
                }}
              >
                Clear all active filters
              </button>
            </div>
          )}
          <div
            aria-live='polite'
            style={{
              border: 0,
              clip: 'rect(0,0,0,0)',
              height: '1px',
              margin: '-1px',
              overflow: 'hidden',
              padding: 0,
              position: 'absolute',
              width: '1px'
            }}
          >
            {filteredStudySpaces.length === 0 ? 'No results found matching your selected filters.' : ''}
          </div>
          {filteredStudySpaces.length === 0
            ? (
                <>
                  <NoFassResults
                    image={data.fassNoResults.childImageSharp.gatsbyImageData}
                    alt='No study spaces found'
                  >
                  </NoFassResults>
                </>
              )
            : (
                <>
                  <AnimatePresence>
                    {resultsSummary}
                    <ol
                      css={{
                        display: 'grid',
                        gridGap: `${SPACING.XL} ${SPACING.M}`,
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        [MEDIA_QUERIES.M]: {
                          gridTemplateColumns: 'repeat(2, minmax(320px, 1fr))'
                        }
                      }}
                    >
                      <AnimatePresence>
                        {filteredStudySpaces.slice(0, showAll ? filteredStudySpaces.length : show).map((edge) => {
                          const { slug } = edge.node.fields;
                          const cardImage = edge.node.relationships?.field_media_image?.relationships?.field_media_image?.localFile?.childImageSharp?.gatsbyImageData;
                          const cardAlt = edge.node.relationships?.field_media_image?.field_media_image?.alt;
                          const cardTitle = edge.node.title;
                          const cardSummary = edge.node.body.summary;
                          const buildingName = getBuildingName(edge);
                          const spaceFeatures = getSpaceFeatures(edge);
                          const noiseLevel = getNoiseLevel(edge);
                          return (
                            <motion.li
                              key={slug}
                              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
                              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2 }}
                              style={{ listStyle: 'none' }}
                            >
                              <CardWithLocation
                                css={{ marginBottom: SPACING.XL }}
                                image={cardImage}
                                alt={cardAlt}
                                href={slug}
                                title={cardTitle}
                                subtitle={buildingName}
                              >
                                {cardSummary}
                                <SpaceFeatures spaceFeatures={spaceFeatures}></SpaceFeatures>
                                <NoiseLevel noiseLevel={noiseLevel}></NoiseLevel>
                              </CardWithLocation>
                            </motion.li>
                          );
                        })}
                      </AnimatePresence>
                    </ol>
                  </AnimatePresence>
                  <div css={{ marginTop: SPACING['2XL'] }}>
                    {resultsSummary}
                  </div>
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
    fassNoResults: PropTypes.shape({
      childImageSharp: PropTypes.shape({
        gatsbyImageData: PropTypes.any
      })
    }),
    locations: PropTypes.shape({
      edges: PropTypes.array
    }),
    page: PropTypes.any,
    room: PropTypes.any,
    rooms: PropTypes.shape({
      edges: PropTypes.array
    })
  })
};

export default FindStudySpaceTemplate;

const NoFassResults = ({ image, alt }) => {
  return (
    <div style={{ margin: '2rem 0' }}>
      <div>
        <Heading level={2} size='L' style={{ marginBottom: SPACING.XL }}>
          We couldn&apos;t find what you&apos;re looking for.
        </Heading>
        We couldn&apos;t find any results that match your chosen filters. Try removing a filter or find information about other library spaces with cafes, computing resources, and more.
        <ul css={{
          listStyle: 'disc',
          marginLeft: SPACING.L,
          marginTop: SPACING.XL
        }}
        >
          <li>
            <PlainLink
              to='/visit-and-study/computing-and-technology'
              css={{
                color: 'var(--color-teal-400)',
                textDecoration: 'underline'
              }}
            >
              Computing and Technology
            </PlainLink>
          </li>
          <li>
            <PlainLink
              to='/visit-and-study/cafes-and-wellbeing'
              css={{
                color: 'var(--color-teal-400)',
                textDecoration: 'underline'
              }}
            >
              Cafes
            </PlainLink>
          </li>
          <li>
            <PlainLink
              to='/visit-and-study/study-spaces/student-parent-and-caregiver-study-room'
              css={{
                color: 'var(--color-teal-400)',
                textDecoration: 'underline'
              }}
            >
              Student Parent and Caregiver Room
            </PlainLink>
          </li>
        </ul>
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

NoFassResults.propTypes = {
  alt: PropTypes.any,
  image: PropTypes.any
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
