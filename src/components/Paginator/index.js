import React from "react";
import { Pagination } from "react-bootstrap";

const Paginator = ({
  prev,
  current,
  next,
  hasNext,
  onPrevClick,
  onNextClick,
}) => {
  return (
    <Pagination>
      <Pagination.Prev onClick={onPrevClick} />
      {current !== 1 && <Pagination.Item>{prev}</Pagination.Item>}
      <Pagination.Item>{current}</Pagination.Item>
      {hasNext && <Pagination.Item>{next}</Pagination.Item>}
      <Pagination.Next disabled={!hasNext} onClick={onNextClick} />
    </Pagination>
  );
};

export default Paginator;
