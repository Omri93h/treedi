import React, { useState, useRef } from "react";
import "./Home.css";
import Login from "./components/Login";
// import video from "./video.mp4";
import MetaTags from "react-meta-tags";

const Home = () => {
	const [loginData, setLoginData] = useState(
		localStorage.getItem("loginData") ? JSON.parse(localStorage.getItem("loginData")) : null
	);

	// const videoUrl  = useRef(video)


	// const videoUrl = useRef(URL.createObjectURL(new Blob([video], {type:'video/mp4'})))
	// console.log(video)
	return (
		<div className='Welcome'>
			{/* <MetaTags> */}
				{/* <meta http-equiv="Content-Security-Policy" content="connect-src 'ws://localhost:3000/ws"/> */}
				<video loop autoPlay muted type='video/mp4' >
					<source src={'/video.mp4'}></source>
				</video>
			{/* </MetaTags> */}

			<Login />
		</div>
	);
};

export default Home;
