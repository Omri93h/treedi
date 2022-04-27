import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import rough from "roughjs/bundled/rough.esm";
import getStroke from "perfect-freehand";
import useDrivePicker from "react-google-drive-picker";
import data_format from "./utils/DataFormat";
import Logout from "./components/Logout";
import GoogleDriveButton from "./components/GoogleDriveButton";
import TreediMenuBar from "./components/TreediMenuBar";
import axios from "axios";


const generator = rough.generator();
var Pressure = require("pressure");

const nearPoint = (x, y, x1, y1, name) => {
	return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? name : null;
};

const onLine = (x1, y1, x2, y2, x, y, maxDistance = 1) => {
	const a = { x: x1, y: y1 };
	const b = { x: x2, y: y2 };
	const c = { x, y };
	const offset = distance(a, b) - (distance(a, c) + distance(b, c));
	return Math.abs(offset) < maxDistance ? "inside" : null;
};

const positionWithinElement = (x, y, element) => {
	const { type, x1, x2, y1, y2 } = element;
	switch (type) {
		case "line":
			const on = onLine(x1, y1, x2, y2, x, y);
			const start = nearPoint(x, y, x1, y1, "start");
			const end = nearPoint(x, y, x2, y2, "end");
			return start || end || on;
		case "rectangle":
			const topLeft = nearPoint(x, y, x1, y1, "tl");
			const topRight = nearPoint(x, y, x2, y1, "tr");
			const bottomLeft = nearPoint(x, y, x1, y2, "bl");
			const bottomRight = nearPoint(x, y, x2, y2, "br");
			const inside = x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null;
			return topLeft || topRight || bottomLeft || bottomRight || inside;
		case "pencil":
			const betweenAnyPoint = element.points.some((point, index) => {
				const nextPoint = element.points[index + 1];
				if (!nextPoint) return false;
				return onLine(point.x, point.y, nextPoint.x, nextPoint.y, x, y, 5) != null;
			});
			return betweenAnyPoint ? "inside" : null;
		case "text":
			return x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null;
		default:
			throw new Error(`Type not recognised: ${type}`);
	}
};

const distance = (a, b) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

const getElementAtPosition = (x, y, elements) => {
	return elements
		.map((element) => ({
			...element,
			position: positionWithinElement(x, y, element),
		}))
		.find((element) => element.position !== null);
};

const adjustElementCoordinates = (element) => {
	const { type, x1, y1, x2, y2 } = element;
	if (type === "rectangle") {
		const minX = Math.min(x1, x2);
		const maxX = Math.max(x1, x2);
		const minY = Math.min(y1, y2);
		const maxY = Math.max(y1, y2);
		return { x1: minX, y1: minY, x2: maxX, y2: maxY };
	} else {
		if (x1 < x2 || (x1 === x2 && y1 < y2)) {
			return { x1, y1, x2, y2 };
		} else {
			return { x1: x2, y1: y2, x2: x1, y2: y1 };
		}
	}
};

const cursorForPosition = (position) => {
	switch (position) {
		case "tl":
		case "br":
		case "start":
		case "end":
			return "nwse-resize";
		case "tr":
		case "bl":
			return "nesw-resize";
		default:
			return "move";
	}
};

const resizedCoordinates = (clientX, clientY, position, coordinates) => {
	const { x1, y1, x2, y2 } = coordinates;
	switch (position) {
		case "tl":
		case "start":
			return { x1: clientX, y1: clientY, x2, y2 };
		case "tr":
			return { x1, y1: clientY, x2: clientX, y2 };
		case "bl":
			return { x1: clientX, y1, x2, y2: clientY };
		case "br":
		case "end":
			return { x1, y1, x2: clientX, y2: clientY };
		default:
			return null; //should not really get here...
	}
};

const useHistory = (initialState) => {
	const [index, setIndex] = useState(0);
	const [history, setHistory] = useState([initialState]);

	const setState = (action, overwrite = false) => {
		const newState = typeof action === "function" ? action(history[index]) : action;
		if (overwrite) {
			const historyCopy = [...history];
			historyCopy[index] = newState;
			setHistory(historyCopy);
		} else {
			const updatedState = [...history].slice(0, index + 1);
			setHistory([...updatedState, newState]);
			setIndex((prevState) => prevState + 1);
		}
	};

	const undo = () => index > 0 && setIndex((prevState) => prevState - 1);
	const redo = () => index < history.length - 1 && setIndex((prevState) => prevState + 1);
	// const redo_diff_screen = () => console.log(history);
	return [history[index], setState, undo, redo];
};

