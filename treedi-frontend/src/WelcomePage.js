import React, { Component, useState } from "react";
import "./WelcomePage.css";
import Login from "./components/Login";


function WelcomePage() {
  const [loginData, setLoginData] = useState(localStorage.getItem('loginData') ? JSON.parse(localStorage.getItem('loginData')) : null)

  // const handleLogout = () => {
  //   setLoginData(null)
  // }
  return (
    <div className="Welcome">
      <h2>Teedi App</h2>
      <Login />
    </div>
  );
}

export default WelcomePage;
