// import React from 'react';

// import { GoogleLogin } from 'react-google-login';


// // refresh token
// import { refreshTokenSetup } from '../utils/refreshToken';
// const  clientId  = process.env.REACT_APP_CLIENT_ID;
// //const clientId='570116819468-tl8q8ndkk59a7i25rp874liu56fcua21.apps.googleusercontent.com'
// console.log(clientId);
// function Login() {
//   const onSuccess = (res) => {
//     console.log('Login Success: currentUser:', res.profileObj);
//     alert(
//       `Logged in successfully welcome ${res.profileObj.name} 😍. \n See console for full profile object.`
//     );
//     refreshTokenSetup(res);
//   };

//   const onFailure = (res) => {
//     console.log('Login failed: res:', res);
//     alert(
//       `Failed to login. 😢`
//     );
//   };

//   return (
//     <div>
//       <GoogleLogin    
//         buttonText="Login"
//         clientId={clientId}
//         onSuccess={onSuccess}
//         onFailure={onFailure}
//         cookiePolicy={'single_host_origin'}
//         style={{ marginTop: '10px' }}
//         isSignedIn={true}
//       />
//     </div>
//   );
// }

// export default Login;

import { useNavigate } from 'react-router-dom';

import React from 'react';

import { GoogleLogin } from 'react-google-login';
// refresh token
import { refreshTokenSetup } from '../utils/refreshToken';

const  clientId  = process.env.REACT_APP_CLIENT_ID;

function Login() {
  const navigate = useNavigate();

  const onSuccess = (res) => {
    console.log('Login Success: currentUser:', res.profileObj);
    console.log(res);
    alert(
      `Logged in successfully welcome ${res.profileObj.name} 😍. \n See console for full profile object.`
    );
    refreshTokenSetup(res);
    navigate('/homepage');

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
        clientId={clientId}
        //clientId={'570116819468-tl8q8ndkk59a7i25rp874liu56fcua21.apps.googleusercontent.com'}
        buttonText="Login"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={'single_host_origin'}
        style={{ marginTop: '100px' }}
        isSignedIn={true}
      />
    </div>
  );
}

export default Login;
