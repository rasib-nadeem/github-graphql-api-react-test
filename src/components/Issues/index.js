import React, { useState } from "react";
import moment from "moment";
import { Button } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { CreateIssueQuery } from "../../graphql/Queries";

import {
  AddIssueModal,
  IssuesListItem,
  Label,
  RepositoryListItem,
  Paginator,
} from "..";
import "./styles.css";

const Issues = ({
  issues,
  selectedRepo,
  setRepo,
  setShowRepositories,
  issuePagination,
  setIssuePagination,
  handleRepoClick,
}) => {
  const [createIssue] = useMutation(CreateIssueQuery);
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState();

  const handleDays = (startingDate) => {
    const currentDate = moment(new Date());

    const days = currentDate.diff(startingDate, "days");
    if (days >= 365) {
      return `${parseInt(days / 365)} year ago`;
    } else if (days >= 31 || days >= 30) {
      return `${days / 30} month ago`;
    } else {
      return `${days} day ago `;
    }
  };

  const handleCreateIssue = async () => {
    setShowError(false);
    if (!title || !description) {
      setShowError(true);
      setError("Enter all data");
      return;
    }

    const { errors } = await createIssue({
      variables: {
        id: selectedRepo.id,
        title: title,
        description: description,
      },
    });
    if (!errors) {
      setVisible(false);
      setRepo(null);
      setShowRepositories(true);
    }
  };

  return (
    <>
      <Label title="Issues" />

      <RepositoryListItem
        name={selectedRepo.name}
        stars={selectedRepo.stargazerCount}
        watching={selectedRepo.watchers.nodes.length}
      />

      <div className="new_issue_wrapper">
        <span>Open Issues</span>
        <Button onClick={() => setVisible(true)}>New Issue</Button>
      </div>

      {issues.length === 0 ? (
        <h3
          style={{ display: "flex", alignSelf: "center", color: "dodgerblue" }}
        >
          No Issues
        </h3>
      ) : (
        issues
          .slice((issuePagination.current - 1) * 5, issuePagination.current * 5)
          .map((item) => {
            return (
              <IssuesListItem
                key={item.id}
                issue={item.title}
                days={handleDays(moment(item.publishedAt))}
                by={item.by}
              />
            );
          })
      )}
      <AddIssueModal
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        visible={visible}
        setVisible={setVisible}
        onCreate={handleCreateIssue}
        showError={showError}
        error={error}
      />
      <Paginator
        hasNext={issuePagination?.hasNext}
        hasPrev={issuePagination?.hasPrev}
        current={issuePagination?.current}
        onPrevClick={async () => {
          await setIssuePagination((prevState) => {
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
          await setIssuePagination((prevState) => {
            return {
              ...prevState,
              current: prevState.current + 1,
            };
          });
          handleRepoClick(selectedRepo, true);
        }}
      />
    </>
  );
};

export default Issues;
