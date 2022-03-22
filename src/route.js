import { Routes, Route } from "react-router-dom";
import React, { Fragment } from "react";
import WelcomePage from './WelcomePage'
import App from './App'
import TreediDraw from './TreediDraw'

function Routing() {
  return (
    <div>
      <Routes>
        <Route exact path="/" element={<WelcomePage />}>
        </Route>
        <Route path="/homepage" element={<App />}>
        </Route>
        <Route path="/treedi" element={<TreediDraw />}>
        </Route>
      </Routes>
    </div>
  );
}
export default Routing;