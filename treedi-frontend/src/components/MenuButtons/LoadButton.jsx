import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import useDrivePicker from "react-google-drive-picker";
import { default as LoadIcon } from "@mui/icons-material/CloudUpload";
import { toast } from "react-toastify";
import "../../App.css";

const LoadButton = ({ setActions, setEditPermission, setReadPermission }) => {
	const [openPicker, data] = useDrivePicker();
	const clientId = process.env.REACT_APP_CLIENT_ID;
	const developerKey = process.env.REACT_APP_DEVELOPER_KEY;

	useEffect(() => {
		if (data) {
			setActions({ clear: true });
			console.log(data.docs[0].id);
			localStorage.setItem("fileId", data.docs[0].id);
			GetFileData(data.docs[0].id);
		}
	}, [data]);

	const addElement = (data) => {

		let image = new Image();
		image.onload = function () {
			var canvas = document.querySelector("canvas");
			const ctx = canvas.getContext("2d");
			ctx.globalAlpha = 1;
			ctx.drawImage(image, 0, 0);
		};
		image.src = data.Screens[0].Image;
		const element = { id: 0, type: "base64", image: data };
		setActions({ load: [element] }); // setElements([element])

	};

	const GetFileData = async function (fileID) {
		toast.info("Loading File ...", {
			position: "bottom-left",
			autoClose: 2000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
		});
		let params = new URL(document.location).searchParams;
		let code = params.get("code");
		try {
			const res = await axios
				.post("http://localhost:5001/api/googleDrive/getFileData/?code=" + code, {
					data: {
						fileid: fileID,
					},
				})
				.then((res) => {
					addElement(res.data);
					if (res.status == 200) {
						toast.success("Loaded successfully", {
							position: "bottom-left",
							autoClose: 5000,
							hideProgressBar: false,
							closeOnClick: true,
							pauseOnHover: true,
							draggable: true,
							progress: undefined,
						});
					} else {
						toast.error("Could not load file", {
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
			toast.error("Load error", {
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

	const handleOpenPicker = async function () {
		let TOKEN;
		let params = new URL(document.location).searchParams;
		let code = params.get("code");
		console.log("PICKER CODE:", code);
		try {
			const res = await axios.get("http://localhost:5001/api/googleDrive/getToken/?code=" + code);
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
			"PARAMS FOR PICKER:\n\n",
			"clientId:",
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
		<Button className='basic-button' onClick={() => handleOpenPicker()}>
			<LoadIcon className='menu-item' />
		</Button>
	);
};

export default LoadButton;
