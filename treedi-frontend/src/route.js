import { Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import WelcomePage from './WelcomePage';
import App from './App';
import TreediDraw from './TreediDraw';

function Routing() {
  const [loginData, setLoginData] = useState(localStorage.getItem('loginData') ? JSON.parse(localStorage.getItem('loginData')) : null)

  const handleLogout = () => {
    setLoginData(null)
  }

  const handleLogin = (data) => {
    setLoginData(data)
  }
  
  return (
    <div>
      <Routes>
        <Route exact path="/" element={<WelcomePage handleLogin={handleLogin}/>}>
        </Route>
        <Route path="/homepage" element={<App />}>
        </Route>
        <Route path="/treedi" element={<TreediDraw handleLogout={handleLogout}/>}>
        </Route>
      </Routes>
    </div>
  );
}
export default Routing;