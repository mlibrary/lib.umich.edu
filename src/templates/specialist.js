/* eslint-disable no-invalid-this */
import { Button, Heading, Margins, MEDIA_QUERIES, SPACING, TextInput } from '../reusable';
import getUrlState, { stringifyState } from '../utils/get-url-state';
import { graphql, navigate } from 'gatsby';
import React, { createContext, useContext, useEffect, useReducer, useState } from 'react';
import Breadcrumb from '../components/breadcrumb';
import Html from '../components/html';
import Link from '../components/link';
import NoResults from '../components/no-results';
import processSpecialistData from '../utils/process-specialist-data';
import PropTypes from 'prop-types';
import SearchEngineOptimization from '../components/seo';
import Select from '../components/select';
import Switch from '../components/switch';
import TemplateLayout from './template-layout';
import useGoogleTagManager from '../hooks/use-google-tag-manager';

const lunr = require('lunr');
const SpecialistsContext = createContext();

const SpecialistsProvider = ({ reducer, intialState, children }) => {
  return (
    <SpecialistsContext.Provider value={useReducer(reducer, intialState)}>
      {children}
    </SpecialistsContext.Provider>
  );
};

SpecialistsProvider.propTypes = {
  children: PropTypes.any,
  intialState: PropTypes.any,
  reducer: PropTypes.any
};

const useSpecialists = () => {
  return useContext(SpecialistsContext);
};

export default function FindASpecialistTemplate ({ data, location }) {
  const [initialized, setInitialized] = useState(false);
  const [specialists, setSpecialists] = useState();
  const node = data.page;
  const { body, fields, field_title_context: fieldTitleContext } = node;

  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      setSpecialists(processSpecialistData({ data }));
    }
  }, [initialized, data]);

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

        {!initialized && (
          <div
            css={{
              color: 'var(--color-neutral-300)',
              fontSize: '1.125rem',
              padding: SPACING.XL
            }}
            role='status'
            aria-live='polite'
          >
            Loading Find a Specialist...
          </div>
        )}

        {initialized && <FindASpecialist specialists={specialists} location={location} />}
      </Margins>
    </TemplateLayout>
  );
}

FindASpecialistTemplate.propTypes = {
  data: PropTypes.shape({
    page: PropTypes.shape({
      body: PropTypes.shape({
        processed: PropTypes.any
      }),
      // eslint-disable-next-line camelcase
      field_title_context: PropTypes.any,
      fields: PropTypes.shape({
        breadcrumb: PropTypes.any
      })
    })
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string
  })
};

/* eslint-disable react/prop-types */
export const Head = ({ data, location }) => {
  return <SearchEngineOptimization data={data.page} location={location} />;
};
/* eslint-enable react/prop-types */

const getCategories = (specialists) => {
  return Array.from(
    new Set(
      specialists
        .map(({ category }) => {
          return category;
        })
        .filter((category) => {
          return category;
        })
        .sort()
    )
  );
};

const FindASpecialist = ({ specialists, location }) => {
  const urlState = getUrlState(location.search, ['query', 'hs', 'category']);
  const results = specialists;
  const initialState = {
    categories: getCategories(specialists),
    category: urlState.category,
    healthSciencesOnly: Boolean(urlState.hs),
    query: urlState.query ? urlState.query : '',
    results,
    specialists,
    stateString: stringifyState({
      category: urlState.category,
      hs: urlState.hs,
      query: urlState.query
    })
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case 'setQuery':
        return {
          ...state,
          query: action.query,
          stateString: stringifyState({
            category: state.category,
            hs: state.healthSciencesOnly ? true : null,
            query: action.query.length > 0 ? action.query : null
          })
        };
      case 'setResults':
        return {
          ...state,
          results: action.results
        };
      case 'setHealthSciencesOnly':
        return {
          ...state,
          category: null,
          healthSciencesOnly: action.healthSciencesOnly,
          stateString: stringifyState({
            category: action.healthSciencesOnly ? state.category : null,
            hs: action.healthSciencesOnly ? true : null,
            query: state.query.length > 0 ? state.query : null
          })
        };
      case 'setCategory': {
        const category
          = action.category === 'All categories' ? null : action.category;

        return {
          ...state,
          category,
          healthSciencesOnly: true,
          stateString: stringifyState({
            category,
            hs: true,
            query: state.query.length > 0 ? state.query : null
          })
        };
      }
      case 'clear':
        return {
          ...initialState,
          category: null,
          healthSciencesOnly: state.healthSciencesOnly,
          query: ''
        };
      default:
        return state;
    }
  };

  return (
    <SpecialistsProvider intialState={initialState} reducer={reducer}>
      <SpecialistsURLState location={location} />
      <SpecialistsSearchIndex />
      <SpecialistsGoogleTagManager />
      <SpecialistsSearch />
      <SpecialistsResults />
    </SpecialistsProvider>
  );
};

FindASpecialist.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string
  }),
  specialists: PropTypes.any
};

