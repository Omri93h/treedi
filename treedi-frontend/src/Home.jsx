import React, { useState } from "react";
import "./Home.css";
import Login from "./components/Login";
import { Fade, Box } from "@mui/material";


const Home = () => {
	const [loginData, setLoginData] = useState(
		localStorage.getItem("loginData") ? JSON.parse(localStorage.getItem("loginData")) : null
	);

	return (
		<div className='Welcome'>
			<video loop autoPlay muted type='video/mp4'>
				<source src={"/video.mp4"}></source>
			</video>

			<Fade in={true} timeout={1000}>

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
			<Fade in={true} timeout={2000}>
				<div
					id='treedi-description'
					style={{
						position: "absolute",
						width: "600px",
						top: "300px",
						height: "150px",
						background: "",
						left: "50px",
						padding: "10px",
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
							<b>Treedi</b> is a platform that offers innovative, first of a kind, multi-layer document creation and
							editing, featuring layers sharing between users - while working in parallel and governed by a layers
							permissions system
						</p>
					</span>
				</div>
			</Fade>
			<Fade in={true} timeout={3000}>
				<div>
					<Login />
				</div>
			</Fade>
		</div>
	);
};

export default Home;
