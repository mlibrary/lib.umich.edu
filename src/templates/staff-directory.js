/* eslint-disable no-underscore-dangle */
import { Alert, Button, COLORS, Heading, Margins, SPACING, TextInput } from '../reusable';
import getUrlState, { stringifyState } from '../utils/get-url-state';
import React, { useEffect, useState } from 'react';
import Breadcrumb from '../components/breadcrumb';
import { GatsbyImage } from 'gatsby-plugin-image';
import { graphql } from 'gatsby';
import Html from '../components/html';
import Link from '../components/link';
import MEDIA_QUERIES from '../reusable/media-queries';
import { navigate } from '@reach/router';
import NoResults from '../components/no-results';
import PlainLink from '../components/plain-link';
import PropTypes from 'prop-types';
import SearchEngineOptimization from '../components/seo';
import Select from '../components/select';
import StaffPhotoPlaceholder from '../components/staff-photo-placeholder';
import TemplateLayout from './template-layout';
import { useDebounce } from 'use-debounce';
import useGoogleTagManager from '../hooks/use-google-tag-manager';

const lunr = require('lunr');

export default function StaffDirectoryWrapper ({ data, location }) {
  const node = data.page;
  const { allNodeDepartment, allStaff, allStaffImages } = data;

  const departments = allNodeDepartment.edges.reduce((acc, { node: departmentsNode }) => {
    return {
      ...acc,
      [departmentsNode.drupal_internal__nid]: departmentsNode
    };
  }, {});
  const staff = allStaff.edges.map(({ node: staffNode }) => {
    return {
      ...staffNode,
      department: departments[staffNode.department_nid],
      division: departments[staffNode.division_nid]
    };
  });
  const staffImages = allStaffImages.edges.reduce((acc, { node: staffImagesNode }) => {
    const img = staffImagesNode.relationships.field_media_image;

    return {
      ...acc,
      [img.drupal_internal__mid]: {
        alt: img.field_media_image.alt,
        ...img.relationships.field_media_image.localFile
      }
    };
  }, {});

  return (
    <StaffDirectoryQueryContainer
      node={node}
      staff={staff}
      departments={departments}
      staffImages={staffImages}
      location={location}
      navigate={navigate}
    />
  );
}

StaffDirectoryWrapper.propTypes = {
  data: PropTypes.shape({
    allNodeDepartment: PropTypes.shape({
      edges: PropTypes.shape({
        reduce: PropTypes.func
      })
    }),
    allStaff: PropTypes.shape({
      edges: PropTypes.shape({
        map: PropTypes.func
      })
    }),
    allStaffImages: PropTypes.shape({
      edges: PropTypes.shape({
        reduce: PropTypes.func
      })
    }),
    page: PropTypes.any
  }),
  location: PropTypes.any
};

/* eslint-disable react/prop-types */
export const Head = ({ data }) => {
  return <SearchEngineOptimization data={data.page} />;
};
/* eslint-enable react/prop-types */

const filterResults = ({ activeFilters, results }) => {
  const filterKeys = Object.keys(activeFilters);

  if (filterKeys.length === 0) {
    return results;
  }

  return results.filter((result) => {
    const division = result.division && result.division.title;
    const department = result.department && result.department.title;

    return (
      activeFilters.department === division
      || activeFilters.department === department
    );
  });
};

