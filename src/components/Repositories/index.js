import React from "react";
import { Label, RepositoryListItem, Paginator } from "..";

const Repositries = ({
  repositoriesList,
  onClick,
  repoPagination,
  setRepoPagination,
  handleUserCardClick,
  selectedUser,
}) => {
  return (
    <>
      <Label title="Repositories" />
      {repositoriesList.length === 0 ? (
        <h3
          style={{ display: "flex", alignSelf: "center", color: "dodgerblue" }}
        >
          No Repositories
        </h3>
      ) : (
        repositoriesList
          .slice((repoPagination.current - 1) * 5, repoPagination.current * 5)
          .map((item) => {
            return (
              <RepositoryListItem
                key={item.id}
                name={item.name}
                stars={item.stargazerCount}
                watching={item.watchers.nodes.length}
                onClick={() => onClick(item)}
              />
            );
          })
      )}
      <Paginator
        hasNext={repoPagination?.hasNext}
        hasPrev={repoPagination?.hasPrev}
        current={repoPagination?.current}
        onPrevClick={async () => {
          await setRepoPagination((prevState) => {
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
          await setRepoPagination((prevState) => {
            return {
              ...prevState,
              current: prevState.current + 1,
            };
          });
          handleUserCardClick(selectedUser, true);
        }}
      />
    </>
  );
};

export default Repositries;
