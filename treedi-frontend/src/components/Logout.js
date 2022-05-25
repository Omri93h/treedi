import React from 'react';
import { GoogleLogout } from 'react-google-login';
import { useNavigate } from 'react-router-dom';
import axios from "axios";


const clientId = process.env.CLIENT_ID;

const Logout = (props) => {
  const navigate = useNavigate();

  const HandleLogOut = async (response) => {
    let params = new URL(document.location).searchParams;
    let code = params.get("code");
    console.log("Starting Logout");
    const res = await axios.get("http://localhost:5001/api/googleDrive/logOut/?code=" + code);
      console.log('google responseee:', res);
      navigate('/');
  };

  const handleLogout = () => {

    localStorage.removeItem('loginData')
    props.handleLogout();
    alert('Logout made successfully ✌');
    localStorage.clear();
    HandleLogOut();
  }

  return (
    <div>
      <GoogleLogout
        clientId={process.env.REACT_APP_CLIENT_ID}
        buttonText="Logout"
        onLogoutSuccess={handleLogout}
      ></GoogleLogout>
    </div>
  );
}

export default Logout;
