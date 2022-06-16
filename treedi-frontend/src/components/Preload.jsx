import React, { useState, useEffect } from "react";
import { Modal, Button, Box, TextField } from "@mui/material";
import axios from "axios";
import useDrivePicker from "react-google-drive-picker";
import loadTrdiDriveFile from "../utils/loadTrdiDriveFile";

const Preload = ({
	setProjectName,
	setIsDialogOpen,
	setCommand,
	setFileId,
	setOwner,
	setReadPermission,
	setEditPermission,
}) => {
	const clientId = process.env.REACT_APP_CLIENT_ID;
	const developerKey = process.env.REACT_APP_DEVELOPER_KEY;

	const [openPicker, authResponse] = useDrivePicker({
		// onCancel: () => console.log("User closed picker with close/cancel button"),
	});
	const [data, setData] = useState(null);

	const [preload, setPreload] = useState(true);
	const [isNewProject, setIsNewProject] = useState(false);
	const [input, setInput] = useState("");
	const [errorDocName, setErrorDocName] = useState(false);
	const handleChange = (event) => {
		setInput(event.target.value);
	};

	useEffect(() => {
		async function loadProcedure() {
			console.log(data.docs[0].id);
			localStorage.setItem("fileId", data.docs[0].id);
			setFileId(data.docs[0].id);
			const res = await loadTrdiDriveFile(data.docs[0].id);
			console.log("res:", res);
			if (res.status === 200) {
				console.log("data: \n", data);
				// let newReadPermission = Object.assign({}, res.data.ReadPermission, readPermission);
				// let newEditPermission = Object.assign({}, res.thendata.EditPermission, editPermission);
				console.log("\n\nelements: ", data.Elements);
				setOwner(res.data.Owner);
				setReadPermission(res.data.ReadPermission);
				setEditPermission(res.data.EditPermission);
				setProjectName(res.data.FileName);
				setIsDialogOpen(false);
				setCommand({ load: res.data.Elements });
			} else {
				console.log("res status bad!");
				setPreload(true);
			}
		}
		if (data) {
			console.log("DATA ARRIVED", data);
			loadProcedure();
		} else {
		}
	}, [data]);

	const handleOpenPicker = async function () {
		let TOKEN;
		let email = localStorage.getItem("TreediUserEmail");

		console.log("EMAIL IS:", email);
		try {
			// const res = await axios.get("http://localhost:5001/api/googleDrive/TTC/?email=" + email);
			const res = await axios.get("https://treedi-346309.oa.r.appspot.com/api/googleDrive/TTC/?email=" + email);
			setPreload(false);
			console.log(res.data);
			// console.log(" Data:", res.data);
			TOKEN = res.data;
			// console.log(TOKEN);
			if (res.ok) {
				console.log("OK");
			}
		} catch (error) {
			console.log(`error - GetToken - ${error}`);
		}

		openPicker({
			clientId: clientId,
			developerKey: developerKey,
			token: TOKEN,
			viewMimeTypes: "text/plain",
			customScopes: ["https://www.googleapis.com/auth/drive.file"],
			query: ".trdi",
			viewId: "DOCUMENTS",
			supportDrives: true,
			callbackFunction: (pickerResponse) => {
				console.log("PICKER:", pickerResponse);
				if (pickerResponse.action === "picked") {
					console.log('picked')
					setData(pickerResponse);
				}
				if (pickerResponse.action === "cancel") {
					console.log('canceled')
					setPreload(true);
				}
				console.log();
			},
		});
	};

	const handleClickNewDocument = () => {
		if (input === "") {
			setErrorDocName(true);
			return;
		}
		setProjectName(input);
		setPreload(false);
		setIsDialogOpen(false);
	};

	// const handleClickLoadDocument = () => {
	// 	delteLocalStorage();
	// 	handleOpenPicker();
	// 	setPreload(false);
	// 	setIsDialogOpen(false);
	// };

	const deleteLocalStorage = () => {
		localStorage.removeItem("fileId");
		setIsNewProject(true);
	};

	return (
		<div>
			<Modal open={preload}>
				<Box>
					{!isNewProject ? (
						<Box sx={boxStyle}>
							<Button onClick={() => deleteLocalStorage()} size='large' variant='outlined'>
								New Document
							</Button>
							<Button onClick={handleOpenPicker} size='large' variant='contained'>
								Load Document
							</Button>
						</Box>
					) : (
						<Box sx={boxStyle} style={{ display: "block" }}>
							<TextField fullWidth onChange={handleChange} label='Document Name' variant='outlined' />
							<br />
							<Button style={{ margin: "50px" }} onClick={handleClickNewDocument} size='large' variant='contained'>
								Start
							</Button>
							<br />
							{errorDocName ? <span style={{ color: "red" }}>Please enter project name</span> : null}
						</Box>
					)}
				</Box>
			</Modal>
		</div>
	);
};

const boxStyle = {
	position: "absolute",
	height: "200px",
	top: "50%",
	left: window.innerWidth > 3000 ? window.innerWidth / 6 : window.innerWidth / 2,
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	textAlign: "center",
	display: "flex",
	justifyContent: "space-around",
	p: 4,
};

export default Preload;
