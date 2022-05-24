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
	setActions,
	elements,
	projectName,
	displayPressure,
	pressureValue,
	readPermission,
	setReadPermission,
	editPermission,
	setEditPermission,
	setIsDialogOpen,
	setOwner
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
				<UserButton userImage={user["img"]} />
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

				<Button className='basic-button' onClick={() => setActions({ undo: true })}>
					<UndoIcon className='menu-item' />
				</Button>

				<Button className='basic-button' onClick={() => setActions({ redo: true })}>
					<RedoIcon className='menu-item' />
				</Button>

				<SaveButton
					fileName={projectName}
					user={user}
					elements={elements}
					readPermission={readPermission}
					editPermission={editPermission}
				/>

				<LoadButton
					readPermission={readPermission}
					editPermission={editPermission}
					setActions={setActions}
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
			</div>
		</div>
	);
};

export default TreediMenuBar;
