import React, { useState, useEffect } from "react";
import GoogleLogin from "react-google-login";
import axios from "axios";
import SimpleReactLightbox from "simple-react-lightbox";
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
    alert(error);
  };

  // If successfull return of data from google we run this function:
  const googleResponse = async (response) => {
    // Check if a token was recieved and send it to our API:
    if (response.tokenId) {
      const googleResponse = await axios.post(
        "http://localhost:5001/api/v1/user-auth",
        { token: response.tokenId }
      );

      // Check if we have some result:
      if (Object.keys(googleResponse.data.payload).length !== 0) {
        /*
          Get the following user details from our API and set them in the state:
          User Account Name
          User Email
          User Profile Picture for Google
        */
        const { name, email, picture } = googleResponse.data.payload;
        console.log("loading profile, ", name);
        setUser({
          ...user,
          name,
          email,
          picture,
          profile_loaded: true,
        });
      }
    }
  };

  // when profile is loaded -> Save data locally
  useEffect(() => {
    if (user.profile_loaded) {
      localStorage.setItem("TreediUserName", user.name);
      localStorage.setItem("TreediUserEmail", user.email);
      localStorage.setItem("TreediUserImage", user.picture);
      setIsDataSavedLocally(true);
      console.log("now setting to local storage");
    }
  }, [user.profile_loaded]);

  // when data is saved locally - and params are communicating -> open the app
  useEffect(() => {
    if (isDataSavedLocally) {
      const savedData = { name: "", email: "", img: "" };
      savedData.name = localStorage.getItem("TreediUserName");
      savedData.email = localStorage.getItem("TreediUserEmail");
      savedData.img = localStorage.getItem("TreediUserImage");
      console.log("saving data to local storage");
      console.log("name: ", localStorage.getItem("TreediUserName"));
      while (true) {
        if (savedData.name && savedData.email && savedData.img) {
          console.log("should open!\nData: " , savedData.name, savedData.email, savedData.img)
          window.open(window.location.origin + "/treedi", "MyWindow", "_blank");
          break;
        }
      }
    }
  }, [isDataSavedLocally]);

  return (
    <SimpleReactLightbox>
      <div className="Login">
        {!user.profile_loaded ? (
          <div>
            <GoogleLogin
              clientId="101602613283-mg4l5v8f2ssl11qpusebl8n2dn0hrlil.apps.googleusercontent.com"
              buttonText="Login"
              onSuccess={googleResponse}
              onFailure={onFailure}
            />
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </SimpleReactLightbox>
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