const getSvgPathFromStroke = (stroke) => {
	if (!stroke.length) return "";

	const d = stroke.reduce(
		(acc, [x0, y0], i, arr) => {
			const [x1, y1] = arr[(i + 1) % arr.length];
			acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
			return acc;
		},
		["M", ...stroke[0], "Q"]
	);

	d.push("Z");
	return d.join(" ");
};

const adjustmentRequired = (type) => ["line", "rectangle"].includes(type);

const TreediDraw = (props) => {
	const [user, setUser] = useState({
		name: localStorage.getItem("TreediUserName"),
		email: localStorage.getItem("TreediUserName"),
		img: localStorage.getItem("TreediUserEmail"),
	});

	// console.log(user.name + " \n" + user.email + " \n" + user.img);

	////////

	const [elements, setElements, undo, redo] = useHistory([]);
	const [elementToMove, setElementToMove] = useState(null);

	useEffect(() => {
		if (elementToMove !== null) {
			const elementToMoveCopy = elementToMove;
			const canvas = document.querySelector("canvas");
			const ctx = canvas.getContext("2d");
			ctx.canvas.style.touchAction = "none";
			const stroke = getSvgPathFromStroke(getStroke(elementToMove.points));
			const p = new Path2D(stroke);
			ctx.stroke(p);
			ctx.fill(p);
			setElements((allElements) => [...allElements, elementToMoveCopy]);
			setElementToMove(null);
			// console.log(elements)
		}
	}, [elementToMove]);

	const createElement = (id, x1, y1, x2, y2, type, elem_color, display) => {
		const canvas = document.querySelector("canvas");
		const ctx = canvas.getContext("2d");
		switch (type) {
			case "line":
			case "rectangle":
				const roughElement =
					type === "line"
						? generator.line(x1, y1, x2, y2, { stroke: color })
						: generator.rectangle(x1, y1, x2 - x1, y2 - y1, { stroke: color });
				return { id, x1, y1, x2, y2, type, roughElement, elem_color, display };
			case "pencil":
				return { id, type, points: [{ x: x1, y: y1 }], elem_color, display };
			case "text":
				return { id, type, x1, y1, x2, y2, text: "", elem_color, display };
			default:
				throw new Error(`Type not recognised: ${type}`);
		}
	};

	const [action, setAction] = useState("none");
	const [tool, setTool] = useState("pencil");
	const [selectedElement, setSelectedElement] = useState(null);
	const textAreaRef = useRef();
	const [pressureValue, setPressureValue] = useState(0);
	const [currMaxPressureValue, setCurrMaxPressureValue] = useState(0);
	const [color, setColor] = useState("black");

	const drawElement = (roughCanvas, context, element) => {
		switch (element.type) {
			case "line":
			case "rectangle":
				// element.roughElement.options.stroke = color;
				roughCanvas.draw(element.roughElement);
				break;
			case "pencil":
				const stroke = getSvgPathFromStroke(getStroke(element.points));
				context.fillStyle = element.elem_color;
				context.beginPath();
				const path = new Path2D(stroke);
				context.fill(path);
				context.closePath();
				break;
			case "text":
				context.textBaseline = "top";
				context.font = "24px sans-serif";
				context.fillText(element.text, element.x1, element.y1);
				break;
			default:
				throw new Error(`Type not recognised: ${element.type}`);
		}
	};

	useLayoutEffect(() => {
		const canvas = document.getElementById("canvas");
		const context = canvas.getContext("2d");
		context.clearRect(0, 0, canvas.width, canvas.height);
		const roughCanvas = rough.canvas(canvas);
		elements.forEach((element) => {
			if (action === "writing" && selectedElement.id === element.id) {
				return;
			}
			drawElement(roughCanvas, context, element);
		});
	}, [elements, action, selectedElement]);

	useEffect(() => {
		const undoRedoFunction = (event) => {
			if ((event.metaKey || event.ctrlKey) && event.key === "z") {
				if (event.shiftKey) {
					redo();
				} else {
					undo();
				}
			}
		};

		document.addEventListener("keydown", undoRedoFunction);
		return () => {
			document.removeEventListener("keydown", undoRedoFunction);
		};
	}, [undo, redo]);

	useEffect(() => {
		const textArea = textAreaRef.current;
		if (action === "writing") {
			textArea.focus();
			textArea.value = selectedElement.text;
		}
	}, [action, selectedElement]);

	const updateElement = (id, x1, y1, x2, y2, type, options) => {
		const elementsCopy = [...elements];

		switch (type) {
			case "line":
			case "rectangle":
				elementsCopy[id] = createElement(id, x1, y1, x2, y2, type);
				break;
			case "pencil":
				elementsCopy[id].points = [...elementsCopy[id].points, { x: x2, y: y2 }];
				break;
			case "text":
				const textWidth = document
					.getElementById("canvas")
					.getContext("2d")
					.measureText(options.text).width;
				const textHeight = 24;
				elementsCopy[id] = {
					...createElement(id, x1, y1, x1 + textWidth, y1 + textHeight, type),
					text: options.text,
				};
				break;
			default:
				throw new Error(`Type not recognised: ${type}`);
		}

		setElements(elementsCopy, true);
	};

	Pressure.set("canvas", {
		change: function (force, event) {
			if (force > currMaxPressureValue) {
				setCurrMaxPressureValue(force);
			}
			setPressureValue(force);
		},
	});

	const pressureElement = (
		<div id='pressure-element' style={{ textAlign: "right" }}>
			{" "}
			{pressureValue}{" "}
		</div>
	);

	const handleMouseDown = (event) => {
		if (action === "writing") return;

		const { clientX, clientY } = event;
		if (tool === "selection") {
			const element = getElementAtPosition(clientX, clientY, elements);
			if (element) {
				if (element.type === "pencil") {
					const xOffsets = element.points.map((point) => clientX - point.x);
					const yOffsets = element.points.map((point) => clientY - point.y);
					setSelectedElement({ ...element, xOffsets, yOffsets });
				} else {
					const offsetX = clientX - element.x1;
					const offsetY = clientY - element.y1;
					setSelectedElement({ ...element, offsetX, offsetY });
				}
				setElements((prevState) => prevState);

				if (element.position === "inside") {
					setAction("moving");
				} else {
					setAction("resizing");
				}
			}
		} else {
			const id = elements.length;
			const element = createElement(id, clientX, clientY, clientX, clientY, tool, color, true);
			setElements((prevState) => [...prevState, element]);
			setSelectedElement(element);

			setAction(tool === "text" ? "writing" : "drawing");
		}
	};

	const saveLocal = () => {
		var canvas = document.querySelector("canvas");
		var dataURL = canvas.toDataURL("image/png", 1.0);
		data_format.FileName = "FILENAME";
		data_format.LastModified = "DATE";
		data_format.Owner = "GOOGLE_USER";
		data_format.Screens.push({ Image: dataURL, LastModified: "DATE" });
		// console.log(data_format)

		// TEMP Currently Downloading...
		downloadTrdiFile(data_format, "NEW_TREEDI_FILE.trdi");
	};
	const [Url, setUrl] = useState(null);
	const downloadTrdiFile = (jsonData, filename) => {
		const fileData = JSON.stringify(jsonData);
		const blob = new Blob([fileData], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.download = filename;
		link.href = url;
		setUrl(link.href.slice(5));
		// console.log( link.href.slice(5));
		//console.log(link);
		// link.click();
	};

	const loadLocal = () => {
		let trdiFile = require("./utils/NEW_TREEDI_FILE.trdi");
		fetch(trdiFile)
			.then((r) => r.json())
			.then((parsed) => {
				// console.log(parsed)
				let image = new Image();
				// var images = new Array();
				image.onload = function () {
					var canvas = document.querySelector("canvas");
					const ctx = canvas.getContext("2d");
					ctx.globalAlpha = 1;
					ctx.drawImage(image, 0, 0);
				};
				image.src = parsed.Screens[0].Image;
			});
	};

	const handleMouseMove = (event) => {
		const { clientX, clientY } = event;

		if (tool === "selection") {
			const element = getElementAtPosition(clientX, clientY, elements);
			event.target.style.cursor = element ? cursorForPosition(element.position) : "default";
		}
		if (action === "drawing") {
			const index = elements.length - 1;
			const { x1, y1 } = elements[index];
			if (event.type == "touchmove") {
				console.log("Touchmove\n");
				updateElement(index, x1, y1, event.changedTouches[0].clientX, event.changedTouches[0].clientY, tool);
			} else {
				updateElement(index, x1, y1, clientX, clientY, tool);
			}
			//   console.log(
			//     'index,', index, '\n',
			//     'x1', x1, '\n',
			//     'y1, ', y1, '\n',
			//     'clientX', clientX, '\n',
			//     'clientY', clientY, '\n',
			//     'tool', tool)
		} else if (action === "moving") {
			if (selectedElement.type === "pencil") {
				// console.log(event);

				const newPoints = selectedElement.points.map((_, index) => ({
					x: clientX - selectedElement.xOffsets[index],
					y: clientY - selectedElement.yOffsets[index],
				}));

				const elementsCopy = [...elements];
				elementsCopy[selectedElement.id] = {
					...elementsCopy[selectedElement.id],
					points: newPoints,
				};
				setElements(elementsCopy, true);
			} else {
				const { id, x1, x2, y1, y2, type, offsetX, offsetY } = selectedElement;
				const width = x2 - x1;
				const height = y2 - y1;
				const newX1 = clientX - offsetX;
				const newY1 = clientY - offsetY;
				const options = type === "text" ? { text: selectedElement.text } : {};
				updateElement(id, newX1, newY1, newX1 + width, newY1 + height, type, options);
			}
		} else if (action === "resizing") {
			const { id, type, position, ...coordinates } = selectedElement;
			const { x1, y1, x2, y2 } = resizedCoordinates(clientX, clientY, position, coordinates);
			updateElement(id, x1, y1, x2, y2, type);
		}
	};

	const handleMouseUp = (event) => {
		const canvas = document.querySelector("canvas");
		const ctx = canvas.getContext("2d");
		const { clientX, clientY } = event;

		if (currMaxPressureValue > 0.5) {
			const currElement = elements[elements.length - 1];

			const new_elem = { id: currElement.id, type: "pencil", points: [] };
			for (const i in currElement.points) {
				new_elem.points.push({
					x: currElement.points[i].x + 1600,
					y: currElement.points[i].y,
				});
			}
			console.log("OLD ELEM:,", currElement);
			console.log("NEW ELEM:,", new_elem);
			undo();
			setElementToMove(new_elem);
			// const canvas = document.getElementById("canvas");
			// const context = canvas.getContext("2d");

			// const stroke = getSvgPathFromStroke(getStroke(new_elem.points));
			// console.log("Stroke: ", stroke)
			// context.strokeStyle = '#000';
			// context.lineWidth = 1;
			// context.fillStyle = 'rgb(200, 0, 0)';
			// context.fillRect(x, y, width, height)
			// var p = new Path2D(stroke)
			// console.log("Path2D", p)
			// context.stroke(p);
			// context.fill(p)
			// context.stroke(new Path2D(stroke));

			// insertSvgToDifferentScreen(stroke)

			setCurrMaxPressureValue(0);
		} else if (selectedElement) {
			if (
				selectedElement.type === "text" &&
				clientX - selectedElement.offsetX === selectedElement.x1 &&
				clientY - selectedElement.offsetY === selectedElement.y1
			) {
				setAction("writing");

				return;
			}

			const index = selectedElement.id;
			const { id, type } = elements[index];
			if ((action === "drawing" || action === "resizing") && adjustmentRequired(type)) {
				const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[index]);
				updateElement(id, x1, y1, x2, y2, type);
				// console.log('We are updating the element ', elements[index])
			}
		}

		if (action === "writing") return;

		setAction("none");
		setSelectedElement(null);
		ctx.closePath();
	};

	const [openPicker, data] = useDrivePicker();

	const clientId = process.env.REACT_APP_CLIENT_ID;
	const developerKey = process.env.REACT_APP_DEVELOPER_KEY;
	const TOKEN = process.env.REACT_APP_ACCESS_TOKEN;
	const handleOpenPicker = () => {
		openPicker({
			clientId: clientId,
			developerKey: developerKey,
			token: TOKEN,
			viewId: "DOCS",
			showUploadView: true,
			showUploadFolders: true,
			supportDrives: true,
			multiselect: true,
		});
	};
	useEffect(() => {
		if (data) {
			data.docs.map((i) => console.log(i));
		}
	}, [data]);

	const handleBlur = (event) => {
		const { id, x1, y1, type } = selectedElement;
		setAction("none");
		setSelectedElement(null);
		updateElement(id, x1, y1, null, null, type, { text: event.target.value });
	};

	useEffect(() => {
		let iframe = document.getElementsByClassName("save-to-drive-button jfk-button jfk-button-standard jfk-button-rtl");

		console.log(iframe);
		console.log(typeof iframe);
	}, []);

	useEffect(() => {
		setInterval(() => {
			saveLocal();
		}, 5000);
	}, []);

	const JonisaveLocal = () => {
		var canvas = document.querySelector("canvas");
		var dataURL = canvas.toDataURL("image/png", 1.0);
		data_format.FileName = "FILENAME";
		data_format.LastModified = "DATE";
		data_format.Owner = "GOOGLE_USER";
		data_format.Screens.push({ Image: dataURL, LastModified: "DATE" });
		downloadTrdiFile1(data_format, "NEW_TREEDI_FILE.trdi");
	};
	// const [Url1, setUrl1] = useState(null);
	const [FileData, setFileData] = useState(null);
	const downloadTrdiFile1 = (jsonData, filename) => {
		const fileData = JSON.stringify(jsonData);
		setFileData(fileData);
		const blob = new Blob([fileData], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.download = filename;
		link.href = url;
		// setUrl1(link.href.slice(5));
		// console.log("MY HREF:", link.href.slice(5));
		Jonisave();
		// console.log("URL1 IS :", Url1);
		// console.log( link.href.slice(5));
		//console.log(link);
		// link.click();
	};

	const Jonisave = async function () {
		try {
			let params = (new URL(document.location)).searchParams;
			let code = params.get("code");

			const res = await axios.post(
				"http://localhost:5001/api/googleDrive/save/?code=" + code,
				{
					data: {
						Url: FileData, // This is the body part
					}
				}
			)



			console.log(res);

			// let response = await fetch('/api/googleDrive/listFiles?code='+code, {
			//     method: 'GET',
			//     mode: 'no-cors',
			//     headers: {
			//         'Content-Type': 'application/json'
			//     },
			//     //body: formData
			// });
			if (res.ok) {
				console.log("OK");
			}
		}
		catch (error) {
			console.log(`error - Save - ${error}`);
		}
	}



	const GetListOfItems = async function () {
		try {
			let params = (new URL(document.location)).searchParams;
			let code = params.get("code");
			const res = await axios.get(
				"http://localhost:5001/api/googleDrive/listFiles/?code=" + code,
			)


			console.log(res);
			if (res.ok) {
				console.log("OK");
			}
		}
		catch (error) {
			console.log(`error - Save - ${error}`);
		}
	}
	return (
		<div>
			<TreediMenuBar setColor={setColor} setTool={setTool} color={color} undo={undo} redo={redo} />
			{/* <div style={{ position: "fixed" }}>
				<Toolbar setTool={setTool} setColor={setColor} Color={color} Undo={undo} Redo={redo} />
				<input type='radio' id='selection' checked={tool === "selection"} onChange={() => setTool("selection")} />
				<label htmlFor='selection'>Selection</label>
				<input type='radio' id='line' checked={tool === "line"} onChange={() => setTool("line")} />
				<label htmlFor='line'>Line</label>
				<input type='radio' id='rectangle' checked={tool === "rectangle"} onChange={() => setTool("rectangle")} />
				<label htmlFor='rectangle'>Rectangle</label>
				<input type='radio' id='text' checked={tool === "text"} onChange={() => setTool("text")} />

				<label htmlFor='text'>Text</label>
				<input type='radio' id='pencil' checked={tool === "pencil"} onChange={() => setTool("pencil")} />
				<label htmlFor='pencil'>Pencil</label>
			</div> */}

			{pressureElement}

			<div style={{ position: "fixed", bottom: 0, padding: 10 }}>
				<Logout handleLogout={props.handleLogout} />
				<button onClick={undo}>Undo</button>
				<button onClick={redo}>Redo</button>

				<GoogleDriveButton Url={Url} />

				<button onClick={() => saveLocal()}>saveLocal</button>
				<button onClick={() => loadLocal()}>loadLocal</button>
				<button onClick={() => handleOpenPicker()}>Open Picker</button>
				<button onClick={() => GetListOfItems()}>Get List From Drive</button>
				<button onClick={() => JonisaveLocal()}>Joni save</button>

			</div>

			{action === "writing" ? (
				<textarea
					ref={textAreaRef}
					onBlur={handleBlur}
					style={{
						position: "fixed",
						top: selectedElement.y1 - 2,
						left: selectedElement.x1,
						font: "24px sans-serif",
						margin: 0,
						padding: 0,
						border: 0,
						outline: 0,
						resize: "auto",
						overflow: "hidden",
						whiteSpace: "pre",
						background: "transparent",
					}}
				/>
			) : null}
			<canvas
				id='canvas'
				width={window.innerWidth}
				height={window.innerHeight}
				onTouchStart={handleMouseDown}
				onTouchMove={handleMouseMove}
				onTouchEnd={handleMouseUp}
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}
				style={{ touchAction: "none", cursor: "crosshair" }}>
				Canvas
			</canvas>
		</div>
	);
};

export default TreediDraw;
