import { Button, Heading, Margins, MEDIA_QUERIES, SPACING, TYPOGRAPHY } from '../reusable';
import CardImage from '../reusable/card-image';
import Card from '../components/Card';
import Breadcrumb from '../components/breadcrumb';
import Collapsible from '../components/collapsible';
import { graphql } from 'gatsby';
import Html from '../components/html';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import SearchEngineOptimization from '../components/seo';
import TemplateLayout from './template-layout';
import { Template, TemplateContent, TemplateSide } from '../components/aside-layout';
import transformNodePanels from '../utils/transform-node-panels';
import { PanelList } from '../components/panels';

const getCampusOfficialName = (edge) => {
  if (edge.node.__typename === 'node__location') {
    return (
      edge.node.relationships?.field_parent_location?.relationships?.field_building_campus
        ?.field_campus_official_name || ''
    );
  }
  if (edge.node.__typename === 'node__room') {
    return (
      edge.node.relationships?.field_room_building?.relationships?.field_building_campus
        ?.field_campus_official_name || ''
    );
  }
  return '';
};

const getBuildingName = (edge) => {
  return (
    edge.node.relationships?.field_parent_location?.title
    || edge.node.relationships?.field_room_building?.title
    || ''
  );
};

const getSpaceFeatures = (edge) => {
  return edge.node.field_space_features?.processed || '';
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
  return { campus, building };
};

const CheckboxGroup = ({
  label,
  options,
  selected,
  onChange,
  parentKey = '',
  childrenKey = 'buildings',
  isNested = false
}) => {
  const getParentState = (parent) => {
    const children = parent[childrenKey];
    const checkedChildren = children.filter(
      (child) => {
        return selected[`${parent.campus}:${child}`];
      }
    ).length;
    if (checkedChildren === 0) {
      return 'unchecked';
    }
    if (checkedChildren === children.length) {
      return 'checked';
    }
    return 'mixed';
  };

  return (
    <div>
      {isNested
        ? options.map((parent) => {
            const parentState = getParentState(parent);
            return (
              <div key={parent.campus} style={{ marginBottom: 8 }}>
                <label>
                  <input
                    type='checkbox'
                    checked={parentState === 'checked'}
                    ref={(el) => {
                      if (el) {
                        el.indeterminate = parentState === 'mixed';
                      }
                    }}
                    onChange={() => {
                      const shouldCheck = parentState !== 'checked';
                      onChange(parent.campus, null, shouldCheck);
                    }}
                  />
                  {parent.campus}
                </label>
                <div style={{ marginLeft: 24 }}>
                  {parent[childrenKey].map((child) => {
                    return (
                      <label key={child} style={{ display: 'block' }}>
                        <input
                          type='checkbox'
                          checked={selected[`${parent.campus}:${child}`] || false}
                          onChange={() => {
                            onChange(parent.campus, child);
                          }}
                        />
                        {child}
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })
        : options.map((option) => {
            return (
              <label key={option} style={{ display: 'block' }}>
                <input
                  type='checkbox'
                  checked={selected[option] || false}
                  onChange={() => {
                    onChange(option);
                  }}
                />
                {option}
              </label>
            );
          })}
    </div>
  );
};

const FindStudySpaceTemplate = ({ data }) => {
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
        campus,
        buildings: Array.from(buildingsSet).sort()
      };
    }
  );

  const allSpaceFeaturesList = Array.from(
    new Set(allStudySpaces.map(getSpaceFeatures).filter(Boolean))
  );

  const [bookableOnly, setBookableOnly] = useState(false);
  const [show, setShow] = useState(6);
  const [selectedCampuses, setSelectedCampuses] = useState({});
  const [selectedFeatures, setSelectedFeatures] = useState({});

  const handleBookableChange = () => {
    return setBookableOnly((b) => {
      return !b;
    });
  };

  const handleCampusChange = (campus, building, setAll = null) => {
    setSelectedCampuses((prev) => {
      const updated = { ...prev };
      const campusObj = campusesWithBuildings.find((c) => {
        return c.campus === campus;
      });

      if (building === null) {
        campusObj.buildings.forEach((b) => {
          updated[`${campus}:${b}`] = setAll;
        });
      } else {
        const key = `${campus}:${building}`;
        updated[key] = !prev[key];
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

  const filteredStudySpaces = allStudySpaces.filter((edge) => {
    if (bookableOnly && !edge.node.field_is_bookable) {
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
            />
          </Collapsible>
          <hr
            css={{
              display: 'block',
              height: '1px',
              border: 0,
              borderTop: '1px solid var(--color-neutral-100)',
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
            />
          </Collapsible>
        </TemplateSide>
        <TemplateContent
          css={{
            marginLeft: SPACING['2XL'],
            marginRight: '0 !important'
          }}
        >
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
          {resultsSummary}
          {showMoreOrLessButton}
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
  }
`;
