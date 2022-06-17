import React from "react";
import Notificator from "../utils/Notificator";
import { canEditScreen } from "../utils/permissionHandler";

const ScreenToWriteTo = ({ user, owner, editPermission, screenToWriteTo }) => {
	// const getDisplayInfo = () => {
	// 	if (!canEditScreen(user, owner, editPermission, screenToWriteTo)) {
	// 		return "You are not permitted to edit this screen!";
	// 	}
	// 	return screenToWriteTo > 0 ? "Writing To Screen " + Number(screenToWriteTo) : "Pressure Mode";
	// };

	const getDisplayInfo = () => {
		if (!canEditScreen(user, owner, editPermission, screenToWriteTo)) {
			Notificator("edit-permission");
			return;
		}
		Notificator("screen-mode", screenToWriteTo);
		// return screenToWriteTo > 0 ? "Writing To Screen " + Number(screenToWriteTo) : "Pressure Mode";
	};

	return (
		// <div
		// 	onAnimationEnd={() => setDisplayScreenToWriteTo(false)}
		// 	style={{
		// 		position: "absolute",
		// 		margin: "1%",
		// 		height: String(window.screen.height / 4) + "px",
		// 		lineHeight: String(window.screen.height / 4) + "px",
		// 		width: String(window.screen.width/2) + "px",
		// 		animation: "fadeOut 1s forwards",
		// 		animationDelay: "0.2s",
		// 		color: "black",
		// 		textAlign: "center",
		// 		fontSize: "35px",
		// 		zIndex: "99",
		// 		opacity: "0.2",
		// 		background: "lightblue",
		// 		border: "1px solid green",
		// 	}}>
		// 	{getDisplayInfo()}
		// </div>
		<div>{getDisplayInfo()}</div>
	);
};

export default ScreenToWriteTo;
