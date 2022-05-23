import React, { useState } from "react";
import { Modal, Button, Box, TextField } from "@mui/material";

const boxStyle = {
	position: "absolute",
	height: "200px",
	top: "50%",
	left: window.innerWidth / 6,
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

const Preload = ({ projectName, setProjectName, setIsDialogOpen }) => {
	const [preload, setPreload] = useState(true);
	const [isNewProject, setIsNewProject] = useState(false);
	const [input, setInput] = useState("");
	const [error, setError] = useState(false);
	const handleChange = (event) => {
		setInput(event.target.value);
	};

	const handleClick = () => {
		if (input === "") {
			setError(true);
			return;
		}
		setProjectName(input);
		setPreload(false);
		setIsDialogOpen(false)
	};

	const delteLocalStorage = (event) => {
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
								New Project
							</Button>
							<Button onClick={() => setPreload(false)} size='large' variant='contained'>
								Open Existing
							</Button>
						</Box>
					) : (
						<Box sx={boxStyle} style={{ display: "block" }}>
							<TextField
								fullWidth
								onChange={handleChange}
								id='outlined-basic'
								label='Project Name'
								variant='outlined'
							/>
							<br />
							<Button style={{ margin: "50px" }} onClick={handleClick} size='large' variant='contained'>
								Start Project
							</Button>
							<br />
							{error ? <span style={{color:'red'}}>Please enter project name</span>: null}
						</Box>
					)}
				</Box>
			</Modal>
		</div>
	);
};

export default Preload;
