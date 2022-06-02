import React from "react";
import { canEditScreen } from "../utils/permissionHandler";

const ScreenToWriteTo = ({ user, owner, editPermission, screenToWriteTo, setDisplayScreenToWriteTo }) => {
	const getDisplayInfo = () => {
		console.log("trying");
		if (!canEditScreen(user, owner, editPermission, screenToWriteTo)) {
			return "You are not permitted to edit this screen!";
		}
		return screenToWriteTo > 0 ? "Writing To Screen " + Number(screenToWriteTo) : "Pressure Mode";
	};

	return (
		<div
			onAnimationEnd={() => setDisplayScreenToWriteTo(false)}
			style={{
				position: "absolute",
				margin: "1%",
				height: String(window.screen.height / 2) + "px",
				lineHeight: String(window.screen.height / 2) + "px",
				width: String(window.screen.width) + "px",
				animation: "fadeOut 1s forwards",
				animationDelay: "0.2s",
				color: "black",
				textAlign: "center",
				fontSize: "75px",
				zIndex: "99",
				opacity: "0.2",
				background: "lightblue",
				border: "1px solid green",
			}}>
			{getDisplayInfo()}
		</div>
	);
};

export default ScreenToWriteTo;
