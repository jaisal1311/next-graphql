import { gql } from "@apollo/client";

export const GET_POSTS = gql`
  query ($options: PageQueryOptions) {
    posts(options: $options) {
      data {
        id
        title
        counter @client
      }
    }
  }
`;

export const GET_COUNTER = gql`
  query GetCounterValue {
    counter @client
  }
`;
