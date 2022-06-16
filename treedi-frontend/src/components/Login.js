import React, { useState, useEffect } from "react";
import GoogleLogin from "react-google-login";
import axios from "axios";
import Button from "@mui/material/Button";

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
	const [isDataLoadedLocally, setIsDataLoadedLocally] = useState(false);

	let isUserDataAlreadyInLocal = false;

	// On Failur of google login we get the reason for failur in an alert:
	const onFailure = (error) => {
		console.log("ERORRRR");
		// alert(JSON.stringify(error));
		localStorage.clear();
		window.location.href = "https://www.treedi.app";
		// window.location.href = 'http://localhost:3000/';
	};

	function openWindow(treediAppPage) {
		let width = 1800;
		let left = 800;
		let height = window.screen.height;
		left += window.screenX;

		window.open(
			treediAppPage,
			"windowName",
			"resizable=1,scrollbars=1,fullscreen=0,+height=" +
				height +
				",width=" +
				width +
				"  , left=" +
				left +
				", toolbar=0, menubar=0,status=1"
		);
		return 0;
	}
	// If successfull return of data from google we run this function:
	const googleResponse = async (response) => {
		console.log("going to API");
		console.log("FIRST RESPONSE IS:", response);
		console.log("EMAIL SHOULD BE:", response.profileObj.email);

		// Check if a token was recieved and send it to our API:
		if (response.tokenId) {
			// const googleResponse = await axios.post("http://localhost:5001/api/user-authentication", {
			const googleResponse = await axios.post("https://treedi-346309.oa.r.appspot.com/api/user-authentication", {
				token: response.tokenId,
				Email: response.profileObj.email,
			});
			console.log("google responseee:", googleResponse.data);
			window.location.href = googleResponse.data.authUrl;

			// openWindow(googleResponse.data.authUrl);

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

			// 	initUser(user, name, email, picture);

			setUser({
				...user,
				name,
				email,
				picture,
				profile_loaded: true,
			});
			// console.log("user Loaded", user);
			// }

			try {
				isUserDataAlreadyInLocalStorage();
			} catch {
				{
				}
			}
		}
	};

	// 	// }
	// }
	// };

	// async function initUser(user, name, email, picture) {
	//  setUser({
	// 	...user,
	// 	name,
	// 	email,
	// 	picture,
	// 	profile_loaded: true,
	// });
	// await setLocalStorage(user)
	// }

	// async function setLocalStorage(user) {
	// localStorage.setItem("TreediUserName", user.name);
	// localStorage.setItem("TreediUserEmail", user.email);
	// localStorage.setItem("TreediUserImage", user.picture);
	// setIsDataSavedLocally(true);
	// }

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

	function isUserDataAlreadyInLocalStorage() {
		if (isUserDataSavedToLocalStorage()) {
			window.location.href = googleResponse.data.authUrl;
		}
	}

	async function isUserDataSavedToLocalStorage() {
		const name = localStorage.getItem("TreediUserName");
		const email = localStorage.getItem("TreediUserEmail");
		const img = localStorage.getItem("TreediUserImage");
		if (name !== "" && email !== "" && img !== "") {
			return true;
		}
		return false;
	}

	async function checkIfLoadedFromLocalStorage() {
		const isLoaded = await isUserDataSavedToLocalStorage();
		setIsDataLoadedLocally(isLoaded);
		await new Promise((r) => setTimeout(r, 1000));
	}

	// when data is saved locally - and params are communicating -> open the app
	useEffect(() => {
		let i = 0;
		console.log("is saved data locally,", isDataSavedLocally);
		while (true) {
			checkIfLoadedFromLocalStorage();
			if (isDataSavedLocally) {
				console.log("saving locally is DONE ");
				if (isDataLoadedLocally || user.email !== "") {
					console.log("Data is LOADED LOCALLY");
					console.log("should open!\nData: ");
					// window.open(window.location.origin + "/treedi", "MyWindow", "_blank");
					// console.log(googleResponse.data.authUrl);
					window.location.href = googleResponse.data.authUrl;
					break;
				} else {
					console.log("data is NOT loaded from locally yet ...");
				}
			} else {
				console.log("cant save data to local storage yet..");
			}
			i += 1;
			if (i > 5) {
				window.location.href = googleResponse.data.authUrl;
				break;
			}
		}
	}, [isDataSavedLocally]);

	console.log("\n\nClientID\n", clientId);

	return (
		<div>
			{!user.profile_loaded ? (
				<div>
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
			) : (
				<div></div>
			)}
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
