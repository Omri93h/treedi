import React, { useState } from 'react';
import GoogleLogin from 'react-google-login';
// refresh token
import { refreshTokenSetup } from '../utils/refreshToken';
import { useNavigate } from 'react-router-dom';

const clientId  = process.env.REACT_APP_CLIENT_ID;

function Login(props) {
  // const history = useHistory();
  const navigate = useNavigate();
  
  const onSuccess = (googleData) => {
    props.handleLogin(googleData);
    localStorage.setItem('loginData', JSON.stringify(googleData));

    // console.log('Login Success: currentUser:', res.profileObj);
    // console.log(res);
    console.log(googleData)
    alert(
      `Logged in successfully welcome Treedi ${googleData.profileObj.name} .`
    );
     navigate('/treedi')
    // refreshTokenSetup(res);
    // localStorage.setItem("tokenObj",res.tokenObj.access_token);
    //window.open(window.location.origin + '/treedi', 'MyWindow', '_blank');

  };

  const onFailure = (res) => {
    console.log('Login failed: res:', res);
    alert(
      `Failed to login.`
    );
  };

  return (
    <div>
      <GoogleLogin
        buttonText="Login"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={'single_host_origin'}
        style={{ marginTop: '100px' }}
        // isSignedIn={true}
        clientId={process.env.REACT_APP_CLIENT_ID}
      />
    </div>
  );
}

export default Login;
