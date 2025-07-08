import React from "react";
import Home from "./Home";
import Form from "./Form";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { NavLink } from "react-router-dom";

function App() {
  return (
    <div id="app">
      <nav>
        {/* NavLinks here */}
        <NavLink to="/">Home</NavLink>
        <NavLink to="/order">Order</NavLink>
      </nav>
      {/* Route and Routes here */}
      <Routes>
        <Route index element={<Home />} />
        <Route path={"/order"} element={<Form />} />
      </Routes>
    </div>
  );
}

export default App;
