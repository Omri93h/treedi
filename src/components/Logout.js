import React from 'react';
import { GoogleLogout } from 'react-google-login';
import { useNavigate } from 'react-router-dom';

const clientId = process.env.CLIENT_ID;

const Logout = (props) => {
  const navigate = useNavigate();

  // const onSuccess = () => {
  //   console.log('Logout made successfully');
  //   alert('Logout made successfully ✌');
  // };

  const handleLogout = () => {
    localStorage.removeItem('loginData')
    props.handleLogout();
    alert('Logout made successfully ✌');
    navigate('/')
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
