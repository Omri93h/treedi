import React, { useState } from "react";

import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { default as SaveIcon } from "@mui/icons-material/SaveAltRounded";
import { Divider } from "@mui/material";
import getTrdiFileData from "../../utils/getTrdiFileData";
import saveTrdiFile from "../../utils/saveTrdiFile";
import { toast } from "react-toastify";

import "../../App.css";

const SaveButton = ({
	fileName,
	user,
	elements,
	owner,
	readPermission,
	editPermission,
	setFileId,
	elementsIdOnViewMode,
}) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const getBaseElements = () => {
		let baseElements = [];
		console.log('The LAST element in §elements§ is', elements[elements.length - 1])
		elements.forEach((element) => {
			let baseElement = {};
			Object.assign(baseElement, element);

			// if saving on a screen view mode
			if (elementsIdOnViewMode.indexOf(element.id) !== -1) {
				baseElement.points.forEach((point) => {
					point.x += window.screen.width * (element.screen - 1);
				});
			}

			baseElement.display = true;
			baseElements.push(baseElement);
			console.log('pushed to elements that are going to be saved:', baseElement)
		});

		console.log('these are the elements which going to be saved:', baseElements)
		return baseElements;
	};

	const handleSave = () => {
		// setScreenView("all");
		toast.info("Saving File ...", {
			position: "bottom-left",
			autoClose: 800,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
		});
		// console.log(elements);
		const baseElements = getBaseElements();
		console.log(baseElements);
		const trdiFileData = getTrdiFileData(owner, fileName, baseElements, readPermission, editPermission);
		saveTrdiFile(trdiFileData, fileName, setFileId);
		handleClose();
	};

	return (
		<>
			<Button
				style={{ height: "100%" }}
				aria-controls={open ? "basic-menu" : undefined}
				aria-haspopup='true'
				aria-expanded={open ? "true" : undefined}
				onClick={handleClick}>
				<SaveIcon />
			</Button>
			<Menu
				className='basic-menu'
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					"aria-labelledby": "basic-button",
				}}>
				<MenuItem onClick={handleSave} disabled={fileName ? false : true}>
					{" "}
					Save {fileName}
				</MenuItem>
				<Divider />
				<MenuItem
					onClick={() => {
						handleClose();
					}}>
					{" "}
					Save As ..
				</MenuItem>
			</Menu>
		</>
	);
};

export default SaveButton;
