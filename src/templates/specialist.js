import React, { createContext, useContext, useEffect, useReducer, useState } from 'react';
import SearchEngineOptimization from '../components/seo';
import { graphql } from 'gatsby';
import { Alert, Button, COLORS, Heading, Margins, SPACING, TextInput } from '../reusable';
import { navigate, useLocation } from '@reach/router';
import Link from '../components/link';
import Breadcrumb from '../components/breadcrumb';
import MEDIA_QUERIES from '../reusable/media-queries';
import TemplateLayout from './template-layout';
import Html from '../components/html';
import NoResults from '../components/no-results';
import getUrlState, { stringifyState } from '../utils/get-url-state';
import Switch from '../components/switch';
import Select from '../components/select';
import processSpecialistData from '../utils/process-specialist-data';
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

const useSpecialists = () => {
  return useContext(SpecialistsContext);
};

export default function FinaASpecialistTemplate ({ data }) {
  const [initialized, setInitialized] = useState(false);
  const [specialists, setSpecialists] = useState();
  const node = data.page;
  const { body, fields, field_title_context } = node;

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
          {field_title_context}
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

        {specialists && <FindASpecialist specialists={specialists} />}
      </Margins>
    </TemplateLayout>
  );
}

export function Head ({ data }) {
  return <SearchEngineOptimization data={data.page} />;
}

