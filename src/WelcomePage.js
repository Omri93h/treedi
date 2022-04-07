import React, { Component, useState } from 'react';
import './WelcomePage.css';
import Login from './components/Login';
import Logout from './components/Logout';

function WelcomePage(props) {
  // const [loginData, setLoginData] = useState(localStorage.getItem('loginData') ? JSON.parse(localStorage.getItem('loginData')) : null)
  
  // const handleLogout = () => {
  //   setLoginData(null)
  // }
  return (
    <div className="Welcome">
      <h2>Teedi App</h2>
      <Login handleLogin={props.handleLogin} />
      {/* <Login /> */}
      {/* <br /> */}
      {/* <Logout /> */}

    </div>

  );
}

export default WelcomePage;