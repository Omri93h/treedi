import React, { Component }  from 'react';
import './WelcomePage.css';
import Login from './components/Login';
import Logout from './components/Logout';

function WelcomePage() {
  return (
    
    <div className="Welcome">
      <h2>Teedi App</h2>
      <Login />
      <br />
      <Logout />
     
    </div>
    
  );
}

export default WelcomePage;