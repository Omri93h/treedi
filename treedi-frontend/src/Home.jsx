import React, { useState } from "react";
import "./Home.css";
import Login from "./components/Login";
import { Fade, Box } from "@mui/material";
import { width } from "@mui/system";

const Home = () => {
	const [loginData, setLoginData] = useState(
		localStorage.getItem("loginData") ? JSON.parse(localStorage.getItem("loginData")) : null
	);

	return (
		<div className='Home'>
			<video loop autoPlay muted type='video/mp4'>
				<source src={"/video.mp4"}></source>
			</video>

			<Fade in={true} timeout={2000}>
				<div id='treedi-welcome' style={{ width: "600px" }}>
					<span
						style={{
							fontSize: "90px",
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
						<img src='./icon_big.png' style={iconStyle} />
						<b style={{ marginLeft: "205px", fontSize: "100px" }}>Treedi</b>
					</span>
				</div>
			</Fade>
			<Fade in={true} timeout={3000}>
				<div
					id='treedi-description'
					style={{
						position: "absolute",
						width: "800px",
						top: "330px",
						height: "150px",
						background: "",
						left: "50px",
						padding: "10px",
					}}>
					<p
						style={{
							opacity: "0.8",
							fontSize: "26px",
							fontFamily: "ubuntu",
							color: "#f0f0f0",
							textAlign: "left",
							textShadow: "1px 2px 4px black",
						}}>
						<b>Treedi</b> offers innovative, first of a kind, multi-layer document creation and editing, featuring{" "}
						<b>layers sharing</b> and <b>parallel editing</b> - governed by a layers
						<b> permissions system</b>
					</p>
					{/* </span> */}
				</div>
			</Fade>
			<Fade in={true} timeout={4000}>
				<div style={{ position: "absolute", top: "500px", left: "50px" }}>
					<Login />
				</div>
			</Fade>
		</div>
	);
};

const iconStyle = {
	height: "130px",
	width: "170px",
	position: "absolute",
};

export default Home;
