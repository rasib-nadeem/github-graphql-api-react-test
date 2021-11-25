import { gql } from "@apollo/client";

export const SearchUsersQuery = gql`
  query MyQuery($name: String!, $first: Int!) {
    search(query: $name, type: USER, first: $first) {
      nodes {
        ... on User {
          id
          avatarUrl
          name
        }
      }
      pageInfo {
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
`;

export const CreateIssueQuery = gql`
  mutation MyMutation($id: ID!, $title: String!, $description: String!) {
    __typename
    createIssue(
      input: { repositoryId: $id, title: $title, body: $description }
    ) {
      clientMutationId
    }
  }
`;

export const GetRepoIssuesQuery = gql`
  query getIssues($repoName: String!, $ownerName: String!, $first: Int!) {
    repository(name: $repoName, owner: $ownerName) {
      id
      issues(first: $first, states: OPEN) {
        nodes {
          id
          title
          publishedAt
        }
        pageInfo {
          hasNextPage
          startCursor
          endCursor
        }
      }
    }
  }
`;

export const GetUserRepos = gql`
  query getRepos($ownerName: String!, $first: Int!) {
    user(login: $ownerName) {
      repositories(
        first: $first
        orderBy: { field: CREATED_AT, direction: ASC }
      ) {
        nodes {
          id
          name
          stargazerCount
          watchers(first: 5) {
            nodes {
              id
              name
            }
          }
        }
        pageInfo {
          hasNextPage
          startCursor
          endCursor
        }
      }
    }
  }
`;
