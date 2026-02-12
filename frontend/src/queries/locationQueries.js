import { gql } from '@apollo/client';

const GET_LOCATIONS = gql`
  query getLocations {
    locations {
      _id
      name
      schoolNumber
    }
  }
`;

export { GET_LOCATIONS };
