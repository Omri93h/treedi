import React, { useState } from "react";

import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { default as SaveIcon } from "@mui/icons-material/SaveAltRounded";
import { Divider } from "@mui/material";
import getTrdiFileData from "../../utils/getTrdiFileData";
import saveTrdiFile from "../../utils/saveTrdiFile";
import { toast } from "react-toastify";

import "../../App.css";

const SaveButton = ({ fileName, user, elements, readPermission, editPermission }) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleSave = () => {
		toast.info("Saving File ...", {
			position: "bottom-left",
			autoClose: 800,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
		});
		const trdi_file_data = getTrdiFileData(user, fileName, elements, readPermission, editPermission);
		console.log(trdi_file_data)
		saveTrdiFile(trdi_file_data, fileName);
		handleClose();
	};

	return (
		<>
			<Button
				style={{ height: "100%" }}
				aria-controls={open ? "basic-menu" : undefined}
				aria-haspopup='true'
				aria-expanded={open ? "true" : undefined}
				onClick={handleClick}>
				<SaveIcon />
			</Button>
			<Menu
				className='basic-menu'
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					"aria-labelledby": "basic-button",
				}}>
				<MenuItem onClick={handleSave} disabled={fileName ? false : true}>
					{" "}
					Save {fileName}
				</MenuItem>
				<Divider />
				<MenuItem
					onClick={() => {
						handleClose();
					}}>
					{" "}
					Save As ..
				</MenuItem>
			</Menu>
		</>
	);
};

export default SaveButton;
