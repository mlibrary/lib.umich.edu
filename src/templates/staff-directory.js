import React, { useState, useEffect } from 'react';
import { graphql } from 'gatsby';
import SearchEngineOptimization from '../components/seo';
import { GatsbyImage } from 'gatsby-plugin-image';
import { Heading, SPACING, Margins, TextInput, COLORS, Button, Alert } from '../reusable';
import { navigate } from '@reach/router';
import { useDebounce } from 'use-debounce';
import Link from '../components/link';
import PlainLink from '../components/plain-link';
import Breadcrumb from '../components/breadcrumb';
import MEDIA_QUERIES from '../reusable/media-queries';
import TemplateLayout from './template-layout';
import Html from '../components/html';
import NoResults from '../components/no-results';
import Select from '../components/select';
import StaffPhotoPlaceholder from '../components/staff-photo-placeholder';
import getUrlState, { stringifyState } from '../utils/get-url-state';
import useGoogleTagManager from '../hooks/use-google-tag-manager';

const lunr = require('lunr');

export default function StaffDirectoryWrapper({ data, location }) {
  const node = data.page;
  const { allNodeDepartment, allStaff, allStaffImages } = data;

  const departments = allNodeDepartment.edges.reduce((acc, { node }) => {
    return {
      ...acc,
      [node.drupal_internal__nid]: node,
    };
  }, {});
  const staff = allStaff.edges.map(({ node }) => {
    return {
      ...node,
      department: departments[node.department_nid],
      division: departments[node.division_nid],
    };
  });
  const staffImages = allStaffImages.edges.reduce((acc, { node }) => {
    const img = node.relationships.field_media_image;

    return {
      ...acc,
      [img.drupal_internal__mid]: {
        alt: img.field_media_image.alt,
        ...img.relationships.field_media_image.localFile,
      },
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

export function Head({ data }) {
  return <SearchEngineOptimization data={ data.page } />;
}

function StaffDirectoryQueryContainer({
  node,
  staff,
  departments,
  staffImages,
  location,
  navigate,
}) {
  const [urlState] = useState(
    getUrlState(location.search, ['query', 'department'])
  );
  const { body, fields, field_title_context } = node;
  const [query, setQuery] = useState(urlState.query ? urlState.query : '');
  const [activeFilters, setActiveFilters] = useState(
    urlState.department ? { department: urlState.department } : {}
  );
  const [results, setResults] = useState([]);
  const [stateString] = useDebounce(
    stringifyState({
      query: query.length > 0 ? query : undefined,
      department: activeFilters['department'],
    }),
    100
  );

  useGoogleTagManager({
    eventName: 'staffDirectorySearch',
    value: query,
  });

  useEffect(() => {
    navigate('?' + stateString, {
      replace: true,
      state: { preserveScroll: true },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateString]);

  useEffect(() => {
    if (!window.__SDI__) {
      // create staff directory index if it does not exist
      window.__SDI__ = lunr(function () {
        this.ref('uniqname');
        this.field('name');
        this.field('uniqname');
        this.field('title');

        staff.forEach(function (person) {
          this.add(person);
        }, this);
      });
    }

    // Get the staff directory index
    const index = window.__SDI__;

    try {
      const results = index
        .query((q) => {
          q.term(lunr.tokenizer(query), {
            boost: 3,
          });
          q.term(lunr.tokenizer(query), {
            boost: 2,
            wildcard: lunr.Query.wildcard.TRAILING,
          });
          if (query.length > 2) {
            q.term(lunr.tokenizer(query), {
              wildcard:
                lunr.Query.wildcard.TRAILING | lunr.Query.wildcard.LEADING,
            });
          }
        })
        .map(({ ref }) => {
          return staff.find(({ uniqname }) => uniqname === ref);
        });

      setResults(filterResults({ activeFilters, results }));
    } catch {
      return;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, activeFilters]);

  function handleChange(e) {
    const { name, value } = e.target;
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
        [name]: value,
      };
    }

    setActiveFilters(activeFiltersCopy);
  }

  const filters = [
    {
      label: 'Department or division',
      name: 'department',
      options: ['All'].concat(
        Object.keys(departments)
          .map((d) => departments[d].title)
          .sort()
      ),
    },
  ];

  function handleClear() {
    setQuery('');
    setActiveFilters({});
    setResults(staff);
  }

  return (
    <TemplateLayout node={node}>
      <Margins
        css={{
          marginBottom: SPACING['2XL'],
        }}
      >
        <Breadcrumb data={fields.breadcrumb} />
        <Heading
          size="3XL"
          level={1}
          css={{
            marginBottom: SPACING['S'],
          }}
        >
          {field_title_context}
        </Heading>

        {body && (
          <div
            css={{
              marginBottom: SPACING['XL'],
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
}

const StaffDirectory = React.memo(function StaffDirectory({
  handleChange,
  handleClear,
  filters,
  results,
  staffImages,
  query,
  activeFilters,
}) {
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
  const showMoreText =
    show < results.length
      ? `Showing ${show} of ${results.length} results`
      : null;

  function showMore() {
    setShow(results.length);
  }

  return (
    <React.Fragment>
      <div
        css={{
          display: 'grid',
          gridGap: SPACING['S'],
          [MEDIA_QUERIES['S']]: {
            gridTemplateColumns: `3fr 2fr auto`,
          },
          input: {
            lineHeight: '1.5',
            height: '40px',
          },
          marginBottom: SPACING['M'],
        }}
      >
        <TextInput
          id="staff-directory-search-input"
          labelText="Search by name, uniqname, or title"
          name="query"
          value={query}
          onChange={(e) => {
            setShow(20);
            handleChange(e);
          }}
        />
        {filters.map(({ label, name, options }) => (
          <Select
            label={label}
            name={name}
            options={options}
            onChange={(e) => handleChange(e)}
            value={activeFilters[name]}
            key={name}
          />
        ))}
        <Button
          kind="subtle"
          onClick={handleClear}
          css={{
            alignSelf: 'end',
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
              marginBottom: SPACING['L'],
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

function filterResults({ activeFilters, results }) {
  const filterKeys = Object.keys(activeFilters);

  if (filterKeys.length === 0) {
    return results;
  }

  return results.filter((result) => {
    const division = result.division && result.division.title;
    const department = result.department && result.department.title;

    return (
      activeFilters['department'] === division ||
      activeFilters['department'] === department
    );
  });
}

function StaffPhoto({ mid, staffImages }) {
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
}

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

function StaffDirectoryResults({
  results,
  staffImages,
  resultsSummary,
  staffInView,
}) {
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
        width: '100%',
        'tr > *': {
          padding: '0.75rem 0',
          position: 'relative',
          verticalAlign: 'top',
          [tableBreakpoint]: {
            display: 'block',
            padding: '0.5rem 0 0 0'
          },
          '& + *': {
            paddingLeft: '2rem',
            [tableBreakpoint]: {
              paddingLeft: '0',
              '&:nth-of-type(2)': {
                paddingTop: '1rem',
                '& + *': {
                  paddingBottom: '1rem'
                }
              }
            }
          }
        }
      }}
    >
      <caption className='visually-hidden'>
        <Alert>{resultsSummary}</Alert>
      </caption>
      <colgroup>
          <col
            span="1"
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
            width: '1px',
          }
        }}
      >
        <tr>
          <th className="visually-hidden">Photo</th>
          <th colSpan="3">Name and title</th>
          <th colSpan="2">Contact info</th>
          <th colSpan="3">Department</th>
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
            image_mid,
          }) => (
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
                <StaffPhoto mid={image_mid} staffImages={staffImages} />
              </td>
              <td colSpan="3">
                <PlainLink
                  css={{
                    color: COLORS.teal['400'],
                    textDecoration: 'underline',
                    ':hover': {
                      textDecorationThickness: '2px',
                    },
                  }}
                  to={`/users/` + uniqname}
                >
                  {name}
                </PlainLink>
                <span css={{ display: 'block' }}>{title}</span>
              </td>
              <td
                colSpan="2"
                css={{
                  'span': {
                    display: 'block',
                    [tableBreakpoint]: {
                      display: 'initial'
                    }
                  }
                }}
              >
                <span>
                  <Link to={`mailto:` + email} kind="subtle">
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
                    >&middot;</span>
                    <span>
                      <Link to={`tel:1-` + phone} kind="subtle">
                        {phone}
                      </Link>
                    </span>
                  </>
                )}
              </td>
              <td
                colSpan="3"
                css={{
                  [tableBreakpoint]: {
                    display: 'none!important'
                  }
                }}
              >
                {department && (
                  <Link to={department.fields.slug} kind="subtle">
                    {department.title}
                  </Link>
                )}

                {!department && division && (
                  <Link to={division.fields.slug} kind="subtle">
                    {division.title}
                  </Link>
                )}
              </td>
            </tr>
          )
        )}
      </tbody>
    </table>
  );
}
