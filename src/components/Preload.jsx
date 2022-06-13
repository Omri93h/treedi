import React, { useState } from "react";
import { Modal, Button, Box, TextField } from "@mui/material";
import LoadButton from "./MenuButtons/LoadButton";


const Preload = ({ setProjectName, setIsDialogOpen }) => {
	const [preload, setPreload] = useState(true);
	const [isNewProject, setIsNewProject] = useState(false);
	const [input, setInput] = useState("");
	const [error, setError] = useState(false);
	const handleChange = (event) => {
		setInput(event.target.value);
	};

	const handleClickNewDocument = () => {
		if (input === "") {
			setError(true);
			return;
		}
		setProjectName(input);
		setPreload(false);
		setIsDialogOpen(false);
	};

	const handleClickLoadDocument = () => {
		delteLocalStorage();
		LoadButton.handleOpenPicker();
		setPreload(false);
		setIsDialogOpen(false);
	};

	const delteLocalStorage = () => {
		localStorage.removeItem("fileId");
		setIsNewProject(true);
	};

	return (
		<div>
			<Modal open={preload}>
				<Box>
					{!isNewProject ? (
						<Box sx={boxStyle}>
							<Button onClick={() => delteLocalStorage()} size='large' variant='outlined'>
								New Document
							</Button>
							<Button onClick={handleClickLoadDocument} size='large' variant='contained'>
								Load Document
							</Button>
						</Box>
					) : (
						<Box sx={boxStyle} style={{ display: "block" }}>
							<TextField
								fullWidth
								onChange={handleChange}
								label='Document Name'
								variant='outlined'
							/>
							<br />
							<Button style={{ margin: "50px" }} onClick={handleClickNewDocument} size='large' variant='contained'>
								Start
							</Button>
							<br />
							{error ? <span style={{ color: "red" }}>Please enter project name</span> : null}
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
	left: window.innerWidth > 3000? window.innerWidth / 6: window.innerWidth/2,
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
