import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import "./styles.css";

const InputField = ({ value, onChange, placeholder }) => {
  return (
    <div className="input_field">
      <AiOutlineSearch />
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="input"
        placeholder={placeholder}
      />
    </div>
  );
};

export default InputField;
