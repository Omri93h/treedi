import React, { useState, useEffect } from "react";
import GoogleLogin from "react-google-login";
import axios from "axios";
import Button from "@mui/material/Button";
import { Fade } from "@mui/material";
import { textAlign } from "@mui/system";

// import SimpleReactLightbox from "simple-react-lightbox";
// import { refreshTokenSetup } from "../utils/refreshToken";

const clientId = process.env.REACT_APP_CLIENT_ID;

const Login = () => {
	// User Data:
	const [user, setUser] = useState({
		name: "",
		email: "",
		picture: "",
		profile_loaded: false,
	});

	// Saving user data locally (opening a new window)
	const [isDataSavedLocally, setIsDataSavedLocally] = useState(false);

	// On Failur of google login we get the reason for failur in an alert:
	const onFailure = (error) => {
		alert(JSON.stringify(error));
	};

	// If successfull return of data from google we run this function:
	const googleResponse = async (response) => {
		console.log("going to API");
		// Check if a token was recieved and send it to our API:
		if (response.tokenId) {
			// const googleResponse = await axios.post("http://localhost:5001/api/user-authentication", {
				const googleResponse = await axios.post("https://treedi-346309.oa.r.appspot.com/api/user-authentication", {
				token: response.tokenId,
			});
			console.log("google responseee:", googleResponse);
			window.location.href = googleResponse.data.authUrl;
			// window.open(googleResponse.data.authUrl, "MyWindow", "_blank").focus();
			// // Check if we have some result:
			// if (Object.keys(googleResponse.data.payload).length !== 0) {
			//   /*
			//     Get the following user details from our API and set them in the state:
			//     User Account Name
			//     User Email
			//     User Profile Picture for Google
			//   */
			const { name, email } = response.profileObj;
			const picture = response.profileObj.imageUrl;
			//   console.log(googleResponse);
			//   console.log("loading profile, ", name);
			setUser({
				...user,
				name,
				email,
				picture,
				profile_loaded: true,
			});
			console.log("user Loaded", user);
			// }
		}
	};

	// when profile is loaded -> Save data locally
	useEffect(() => {
		if (user.profile_loaded) {
			console.log("user Loaded", user);
			localStorage.setItem("TreediUserName", user.name);
			localStorage.setItem("TreediUserEmail", user.email);
			localStorage.setItem("TreediUserImage", user.picture);
			setIsDataSavedLocally(true);
			console.log("now setting to local storage");
		} else {
			console.log("user not loaded");
		}
	}, [user.profile_loaded]);

	// when data is saved locally - and params are communicating -> open the app
	useEffect(() => {
		if (isDataSavedLocally) {
			console.log("saving data to local storage");
			const savedData = { name: "", email: "", img: "" };
			savedData.name = localStorage.getItem("TreediUserName");
			savedData.email = localStorage.getItem("TreediUserEmail");
			savedData.img = localStorage.getItem("TreediUserImage");
			console.log("saving data to local storage");
			console.log("name: ", localStorage.getItem("TreediUserName"));
			while (true) {
				if (savedData.name && savedData.email && savedData.img) {
					console.log("should open!\nData: ", savedData.name, savedData.email, savedData.img);
					// window.open(window.location.origin + "/treedi", "MyWindow", "_blank");
					window.location.href = googleResponse.data.authUrl;
					break;
				}
			}
		} else {
			console.log("cant save data to local storage yet..");
		}
	}, [isDataSavedLocally]);

	return (
		<div style={{ position: "fixed", top: "0" }}>
			<div className='Login'>
				{" "}
				<Fade in={true} timeout={2000}>
					<div id='treedi-welcome' style={{ width: "600px" }}>
						<span
							style={{
								fontSize: "100px",
								position: "absolute",
								left: "50px",
								top: "50px",
								height: "200px",
								fontFamily: "ubuntu",
								color: "#f0f0f0",
								opacity: "0.7",
								textAlign: "left",
							}}>
							Welcome To
							<br />
							<b>Treedi</b>
						</span>
					</div>
				</Fade>
				<Fade in={true} timeout={3000}>
					<div
						id='treedi-description'
						style={{
							position: "absolute",
							width: "600px",
							top: "300px",
							height: "150px",
							background: "",
							left: "50px",
							padding:'10px'

						}}>
						<span
							style={{
								opacity: "0.7",
								fontSize: "25px",
								fontFamily: "ubuntu",
								color: "#f0f0f0",
								textAlign: "left",
							}}>
							<p>
								<b>Treedi</b> is a platform that offers innovative, first of a kind, multi-layer document creation and editing,
								featuring layers sharing between users - while working in parallel and governed by a layers permissions
								system
							</p>
						</span>
					</div>
				</Fade>
				{!user.profile_loaded ? (
					<Fade in={true} timeout={4000}>
						<div style={{ position: "absolute", top: "500px", left: "50px" }}>
							<GoogleLogin
								clientId={clientId}
								buttonText='Login'
								onSuccess={googleResponse}
								onFailure={onFailure}
								render={(renderProps) => (
									<Button onClick={renderProps.onClick} variant='contained' size='large' color='success'>
										Login
									</Button>
								)}
							/>
						</div>
					</Fade>
				) : (
					<div></div>
				)}
			</div>
		</div>
	);

	//                                               O L D                                       //
	//   // const history = useHistory();
	//   const navigate = useNavigate();

	//   const onSuccess = (googleData) => {
	//     props.handleLogin(googleData);
	//     localStorage.setItem('loginData', JSON.stringify(googleData));

	//     // console.log('Login Success: currentUser:', res.profileObj);
	//     // console.log(res);
	//     console.log(googleData)
	//     alert(
	//       `Logged in successfully welcome Treedi ${googleData.profileObj.name} .`
	//     );
	//      navigate('/treedi')
	//     // refreshTokenSetup(res);
	//     // localStorage.setItem("tokenObj",res.tokenObj.access_token);
	//     //window.open(window.location.origin + '/treedi', 'MyWindow', '_blank');

	//   };

	//   const onFailure = (res) => {
	//     console.log('Login failed: res:', res);
	//     alert(
	//       `Failed to login.`
	//     );
	//   };

	//   return (
	//     <div>
	//       <GoogleLogin
	//         buttonText="Login"
	//         onSuccess={onSuccess}
	//         onFailure={onFailure}
	//         cookiePolicy={'single_host_origin'}
	//         style={{ marginTop: '100px' }}
	//         // isSignedIn={true}
	//         clientId={process.env.REACT_APP_CLIENT_ID}
	//       />
	//     </div>
	//   );
};

export default Login;