function FindASpecialist ({ specialists }) {
  const location = useLocation();
  const urlState = getUrlState(location.search, ['query', 'hs', 'category']);
  const results = specialists;
  const initialState = {
    query: urlState.query ? urlState.query : '',
    specialists,
    results,
    stateString: stringifyState({
      query: urlState.query,
      hs: urlState.hs,
      category: urlState.category
    }),
    healthSciencesOnly: Boolean(urlState.hs),
    category: urlState.category,
    categories: getCategories(specialists)
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case 'setQuery':
        return {
          ...state,
          query: action.query,
          stateString: stringifyState({
            query: action.query.length > 0 ? action.query : undefined,
            hs: state.healthSciencesOnly ? true : undefined,
            category: state.category
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
          healthSciencesOnly: action.healthSciencesOnly,
          category: undefined,
          stateString: stringifyState({
            query: state.query.length > 0 ? state.query : undefined,
            hs: action.healthSciencesOnly ? true : undefined,
            category: action.healthSciencesOnly ? state.category : undefined
          })
        };
      case 'setCategory':
        const category
          = action.category === 'All categories' ? undefined : action.category;

        return {
          ...state,
          category,
          healthSciencesOnly: true,
          stateString: stringifyState({
            query: state.query.length > 0 ? state.query : undefined,
            hs: true,
            category
          })
        };
      case 'clear':
        return {
          ...initialState,
          query: '',
          healthSciencesOnly: state.healthSciencesOnly,
          category: undefined
        };
      default:
        return state;
    }
  };

  return (
    <SpecialistsProvider intialState={initialState} reducer={reducer}>
      <SpecialistsURLState />
      <SpecialistsSearchIndex />
      <SpecialistsGoogleTagManager />
      <SpecialistsSearch />
      <SpecialistsResults />
    </SpecialistsProvider>
  );
}

function SpecialistsURLState () {
  const location = useLocation();
  const [{ stateString }] = useSpecialists();

  // When changes to state string represenation, set it to browser URL.
  useEffect(() => {
    /*
     * If there is state to be put in the URL, use that, otherwise,
     * clear the URL with the location pathname.
     */
    const to = stateString.length > 0 ? `?${stateString}` : location.pathname;
    navigate(to, { replace: true, state: { preserveScroll: true } });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateString]);

  return null;
}

function SpecialistsSearchIndex () {
  const [{ query, specialists }, dispatch] = useSpecialists();

  useEffect(() => {
    if (!window.__FSI__) {
      window.__FSI__ = lunr(function () {
        this.ref('name');
        this.field('name');

        specialists.forEach(function (specialist) {
          this.add(specialist);
        }, this);
      });
    }

    // Get the Find a Specialist Index index (FSI)
    const index = window.__FSI__;

    try {
      const results = index
        .query((q) => {
          q.term(lunr.tokenizer(query), {
            boost: 3
          });
          q.term(lunr.tokenizer(query), {
            boost: 2,
            wildcard: lunr.Query.wildcard.TRAILING
          });
          if (query.length > 2) {
            q.term(lunr.tokenizer(query), {
              wildcard:
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
        type: 'setResults',
        results
      });
    } catch {

    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return null;
}

function SpecialistsHealthSciencesOnly () {
  const [{ healthSciencesOnly }, dispatch] = useSpecialists(); // TODO, replace with dispatch

  return (
    <Switch
      on={healthSciencesOnly}
      onClick={() => {
        return dispatch({
          type: 'setHealthSciencesOnly',
          healthSciencesOnly: !healthSciencesOnly
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
}

function SpecialistsCategorySelect () {
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
      onChange={(e) => {
        return dispatch({ type: 'setCategory', category: e.target.value });
      }}
      value={category ? category : 'All categories'}
    />
  );
}

function SpecialistsGoogleTagManager () {
  const [{ query }] = useSpecialists();

  useGoogleTagManager({
    eventName: 'findASpecialistSearch',
    value: query
  });

  return null;
}

function SpecialistsSearch () {
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
          lineHeight: '1.5',
          height: '40px'
        },
        marginBottom: SPACING.M
      }}
    >
      <TextInput
        id='find-specialist-search-input'
        labelText='Search by subject or specialty'
        name='query'
        value={query}
        onChange={(e) => {
          dispatch({ type: 'setQuery', query: e.target.value });
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
}

function SpecialistsResults () {
  const [show, setShow] = useState(20);
  const [{ results, query, category, healthSciencesOnly }] = useSpecialists();
  const resultsFiltered = filterResults({
    results,
    category,
    healthSciencesOnly
  });
  const resultsShown = resultsFiltered.slice(0, show);
  let resultsSummary = results.length
    ? `${resultsFiltered.length} results`
    : `No results`;
  if (query) {
    resultsSummary += ` for ${query}`;
  }
  if (category) {
    resultsSummary += ` in ${category}`;
  }
  const showMoreText
    = show < resultsFiltered.length
      ? `Showing ${show} of ${resultsFiltered.length} results`
      : null;
  function showMore () {
    setShow(results.length);
  }
  const tableBreakpoint = `@media only screen and (max-width: 720px)`;
  const borderStyle = '1px solid var(--color-neutral-100)';

  return (
    <React.Fragment>
      <table
        css={{
          tableLayout: 'fixed',
          textAlign: 'left',
          width: '100%',
          'tr > *': {
            padding: '0.75rem 0',
            position: 'relative',
            [tableBreakpoint]: {
              display: 'block',
              padding: '0.25rem 0'
            },
            '& + *': {
              paddingLeft: '2rem',
              [tableBreakpoint]: {
                paddingLeft: '0'
              }
            }
          }
        }}
      >
        <caption className='visually-hidden'>
          <Alert>{resultsSummary}</Alert>
        </caption>
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
            <th scope='col'>Subjects and specialties</th>
            <th colSpan='2' scope='col'>Contact</th>
            {healthSciencesOnly && <th scope='col'>Category</th>}
          </tr>
        </thead>
        <tbody>
          {resultsShown.map(({ name, contacts, category }, i) => {
            return (
              <tr
                key={name + i}
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
                  {contacts.map(({ link, description }, y) => {
                    return (
                      <div
                        key={link.to + y}
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
                {healthSciencesOnly && <td>{category}</td>}
              </tr>
            );
          })}
        </tbody>
      </table>

      {showMoreText && (
        <>
          <p
            css={{
              marginBottom: SPACING.M
            }}
          >
            {showMoreText}
          </p>
          <Button onClick={showMore}>Show all</Button>
        </>
      )}

      {!resultsFiltered.length && (
        <NoResults>Consider searching with different keywords.</NoResults>
      )}
    </React.Fragment>
  );
}

function filterResults ({ results, healthSciencesOnly, category }) {
  let filteredResults = results;

  if (healthSciencesOnly) {
    filteredResults = filteredResults.filter(
      (result) => {
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
}

function getCategories (specialists) {
  return Array.from(
    new Set(
      specialists
        .map(({ category }) => {
          return category;
        })
        .filter((category) => {
          return category !== undefined;
        })
        .sort()
    )
  );
}

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
