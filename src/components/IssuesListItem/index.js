import React from "react";
import "./styles.css";

const IssuesListItem = ({ issue, days, by, onClick }) => {
  return (
    <div className="issues_list_item_wrapper">
      <div className="issue_name">{issue}</div>
      <div>{days}</div>
    </div>
  );
};

export default IssuesListItem;
