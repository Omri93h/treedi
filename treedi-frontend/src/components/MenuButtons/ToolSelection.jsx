import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import "../../App.css";

// Icons

import { default as RectangleIcon } from "@mui/icons-material/Crop54Rounded";
import { default as LineIcon } from "@mui/icons-material/RemoveRounded";
import { default as TextIcon } from "@mui/icons-material/TextFieldsRounded";
import { default as SelectIcon } from "@mui/icons-material/HighlightAltRounded";
import { default as PencilIcon } from "@mui/icons-material/CreateRounded";
import { default as EraserIcon } from "@mui/icons-material/CancelPresentationRounded";

const ToolSelection = ({ setTool }) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const [toolToDisplay, setToolToDisplay] = useState("pencil");

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	const handleSelected = (selected) => {
		handleClose();
		setToolToDisplay(selected);
		setTool(selected);
	};

	const displayPencilTool = (
		<span className='menu-item'>
			<PencilIcon /> &nbsp; Pencil
		</span>
	);
	const displayRectangleTool = (
		<span className='menu-item'>
			<RectangleIcon /> &nbsp; Rectangle
		</span>
	);

	const displayEraserTool = (
		<span className='menu-item'>
			<EraserIcon /> &nbsp; Eraser
		</span>
	);

	const displayLineTool = (
		<span className='menu-item'>
			<LineIcon /> &nbsp; Line
		</span>
	);

	const displayTextTool = (
		<span className='menu-item'>
			<TextIcon /> &nbsp; Text
		</span>
	);

	const displaySelectionTool = (
		<span className='menu-item'>
			<SelectIcon /> &nbsp; Select
		</span>
	);

	const displayCurrentTool = () => {
		switch (toolToDisplay) {
			case "pencil":
				return <PencilIcon />;
			case "rectangle":
				return <RectangleIcon />;
			case "line":
				return <LineIcon />;
			case "text":
				return <TextIcon />;
			case "selection":
				return <SelectIcon />;
			case "eraser":
				return <EraserIcon />;

			default:
				return displayPencilTool;
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
				<MenuItem onClick={() => handleSelected("pencil")}>{displayPencilTool}</MenuItem>
				{/* <MenuItem onClick={() => handleSelected("text")}>{displayTextTool}</MenuItem> */}
				<MenuItem onClick={() => handleSelected("rectangle")}>{displayRectangleTool}</MenuItem>
				<MenuItem onClick={() => handleSelected("line")}>{displayLineTool}</MenuItem>
				<MenuItem onClick={() => handleSelected("eraser")}>{displayEraserTool}</MenuItem>
				<MenuItem onClick={() => handleSelected("selection")}>{displaySelectionTool}</MenuItem>
			</Menu>
		</>
	);
};

export default ToolSelection;
