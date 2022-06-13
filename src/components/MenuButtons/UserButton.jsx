import React, { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { default as UserIcon } from "@mui/icons-material/AccountCircleRounded";
import "../../App.css";
import "../Logout";
import Logout from "../Logout";

const UserButton = ({ userImage, handleLogout }) => {
	const userImageElement = (
		<img src={userImage} style={{ height: "40px", width: "40px", borderRadius: "100%" }} referrerPolicy='no-referrer' />
	);

	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		// localStorage.clear();
		setAnchorEl(null);
	};

	return (
		<>
			<Button
			
				aria-controls={open ? "basic-menu" : undefined}
				aria-expanded={open ? "true" : undefined}
				disableElevation={true}
				disableRipple={true}
				disableFocusRipple={true}
				style={{ backgroundColor: 'transparent' }} 

				onClick={handleClick}>
				{userImage ? userImageElement : <UserIcon />}
			</Button>
			<Menu className='basic-menu' anchorEl={anchorEl} open={open} onClose={handleClose}>
				<Logout handleLogout={handleLogout} />

				{/* <MenuItem 
					onClick={() => {
						handleClose();
					}}> */}
				{/* ANOTHER OPTIONS THAT MIGHT COME SHOULD BE WRAPPED HERE */}
				{/* </MenuItem> */}
			</Menu>
		</>
	);
};

export default UserButton;
