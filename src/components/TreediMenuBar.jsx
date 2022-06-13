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
import ScreenViewButton from './MenuButtons/ScreenViewButton'

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
	setScreenView,
}) => {
	const userButton = React.useMemo(
		() => (
			<div
				style={{
					marginTop: "10px",
					marginLeft: "10px",
					height: "50px",
					lineHeight: "50px",
					verticalAlign: "middle",
					textAlign: "center",
				}}>
				<UserButton userImage={user["img"]} handleLogout={handleLogout} />
			</div>
		),
		[]
	);
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

			{userButton}
			<div style={TreediMenuBarStyle}>
				<ToolSelection setTool={setTool} />

				<ColorSelection color={color} setColor={setColor} />

				<Button onClick={() => setCommand({ undo: true })}>
					<UndoIcon />
				</Button>

				<Button onClick={() => setCommand({ redo: true })}>
					<RedoIcon  />
				</Button>

				<SaveButton
					setFileId={setFileId}
					fileName={projectName}
					user={user}
					elements={elements}
					readPermission={readPermission}
					editPermission={editPermission}
				/>

				<LoadButton
					setFileId={setFileId}
					readPermission={readPermission}
					editPermission={editPermission}
					setCommand={setCommand}
					setEditPermission={setEditPermission}
					setReadPermission={setReadPermission}
					setOwner={setOwner}
				/>

				<ShareButton
					user={user}
					elements={elements}
					fileName={projectName}
					readPermission={readPermission}
					setReadPermission={setReadPermission}
					editPermission={editPermission}
					setEditPermission={setEditPermission}
					setIsDialogOpen={setIsDialogOpen}
				/>

				<Button onClick={() => setCommand({ clear: true })}>
					<DeleteIcon className='menu-item' />
				</Button>

				<ScreenViewButton setScreenView={setScreenView} />

			</div>
		</div>
	);
};

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

export default TreediMenuBar;
