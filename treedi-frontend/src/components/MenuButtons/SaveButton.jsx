import React, { useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { default as SaveIcon } from "@mui/icons-material/SaveAltRounded";
import { Divider } from "@mui/material";
import data_format from "../../utils/DataFormat";
import { toast } from "react-toastify";

import "../../App.css";

const SaveButton = ({ fileName, user }) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleSave = () => {
		toast.info('Saving File ...', {
			position: "bottom-left",
			autoClose: 800,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			});
		var canvas = document.querySelector("canvas");
		var dataURL = canvas.toDataURL("image/png", 1.0);
		data_format.FileName = fileName;
		data_format.LastModified = new Date().toLocaleString();
		data_format.Owner = user["name"];
		data_format.Screens.push({ Image: dataURL, LastModified: new Date().toLocaleString() });
		const data = JSON.stringify(data_format);
		Jonisave(data);
		handleClose();
	};

	const Jonisave = async function (data) {
		try {
			let params = new URL(document.location).searchParams;
			let code = params.get("code");
			let fileid = localStorage.getItem("fileId");
			console.log("CODE:", code);
			const response = await axios
				.post("http://localhost:5001/api/googleDrive/save/?code=" + code, {
					data: {
						fileData: data,
						fileId: fileid,
						fileName: fileName,
					},
				})
				.then((res) => {
					localStorage.setItem("fileId", res.data);
					if (res.status == 200) {
						toast.success('Saved successfully', {
							position: "bottom-left",
							autoClose: 5000,
							hideProgressBar: false,
							closeOnClick: true,
							pauseOnHover: true,
							draggable: true,
							progress: undefined,
							});
					} else {
						toast.error("Could not save file", {
							position: "bottom-left",
							autoClose: 5000,
							hideProgressBar: false,
							closeOnClick: true,
							pauseOnHover: true,
							draggable: true,
							progress: undefined,
							});
					}
				});
		} catch (error) {
			toast.error("Save error", {
				position: "bottom-left",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				});
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
