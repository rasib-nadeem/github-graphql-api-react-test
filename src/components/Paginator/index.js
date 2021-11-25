import React from "react";
import { Pagination } from "react-bootstrap";

const Paginator = ({
  hasPrev,
  prev,
  current,
  next,
  hasNext,
  onPrevClick,
  onNextClick,
}) => {
  return (
    <Pagination className="d-flex align-self-center">
      <Pagination.Prev disabled={!hasPrev} onClick={onPrevClick} />
      <Pagination.Item>{current}</Pagination.Item>
      <Pagination.Next disabled={!hasNext} onClick={onNextClick} />
    </Pagination>
  );
};

export default Paginator;
