import "./index.css"
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee } from "@fortawesome/free-solid-svg-icons";
const Banner = () => {
  const isMobile = window.innerWidth <= 600;
  const fontSize = isMobile ? "1em" : "1.5em"; // Decreased from 1.2em and 2em to 1em and 1.5em
  const padding = isMobile ? "10px" : "20px";

  return (
    <div
      style={{
        backgroundColor: "#1a202c",
        textAlign: "center",
        padding: padding,
        fontSize: fontSize,
        fontWeight: "bold",
        color: "#f7fafc",
        boxShadow: "0px 4px 8px 0px rgba(0,0,0,0.2)",
        margin: 0,
        fontFamily: "'Roboto', sans-serif",
        letterSpacing: "1px",
        display: "flex",
        justifyContent: "left",
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
