import React, { useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { default as ShareIcon } from "@mui/icons-material/ShareRounded";
import { Divider } from "@mui/material";
import data_format from "../../utils/DataFormat";
import { toast } from "react-toastify";
import "../../App.css";

import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";

import Typography from "@mui/material/Typography";

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
	const [open, setOpen] = React.useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

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
							Text in a modal
						</Typography>
						<Typography id='transition-modal-description' sx={{ mt: 2 }}>
							Enter Email (to develop)
						</Typography>
					</Box>
				</Fade>
			</Modal>
		</>
	);
};

export default ShareButton;
