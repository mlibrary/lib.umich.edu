import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { graphql } from 'gatsby'
import {
  Heading,
  SPACING,
  Margins,
  TextInput,
  COLORS,
  Button,
  Alert,
} from '@umich-lib/core'
import { useLocation, useNavigate } from '@reach/router'
import VisuallyHidden from '@reach/visually-hidden'
import Link from '../components/link'
import Breadcrumb from '../components/breadcrumb'
import MEDIA_QUERIES from '../maybe-design-system/media-queries'
import TemplateLayout from './template-layout'
import HTML from '../components/html'
import NoResults from '../components/no-results'
import getUrlState, { stringifyState } from '../utils/get-url-state'
import Switch from '../components/switch'
import Select from '../components/select'
const lunr = require('lunr')

const SpecialistsContext = createContext()

const SpecialistsProvider = ({ reducer, intialState, children }) => (
  <SpecialistsContext.Provider value={useReducer(reducer, intialState)}>
    {children}
  </SpecialistsContext.Provider>
)

const useSpecialists = () => useContext(SpecialistsContext)

export default function FinaASpecialistTemplate({ data }) {
  const node = data.page
  const { body, fields, field_title_context } = node

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
            <HTML html={body.processed} />{' '}
          </div>
        )}

        <FindASpecialist />
      </Margins>
    </TemplateLayout>
  )
}

function FindASpecialist() {
  const location = useLocation()
  const urlState = getUrlState(location.search, ['query'])

  const initialState = {
    query: urlState.query ? urlState.query : '',
    specialists: mockData,
    results: mockData,
    stateString: stringifyState({ query: urlState.query }),
    healthSciencesOnly: false,
  }

  const reducer = (state, action) => {
    switch (action.type) {
      case 'setQuery':
        return {
          ...state,
          query: action.query,
          stateString: stringifyState({
            query: action.query.length > 0 ? action.query : undefined,
          }),
        }
      case 'setResults':
        return {
          ...state,
          results: action.results,
        }
      case 'setHealthSciencesOnly':
        return {
          ...state,
          healthSciencesOnly: action.healthSciencesOnly,
        }
      case 'clear':
        return {
          ...initialState,
          query: '',
          healthSciencesOnly: state.healthSciencesOnly,
        }
      default:
        return state
    }
  }

  return (
    <SpecialistsProvider intialState={initialState} reducer={reducer}>
      <SpecialistsURLState />
      <SpecialistsSearchIndex />
      <SpecialistsSearch />
      <SpecialistsTableResults />
    </SpecialistsProvider>
  )
}

function SpecialistsURLState() {
  const location = useLocation()
  const navigate = useNavigate()
  const [{ stateString }] = useSpecialists()

  // When changes to state string represenation, set it to browser URL.
  useEffect(() => {
    // If there is state to be put in the URL, use that, otherwise,
    // clear the URL with the location pathname.
    const to = stateString.length > 0 ? '?' + stateString : location.pathname
    navigate(to)
  }, [stateString])

  return null
}

