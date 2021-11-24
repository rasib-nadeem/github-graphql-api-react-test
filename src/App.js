import React, { useState } from "react";
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloProvider,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import {
  Issues,
  Label,
  Repositries,
  SearchBar,
  UserCard,
  ActivityIndicator,
} from "./components";
import "./App.css";
import {
  SearchUsersQuery,
  GetUserRepos,
  GetRepoIssuesQuery,
} from "../src/graphql/Queries";

const httpLink = createHttpLink({
  uri: "https://api.github.com/graphql",
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${process.env.REACT_APP_GITHUB_ACCESS_TOKEN}`,
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const App = () => {
  const [search, setSearch] = useState();
  const [selectedUser, setSelectedUser] = useState();
  const [repositoriesList, setRepositoriesList] = useState([]);
  const [repo, setRepo] = useState();
  const [selectedRepo, setSelectedRepo] = useState();
  const [showRepositories, setShowRepositories] = useState(false);
  const [users, setUsers] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState(false);

  const handleUserCardClick = async (e, item) => {
    setShowError(false);
    e.preventDefault();
    if (item.name === null) {
      setError("Failed to load user's data");
      return setShowError(true);
    }
    setSelectedUser(item);
    setRepo(null);
    let name = item.name.includes(" ")
      ? item.name.split(" ").join("")
      : item.name;
    setLoading(true);
    const { data, error } = await client.query({
      query: GetUserRepos,
      variables: {
        ownerName: name,
      },
    });
    setLoading(false);
    if (error) {
      setShowError(true);
      return setError("Failed to load repos");
    }
    setRepositoriesList(data.user.repositories.nodes.map((repo) => repo));
    setShowRepositories(true);
  };

  const SearchUser = async (e) => {
    e.preventDefault();
    setRepo(null);
    setShowRepositories(false);
    setLoading(true);
    const { data } = await client.query({
      query: SearchUsersQuery,
      variables: {
        name: search,
      },
    });
    setLoading(false);

    const userList = data.search.nodes.map((user) => user);
    setUsers(userList);
  };

  const handleRepoClick = async (repo) => {
    setShowError(false);
    setShowRepositories(false);
    setSelectedRepo(repo);
    setRepo(repo.id);
    let name = selectedUser.name.includes(" ")
      ? selectedUser.name.split(" ").join("")
      : selectedUser.name;
    setLoading(true);
    const { data, error } = await client.query({
      query: GetRepoIssuesQuery,
      variables: {
        repoName: repo.name,
        ownerName: name,
      },
    });
    if (error) {
      setShowError(true);
      return setError("Failed to load issues");
    }
    setLoading(false);
    setIssues(data.repository.issues.nodes.map((issue) => issue));
  };

  return (
    <ApolloProvider client={client}>
      <div className="App">
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClick={SearchUser}
        />
        <ActivityIndicator visible={loading} />
        {showError && <h3 className="error_field">{error}</h3>}
        {users.length !== 0 && (
          <>
            <Label title="Users" />
            <div className="user_list_container">
              {users.map((item) => {
                return (
                  <UserCard
                    selected={selectedUser?.id === item.id}
                    avatar={item.avatarUrl}
                    onClick={(e) => handleUserCardClick(e, item)}
                    userName={item.name === null ? "No Name" : item.name}
                  />
                );
              })}
            </div>
          </>
        )}
        {showRepositories && (
          <Repositries
            repositoriesList={repositoriesList}
            onClick={handleRepoClick}
          />
        )}
        {repo && (
          <Issues
            issues={issues}
            selectedRepo={selectedRepo}
            setRepo={setRepo}
            setShowRepositories={setShowRepositories}
          />
        )}
      </div>
    </ApolloProvider>
  );
};

export default App;
