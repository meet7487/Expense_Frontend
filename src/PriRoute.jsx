// PriRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const PriRoute = ({ children }) => {
  const isAuth = localStorage.getItem("isValidate") === "true";
  return isAuth ? children : <Navigate to="/" />;
};

export default PriRoute;
