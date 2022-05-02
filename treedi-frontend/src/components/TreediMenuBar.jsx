import React, { useState } from "react";
import ColorSelection from "./MenuButtons/ColorSelection";
import ToolSelection from "./MenuButtons/ToolSelection";
import Button from "@mui/material/Button";
import { default as UndoIcon } from "@mui/icons-material/UndoRounded";
import { default as RedoIcon } from "@mui/icons-material/RedoRounded";
import { default as ShareIcon } from "@mui/icons-material/ShareRounded";


import UserButton from "./MenuButtons/UserButton";
import SaveButton from "./MenuButtons/SaveButton";

import "../App.css";
import LoadButton from "./MenuButtons/LoadButton";

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

const TreediMenuBar = ({ user, pickerCode, setTool, color, setColor, undo, redo }) => {
	return (
		<div style={{ display: "flex" }}>
			<div
				style={{
					marginTop: "10px",
					marginLeft: "10px",
					height: "50px",
					lineHeight: "50px",
					verticalAlign: "middle",
					textAlign: "center",
				}}>
				<UserButton userImage={user['img']} />
			</div>
			<div style={TreediMenuBarStyle}>
				<ToolSelection setTool={setTool} />

				<ColorSelection color={color} setColor={setColor} />

				<Button className='basic-button'>
					<UndoIcon className='menu-item' onClick={undo} />
				</Button>

				<Button className='basic-button'>
					<RedoIcon className='menu-item' onClick={redo} />
				</Button>

				<SaveButton fileName={'Untitled'} />

				<LoadButton pickerCode={pickerCode}/>

				<Button className='basic-button'>
					<ShareIcon className='menu-item' />
				</Button>
			</div>
		</div>
	);
};

export default TreediMenuBar;
