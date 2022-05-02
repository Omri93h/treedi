import React, { useState } from "react";
import { Modal, Button, Box, TextField } from "@mui/material";

const style = {
	position: "absolute",
	height: "200px",
	top: "50%",
	left: "50%",
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

const Preload = ({ projectName, setProjectName }) => {
	const [preload, setPreload] = useState(true);
	const [isNewProject, setIsNewProject] = useState(false);

	const handleChange = (event) => {
		setProjectName(event.target.value);
	};

	return (
		<div>
			<Modal open={preload} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
				<Box sx={style}>
					{!isNewProject ? (
						<Box sx={style}>
							<Button onClick={() => setIsNewProject(true)} size='large' variant='outlined'>
								New Project
							</Button>
							<Button onClick={() => setPreload(false)} size='large' variant='contained'>
								Open Existing
							</Button>
						</Box>
					) : (
						<div>
							<TextField
								fullWidth
								onChange={handleChange}
								id='outlined-basic'
								label='Project Name'
								variant='outlined'
							/>

							<Button
								style={{ margin: "50px" }}
								onClick={() => setPreload(false)}
								disabled={projectName ? false : true}
								size='large'
								variant='contained'>
								Start Project
							</Button>
						</div>
					)}
				</Box>
			</Modal>
		</div>
	);
};

export default Preload;
