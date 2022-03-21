import { Routes, Route } from "react-router-dom";
import React, { Fragment } from "react";
import WelcomePage from './WelcomePage'
import App from './App'
import TreediDraw from './TreediDraw'

function Routing() {
    return (
      <div>
          <Routes>
              <Fragment>
            <Route exact path="/" element={<WelcomePage/>}>
            </Route>
            <Route  path="/homepage" element={<App/>}>
            </Route>
            <Route  path="/treedi" element={<TreediDraw/>}>
            </Route>
            </Fragment>
          </Routes>
      </div>
    );
  }
  export default Routing;