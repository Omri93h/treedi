import React, { useState } from "react";
import Button from "@mui/material/Button";
import { default as ShareIcon } from "@mui/icons-material/ShareRounded";
import getTrdiFileData from "../../utils/getTrdiFileData";
import saveTrdiFile from "../../utils/saveTrdiFile";
import Notificator from "../../utils/Notificator";
import "../../App.css";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Switch from "@mui/material/Switch";
import Checkbox from "@mui/material/Checkbox";
import axios from "axios";
import OutlinedInput from "@mui/material/OutlinedInput";

const modalStyle = {
	position: "absolute",
	top: "50%",
	left: window.screen.width / 6,
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	p: 4,
};

const screens = [1, 2, 3];
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
};

const ShareButton = ({
	elements,
	owner,
	fileName,
	readPermission,
	setReadPermission,
	editPermission,
	setEditPermission,
	setIsDialogOpen,
	setFileId,
	elementsIdOnViewMode,
}) => {
	const [open, setOpen] = useState(false);
	const [editToggle, setEditToggle] = useState(false);
	const [email, setEmail] = useState("");
	const [currReadPermission, setCurrReadPermission] = useState([]);
	const [currEditPermission, setCurrEditPermission] = useState([]);

	const handleOpen = () => {
		setIsDialogOpen(true); // for prevent using "keydowns" in app
		setOpen(true);
	};

	const handleClose = () => {
		setIsDialogOpen(false);
		setOpen(false);
	};

	const [displayedReadPermissions, setDisplayedReadPermissions] = useState([]);

	const handleEmailChange = (event) => {
		setEmail(event.target.value);
	};

	const handleEditToggle = () => {
		setEditToggle(!editToggle);
		setCurrEditPermission(Array());
	};

	const handleReadPermissionChange = (event) => {
		let values = getValues(event);
		if (values.length) {
			let currEditPermissionCopy = currEditPermission;
			values.forEach((value) => {
				if (currEditPermissionCopy.indexOf(value) !== -1) {
					currEditPermissionCopy.pop(value);
				}
			});
			setCurrEditPermission(currEditPermissionCopy);
		} else {
			setCurrEditPermission(Array());
		}
		values.sort();
		setCurrReadPermission(values);

		handleDisplayedReadPermissionChange(values, currEditPermission);
		// console.log(displayedReadPermissions2);
		// setDisplayedReadPermissions(displayedReadPermissions2);

		// setDisplayedReadPermissions(currReadPermission);
	};
	const handleEditPermissionChange = (event) => {
		const values = getValues(event);
		if (values.length) {
			if (currReadPermission.indexOf(values[values.length - 1]) === -1) {
				setCurrReadPermission([...currReadPermission, values[values.length - 1]].sort());

				// console.log(displayedReadPermissions2);
				// setDisplayedReadPermissions(displayedReadPermissions2);
			}
		}
		values.sort();
		setCurrEditPermission(values);
		handleDisplayedReadPermissionChange(currReadPermission, values);
	};
	const getValues = (event) => {
		const {
			target: { value },
		} = event;
		// On autofill we get a stringified value.
		return typeof value === "string" ? value.split(",") : value;
	};

	const handleShare = async function () {
		// console.log("setting Permissions");
		let newReadPermissions = readPermission;
		newReadPermissions[email] = currReadPermission;

		let newEditPermissions = editPermission;
		editPermission[email] = currEditPermission;

		setReadPermission(newReadPermissions);
		setEditPermission(newEditPermissions);

		const getBaseElements = () => {
			let baseElements = [];
			elements.forEach((element) => {
				let baseElement = {};
				Object.assign(baseElement, element);
				if (elementsIdOnViewMode.indexOf(element.id) !== -1) {
					baseElement.points.forEach((point) => {
						point.x += window.screen.width * (element.screen - 1);
					});
				}
				baseElement.display = true;
				baseElements.push(baseElement);
			});
			return baseElements;
		};
		const baseElements = getBaseElements();
		const trdiFileData = getTrdiFileData(owner, fileName, baseElements, newReadPermissions, newEditPermissions);

		handleClose();

		await saveTrdiFile(trdiFileData, fileName, setFileId);
		ShareFile();
	};

	const handleDisplayedReadPermissionChange = (readList, editList) => {
		const currDisplayedReadPermissions = readList.filter(function (e) {
			return this.indexOf(e) < 0;
		}, editList);

		setDisplayedReadPermissions(currDisplayedReadPermissions);
	};

	// Share File
	const ShareFile = async function () {
		try {
			let params = new URL(document.location).searchParams;
			let fileid = localStorage.getItem("fileId");
			let email1 = localStorage.getItem("TreediUserEmail");

			// const res = await axios.post("http://localhost:5001/api/googleDrive/shareFile/?email=" + email1, {
			const res = await axios.post(
				"https://treedi-346309.oa.r.appspot.com/api/googleDrive/shareFile/?email=" + email1,
				{
					data: {
						email: email,
						fileId: fileid,
						edit: currEditPermission.length > 0 ? true : false,
					},
				}
			);

			if (res.data === "success" || res.statusText === "OK") {
				Notificator("share-success");
			} else {
				console.log("Problem on Share!");
				Notificator("share-error");
			}
		} catch (error) {
			console.log(`error - ShareFile - ${error}`);
			Notificator("share-error");
		}
	};

	// Inner Components
	const readScreens = (
		<FormControl sx={{ m: 0, minWidth: 200 }}>
			<InputLabel>Read Screens ...</InputLabel>
			<Select
				multiple
				value={currReadPermission}
				onChange={handleReadPermissionChange}
				input={<OutlinedInput label='Read Screens ... ' />}
				renderValue={() =>
					displayedReadPermissions.length ? (
						displayedReadPermissions.join(", ")
					) : (
						<span style={{ color: "grey" }}>Edit Screens</span>
					)
				}
				MenuProps={MenuProps}>
				{screens.map((screen) => (
					<MenuItem key={screen} value={screen}>
						<Checkbox checked={currReadPermission.indexOf(screen) > -1 || currEditPermission.indexOf(screen) > -1} />
						<ListItemText primary={screen} />
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
	const editScreens = (
		<FormControl sx={{ m: 0, minWidth: 200 }}>
			<InputLabel>Edit Screens ...</InputLabel>
			<Select
				disabled={!editToggle}
				multiple
				value={currEditPermission}
				onChange={handleEditPermissionChange}
				input={<OutlinedInput label='Edit Screens ... ' />}
				renderValue={(selected) => selected.join(", ")}
				MenuProps={MenuProps}>
				{screens.map((screen) => (
					<MenuItem key={screen} value={screen}>
						<Checkbox checked={currEditPermission.indexOf(screen) > -1} />
						<ListItemText primary={screen} />
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);

	return (
		<>
			<Button className='basic-button' onClick={handleOpen}>
				<ShareIcon className='menu-item' />
			</Button>
			<Modal
				open={open}
				onClose={handleClose}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500,
				}}>
				<Fade in={open}>
					<Box sx={modalStyle}>
						<Typography id='transition-modal-title' variant='h6' component='h2'>
							<TextField onChange={handleEmailChange} fullWidth label='Email ...' id='fullWidth' type='email' />
						</Typography>
						<br />
						<br />
						<List
							sx={{ width: "100%", bgcolor: "background.paper" }}
							subheader={<ListSubheader>Permissions</ListSubheader>}>
							<ListItem>
								<Switch edge='end' disabled={true} checked={true} />
								<ListItemText primary='&nbsp;Read' />
								{readScreens}
							</ListItem>
							<ListItem>
								<Switch edge='end' onChange={handleEditToggle} checked={editToggle} />
								<ListItemText primary='&nbsp;Edit' />
								{editScreens}
							</ListItem>
						</List>
						<br />
						<div style={{ textAlign: "center" }}>
							<Button size='large' variant='outlined' onClick={handleShare}>
								<ShareIcon className='menu-item' /> &nbsp; Share
							</Button>
						</div>
					</Box>
				</Fade>
			</Modal>
		</>
	);
};

export default ShareButton;
