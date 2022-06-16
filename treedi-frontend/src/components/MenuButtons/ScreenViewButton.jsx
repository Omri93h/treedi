import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import "../../App.css";

const ScreenViewButton = ({ setScreenView }) => {
	const [displayModeToggle, setDisplayModeToggle] = useState(true);

	const handleClick = () => {
		setDisplayModeToggle(!displayModeToggle);
		setScreenView(displayModeToggle? "1":"all")
	};



	const displayButton = (
		<span style={{ fontSize: "10px" }}>{displayModeToggle ? "Treedi Mode" : "Single Screen"}</span>
	);
	return (
		<>
			<Button onClick={handleClick}>
				{displayButton}
			</Button>
		</>
	);
};

export default ScreenViewButton;