const SpecialistsURLState = ({ location }) => {
  const [{ stateString }] = useSpecialists();

  // When changes to state string represenation, set it to browser URL.
  useEffect(() => {
    /*
     * If there is state to be put in the URL, use that, otherwise,
     * clear the URL with the location pathname.
     */
    const to = stateString.length > 0 ? `?${stateString}` : location.pathname;
    navigate(to, { replace: true, state: { preserveScroll: true } });
  }, [stateString, location.pathname]);

  return null;
};

SpecialistsURLState.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string
  })
};

const SpecialistsSearchIndex = () => {
  const [{ query, specialists }, dispatch] = useSpecialists();

  /* eslint-disable no-underscore-dangle */
  useEffect(() => {
    if (!window.__FSI__) {
      window.__FSI__ = lunr(function setupSearchIndex () {
        this.ref('name');
        this.field('name');

        specialists.forEach(function addToIndex (specialist) {
          this.add(specialist);
        }, this);
      });
    }

    // Get the Find a Specialist Index index (FSI)
    const index = window.__FSI__;

    try {
      const results = index
        .query((queryText) => {
          queryText.term(lunr.tokenizer(query), {
            boost: 3
          });
          queryText.term(lunr.tokenizer(query), {
            boost: 2,
            wildcard: lunr.Query.wildcard.TRAILING
          });
          if (query.length > 2) {
            queryText.term(lunr.tokenizer(query), {
              wildcard:
                // eslint-disable-next-line no-bitwise
                lunr.Query.wildcard.TRAILING | lunr.Query.wildcard.LEADING
            });
          }
        })
        .map(({ ref }) => {
          return specialists.find(({ name }) => {
            return name === ref;
          });
        });

      dispatch({
        results,
        type: 'setResults'
      });
    } catch {
      // No action needed; intentionally empty block
    }
  }, [query, dispatch, specialists]);

  return null;
};

const SpecialistsHealthSciencesOnly = () => {
  // eslint-disable-next-line no-warning-comments
  // TODO, replace with dispatch
  const [{ healthSciencesOnly }, dispatch] = useSpecialists();

  return (
    <Switch
      on={healthSciencesOnly}
      onClick={() => {
        return dispatch({
          healthSciencesOnly: !healthSciencesOnly,
          type: 'setHealthSciencesOnly'
        });
      }}
      css={{
        alignSelf: 'end',
        [MEDIA_QUERIES.L]: {
          marginLeft: SPACING.M
        }
      }}
    >
      <span>Show Health Sciences only</span>
    </Switch>
  );
};

const SpecialistsCategorySelect = () => {
  const [{ healthSciencesOnly, category, categories }, dispatch]
    = useSpecialists();

  if (!healthSciencesOnly) {
    return null;
  }

  return (
    <Select
      label='Category'
      name='category'
      options={['All categories'].concat(categories)}
      onChange={(event) => {
        return dispatch({ category: event.target.value, type: 'setCategory' });
      }}
      value={category ? category : 'All categories'}
    />
  );
};

const SpecialistsGoogleTagManager = () => {
  const [{ query }] = useSpecialists();

  useGoogleTagManager({
    eventName: 'findASpecialistSearch',
    value: query
  });

  return null;
};

const SpecialistsSearch = () => {
  const [{ query, healthSciencesOnly }, dispatch] = useSpecialists();

  return (
    <div
      css={{
        display: 'grid',
        gridGap: SPACING.M,
        [MEDIA_QUERIES.L]: {
          gridTemplateColumns: healthSciencesOnly
            ? `minmax(200px, 3fr) auto auto auto`
            : `minmax(200px, 3fr) auto auto`
        },
        input: {
          height: '40px',
          lineHeight: '1.5'
        },
        marginBottom: SPACING.M
      }}
    >
      <TextInput
        id='find-specialist-search-input'
        labelText='Search by subject or specialty'
        name='query'
        value={query}
        onChange={(event) => {
          dispatch({ query: event.target.value, type: 'setQuery' });
        }}
      />
      <SpecialistsCategorySelect />
      <Button
        kind='subtle'
        onClick={() => {
          return dispatch({ type: 'clear' });
        }}
        css={{
          alignSelf: 'end'
        }}
      >
        Clear
      </Button>
      <SpecialistsHealthSciencesOnly />
    </div>
  );
};

const filterResults = ({ results, healthSciencesOnly, category }) => {
  let filteredResults = results;

  if (healthSciencesOnly) {
    filteredResults = filteredResults.filter(
      (result) => {
        // eslint-disable-next-line no-undefined
        return result.category !== undefined;
      }
    );
  }

  if (category) {
    filteredResults = filteredResults.filter(
      (result) => {
        return result.category === category;
      }
    );
  }
  return filteredResults;
};