const StaffDirectoryQueryContainer = ({
  node,
  staff,
  departments,
  staffImages,
  location,
  navigate: staffDirectoryNavigate
}) => {
  const [urlState] = useState(
    getUrlState(location.search, ['query', 'department'])
  );

  // eslint-disable-next-line react/prop-types
  const { body, fields, field_title_context: fieldTitleContext } = node;
  const [query, setQuery] = useState(urlState.query ? urlState.query : '');
  const [activeFilters, setActiveFilters] = useState(
    urlState.department ? { department: urlState.department } : {}
  );
  const [results, setResults] = useState([]);
  const [stateString] = useDebounce(
    stringifyState({
      department: activeFilters.department,
      // eslint-disable-next-line no-undefined
      query: query.length > 0 ? query : undefined
    }),
    100
  );

  useGoogleTagManager({
    eventName: 'staffDirectorySearch',
    value: query
  });

  useEffect(() => {
    staffDirectoryNavigate(`?${stateString}`, {
      replace: true,
      state: { preserveScroll: true }
    });
  }, [stateString]);

  useEffect(() => {
    if (!window.__SDI__) {
      // Create staff directory index if it does not exist
      window.__SDI__ = lunr(function createStaffDirectory () {
        /* eslint-disable no-invalid-this */
        this.ref('uniqname');
        this.field('name');
        this.field('uniqname');
        this.field('title');

        staff.forEach(function addPerson (person) {
          this.add(person);
        }, this);
        /* eslint-enable no-invalid-this */
      });
    }

    // Get the staff directory index
    const index = window.__SDI__;

    try {
      const tryResults = index
        .query((queryName) => {
          queryName.term(lunr.tokenizer(query), {
            boost: 3
          });
          queryName.term(lunr.tokenizer(query), {
            boost: 2,
            wildcard: lunr.Query.wildcard.TRAILING
          });
          if (query.length > 2) {
            queryName.term(lunr.tokenizer(query), {
              wildcard:
                // eslint-disable-next-line no-bitwise
                lunr.Query.wildcard.TRAILING | lunr.Query.wildcard.LEADING
            });
          }
        })

        .map(({ ref }) => {
          return staff.find(({ uniqname }) => {
            return uniqname === ref;
          });
        });

      setResults(filterResults({ activeFilters, results: tryResults }));
    } catch {
      // Intentionally left blank
    }
  }, [query, activeFilters]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'query') {
      setQuery(value);
      return;
    }

    let activeFiltersCopy = { ...activeFilters };

    if (value.startsWith('All')) {
      delete activeFiltersCopy[name];
    } else {
      activeFiltersCopy = {
        ...activeFiltersCopy,
        [name]: value
      };
    }

    setActiveFilters(activeFiltersCopy);
  };

  const filters = [
    {
      label: 'Department or division',
      name: 'department',
      options: ['All'].concat(
        Object.keys(departments)
          .map((data) => {
            return departments[data].title;
          })
          .sort()
      )
    }
  ];

  const handleClear = () => {
    setQuery('');
    setActiveFilters({});
    setResults(staff);
  };

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

        <StaffDirectory
          handleChange={handleChange}
          handleClear={handleClear}
          filters={filters}
          activeFilters={activeFilters}
          results={results}
          staffImages={staffImages}
          query={query}
        />
      </Margins>
    </TemplateLayout>
  );
};

StaffDirectoryQueryContainer.propTypes = {
  departments: PropTypes.any,
  location: PropTypes.shape({
    search: PropTypes.any
  }),
  navigate: PropTypes.func,
  node: PropTypes.shape({
    body: PropTypes.shape({
      processed: PropTypes.any
    }),
    fieldTitleContext: PropTypes.any,
    fields: PropTypes.shape({
      breadcrumb: PropTypes.any
    })
  }),
  staff: PropTypes.shape({
    find: PropTypes.func,
    forEach: PropTypes.func
  }),
  staffImages: PropTypes.any
};

