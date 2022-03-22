import { useNavigate } from 'react-router-dom';

import React from 'react';

import { GoogleLogin } from 'react-google-login';
// refresh token
import { refreshTokenSetup } from '../utils/refreshToken';

const clientId  = process.env.REACT_APP_CLIENT_ID;

function Login() {
  const navigate = useNavigate();

  const onSuccess = (res) => {
    console.log('Login Success: currentUser:', res.profileObj);
    console.log(res);
    alert(
      `Logged in successfully welcome Treedi ${res.profileObj.name} .`
    );
    refreshTokenSetup(res);
    console.log(res.tokenObj.access_token);
    localStorage.setItem("tokenObj",res.tokenObj.access_token);
    window.open(window.location.origin + '/treedi', 'MyWindow', '_blank');
    //navigate('/treedi');

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
        //cookiePolicy={'single_host_origin'}
        style={{ marginTop: '100px' }}
        isSignedIn={true}
        clientId={clientId}
      />
    </div>
  );
}

export default Login;
