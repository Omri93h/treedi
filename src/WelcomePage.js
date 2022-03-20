import './WelcomePage.css';
import Login from './components/Login';
import Logout from './components/Logout';
import App from './App';
import React, { useState,useEffect } from "react";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

//import LoginHooks from './components/LoginHooks';
//import LogoutHooks from './components/LogoutHooks';

  const openApp = () => {
    console.log('Clicked')
    window.open(window.location.origin + '/app', 'MyWindow', '_blank');
    // window.close()
  }

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





    
  {/* //   <div className="Welcome">
  //     <h2>Teedi App</h2>
  //     <Login onClick = />
  //     <br />
  //     <Logout />
     
  //   </div>
  // ); */}

export default WelcomePage;


// export default WelcomePage;