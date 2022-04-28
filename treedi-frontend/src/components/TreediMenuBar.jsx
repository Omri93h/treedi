import React, { useState } from "react";
import ColorSelection from "./MenuButtons/ColorSelection";
import ToolSelection from "./MenuButtons/ToolSelection";
import Button from "@mui/material/Button";
import { default as UndoIcon } from "@mui/icons-material/UndoRounded";
import { default as RedoIcon } from "@mui/icons-material/RedoRounded";
import { default as SaveIcon } from "@mui/icons-material/SaveAltRounded";
import { default as ShareIcon } from "@mui/icons-material/ShareRounded";
import UserButton from "./MenuButtons/UserButton";

import "../App.css";

const TreediMenuBar = ({ setTool, color, setColor, undo, redo }) => {
	return (
		<div style={{display:"flex"}}>
			<UserButton/>
			<div style={TreediMenuBarStyle}>
				<ToolSelection setTool={setTool} />

				<ColorSelection color={color} setColor={setColor} />

				<Button className='basic-button'>
					<UndoIcon className='menu-item' onClick={undo} />
				</Button>

				<Button className='basic-button'>
					<RedoIcon className='menu-item' onClick={redo} />
				</Button>

				<Button className='basic-button'>
					<SaveIcon className='menu-item' />
				</Button>

				<Button className='basic-button'>
					<ShareIcon className='menu-item' />
				</Button>
			</div>
		</div>
	);
};

export default TreediMenuBar;

const TreediMenuBarStyle = {
	position: "absolute",
	justifyContent: "center",
	display: "flex",
	width: "450px",
	height: "50px",
	lineHeight: "50px",
	verticalAlign: "middle",
	marginLeft: "20px",
	marginTop: "10px",
	border: "2px solid #f0f0f0",
	borderRadius: "25px",
};
