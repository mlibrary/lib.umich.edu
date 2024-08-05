/*
 *# Find a Specialist nodes
 *
 *Take structured data created from Drupal JSON API
 *gatsby-source-drupal plugin and create new nodes that
 *are easier to use for the Find a Specialist template.
 *
 *Combine these terms across all 4 taxonomies
 * 1. Health Sciences
 * 2. Academic Discipline
 * 3. Collecting Areas
 * 4. Library Expertise
 *
 *Use the synonyms overriding priority above.
 */

export default function processSpecialistData ({ data }) {
  const groups = [
    'allTaxonomyTermHealthSciences',
    'allTaxonomyTermAcademicDiscipline',
    'allTaxonomyTermCollectingAreas',
    'allTaxonomyTermLibraryExpertise'
  ];

  const flatten = groups.reduce((acc, group) => {
    return acc.concat(data[group].edges.map(({ node }) => {
      return node;
    }));
  }, []);

  let inheritedNodesIds = [];

  const getChildren = (node) => {
    const { relationships } = node;
    const { field_synonym: fieldSynonym } = relationships;

    return fieldSynonym;
  };

  const getUsers = (node) => {
    const { relationships } = node;
    /* eslint-disable camelcase */
    const { user__user } = relationships;
    const users = user__user ? user__user : [];
    /* eslint-disable camelcase */

    return users;
  };

  const processUserNodes = (nodes) => {
    return nodes.map(
      ({ name, field_user_display_name, field_user_work_title }) => {
        return {
          description: field_user_work_title,
          link: {
            label: field_user_display_name,
            to: `/users/${name}`
          }
        };
      }
    );
  };

  const processGroupEmail = ({ node }) => {
    const { field_group_email, field_brief_group_description } = node;

    if (!field_group_email) {
      return [];
    }

    return [
      {
        description: field_brief_group_description,
        link: {
          label: field_group_email,
          to: `mailto:${field_group_email}`
        }
      }
    ];
  };

  /*
   *If there is a groupEmail, use that.
   *Otherwise use users, and if there are no users,
   *use the Ask a Librarian contact.
   */
  const processContacts = ({ users, groupEmail }) => {
    if (groupEmail.length > 0) {
      return groupEmail;
    }

    if (users.length > 0) {
      return users;
    }

    return [
      {
        description:
          'We can help you locate library resources, connect with a specialist, or find support at any stage of your project.',
        link: {
          label: 'Ask a Librarian',
          to: '/ask-librarian'
        }
      }
    ];
  };

  const result = flatten.reduce((acc, node, index) => {
    if (inheritedNodesIds.includes(node.id)) {
      return acc;
    }
    const children = flatten.slice(index + 1).filter((callbackFn) => {
      const isChild = getChildren(callbackFn).find((elementToFind) => {
        return node.id === elementToFind.id;
      });
      return isChild;
    });
    const userNodes = getUsers(node).concat(
      children.map((callbackFn) => {
        return getUsers(callbackFn);
      }).flat()
    );
    const uniqueUserNames = Array.from(
      new Set(userNodes.map(({ name }) => {
        return name;
      }))
    );
    const uniqueUserNodes = uniqueUserNames.map((name) => {
      return userNodes.find((callbackFn) => {
        return callbackFn.name === name;
      });
    });
    const users = processUserNodes(uniqueUserNodes);
    inheritedNodesIds = Array.from(
      new Set(inheritedNodesIds.concat(children.map((child) => {
        return child.id;
      })))
    );
    const groupEmail = processGroupEmail({
      node
    });
    const contacts = processContacts({
      groupEmail,
      users
    });

    return acc.concat({
      category: node.relationships?.field_health_sciences_category?.name,
      contacts,
      name: node.name
    });
  }, []);

  const sortedResult = [...result].sort((sortLeft, sortRight) => {
    const nameA = sortLeft.name.toLowerCase();
    const nameB = sortRight.name.toLowerCase();

    if (nameA < nameB) {
      return -1;
    }

    if (nameA > nameB) {
      return 1;
    }

    return 0;
  });

  return sortedResult;
}
