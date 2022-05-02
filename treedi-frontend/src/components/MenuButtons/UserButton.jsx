import React, { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { default as UserIcon } from "@mui/icons-material/AccountCircleRounded";
import "../../App.css";

const UserButton = ({ userImage }) => {
	const userImageElement = (
		<img src={userImage} style={{ height: "40px", width: "40px", borderRadius: "100%" }} referrerPolicy='no-referrer' />
	);

	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<div>
			<Button
				style={{ height: "100%",  }}
				aria-controls={open ? "basic-menu" : undefined}
				aria-haspopup='true'
				aria-expanded={open ? "true" : undefined}
				onClick={handleClick}>
				{userImage ? userImageElement : <UserIcon />}
			</Button>
			<Menu
				className='basic-menu'
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					"aria-labelledby": "basic-button",
				}}>
				<MenuItem onClick={() => {handleClose()}}> Load Different</MenuItem>
				<MenuItem onClick={() => {handleClose()}}> Log Out</MenuItem>
			</Menu>
		</div>
	);
};

export default UserButton;
