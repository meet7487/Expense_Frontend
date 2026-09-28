// App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Registration from "./Registration";
import ExpenseDtl from "./ExpenseDtl";
import PriRoute from "./PriRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Registration />} />
      <Route
        path="/expense"
        element={
          <PriRoute>
            <ExpenseDtl />
          </PriRoute>
        }
      />
    </Routes>
  );
}

export default App;
