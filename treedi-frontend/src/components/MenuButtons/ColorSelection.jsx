import React, { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { HexColorPicker } from "react-colorful";
import "../../App.css";
// Icons

import { default as ColorIcon } from "@mui/icons-material/CircleRounded";

const ColorSelection = ({ color, setColor }) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const displayColorPicker = (
		<div>
			<HexColorPicker color={color} onChange={setColor} />
		</div>
	);

	return (
		<>
			<Button
				style={{height:"100%"}}

				className='basic-button'
				aria-controls={open ? "basic-menu" : undefined}
				aria-haspopup='true'
				aria-expanded={open ? "true" : undefined}
				onClick={handleClick}>
				<ColorIcon className="menu-item" style={{ color: color }} />
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
			</Menu>
		</>
	);
};

export default ColorSelection;
