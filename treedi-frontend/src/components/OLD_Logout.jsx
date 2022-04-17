import React from "react";

import { GoogleLogout } from 'react-google-login';

const clientId = process.env.REACT_APP_GOOGLE_DRIVE_CLIENT_ID;

const Logout = ({ setLoggedIn }) => {

    const onSuccess = (res) => {
        console.log('[Logout Success]\n', res);
        setLoggedIn(false);
    };

    const onFailure = (res) => {
        console.log('[Logout FAILED]\n', res);
    };


    return (
        <span>
            <GoogleLogout
                clientId={clientId}
                buttonText="Logout ..."
                onLogoutSuccess={onSuccess}
                onFailure={onFailure}
                style={{ marginTop: '100px' }}
                isSignedIn={false}
            />
        </span>
    )
}

export default Logout;