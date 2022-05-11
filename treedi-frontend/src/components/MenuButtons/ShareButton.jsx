import React, { useState } from "react";
import Button from "@mui/material/Button";
import { default as ShareIcon } from "@mui/icons-material/ShareRounded";
import { toast } from "react-toastify";
import "../../App.css";

import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

import axios from "axios";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	p: 4,
};

const ShareButton = () => {
	const [open, setOpen] = useState(false);
	const [email, setEmail] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const handleChange = (event) => {
		setEmail(event.target.value);
		console.log(email)
	};

	return (
		<>
			<Button className='basic-button' onClick={handleOpen}>
				<ShareIcon className='menu-item' />
			</Button>
			<Modal
				aria-labelledby='transition-modal-title'
				aria-describedby='transition-modal-description'
				open={open}
				onClose={handleClose}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500,
				}}>
				<Fade in={open}>
					<Box sx={style}>
						<Typography id='transition-modal-title' variant='h6' component='h2'>
						Enter Email:
						</Typography>
						<Typography id='transition-modal-description' sx={{ mt: 2 }}>
							<Box
								sx={{
									width: 500,
									maxWidth: "100%",
								}}>
								<TextField onChange={handleChange} fullWidth label='E-mail' id='fullWidth' type='email' />
								<br/> <br/>
								<Button size='large' variant='outlined' onClick={()=>null}>
							<ShareIcon className='menu-item'/> &nbsp;Share
							</Button>
							</Box>

						</Typography>
					</Box>
				</Fade>
			</Modal>
		</>
	);
};

export default ShareButton;
