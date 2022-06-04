import React, { useState, useRef } from "react";
import Slider from "@mui/material/Slider";


const PressureSlider = ({ pressureValue, screenToWriteTo, pressureMode }) => {
	const marks = [
		{
			value: 0.001,
			label: "Screen 1",
		},
		{
			value: 0.33,
			label: "Screen 2",
		},
		{
			value: 0.66,
			label: "Screen 3",
		},
		{
			value: 1,
			label: "Max Pressure",
		},
	];

	return (
		<div style={stylePressureSlider}>
			<Slider
				orientation='vertical'
				min={0}
				max={1}
				value={screenToWriteTo > 0 && !pressureMode ? [marks[screenToWriteTo - 1].value,marks[screenToWriteTo - 1].value] : pressureValue}
				marks={marks}
				// range={0.2}
			/>
		</div>
	);
};

const stylePressureSlider = {
	position: "absolute",
	height: "80%",
	zIndex: "100",
	top: "100px",
	marginLeft: "10px",
	cursor: "crosshair",
	pointerEvents: "none",
};

export default PressureSlider;
