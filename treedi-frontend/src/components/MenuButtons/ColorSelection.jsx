import React, { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { HexColorPicker } from "react-colorful";
import "../../App.css";
// Icons

import { default as ColorIcon } from "@mui/icons-material/CircleRounded";

const ColorSelection = ({ color, setColor }) => {
	const [currColor, setCurrColor] = useState(color);
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const handleColorChange = (selectedColor) => {
		setCurrColor(selectedColor);
	};

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleSelect = () => {
		setColor(currColor);
		setAnchorEl(null);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const displayColorPicker = (
		<div>
			<HexColorPicker color={color} onChange={handleColorChange} />
		</div>
	);

	return (
		<>
			<Button
				style={{ height: "100%" }}
				className='basic-button'
				aria-controls={open ? "basic-menu" : undefined}
				aria-haspopup='true'
				aria-expanded={open ? "true" : undefined}
				onClick={handleClick}>
				<ColorIcon className='menu-item' style={{ color: color }} />
			</Button>
			<Menu
				className='basic-menu'
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					"aria-labelledby": "basic-button",
				}}>
				<MenuItem>{displayColorPicker}</MenuItem>
				<div id='color-buttons-wrapper' style={{ margin: "5px", display: "flex", justifyContent: "space-evenly" }}>
					<Button variant='outlined' onClick={handleClose}>
						Cancel
					</Button>
					<Button variant='contained' onClick={handleSelect}>
						Select
					</Button>
				</div>
			</Menu>
		</>
	);
};

export default ColorSelection;
