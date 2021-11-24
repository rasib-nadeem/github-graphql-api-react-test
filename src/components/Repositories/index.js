import React from "react";
import { Label, RepositoryListItem } from "..";

const Repositries = ({ repositoriesList, onClick }) => {
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
    </>
  );
};

export default Repositries;
