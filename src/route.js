import { Routes, Route, BrowserRouter } from "react-router-dom";
import React, { Fragment } from "react";
import WelcomePage from './WelcomePage'
import App from './App'

function Routing() {
    return (
      <div>
          <Routes>
              <Fragment>
            <Route exact path="/" element={<WelcomePage/>}>
            </Route>
            <Route  path="/homepage" element={<App/>}>
            </Route>
            </Fragment>
          </Routes>
      </div>
    );
  }
  export default Routing;