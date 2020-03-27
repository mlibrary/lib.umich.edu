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
*/

const exampleData = [
  {
    id: 'fb10a9ff-82dc-5ee1-a9cb-bab2453548f5',
    name: 'Music',
    __typename: 'taxonomy_term__academic_discipline',
    relationships: {
      field_synonym: [
        {
          __typename: 'taxonomy_term__collecting_areas',
          id: '552b5e79-a1a4-5b61-a3a8-4dc01d3edfe5',
          name: 'Music, Theatre and Dance',
        },
      ],
      user__user: [
        {
          id: '11641a42-f150-5d15-a79e-554b0543ab5e',
          name: 'imbesij',
          field_user_display_name: 'Jason Imbesi',
          field_user_work_title: 'Librarian for Music, Theatre and Dance',
        },
        {
          field_user_display_name: 'Jon Earley',
          field_user_work_title: 'User Interface Design Engineer',
          name: 'earleyj',
        },
      ],
    },
  },
  {
    id: 'aada48c9-dae1-5221-9824-8407f39e3352',
    name: 'Theatre and Drama',
    __typename: 'taxonomy_term__academic_discipline',
    relationships: {
      field_synonym: [
        {
          __typename: 'taxonomy_term__collecting_areas',
          id: '552b5e79-a1a4-5b61-a3a8-4dc01d3edfe5',
          name: 'Music, Theatre and Dance',
        },
      ],
      user__user: [
        {
          id: '11641a42-f150-5d15-a79e-554b0543ab5e',
          name: 'imbesij',
          field_user_display_name: 'Jason Imbesi',
          field_user_work_title: 'Librarian for Music, Theatre and Dance',
        },
      ],
    },
  },
  {
    id: '552b5e79-a1a4-5b61-a3a8-4dc01d3edfe5',
    name: 'Music, Theatre and Dance',
    __typename: 'taxonomy_term__collecting_areas',
    relationships: {
      field_synonym: [
        {
          __typename: 'taxonomy_term__academic_discipline',
          id: 'fb10a9ff-82dc-5ee1-a9cb-bab2453548f5',
          name: 'Music',
        },
        {
          __typename: 'taxonomy_term__academic_discipline',
          id: 'aada48c9-dae1-5221-9824-8407f39e3352',
          name: 'Theatre and Drama',
        },
        {
          __typename: 'taxonomy_term__academic_discipline',
          id: '99912849-fd48-5c9f-becf-58bfe47be2c4',
          name: 'Dance',
        },
      ],
      user__user: [
        {
          field_user_display_name: 'Jason Imbesi',
          field_user_work_title: 'Librarian for Music, Theatre and Dance',
          name: 'imbesij',
        },
      ],
    },
  },
  {
    id: 'd6bd986d-710a-51df-8f31-233f89b0aff6',
    name: 'Allergy and Clinical Immunology',
    __typename: 'taxonomy_term__health_sciences',
    field_hs_category: 'department',
    relationships: {
      field_synonym: [
        {
          __typename: 'taxonomy_term__academic_discipline',
          id: '3a8a1cdf-121a-557c-ac74-b417d69c0803',
          name: 'Allergy and Clinical Immunology',
        },
      ],
      user__user: [
        {
          id: 'b32d5de8-cc37-51b4-a5b8-fd4624fef0a6',
          field_user_display_name: 'Emily Catherine Ginier',
          field_user_work_title: 'Associate Librarian',
          name: 'eginier',
        },
      ],
    },
  },
]

export default function createSpecialistNodes({ data }) {
  console.log('createSpecialistNodes, props', data)

  //return mockData

  // The order of these are by prioriry.
  // It decides how they are combined when a synonym exists.
  const groups = [
    'allTaxonomyTermHealthSciences',
    'allTaxonomyTermAcademicDiscipline',
    //'allTaxonomyTermCollectingAreas',
    //'allTaxonomyTermLibraryExpertise',
  ]

  const flatten = groups.reduce((acc, group) => {
    return acc.concat(data[group].edges.map(({ node }) => node))
  }, [])

  let inheritedNodesIds = []

  const result = flatten.reduce((acc, node, i) => {
    if (inheritedNodesIds.includes(node.id)) {
      return acc
    }

    const children = flatten.slice(i + 1).filter(n => {
      const isChild = getChildren(n).find(c => node.id === c.id)
      return isChild
    })
    const userNodes = getUsers(node).concat(
      children.map(n => getUsers(n)).flat()
    )
    const uniqueUserNames = Array.from(
      new Set(userNodes.map(({ name }) => name))
    )
    const uniqueUserNodes = uniqueUserNames.map(name => {
      return userNodes.find(n => n.name === name)
    })
    const users = processUserNodes(uniqueUserNodes)
    inheritedNodesIds = Array.from(
      new Set(inheritedNodesIds.concat(children.map(child => child.id)))
    )

    return acc.concat({
      name: node.name,
      users: users.length > 0 ? users : null,
      category: node.field_hs_category ? node.field_hs_category : null,
    })
  }, [])

  function processUserNodes(nodes) {
    return nodes.map(
      ({ name, field_user_display_name, field_user_work_title }) => {
        return {
          uniqname: name,
          name: field_user_display_name,
          title: field_user_work_title,
        }
      }
    )
  }

  function getUsers(node) {
    const { relationships } = node
    const { user__user } = relationships
    const users = user__user ? user__user : []

    return users
  }

  function getChildren(node) {
    const { relationships } = node
    const { field_synonym } = relationships

    return field_synonym
  }

  return result
}

export const mockData = [
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
