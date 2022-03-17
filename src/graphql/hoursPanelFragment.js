import { graphql } from 'gatsby';

export const query = graphql`
  fragment hoursPanelFragment on paragraph__hours_panel {
    ... on Node {
      __typename
      id
    }
    field_placement
    field_body {
      processed
    }
    relationships {
      field_parent_card {
        ...buildingFragment
        ...locationFragment
      }
      field_cards {
        ... on Node {
          __typename
          ...locationFragment
          ...roomFragment
        }
      }
    }
  }
`;