const SpecialistsResults = () => {
  const [show, setShow] = useState(20);
  const [{ results, query, category, healthSciencesOnly }] = useSpecialists();
  const resultsFiltered = filterResults({
    category,
    healthSciencesOnly,
    results
  });
  const resultsShown = resultsFiltered.slice(0, show);
  let resultsSummary = <></>;
  let showMoreText = null;
  if (resultsFiltered.length > 0) {
    resultsSummary = (<>{resultsFiltered.length} result{resultsFiltered.length > 1 && 's'}</>);
    if (show < resultsFiltered.length) {
      resultsSummary = (<>Showing {show} of {resultsFiltered.length} results</>);
      const showMore = () => {
        setShow(results.length);
      };
      showMoreText = (
        <>
          <p
            css={{
              marginBottom: SPACING.M
            }}
          >
            {resultsSummary}
          </p>
          <Button onClick={showMore}>Show all</Button>
        </>
      );
    }
  }
  [query, category].forEach((param) => {
    if (param) {
      resultsSummary = (
        <>
          {resultsSummary} {param === query ? 'for' : 'in'} <strong style={{ fontWeight: '800' }}>{param}</strong>
        </>
      );
    }
  });
  if (healthSciencesOnly) {
    resultsSummary = (
      <>
        {resultsSummary} with the <strong style={{ fontWeight: '800' }}>Show Health Sciences Only</strong> filter active
      </>
    );
  }
  if (resultsFiltered.length === 0) {
    resultsSummary = (<div><span aria-live='assertive'>No results {resultsSummary}</span></div>);
  }
  const tableBreakpoint = `@media only screen and (max-width: 720px)`;
  const borderStyle = '1px solid var(--color-neutral-100)';

  if (resultsFiltered.length === 0) {
    return (
      <>
        {resultsSummary}
        <NoResults>Consider searching with different keywords.</NoResults>
      </>
    );
  }
  return (
    <React.Fragment>
      <table
        css={{
          tableLayout: 'fixed',
          textAlign: 'left',
          'tr > *': {
            '& + *': {
              paddingLeft: '2rem',
              [tableBreakpoint]: {
                paddingLeft: '0'
              }
            },
            padding: '0.75rem 0',
            position: 'relative',
            [tableBreakpoint]: {
              display: 'block',
              padding: '0.25rem 0'
            }
          },
          width: '100%'

        }}
        aria-live='polite'
      >
        <caption css={{ textAlign: 'left' }}>
          {resultsSummary}
        </caption>
        <thead
          css={{
            borderBottom: borderStyle,
            color: 'var(--color-neutral-300)',
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
            <th scope='col'>Subjects and specialties</th>
            <th colSpan='2' scope='colgroup'>Contact</th>
            {healthSciencesOnly && <th scope='col'>Category</th>}
          </tr>
        </thead>
        <tbody>
          {resultsShown.map(({ name, contacts, category: resultsCategory }, index) => {
            return (
              <tr
                key={name + index}
                css={{
                  borderTop: borderStyle,
                  [tableBreakpoint]: {
                    '> *:last-child': {
                      paddingBottom: '1rem'
                    }
                  }
                }}
              >
                <th
                  scope='row'
                  css={{
                    [tableBreakpoint]: {
                      fontWeight: '600',
                      paddingTop: '1rem!important'
                    }
                  }}
                >
                  {name}
                </th>
                <td colSpan='2'>
                  {contacts.map(({ link, description }, contactsIndex) => {
                    return (
                      <div
                        key={link.to + contactsIndex}
                        css={{
                          '& + *': {
                            paddingTop: '0.5rem'
                          }
                        }}
                      >
                        <Link to={link.to}>{link.label}</Link>
                        <p>{description}</p>
                      </div>
                    );
                  })}
                </td>
                {healthSciencesOnly && <td>{resultsCategory}</td>}
              </tr>
            );
          })}
        </tbody>
      </table>

      {showMoreText}

    </React.Fragment>
  );
};

export const query = graphql`
  fragment specialistsSynonym on Node {
    id
    __typename
    ... on taxonomy_term__academic_discipline {
      name
    }
    ... on taxonomy_term__collecting_areas {
      name
    }
    ... on taxonomy_term__health_sciences {
      name
    }
    ... on taxonomy_term__library_expertise {
      name
    }
  }

  query ($slug: String!) {
    page: nodePage(fields: { slug: { eq: $slug } }) {
      ...pageFragment
    }
    allTaxonomyTermAcademicDiscipline {
      edges {
        node {
          id
          name
          __typename
          field_group_email
          field_brief_group_description
          relationships {
            field_synonym {
              ...specialistsSynonym
            }
            user__user {
              ...userFragment
            }
          }
        }
      }
    }
    allTaxonomyTermCollectingAreas {
      edges {
        node {
          id
          name
          __typename
          field_group_email
          field_brief_group_description
          relationships {
            field_synonym {
              ...specialistsSynonym
            }
            user__user {
              ...userFragment
            }
          }
        }
      }
    }
    allTaxonomyTermHealthSciences {
      edges {
        node {
          id
          name
          __typename
          field_group_email
          field_brief_group_description
          relationships {
            field_health_sciences_category {
              name
            }
            field_synonym {
              ...specialistsSynonym
            }
            user__user {
              ...userFragment
            }
          }
        }
      }
    }
    allTaxonomyTermLibraryExpertise {
      edges {
        node {
          id
          __typename
          name
          field_group_email
          field_brief_group_description
          relationships {
            field_synonym {
              ...specialistsSynonym
            }
            user__user {
              ...userFragment
            }
          }
        }
      }
    }
  }
`;
