import React from "react";
import { Button } from "react-bootstrap";
import { InputField } from "..";
import "./styles.css";

const SearchBar = ({ value, onChange, onClick }) => {
  return (
    <div className="search_bar">
      <InputField
        value={value}
        onChange={onChange}
        placeholder="Search users..."
      />
      <Button onClick={onClick}>Search</Button>
    </div>
  );
};

export default SearchBar;
