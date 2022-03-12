import React from "react";

import { GoogleLogin } from 'react-google-login';

import { refreshTokenSetup } from '../utils/refreshToken'

const clientId = process.env.REACT_APP_GOOGLE_DRIVE_CLIENT_ID;

const Login = ({ setLoggedIn }) => {

    const onSuccess = (res) => {
        console.log('[Login Success] currentUser:', res.profileObj);
        setLoggedIn(true);
        refreshTokenSetup(res);
    };

    const onFailure = (res) => {
        console.log('[Login FAILED] res:', res);
    };


    return (
        <span>
            <GoogleLogin
                clientId={clientId}
                buttonText="Login"
                onSuccess={onSuccess}
                onFailure={onFailure}
                coockiePolicy={'single_host_origin'}
                style={{ marginTop: '100px' }}
                isSignedIn={true}
            />
        </span>
    )
}

export default Login;