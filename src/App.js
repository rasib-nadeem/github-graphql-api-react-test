import React, { useState, useEffect } from "react";
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
  Paginator,
  GithubAccessToken,
} from "./components";
import "./App.css";
import {
  SearchUsersQuery,
  GetUserRepos,
  GetRepoIssuesQuery,
} from "../src/graphql/Queries";

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
  const [userPageInfo, setUserPageInfo] = useState({});

  const [userPagination, setUserPagination] = useState({
    hasPrev: false,
    prev: 0,
    current: 1,
    next: 2,
    hasNext: false,
  });
  const [repoPagination, setRepoPagination] = useState({
    hasPrev: false,
    prev: 0,
    current: 0,
    next: 1,
    hasNext: false,
  });
  const [issuePagination, setIssuePagination] = useState({
    hasPrev: false,
    prev: 0,
    current: 0,
    next: 1,
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
      prev: 0,
      current: 0,
      next: 1,
      hasNext: false,
    });
    setIssuePagination({
      hasPrev: false,
      prev: 0,
      current: 0,
      next: 1,
      hasNext: false,
    });
  };

  const handleUserCardClick = async (e, item) => {
    try {
      resetPaginations();
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
      const { data } = await client.query({
        query: GetUserRepos,
        variables: {
          ownerName: name,
          first:
            userPagination.current === 0
              ? userPagination.current + 1 * 5
              : userPagination.current * 5,
        },
      });
      setLoading(false);
      const { pageInfo } = data.user.repositories;

      const list = data.user.repositories.nodes.map((repo) => repo);
      setRepositoriesList(
        list.slice(repoPagination.prev * 5, repoPagination.current + 1 * 5)
      );
      setRepoPagination((prevState) => {
        return {
          hasNext: pageInfo.hasNextPage,
          current: pageInfo.hasNextPage
            ? prevState.current + 1
            : prevState.current,
          hasPrev: prevState + 1 > 1 ? true : false,
          prev: pageInfo.hasNextPage ? prevState.prev + 1 : prevState.prev,
          next: pageInfo.hasNextPage ? prevState.next + 1 : prevState.next,
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

  const SearchUser = async (name, nextCLicked, prevClicked) => {
    if (!nextCLicked) {
      setUserPagination({
        hasPrev: false,
        prev: 0,
        current: 1,
        next: 2,
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
        first: userPagination.current * 5,
      },
    });
    setLoading(false);
    const { pageInfo } = data.search;
    setUserPageInfo(pageInfo);

    const userList = data.search.nodes.map((user) => user);

    const pageNumber = userPagination.current;
    const pageSize = 5;

    const slicedData = userList.slice(
      (pageNumber - 1) * pageSize,
      pageNumber * pageSize
    );
    setUsers(slicedData);
    if (!prevClicked) {
      setUserPagination((prevState) => {
        return {
          hasNext: pageInfo.hasNextPage,
          current: pageInfo.hasNextPage
            ? prevState.current + 1
            : prevState.current,
          hasPrev: false,
          prev: pageInfo.hasNextPage ? prevState.prev + 1 : prevState.prev,
          next: pageInfo.hasNextPage ? prevState.next + 1 : prevState.next,
        };
      });
    }
    if (userPagination.current === 1) {
      setUserPagination((prevState) => {
        return {
          hasNext: pageInfo.hasNextPage,
          current: prevState.current,
          hasPrev: true,
          prev: pageInfo.hasNextPage ? prevState.prev + 1 : prevState.prev,
          next: pageInfo.hasNextPage ? prevState.next + 1 : prevState.next,
        };
      });
    }
  };

  const handleRepoClick = async (repo) => {
    try {
      resetPaginations();
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
        },
      });

      const { pageInfo } = data.repository.issues;
      const list = data.repository.issues.nodes.map((issue) => issue);
      setIssues(
        list.slice(issuePagination.prev * 5, issuePagination.current + 1 * 5)
      );

      setIssuePagination((prevState) => {
        return {
          hasNext: pageInfo.hasNextPage,
          current: pageInfo.hasNextPage
            ? prevState.current + 1
            : prevState.current,
          hasPrev: false,
          prev: pageInfo.hasNextPage ? prevState.prev + 1 : prevState.prev,
          next: pageInfo.hasNextPage ? prevState.next + 1 : prevState.next,
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
          onClick={() => SearchUser(search, false, true)}
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
            <Paginator
              hasNext={userPagination?.hasNext}
              hasPrev={userPagination?.hasPrev}
              current={userPagination?.current}
              prev={userPagination?.prev}
              next={userPagination?.next}
              onPrevClick={async () => {
                await setUserPagination((prev) => {
                  let newState = prev;
                  console.log({ previous: newState.prev });
                  return {
                    hasPrev: newState.prev > 0 ? false : true,
                    prev: newState.prev - 1,
                    current: newState.current - 1,
                    next: newState.next - 1,
                    hasNext: newState.hasNext,
                  };
                });
                SearchUser(search, true, true);
              }}
              onNextClick={() => {
                SearchUser(search, true, false);
              }}
            />
          </>
        )}
        {showRepositories && (
          <Repositries
            repositoriesList={repositoriesList}
            onClick={handleRepoClick}
            repoPagination={repoPagination}
          />
        )}
        {repo && (
          <Issues
            issues={issues}
            selectedRepo={selectedRepo}
            setRepo={setRepo}
            setShowRepositories={setShowRepositories}
            issuePagination={issuePagination}
          />
        )}
      </div>
      <GithubAccessToken visible={visible} setVisible={setVisible} />
    </ApolloProvider>
  );
};

export default App;
