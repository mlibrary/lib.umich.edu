import { Button, Heading, Icon, Margins, MEDIA_QUERIES, SPACING } from '../reusable';
import { graphql, Link } from 'gatsby';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Template, TemplateContent, TemplateSide } from '../components/aside-layout';
import Breadcrumb from '../components/breadcrumb';
import Card from '../components/Card';
import CheckboxGroup from '../components/checkbox-group';
import Collapsible from '../components/collapsible';
import { GatsbyImage } from 'gatsby-plugin-image';
import Html from '../components/html';
import PropTypes from 'prop-types';
import SearchEngineOptimization from '../components/seo';
import { sentenceCase } from 'change-case';
import { titleCase } from 'title-case';
import TemplateLayout from './template-layout';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

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

const SpaceFeatures = ({ spaceFeatures }) => {
  /* eslint-disable camelcase */
  const iconMap = {
    all_gender_restroom_on_floor: 'person_half_dress',
    external_monitors: 'desktop_windows',
    natural_light: 'sunny',
    wheelchair_accessible: 'wheelchair',
    whiteboards: 'stylus_note'
  };
  /* eslint-enable camelcase */

  return (
    <ul css={{
      listStyle: 'none',
      marginTop: `${[SPACING.XS]}`
    }}
    >
      {spaceFeatures.map((feature, index) => {
        const icon = iconMap[feature];
        if (!icon) {
          return null;
        }

        return (
          <li
            key={index}
            css={{
              alignItems: 'center',
              display: 'inline-flex',
              flexDirection: 'row',
              gap: [SPACING.XS],
              margin: `0 ${[SPACING.XS]} ${[SPACING.XS]} 0`
            }}
          >
            <Icon icon={icon} size={18} css={{ color: 'var(--color-teal-400)' }} />
            <span css={{ color: 'var(--color-neutral-400)' }}>
              {feature.replace(/_/ug, ' ').replace(/^./u, (str) => {
                return str.toUpperCase();
              })}
            </span>
          </li>
        );
      })}
    </ul>
  );
};

SpaceFeatures.propTypes = {
  spaceFeatures: PropTypes.array
};

const NoiseLevel = ({ noiseLevel }) => {
  if (noiseLevel === '') {
    return null;
  }
  return (
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

const Tag = ({ label, onDismiss }) => {
  return (
    <button
      css={{
        '&:active': {
          background: 'var(--color-teal-400)',
          color: 'white',
          border: 'solid 2px var(--color-teal-400)'
        },
        '&:hover': {
          border: 'solid 2px var(--color-teal-400)'
        },
        display: 'flex',
        cursor: 'pointer',
        alignItems: 'center',
        gap: '2px',
        background: 'var(--color-teal-100)',
        color: 'var(--color-neutral-400)',
        border: '2px solid var(--color-teal-200)',
        borderRadius: '1rem',
        padding: '0.25rem 0.75rem',
        marginRight: 8,
        marginBottom: 8,
        fontSize: '0.9rem',
        fontWeight: 500
      }}
      onClick={onDismiss}
    >
      {label}
      <svg role='img' aria-hidden='true' focusable='false' xmlns='http://www.w3.org/2000/svg' height='16px' viewBox='0 0 24 24' width='16px' fill='#212B36'>
        <path d='M0 0h24v24H0z' fill='none'></path>
        <path d='M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z'></path>
      </svg>
    </button>
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
  const [showAll, setShowAll] = useState(false);
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
        updated[campus] = setAll;
      } else {
        const key = `${campus}:${building}`;
        updated[key] = !prev[key];
        const allChecked = campusObj.buildings.every((b) => {
          return updated[`${campus}:${b}`];
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
      if (Object.values(selectedFeatures).some(Boolean)) {
        const hasSelectedFeature = Object.entries(selectedFeatures).some(
          ([feature, checked]) => {
            return checked && features.includes(feature);
          }
        );
        if (!hasSelectedFeature) {
          return false;
        }
      }

      return true;
    }

    if (Object.values(selectedNoiseLevels).some(Boolean)) {
      const noiseLevel = getNoiseLevel(edge);
      if (!selectedNoiseLevels[noiseLevel]) {
        return false;
      }
    }

    return true;
  });

  useEffect(() => {
    if (showAll) {
      setShow(filteredStudySpaces.length);
    } else {
      setShow(6);
    }
  }, [filteredStudySpaces.length, showAll]);

  let resultsSummary = null;
  let showMoreOrLessButton = null;

  if (filteredStudySpaces.length > 0) {
    if (filteredStudySpaces.length > 6) {
      resultsSummary = (
        <p css={{ marginBottom: SPACING.M }}>
          Showing {showAll ? filteredStudySpaces.length : Math.min(show, filteredStudySpaces.length)} of {filteredStudySpaces.length}
        </p>
      );
    } else {
      resultsSummary = (
        <p css={{ marginBottom: SPACING.M }}>
          Showing {filteredStudySpaces.length} result{filteredStudySpaces.length > 1 ? 's' : ''}
        </p>
      );
    }
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

    showMoreOrLessButton = (
      <>
        {(!showAll && show < filteredStudySpaces.length)
          ? (
              <Button css={{ marginTop: SPACING.L }} onClick={showMore}>Show all</Button>
            )
          : (
              <Button css={{ marginTop: SPACING.L }} onClick={showLess}>Show less</Button>
            )}
      </>
    );
  }

  const shouldReduceMotion = useReducedMotion();

  const getActiveFilterTags = useCallback(() => {
    const tags = [];

    if (bookableOnly) {
      tags.push({
        key: 'bookableOnly',
        label: 'Bookable spaces only',
        onDismiss: () => {
          return setBookableOnly(false);
        }
      });
    }

    Object.entries(selectedCampuses).forEach(([key, checked]) => {
      if (checked) {
        let [campus, building] = key.split(':');
        if (building) {
          building = titleCase(building);
          tags.push({
            key: `building-${key}`,
            label: `${campus}, ${building}`,
            onDismiss: () => {
              return setSelectedCampuses((prev) => {
                return { ...prev, [key]: false };
              });
            }
          });
        } else {
          campus = titleCase(campus);
          tags.push({
            key: `campus-${key}`,
            label: `${campus}`,
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
  }, [bookableOnly, selectedCampuses, selectedFeatures, selectedNoiseLevels]);

  const activeFilterTags = getActiveFilterTags();

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
            }
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
              labelRenderer={sentenceCase}
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
                    const match = tag.key.match(/^building-([^:]+):(.+)$/);
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
                  <AnimatePresence>
                    {resultsSummary}
                    <ol
                      css={{
                        [MEDIA_QUERIES.S]: {
                          display: 'grid',
                          gridGap: `${SPACING.XL} ${SPACING.M}`,
                          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))'
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
                              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.4 }}
                              style={{ listStyle: 'none' }}
                            >
                              <Card image={cardImage} alt={cardAlt} href={slug} title={cardTitle} subtitle={buildingName}>
                                {cardSummary}
                                <SpaceFeatures spaceFeatures={spaceFeatures}></SpaceFeatures>
                                <NoiseLevel noiseLevel={noiseLevel}></NoiseLevel>
                              </Card>
                            </motion.li>
                          );
                        })}
                      </AnimatePresence>
                    </ol>
                  </AnimatePresence>
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
