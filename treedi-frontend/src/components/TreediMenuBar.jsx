import React from "react";
import ColorSelection from "./MenuButtons/ColorSelection";
import ToolSelection from "./MenuButtons/ToolSelection";
import Button from "@mui/material/Button";
import { default as UndoIcon } from "@mui/icons-material/UndoRounded";
import { default as RedoIcon } from "@mui/icons-material/RedoRounded";
import { default as DeleteIcon } from "@mui/icons-material/DeleteForeverRounded";
import UserButton from "./MenuButtons/UserButton";
import SaveButton from "./MenuButtons/SaveButton";
import LoadButton from "./MenuButtons/LoadButton";
import ShareButton from "./MenuButtons/ShareButton";
import ScreenViewButton from "./MenuButtons/ScreenViewButton";

import "../App.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TreediMenuBar = ({
	user,
	setTool,
	color,
	setColor,
	setCommand,
	elements,
	projectName,
	readPermission,
	setReadPermission,
	editPermission,
	setEditPermission,
	setIsDialogOpen,
	setOwner,
	setFileId,
	handleLogout,
	elementsIdOnViewMode,
	setScreenView,
	setProjectName,
	setScreenToWriteTo,
	owner,
}) => {
	// const userButton = React.useMemo(
	// 	() => (

	// 	),
	// 	[]
	// );
	return (
		<div style={{ display: "flex", position: "absolute" }}>
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

			<img src='./icon_app.jpg' style={iconStyle} />

			<div style={userIconStyle}>
				<UserButton userImage={user["img"]} handleLogout={handleLogout} />
			</div>

			<div id='menu-bar-wrapper' style={menuBarWrapper}>
				<div style={TreediMenuBarStyle}>
					<ToolSelection setTool={setTool} />

					<ColorSelection color={color} setColor={setColor} />

					<Button onClick={() => setCommand({ undo: true })}>
						<UndoIcon />
					</Button>

					<Button onClick={() => setCommand({ redo: true })}>
						<RedoIcon />
					</Button>

					<SaveButton
						elementsIdOnViewMode={elementsIdOnViewMode}
						setFileId={setFileId}
						fileName={projectName}
						user={user}
						elements={elements}
						readPermission={readPermission}
						editPermission={editPermission}
						owner={owner}
					/>

					<LoadButton
						setProjectName={setProjectName}
						setFileId={setFileId}
						readPermission={readPermission}
						editPermission={editPermission}
						setCommand={setCommand}
						setEditPermission={setEditPermission}
						setReadPermission={setReadPermission}
						setOwner={setOwner}
					/>

					<ShareButton
						owner={owner}
						elementsIdOnViewMode={elementsIdOnViewMode}
						elements={elements}
						fileName={projectName}
						readPermission={readPermission}
						setReadPermission={setReadPermission}
						editPermission={editPermission}
						setEditPermission={setEditPermission}
						setIsDialogOpen={setIsDialogOpen}
						setFileId={setFileId}
					/>

					<Button onClick={() => setCommand({ clear: true })}>
						<DeleteIcon className='menu-item' />
					</Button>

					<ScreenViewButton setScreenView={setScreenView} setScreenToWriteTo={setScreenToWriteTo} />
				</div>
			</div>
		</div>
	);
};

const menuBarWrapper = {
	position: "absolute",
	top: "10px",
	width: String(window.screen.width) + "px",
	height: "50px",
	textAlign: "center",
};

const TreediMenuBarStyle = {
	justifyContent: "space-evenly",
	display: "flex",
	width: "600px",
	height: "50px",
	lineHeight: "50px",
	verticalAlign: "middle",
	border: "2px solid #f0f0f0",
	borderRadius: "10px",
	marginLeft: "auto",
	marginRight: "auto",
};

const iconStyle = {
	marginTop: "10px",
	marginLeft: "20px",
	height: "50px",
	width: "220px",
};

const userIconStyle = {
	zIndex:'1',
	top: "10px",
	position: "absolute",
	left: String(window.screen.width - 100) + "px",
	height: "50px",
	lineHeight: "50px",
	verticalAlign: "middle",
	textAlign: "center",
};

export default TreediMenuBar;
