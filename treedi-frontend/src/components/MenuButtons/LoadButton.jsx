import React, { useEffect } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import useDrivePicker from "react-google-drive-picker";
import { default as LoadIcon } from "@mui/icons-material/CloudUpload";
import { toast } from "react-toastify";
import "../../App.css";

const LoadButton = ({
	setCommand,
	readPermission,
	editPermission,
	setEditPermission,
	setReadPermission,
	setOwner,
	setFileId,
	setProjectName,
}) => {
	const [openPicker, data] = useDrivePicker();
	const clientId = process.env.REACT_APP_CLIENT_ID;
	const developerKey = process.env.REACT_APP_DEVELOPER_KEY;

	useEffect(() => {
		if (data) {
			setCommand({ clear: true });
			console.log(data.docs[0].id);
			localStorage.setItem("fileId", data.docs[0].id);
			setFileId(data.docs[0].id);
			GetFileData(data.docs[0].id);
		}
	}, [data]);

	const addElement = (data) => {
		console.log("data: \n", data);
		let newReadPermission = Object.assign({}, data.ReadPermission, readPermission);
		let newEditPermission = Object.assign({}, data.EditPermission, editPermission);
		setEditPermission(newEditPermission);
		setReadPermission(newReadPermission);

		console.log("\n\nelements: ", data.Elements);

		setCommand({ load: data.Elements });
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
		// let code = params.get("code");

		let email = localStorage.getItem("TreediUserEmail");

		try {
			const res = await axios
				// .post("http://localhost:5001/api/googleDrive/getFileData/?email=" + email, {
				.post("https://treedi-346309.oa.r.appspot.com/api/googleDrive/getFileData/?email=" + email, {
					data: {
						fileid: fileID,
					},
				})
				.then((res) => {
					if (res.status == 200) {
						console.log(res.data);
						addElement(res.data);
						setOwner(res.data.Owner);
						setReadPermission(res.data.ReadPermission);
						setEditPermission(res.data.EditPermission);
						console.log("DATGATGEDBAS", res.data);
						setProjectName(res.data.FileName);
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
		let email = localStorage.getItem("TreediUserEmail");
		console.log("EMAIL IS:", email);
		try {
			// const res = await axios.get("http://localhost:5001/api/googleDrive/TTC/?email=" + email);
			const res = await axios.get("https://treedi-346309.oa.r.appspot.com/api/googleDrive/TTC/?email=" + email);
			console.log(res.data);
			// console.log(" Data:", res.data);
			TOKEN = res.data;
			console.log(TOKEN);
			if (res.ok) {
				console.log("OK");
			}
		} catch (error) {
			console.log(`error - GetToken - ${error}`);
		}
		setCommand({ resetView: true });
		 // console.log(
		// 	"PARAMS FOR PICKER:\n\n",
		// 	"clientId:",
		// 	clientId,
		// 	"\n\n",
		// 	"developerKey:",
		// 	developerKey,
		// 	"\n\n",
		// 	"token:",
		// 	TOKEN
		// );

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