const StaffDirectory = React.memo(({
  handleChange,
  handleClear,
  filters,
  results,
  staffImages,
  query,
  activeFilters
}) => {
  const [show, setShow] = useState(20);
  const staffInView = results.slice(0, show);
  let resultsSummary = results.length
    ? `${results.length} results`
    : `No results`;
  if (query) {
    resultsSummary += ` for ${query}`;
  }
  if (activeFilters.department) {
    resultsSummary += ` in ${activeFilters.department}`;
  }
  const showMoreText
    = show < results.length
      ? `Showing ${show} of ${results.length} results`
      : null;

  const showMore = () => {
    setShow(results.length);
  };

  return (
    <React.Fragment>
      <div
        css={{
          display: 'grid',
          gridGap: SPACING.S,
          [MEDIA_QUERIES.S]: {
            gridTemplateColumns: `3fr 2fr auto`
          },
          input: {
            height: '40px',
            lineHeight: '1.5'
          },
          marginBottom: SPACING.M
        }}
      >
        <TextInput
          id='staff-directory-search-input'
          labelText='Search by name, uniqname, or title'
          name='query'
          value={query}
          onChange={(event) => {
            setShow(20);
            handleChange(event);
          }}
        />
        {filters.map(({ label, name, options }) => {
          return (
            <Select
              label={label}
              name={name}
              options={options}
              onChange={(event) => {
                return handleChange(event);
              }}
              value={activeFilters[name]}
              key={name}
            />
          );
        })}
        <Button
          kind='subtle'
          onClick={handleClear}
          css={{
            alignSelf: 'end'
          }}
        >
          Clear
        </Button>
      </div>

      <StaffDirectoryResults
        results={results}
        staffImages={staffImages}
        resultsSummary={resultsSummary}
        staffInView={staffInView}
      />

      {showMoreText && (
        <>
          <p
            css={{
              marginBottom: SPACING.L
            }}
          >
            {showMoreText}
          </p>
          <Button onClick={showMore}>Show all</Button>
        </>
      )}

      {!results.length && query.length > 0 && (
        <NoResults>
          Consider searching with different keywords or using the department or
          division filter to browse.
        </NoResults>
      )}
    </React.Fragment>
  );
});

StaffDirectory.propTypes = {
  activeFilters: PropTypes.shape({
    department: PropTypes.any
  }),
  filters: PropTypes.shape({
    map: PropTypes.func
  }),
  handleChange: PropTypes.func,
  handleClear: PropTypes.any,
  query: PropTypes.shape({
    length: PropTypes.number
  }),
  results: PropTypes.shape({
    length: PropTypes.any,
    slice: PropTypes.func
  }),
  staffImages: PropTypes.any
};

// Need to set display name for StaffDirectory React.memo. Can also export default React.memo(StaffDirectory)
StaffDirectory.displayName = 'StaffDirectory';

const StaffPhoto = ({ mid, staffImages }) => {
  const img = staffImages[mid];

  if (!img) {
    return <StaffPhotoPlaceholder />;
  }

  return (
    <GatsbyImage
      image={img.childImageSharp.gatsbyImageData}
      alt={img.alt}
      css={{
        backgroundColor: COLORS.blue['100'],
        borderRadius: '2px',
        overflow: 'hidden'
      }}
    />
  );
};

StaffPhoto.propTypes = {
  mid: PropTypes.number,
  staffImages: PropTypes.array
};

export const query = graphql`
  query ($slug: String!) {
    page: nodePage(fields: { slug: { eq: $slug } }) {
      ...pageFragment
    }
    allStaff(sort: {name: ASC}) {
      edges {
        node {
          uniqname
          name
          title
          email
          phone
          department_nid
          division_nid
          image_mid
        }
      }
    }
    allStaffImages: allUserUser(
      filter: {
        relationships: {
          field_media_image: { drupal_internal__mid: { ne: null } }
        }
      }
    ) {
      edges {
        node {
          relationships {
            field_media_image {
              drupal_internal__mid
              field_media_image {
                alt
              }
              relationships {
                field_media_image {
                  localFile {
                    childImageSharp {
                      gatsbyImageData(
                        width: 43
                        height: 57
                        placeholder: NONE
                        layout: CONSTRAINED
                        transformOptions: {
                          cropFocus: CENTER
                        }
                      )
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    allNodeDepartment {
      edges {
        node {
          title
          drupal_internal__nid
          fields {
            slug
          }
        }
      }
    }
  }
`;

