import React from "react";
import { IoIosPerson } from "react-icons/io";
import "./styles.css";

const index = ({ userName, onClick, selected = false, avatar }) => {
  return (
    <div className="user_card_wrapper">
      <div
        className={selected ? "user_card_selected" : "user_card"}
        onClick={onClick}
      >
        {avatar ? (
          <img
            src={avatar}
            alt="user_image"
            width={"95%"}
            height={"95%"}
            style={{ borderRadius: "10px" }}
          />
        ) : (
          <IoIosPerson size={30} color={selected ? "dodgerblue" : "black"} />
        )}
      </div>
      <span className={selected ? "user_name_selected" : "user_name"}>
        {userName}
      </span>
    </div>
  );
};

export default index;