function SpecialistsSearchIndex() {
  const [{ query, specialists }, dispatch] = useSpecialists()

  useEffect(() => {
    if (!window.__FSI__) {
      window.__FSI__ = lunr(function() {
        this.ref('name')
        this.field('name')

        specialists.forEach(function(specialist) {
          this.add(specialist)
        }, this)
      })
    }

    // Get the Find a Specialist Index index (FSI)
    const index = window.__FSI__

    try {
      const results = index
        .query(q => {
          q.term(lunr.tokenizer(query), {
            boost: 3,
          })
          q.term(lunr.tokenizer(query), {
            boost: 2,
            wildcard: lunr.Query.wildcard.TRAILING,
          })
          if (query.length > 2) {
            q.term(lunr.tokenizer(query), {
              wildcard:
                lunr.Query.wildcard.TRAILING | lunr.Query.wildcard.LEADING,
            })
          }
        })
        .map(({ ref }) => {
          return specialists.find(({ name }) => name === ref)
        })

      dispatch({
        type: 'setResults',
        results: results,
      })
    } catch {
      return
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  return null
}

function SpecialistsHealthSciencesOnly() {
  const [{ healthSciencesOnly }, dispatch] = useSpecialists() // TODO, replace with dispatch

  return (
    <Switch
      on={healthSciencesOnly}
      onClick={() =>
        dispatch({
          type: 'setHealthSciencesOnly',
          healthSciencesOnly: !healthSciencesOnly,
        })
      }
      css={{
        alignSelf: 'end',
        marginLeft: SPACING['XL'],
      }}
    >
      <span>Show health sciences only</span>
    </Switch>
  )
}

function SpecialistsCategorySelect() {
  const [{ healthSciencesOnly }] = useSpecialists()

  if (!healthSciencesOnly) {
    return null
  }

  return (
    <Select
      label={'Category'}
      name={'category'}
      options={['All', 'hello', 'world']}
      onChange={e => console.log('SpecialistsCategorySelect', e)}
      value={'All'}
    />
  )
}

function SpecialistsSearch() {
  const [{ query, healthSciencesOnly }, dispatch] = useSpecialists()

  return (
    <div
      css={{
        display: 'grid',
        gridGap: SPACING['S'],
        [MEDIA_QUERIES['S']]: {
          gridTemplateColumns: healthSciencesOnly
            ? `3fr 1fr auto auto`
            : `3fr auto auto`,
        },
        input: {
          lineHeight: '1.5',
          height: '40px',
        },
        marginBottom: SPACING['M'],
      }}
    >
      <TextInput
        id="search"
        labelText="Search by subject or specialty"
        name="query"
        value={query}
        onChange={e => {
          dispatch({ type: 'setQuery', query: e.target.value })
        }}
      />
      <SpecialistsCategorySelect />
      <Button
        kind="subtle"
        onClick={() => dispatch({ type: 'clear' })}
        css={{
          alignSelf: 'end',
        }}
      >
        Clear
      </Button>
      <SpecialistsHealthSciencesOnly />
    </div>
  )
}

function SpecialistsTableResults() {
  const [{ results, healthSciencesOnly }] = useSpecialists()
  const resultsSummary = results.length
    ? `${results.length} results`
    : `No results`

  return (
    <React.Fragment>
      <div
        tabIndex="0"
        css={{
          overflowX: 'auto',
        }}
        role="group"
        aria-labelledby="caption"
      >
        <table
          css={{
            width: '100%',
            minWidth: '840px',
            tableLayout: 'fixed',
            marginBottom: SPACING['XL'],
            'th, td': {
              padding: `${SPACING['S']} 0`,
              textAlign: 'left',
              borderBottom: `solid 1px ${COLORS.neutral['100']}`,
              verticalAlign: 'top',
              '> * + *': {
                marginTop: SPACING['S'],
              },
            },
            'td:not(:last-of-type)': {
              paddingRight: SPACING['XL'],
            },
            th: {
              color: COLORS.neutral['300'],
            },
          }}
        >
          <caption
            id="caption"
            css={{
              textAlign: 'left',
            }}
          >
            <VisuallyHidden>
              <Alert>{resultsSummary}</Alert>
            </VisuallyHidden>

            <p
              css={{
                '@media only screen and (min-width: 720px)': {
                  display: 'none',
                },
              }}
            >
              (Scroll to see more)
            </p>
          </caption>
          <thead>
            <tr>
              <th>Subjects and specialties</th>
              <th colSpan="2">Contact</th>
              {healthSciencesOnly && <th>Category</th>}
              <th>Research guides</th>
            </tr>
          </thead>
          <tbody>
            {results.map(({ name, users, links, categories }, i) => (
              <tr key={name + i}>
                <td>{name}</td>
                <td colSpan="2">
                  {users.map(({ name, title, to }, y) => (
                    <div key={to + y}>
                      <Link to={to}>{name}</Link>
                      <p>{title}</p>
                    </div>
                  ))}
                </td>
                {healthSciencesOnly && (
                  <td>
                    {categories.map((category, y) => (
                      <p key={category + y}>{category}</p>
                    ))}
                  </td>
                )}
                <td>
                  {links.map(({ label, to }, y) => (
                    <p key={to + y}>
                      <Link to={to} kind="subtle">
                        {label}
                      </Link>
                    </p>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!results.length && (
        <NoResults>Consider searching with different keywords.</NoResults>
      )}
    </React.Fragment>
  )
}

export const query = graphql`
  fragment specialistsSynonym on Node {
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

  query($slug: String!) {
    page: nodePage(fields: { slug: { eq: $slug } }) {
      ...pageFragment
    }
    allTaxonomyTermAcademicDiscipline {
      edges {
        node {
          name
          __typename
          relationships {
            field_synonym {
              ...specialistsSynonym
            }
            user__user {
              id
            }
          }
        }
      }
    }
    allTaxonomyTermCollectingAreas {
      edges {
        node {
          name
          __typename
          relationships {
            field_synonym {
              ...specialistsSynonym
            }
            user__user {
              id
            }
          }
        }
      }
    }
    allTaxonomyTermHealthSciences {
      edges {
        node {
          name
          __typename
          relationships {
            field_synonym {
              ...specialistsSynonym
            }
            user__user {
              id
            }
          }
        }
      }
    }
    allTaxonomyTermLibraryExpertise {
      edges {
        node {
          __typename
          name
          relationships {
            field_synonym {
              ...specialistsSynonym
            }
          }
        }
      }
    }
  }
`

const mockData = [
  {
    name: 'Academic and Specialized News',
    users: [
      {
        name: 'Scott L Dennis',
        to: '/users/sdenn',
        title:
          'Librarian for Philosophy, General Reference, and Core Electronic Resources',
      },
      {
        name: 'Shevon Ardeshir Desai',
        to: '/users/shevonad',
        title:
          'Interim Head, Social Science and Clark Library; Librarian for Communication, Media and Information Science',
      },
    ],
    links: [
      {
        label: 'News Sources',
        to: 'https://guides.lib.umich.edu/news',
      },
    ],
    categories: ['School'],
  },
  {
    name: 'Aerospace Engineering',
    users: [
      {
        name: 'Paul F Grochowski',
        to: '/users/grocho',
        title: 'Engineering Librarian',
      },
    ],
    links: [
      {
        label: 'Aerospace Engineering',
        to: 'https://guides.lib.umich.edu/aerospace',
      },
    ],
    categories: ['Clinical Department'],
  },
  {
    name: 'African Studies',
    users: [
      {
        name: 'Loyd Gitari Mbabu',
        to: '/users/lmbabu',
        title:
          'Librarian for African Studies, Collection Coordinator for International Studies',
      },
    ],
    links: [
      {
        label: 'Lusophone Africa',
        to: 'https://guides.lib.umich.edu',
      },
      {
        label: 'African and Diaspora Art and Visual Culture',
        to: 'https://guides.lib.umich.edu',
      },
      {
        label: 'African Studies',
        to: 'https://guides.lib.umich.edu',
      },
    ],
    categories: ['Center'],
  },
]
