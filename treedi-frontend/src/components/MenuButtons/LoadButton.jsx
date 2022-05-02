import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import useDrivePicker from "react-google-drive-picker";
import { default as LoadIcon } from "@mui/icons-material/CloudUpload";

import data_format from "../../utils/DataFormat";

import "../../App.css";

const LoadButton = (pickerCode) => {
	const [openPicker, data] = useDrivePicker();

	const clientId = process.env.REACT_APP_CLIENT_ID;
	const developerKey = process.env.REACT_APP_DEVELOPER_KEY;

	// if changing to "let", it work, but not getting the information

	useEffect(() => {
		if (data) {
			console.log(data.docs[0].id);
			localStorage.setItem("fileId", data.docs[0].id);
			GetFileData(data.docs[0].id);
		}
	}, [data]);

	const GetFileData = async function(fileID) {
		try {
			const res = await axios
				.post("http://localhost:5001/api/googleDrive/getFileData/?code=" + pickerCode, {
					data: {
						fileid: fileID, // This is the body part
					},
				})
				.then((response) => {
					console.log("response : ", response);
				});
			console.log("RES:", res);
		} catch (error) {
			console.log(`error - GetFile - ${error}`);
		}
	};
	// WHY SAVED LOCAL STORAGE ?
	const handleOpenPicker = async function() {
		let TOKEN;
		console.log("PICKER CODE:", pickerCode);
		try {
			const res = await axios.get("http://localhost:5001/api/googleDrive/getToken/?code=" + pickerCode);
			console.log(res);
			console.log(" Data:", res.data);
			TOKEN = res.data;
			console.log(TOKEN);
			if (res.ok) {
				console.log("OK");
			}
		} catch (error) {
			console.log(`error - GetToken - ${error}`);
		}

		console.log(
			"PARAMS FOR PICKER:\n\n", "clientId:",
			clientId,
			"\n\n",
			"developerKey:",
			developerKey,
			"\n\n",
			"token:",
			TOKEN
		);

		openPicker({
			clientId: clientId,
			developerKey: developerKey,
			token: TOKEN,
			viewId: "DOCS",
			supportDrives: true,
		});
	};

	return (
		<Button className='basic-button'>
			<LoadIcon className='menu-item' onClick={() => handleOpenPicker()} />
		</Button>
	);
};

export default LoadButton;
