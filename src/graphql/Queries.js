import { gql } from "@apollo/client";

export const SearchUsersQuery = gql`
  query MyQuery($name: String!) {
    search(query: $name, type: USER, first: 10) {
      nodes {
        ... on User {
          id
          avatarUrl
          name
        }
      }
      pageInfo {
        hasNextPage
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
  query getIssues($repoName: String!, $ownerName: String!) {
    repository(name: $repoName, owner: $ownerName) {
      id
      issues(first: 10, states: OPEN) {
        nodes {
          id
          title
          publishedAt
        }
        pageInfo {
          hasNextPage
        }
      }
    }
  }
`;

export const GetUserRepos = gql`
  query getRepos($ownerName: String!) {
    user(login: $ownerName) {
      repositories(first: 10, orderBy: { field: CREATED_AT, direction: ASC }) {
        nodes {
          id
          name
          stargazerCount
          watchers(first: 10) {
            nodes {
              id
              name
            }
          }
        }
      }
    }
  }
`;
