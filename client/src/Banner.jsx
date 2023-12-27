import "./index.css";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee } from "@fortawesome/free-solid-svg-icons";


const Banner = () => {
  return (
    <div
      style={{
        backgroundColor: "#1a202c",
        textAlign: "center",
        padding: "20px",
        fontSize: "2em",
        fontWeight: "bold",
        color: "#f7fafc",
        boxShadow: "0px 4px 8px 0px rgba(0,0,0,0.2)",
        margin: 0,
        fontFamily: "'Roboto', sans-serif",
        letterSpacing: "1px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <FontAwesomeIcon
        icon={faCoffee}
        size="1x"
        style={{ marginRight: "10px" }}
      />
      MochaMaps
    </div>
  );
};

export default Banner;
