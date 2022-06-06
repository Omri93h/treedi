import React from "react";
import { GoogleLogout } from "react-google-login";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Logout = (props) => {
	const navigate = useNavigate();

	const handleLogOut = async (response) => {
		let params = new URL(document.location).searchParams;
		// let code = params.get("code");
		let email = localStorage.getItem("TreediUserEmail");
		console.log("Starting Logout");
		const res = await axios.get("http://localhost:5001/api/googleDrive/logOut/?email=" + email);
		console.log("google responseee:", res);
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
