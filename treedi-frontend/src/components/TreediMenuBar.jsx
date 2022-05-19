import React from "react";
import ColorSelection from "./MenuButtons/ColorSelection";
import ToolSelection from "./MenuButtons/ToolSelection";
import Button from "@mui/material/Button";
import { default as UndoIcon } from "@mui/icons-material/UndoRounded";
import { default as RedoIcon } from "@mui/icons-material/RedoRounded";

import UserButton from "./MenuButtons/UserButton";
import SaveButton from "./MenuButtons/SaveButton";
import LoadButton from "./MenuButtons/LoadButton";
import ShareButton from "./MenuButtons/ShareButton";

import "../App.css";
import { Fade } from "@mui/material";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TreediMenuBarStyle = {
	position: "absolute",
	justifyContent: "space-evenly",
	display: "flex",
	width: "600px",
	height: "50px",
	lineHeight: "50px",
	verticalAlign: "middle",
	marginLeft: "100px",
	marginTop: "10px",
	border: "2px solid #f0f0f0",
	borderRadius: "25px",
};

const displayPressureStyle = {
	textAlign: "center",
	height: "100%",
	width: "64px",
	fontSize: "20px",
	color: "grey",
};

const TreediMenuBar = ({
	user,
	setTool,
	color,
	setColor,
	undo,
	redo,
	clear,
	setElements,
	projectName,
	displayPressure,
	pressureValue,
	readPermission,
	setReadPermission,
	editPermission,
	setEditPermission,
}) => {
	return (
		<div style={{ display: "flex", position:'absolute' }}>
			<ToastContainer
				position='bottom-left'
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
			<div
				style={{
					marginTop: "10px",
					marginLeft: "10px",
					height: "50px",
					lineHeight: "50px",
					verticalAlign: "middle",
					textAlign: "center",
				}}>
				<UserButton userImage={user["img"]} />
			</div>

			<div style={TreediMenuBarStyle}>
				{displayPressure ? (
					<div style={displayPressureStyle}>
						<Fade in={displayPressure} timeout={300}>
							<div>{Number(pressureValue).toFixed(2)}</div>
						</Fade>
					</div>
				) : (
					<ToolSelection setTool={setTool} />
				)}

				<ColorSelection color={color} setColor={setColor} />

				<Button className='basic-button' onClick={undo}>
					<UndoIcon className='menu-item' />
				</Button>

				<Button className='basic-button' onClick={redo}>
					<RedoIcon className='menu-item' />
				</Button>

				<SaveButton
					fileName={projectName}
					user={user}
					readPermission={readPermission}
					editPermission={editPermission}
				/>

				<LoadButton
					clear={clear}
					setElements={setElements}
					setEditPermission={setEditPermission}
					setReadPermission={setReadPermission}
				/>

				<ShareButton
					readPermission={readPermission}
					setReadPermission={setReadPermission}
					editPermission={editPermission}
					setEditPermission={setEditPermission}
				/>
			</div>
		</div>
	);
};

export default TreediMenuBar;
