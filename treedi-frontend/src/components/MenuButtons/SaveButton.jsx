import React, { useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { default as SaveIcon } from "@mui/icons-material/SaveAltRounded";
import { Divider } from '@mui/material';
import data_format from "../../utils/DataFormat";
import "../../App.css";

const SaveButton = ({ fileName }) => {
	const [FileData, setFileData] = useState(null);
	
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleSave = () => {
		var canvas = document.querySelector("canvas");
		var dataURL = canvas.toDataURL("image/png", 1.0);
		data_format.FileName = fileName;
		data_format.LastModified = "getDate";
		data_format.Owner = "getUser";
		data_format.Screens.push({ Image: dataURL, LastModified: "DATE" });
		downloadTrdiFile1(data_format, "NEW_TREEDI_FILE.trdi");
		handleClose();
	}

	const downloadTrdiFile1 = (jsonData, filename) => {
		const fileData = JSON.stringify(jsonData);
		setFileData(fileData);
		const blob = new Blob([fileData], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.download = filename;
		link.href = url;
		Jonisave();
	};

	const Jonisave = async function() {
		try {
			let params = new URL(document.location).searchParams;
			console.log(params);
			let code = params.get("code");
			await axios
				.post("http://localhost:5001/api/googleDrive/save/?code=" + code, {
					data: {
						Url: FileData, // This is the body part
					},
				})
				.then((res) => res.json())
				.then((json) => console.log(json));
		} catch (error) {
			console.log(`error - Save - ${error}`);
		}
	};

	fileName = '"' + fileName + '"';
	// fileName = false;

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
				<MenuItem
					onClick={handleSave}
					disabled={fileName ? false : true}>
					{" "}
					Save {fileName}
				</MenuItem>
				<Divider/>
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
