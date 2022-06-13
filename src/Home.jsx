import React, { useState, useRef } from "react";
import "./Home.css";
import Login from "./components/Login";
// import video from "./video.mp4";

const Home = () => {
	// const [loginData, setLoginData] = useState(
	// 	localStorage.getItem("loginData") ? JSON.parse(localStorage.getItem("loginData")) : null
	// );

	return (
		<div className='Welcome'>
			<video loop autoPlay muted type='video/mp4'>
				<source src={"/video.mp4"}></source>
			</video>

			<Login />
		</div>
	);
};

export default Home;
