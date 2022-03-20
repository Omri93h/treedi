import App from './App';
import React, { useState,useEffect } from "react";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";


function WelcomePage() {


  useEffect(() => {
    const script = document.createElement('script');
  
    script.src = "https://apis.google.com/js/platform.js";
    script.async = true;
  
    document.body.appendChild(script);
  
    return () => {
      document.body.removeChild(script);
    }
  }, []);


  const openApp = () => {
    console.log('Clicked')
    window.open(window.location.origin + '/app', 'MyWindow', '_blank');
    // window.close()
  }

  return (
    <Switch>

      <Route path="/app">
        <App/>
      </Route>

      <div className="welcome-page" style={welcomePageStyle}>
        <button className='open-app' onClick={openApp} >
          Start App
        </button>
      </div>    
    </Switch>
    
  );
}

export default WelcomePage;


///////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// STYLES ///////////////////////////////////////

const welcomePageStyle = {
  Display: 'flex',
  Width: '100%',
  height: '100vh',
  textAlign: 'center',
  backgroundColor: 'yellow'
}
