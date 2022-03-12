import React from 'react';
import { GoogleLogout } from 'react-google-login';

const clientId =
  '570116819468-tl8q8ndkk59a7i25rp874liu56fcua21.apps.googleusercontent.com';

function Logout() {
  const onSuccess = () => {
    console.log('Logout made successfully');
    alert('Logout made successfully ✌');
  };

  return (
    <div>
      <GoogleLogout
        clientId={clientId}
        buttonText="Logout"
        onLogoutSuccess={onSuccess}
      ></GoogleLogout>
    </div>
  );
}

export default Logout;
