import React from "react";
import { GoogleLogout } from "react-google-login";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Logout = (props) => {
	const navigate = useNavigate();

	const handleLogOut = async (response) => {
		localStorage.clear()


		navigate("/");
	};

	return (
		<>
			<GoogleLogout
				clientId={process.env.REACT_APP_CLIENT_ID}
				buttonText='Logout'
				onLogoutSuccess={handleLogOut}></GoogleLogout>
		</>
	);
};

export default Logout;
