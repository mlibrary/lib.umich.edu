/*
  # Find a Specialist nodes

  Take structured data created from Drupal JSON API
  gatsby-source-drupal plugin and create new nodes that
  are easier to use for the Find a Specialist template.

  Combine these terms across all 4 taxonomies
   1. Health Sciences
   2. Academic Discipline
   3. Collecting Areas
   4. Library Expertise

  Use the synonyms overriding priority above.

  ## Notes
  - forget the syntax, and outline what the recursive algorithm should look like.

  ## Ideas
  - Pull users out.
  - Figure out how to walk between the trees, define what the question is to complete
    each step thru a node. Consider this recursive.
  - Keep a list of what to filter out, if it has been absorbed.
*/

export default function createSpecialistNodes({ data }) {
  console.log('createSpecialistNodes, props', data)

  //return mockData

  // The order of these are by prioriry.
  // It decides how they are combined when a synonym exists.
  const specialistTermKeys = [
    'allTaxonomyTermHealthSciences',
    'allTaxonomyTermAcademicDiscipline',
    'allTaxonomyTermCollectingAreas',
    'allTaxonomyTermLibraryExpertise',
  ]

  // Create a single list ordered by priority with just the data needed.
  const flattened = specialistTermKeys.reduce((acc, termKey, i) => {
    const processedTerm = data[termKey].edges.reduce((memo, edge) => {
      const { name, relationships, __typename } = edge.node
      const users =
        relationships.user__user &&
        relationships.user__user.map(user => user.id)
      const synonyms = relationships.field_synonym.map(syn => syn.name)
      const order = i
      return memo.concat({ type: __typename, name, users, synonyms, order })
    }, [])

    return acc.concat(processedTerm)
  }, [])

  console.log('flattened', flattened)

  const synonymsProccessed = flattened.reduce((acc, specialty) => {
    const { order, users, synonyms } = specialty

    if (order === 0) {
      return specialty
    }
  }, [])

  console.log('synonymsProccessed', synonymsProccessed)

  return []
}

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
  },
]