const StaffDirectoryResults = ({
  results,
  staffImages,
  resultsSummary,
  staffInView
}) => {
  const tableBreakpoint = `@media only screen and (max-width: 820px)`;
  const borderStyle = '1px solid var(--color-neutral-100)';

  if (results.length < 1) {
    return null;
  }

  return (
    <table
      css={{
        tableLayout: 'fixed',

        textAlign: 'left',
        'tr > *': {
          '& + *': {
            paddingLeft: '2rem',
            [tableBreakpoint]: {
              '&:nth-of-type(2)': {
                '& + *': {
                  paddingBottom: '1rem'
                },
                paddingTop: '1rem'
              },
              paddingLeft: '0'
            }
          },
          padding: '0.75rem 0',
          position: 'relative',
          [tableBreakpoint]: {
            display: 'block',
            padding: '0.5rem 0 0 0'
          },
          verticalAlign: 'top'
        },
        width: '100%'
      }}
    >
      <caption className='visually-hidden'>
        <Alert>{resultsSummary}</Alert>
      </caption>
      <colgroup>
        <col
          span='1'
          css={{
            width: '43px'
          }}
        />
      </colgroup>
      <thead
        css={{
          borderBottom: borderStyle,
          color: COLORS.neutral['300'],
          [tableBreakpoint]: {
            clip: 'rect(1px, 1px, 1px, 1px)',
            clipPath: 'inset(50%)',
            height: '1px',
            overflow: 'hidden',
            position: 'absolute',
            whiteSpace: 'nowrap',
            width: '1px'
          }
        }}
      >
        <tr>
          <th className='visually-hidden'>Photo</th>
          <th colSpan='3'>Name and title</th>
          <th colSpan='2'>Contact info</th>
          <th colSpan='3'>Department</th>
        </tr>
      </thead>
      <tbody>
        {staffInView.map(
          ({
            uniqname,
            name,
            title,
            email,
            phone,
            department,
            division,
            image_mid: imageMid
          }) => {
            return (
              <tr
                key={uniqname}
                css={{
                  borderTop: borderStyle
                }}
              >
                <td
                  css={{
                    [tableBreakpoint]: {
                      display: 'none!important'
                    }
                  }}
                >
                  <StaffPhoto mid={imageMid} staffImages={staffImages} />
                </td>
                <td colSpan='3'>
                  <PlainLink
                    css={{
                      ':hover': {
                        textDecorationThickness: '2px'
                      },
                      color: COLORS.teal['400'],
                      textDecoration: 'underline'
                    }}
                    to={`/users/${uniqname}`}
                  >
                    {name}
                  </PlainLink>
                  <span css={{ display: 'block' }}>{title}</span>
                </td>
                <td
                  colSpan='2'
                  css={{
                    span: {
                      display: 'block',
                      [tableBreakpoint]: {
                        display: 'initial'
                      }
                    }
                  }}
                >
                  <span>
                    <Link to={`mailto:${email}`} kind='subtle'>
                      {email}
                    </Link>
                  </span>
                  {phone && (
                    <>
                      <span
                        css={{
                          display: 'none!important',
                          padding: '0 0.5rem',
                          [tableBreakpoint]: {
                            display: 'initial!important'
                          }
                        }}
                      >
                        &middot;
                      </span>
                      <span>
                        <Link to={`tel:1-${phone}`} kind='subtle'>
                          {phone}
                        </Link>
                      </span>
                    </>
                  )}
                </td>
                <td
                  colSpan='3'
                  css={{
                    [tableBreakpoint]: {
                      display: 'none!important'
                    }
                  }}
                >
                  {department && (
                    <Link to={department.fields.slug} kind='subtle'>
                      {department.title}
                    </Link>
                  )}

                  {!department && division && (
                    <Link to={division.fields.slug} kind='subtle'>
                      {division.title}
                    </Link>
                  )}
                </td>
              </tr>
            );
          }
        )}
      </tbody>
    </table>
  );
};

StaffDirectoryResults.propTypes = {
  results: PropTypes.shape({
    length: PropTypes.number
  }),
  resultsSummary: PropTypes.any,
  staffImages: PropTypes.any,
  staffInView: PropTypes.shape({
    map: PropTypes.func
  })
};
