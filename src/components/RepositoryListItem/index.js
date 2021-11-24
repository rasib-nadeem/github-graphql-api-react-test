import React from "react";
import "./styles.css";

const RepositoryListItem = ({ name, stars, watching, onClick }) => {
  return (
    <div onClick={onClick} className="respository_list_item_wrapper">
      <div className="repository_name">{name}</div>
      <div>
        {stars} stars / {watching} watching
      </div>
    </div>
  );
};

export default RepositoryListItem;
