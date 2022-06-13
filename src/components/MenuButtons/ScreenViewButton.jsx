import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import "../../App.css";

// Icons

import { default as RectangleIcon } from "@mui/icons-material/Crop54Rounded";

const ToolSelection = ({ setScreenView }) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const [screenButtonToDisplay, setScreenButtonToDisplay] = useState("All");

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	const handleSelected = (selected) => {
		handleClose();
		setScreenButtonToDisplay(selected);
		setScreenView(selected);
	};

	const displayAllScreensViewButton = (
		<span className='menu-item'>
			<RectangleIcon />
			<span style={{ fontSize: "14px" }}> ALL</span> &nbsp; Full View
		</span>
	);
	const displayScreenOneViewButton = (
		<span className='menu-item'>
			<RectangleIcon />
			<span style={{ fontSize: "14px" }}> 1&nbsp;&nbsp;</span> &nbsp; Screen 1
		</span>
	);
	const displayScreenTwoViewButton = (
		<span className='menu-item'>
			<RectangleIcon />
			<span style={{ fontSize: "14px" }}> 2&nbsp;&nbsp;</span> &nbsp; Screen 2
		</span>
	);
	const displayScreenThreeViewButton = (
		<span className='menu-item'>
			<RectangleIcon />
			<span style={{ fontSize: "14px" }}> 3&nbsp;&nbsp;</span> &nbsp; Screen 3
		</span>
	);

	// const displayPencilTool = (
	// 	<span className='menu-item'>
	// 		<PencilIcon /> &nbsp; Pencil
	// 	</span>
	// );

	// const displayEraserTool = (
	// 	<span className='menu-item'>
	// 		<EraserIcon /> &nbsp; Eraser
	// 	</span>
	// );

	// const displayLineTool = (
	// 	<span className='menu-item'>
	// 		<LineIcon /> &nbsp; Line
	// 	</span>
	// );

	// const displayTextTool = (
	// 	<span className='menu-item'>
	// 		<TextIcon /> &nbsp; Text
	// 	</span>
	// );

	// const displaySelectionTool = (
	// 	<span className='menu-item'>
	// 		<SelectIcon /> &nbsp; Select
	// 	</span>
	// );

	const displayCurrentTool = () => {
		switch (screenButtonToDisplay) {
			case "all":
				return (
					<span>
						<RectangleIcon /> all
					</span>
				);
			case "1":
				return (
					<span>
						<RectangleIcon /> 1
					</span>
				);
			case "2":
				return (
					<span>
						<RectangleIcon /> 2
					</span>
				);
			case "3":
				return (
					<span>
						<RectangleIcon /> 3
					</span>
				);

			default:
				return (
					<span>
						<RectangleIcon /> ALL
					</span>
				);
		}
	};

	return (
		<>
			<Button
				style={{ height: "100%" }}
				aria-controls={open ? "basic-menu" : undefined}
				aria-haspopup='true'
				aria-expanded={open ? "true" : undefined}
				onClick={handleClick}>
				{displayCurrentTool()}
			</Button>
			<Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
				<MenuItem onClick={() => handleSelected("all")}>{displayAllScreensViewButton}</MenuItem>
				<MenuItem onClick={() => handleSelected("1")}>{displayScreenOneViewButton}</MenuItem>
				<MenuItem onClick={() => handleSelected("2")}>{displayScreenTwoViewButton}</MenuItem>
				<MenuItem onClick={() => handleSelected("3")}>{displayScreenThreeViewButton}</MenuItem>
			</Menu>
		</>
	);
};

export default ToolSelection;
