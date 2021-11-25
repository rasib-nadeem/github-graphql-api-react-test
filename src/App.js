import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import React, { useEffect, useState } from "react";
import {
  GetRepoIssuesQuery,
  GetUserRepos,
  SearchUsersQuery,
} from "../src/graphql/Queries";
import "./App.css";
import {
  ActivityIndicator,
  GithubAccessToken,
  Issues,
  Label,
  Paginator,
  Repositries,
  SearchBar,
  UserCard,
} from "./components";

const App = () => {
  const [visible, setVisible] = useState(false);
  const [token, setToken] = useState();
  const httpLink = createHttpLink({
    uri: "https://api.github.com/graphql",
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: `Bearer ${token}`,
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  const [search, setSearch] = useState();
  const [selectedUser, setSelectedUser] = useState();
  const [repositoriesList, setRepositoriesList] = useState([]);
  const [repo, setRepo] = useState();
  const [userPagination, setUserPagination] = useState({
    hasPrev: false,
    current: 1,
    hasNext: false,
  });
  const [repoPagination, setRepoPagination] = useState({
    hasPrev: false,
    current: 1,
    hasNext: false,
  });
  const [issuePagination, setIssuePagination] = useState({
    hasPrev: false,
    current: 1,
    hasNext: false,
  });

  const [selectedRepo, setSelectedRepo] = useState();
  const [showRepositories, setShowRepositories] = useState(false);
  const [users, setUsers] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const access_token = window.localStorage.getItem("token");
    if (!access_token) {
      return setVisible(true);
    }
    setToken(access_token);
    setVisible(false);
  }, []);

  const resetPaginations = () => {
    setRepoPagination({
      hasPrev: false,
      current: 1,
      hasNext: false,
    });
    setIssuePagination({
      hasPrev: false,
      current: 1,
      hasNext: false,
    });
  };

  const handleUserCardClick = async (item, nextCLicked) => {
    try {
      if (!nextCLicked) {
        resetPaginations();
      }
      setShowError(false);
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
      const { data } = await client.query({
        query: GetUserRepos,
        variables: {
          ownerName: name,
          first: nextCLicked
            ? (repoPagination.current + 1) * 5
            : repoPagination.current * 5,
        },
      });
      setLoading(false);
      setRepositoriesList(data.user.repositories.nodes.map((repo) => repo));
      const { pageInfo } = data.user.repositories;
      setRepoPagination((prevState) => {
        return {
          hasNext: pageInfo.hasNextPage,
          current: prevState.current,
          hasPrev: prevState.current > 1 ? true : false,
        };
      });
      setShowRepositories(true);
    } catch (error) {
      setError("Failed to load Users data");
      setShowError(true);
      setLoading(false);
      setShowRepositories(false);
    }
  };

  const SearchUser = async (name, nextCLicked) => {
    if (!nextCLicked) {
      setUserPagination({
        hasPrev: false,
        current: 1,
        hasNext: false,
      });
    }
    resetPaginations();
    setRepo(null);
    setShowRepositories(false);
    setLoading(true);
    const { data } = await client.query({
      query: SearchUsersQuery,
      variables: {
        name: name,
        first: nextCLicked
          ? (userPagination.current + 1) * 5
          : userPagination.current * 5,
      },
    });
    setLoading(false);
    const { pageInfo } = data.search;

    const userList = data.search.nodes.map((user) => user);

    setUsers(userList);
    setUserPagination((prevState) => {
      return {
        hasNext: pageInfo.hasNextPage,
        current: prevState.current,
        hasPrev: prevState.current > 1 ? true : false,
      };
    });
  };

  const handleRepoClick = async (repo, nextClicked) => {
    try {
      if (!nextClicked) {
        setIssuePagination({
          hasPrev: false,
          current: 1,
          hasNext: false,
        });
      }
      setShowError(false);
      setShowRepositories(false);
      setSelectedRepo(repo);
      setRepo(repo.id);
      let name = selectedUser.name.includes(" ")
        ? selectedUser.name.split(" ").join("")
        : selectedUser.name;
      setLoading(true);
      const { data } = await client.query({
        query: GetRepoIssuesQuery,
        variables: {
          repoName: repo.name,
          ownerName: name,
          first: nextClicked
            ? (issuePagination.current + 1) * 5
            : issuePagination.current * 5,
        },
      });

      const { pageInfo } = data.repository.issues;
      const list = data.repository.issues.nodes.map((issue) => issue);
      setIssues(list);

      setIssuePagination((prevState) => {
        return {
          hasNext: pageInfo.hasNextPage,
          current: prevState.current,
          hasPrev: prevState.current > 1 ? true : false,
        };
      });

      setLoading(false);
    } catch (error) {
      setShowError(true);
      setError("Failed to load the repos of this user");
      setLoading(false);
    }
  };

  return (
    <ApolloProvider client={client}>
      <div className="App">
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClick={() => SearchUser(search, false)}
        />
        <ActivityIndicator visible={loading} />
        {showError && <h3 className="error_field">{error}</h3>}
        {users.length !== 0 && (
          <>
            <Label title="Users" />
            <div className="user_list_container">
              {users
                .slice(
                  (userPagination.current - 1) * 5,
                  userPagination.current * 5
                )
                .map((item) => {
                  return (
                    <UserCard
                      selected={selectedUser?.id === item.id}
                      avatar={item.avatarUrl}
                      onClick={() => handleUserCardClick(item, false)}
                      userName={item.name === null ? "No Name" : item.name}
                    />
                  );
                })}
            </div>
            <Paginator
              hasNext={userPagination?.hasNext}
              hasPrev={userPagination?.hasPrev}
              current={userPagination?.current}
              onPrevClick={async () => {
                await setUserPagination((prevState) => {
                  return {
                    ...prevState,
                    current:
                      prevState.current > 1
                        ? prevState.current - 1
                        : prevState.current,
                    hasPrev: prevState.current > 1 ? true : false,
                  };
                });
              }}
              onNextClick={async () => {
                await setUserPagination((prevState) => {
                  return {
                    ...prevState,
                    current: prevState.current + 1,
                  };
                });
                SearchUser(search, true);
              }}
            />
          </>
        )}
        {showRepositories && (
          <Repositries
            repositoriesList={repositoriesList}
            onClick={(repo) => handleRepoClick(repo, false)}
            repoPagination={repoPagination}
            setRepoPagination={setRepoPagination}
            selectedUser={selectedUser}
            handleUserCardClick={handleUserCardClick}
          />
        )}
        {repo && (
          <Issues
            issues={issues}
            selectedRepo={selectedRepo}
            setRepo={setRepo}
            setShowRepositories={setShowRepositories}
            issuePagination={issuePagination}
            handleRepoClick={handleRepoClick}
            setIssuePagination={setIssuePagination}
          />
        )}
      </div>
      <GithubAccessToken visible={visible} setVisible={setVisible} />
    </ApolloProvider>
  );
};

export default App;
