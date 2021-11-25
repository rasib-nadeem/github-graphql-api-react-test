import React from "react";
import { Label, RepositoryListItem, Paginator } from "..";

const Repositries = ({ repositoriesList, onClick, repoPagination }) => {
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
        repositoriesList.map((item) => {
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
        prev={repoPagination?.prev}
        next={repoPagination?.next}
      />
    </>
  );
};

export default Repositries;
