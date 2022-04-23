import React, { useState, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import "../App.css";

// Icons
import { default as SaveIcon } from "@mui/icons-material/SaveAltRounded";
import { default as ShareIcon } from "@mui/icons-material/ShareRounded";
import { default as UndoIcon } from "@mui/icons-material/UndoRounded";
import { default as RedoIcon } from "@mui/icons-material/RedoRounded";
import { default as RectangleIcon } from "@mui/icons-material/Crop54Rounded";
import { default as LineIcon } from "@mui/icons-material/RemoveRounded";
import { default as TextIcon } from "@mui/icons-material/TextFieldsRounded";
import { default as SelectIcon } from "@mui/icons-material/HighlightAltRounded";
import { default as PencilIcon } from "@mui/icons-material/CreateRounded";
import { default as AccountIcon } from "@mui/icons-material/AccountCircleRounded";
import { default as ColorIcon } from "@mui/icons-material/CircleRounded";

//

// Styles
const ToolbarStyle = {
	position: "fixed",
	display: "table",
	textAlign: "center",
	width: "400px",
	height: "20px",
	border: "2px solid grey",
	left: "50px",
	top: "20px",
	borderRadius: "10px",
};

const IconStyle = {
	height: "20px",
	padding: "10px",
	verticalAlign: "middle",
	color: "black",
	cursor: "pointer",
	border: "1px solid grey",
	borderRadius: "100%",
	margin: "5px",
	boxShadow: "inset 2px 4px 6px #d0d0d0",
};

const ColorToggleStyle = {
	position: "absolute !important",
};

const ToolToggleStyle = {
	position: "absolute",
	height: "300px",
	width: "70px",
	border: "1px solid grey",
	borderRadius: "10px",
	backgroundColor: "white",
};

// Component
const Toolbar = ({ setTool, setColor, Color, Undo, Redo }) => {
	const [colorToggle, setColorToggle] = useState(false);
	const [toolToggle, setToolToggle] = useState(false);
	const [selectedTool, setSelectedTool] = useState("pencil");

	useEffect(() => {
		setTool(selectedTool);
	}, [selectedTool]);

	const changeCurrTool = () => {
		switch (selectedTool) {
			case "pencil":
				return <PencilIcon style={IconStyle} onClick={() => setSelectedTool("pencil")} />;
			case "rectangle":
				return <RectangleIcon style={IconStyle} onClick={() => setSelectedTool("rectangle")} />;
			default:
				return <PencilIcon style={IconStyle} onClick={() => setSelectedTool("pencil")} />;
		}
	};

	const displayColorPicker = () => {
		return (
			<div style={ColorToggleStyle}>
				<HexColorPicker color={Color} onChange={setColor} />
			</div>
		);
	};

	const displayTools = () => {
		return (
			<div style={ToolToggleStyle}>
				<PencilIcon style={IconStyle} onClick={() => setSelectedTool("pencil")} />
				<RectangleIcon style={IconStyle} onClick={() => setSelectedTool("rectangle")} />
			</div>
		);
	};

	return (
		<div style={ToolbarStyle}>
			<span id='toolButton' onClick={() => setToolToggle(!toolToggle)}>
				{toolToggle ? displayTools() : null}
				{changeCurrTool()}
			</span>

			<ToggleButtonGroup orientation='vertical' value={"view"} exclusive onChange={() => setToolToggle(!toolToggle)}>
				<ToggleButton value='list' aria-label='list'>
					icon here
				</ToggleButton>
				<ToggleButton value='module' aria-label='module'>
					icon here
				</ToggleButton>
				<ToggleButton value='quilt' aria-label='quilt'>
					icon here
				</ToggleButton>
			</ToggleButtonGroup>

			<ColorIcon style={{ ...IconStyle, color: Color }} onClick={() => setColorToggle(!colorToggle)} />
			{colorToggle ? displayColorPicker() : null}
			<UndoIcon style={IconStyle} onClick={Undo} />
			<RedoIcon style={IconStyle} onClick={Redo} />
			<SaveIcon style={IconStyle} />
			<ShareIcon style={IconStyle} />
		</div>
	);
};

export default Toolbar;
