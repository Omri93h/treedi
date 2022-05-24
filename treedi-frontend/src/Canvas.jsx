import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import rough from "roughjs/bundled/rough.esm";
import getStroke from "perfect-freehand";
import io from "socket.io-client";
const generator = rough.generator();
let Pressure = require("pressure");

const Canvas = (props) => {
	const adjustmentRequired = (type) => ["line", "rectangle"].includes(type);
	const [action, setAction] = useState("none");
	const [selectedElement, setSelectedElement] = useState(null);
	const textAreaRef = useRef();

	const [screenToWriteByPressure, setScreenToWriteByPressure] = useState(0);

	const [elementToMove, setElementToMove] = useState(null);

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
		const clearElements = () => {
			console.log("clearing elements");
			setIndex(0);
			setHistory([[]]);
		};
		const undo = () => index > 0 && setIndex((prevState) => prevState - 1);
		const redo = () => index < history.length - 1 && setIndex((prevState) => prevState + 1);
		return [history[index], setState, undo, redo, clearElements];
	};

	const [elements, setElements, undo, redo, clearElements] = useHistory([]);

	const distance = (a, b) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
	useEffect(() => {
		console.log(props.actions);
		if (props.actions.clear) {
			clearElements();
		} else if (props.actions.undo) {
			undo();
		} else if (props.actions.redo) {
			redo();
		} else if (props.actions.load) {
			setElements(props.actions.load);

			// props.actions.load.forEach((element) => {
			// 	console.log(element);
			// 	setElements([element]);
			// });
			// console.log()
		}
	}, [props.actions]);

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

	const createElement = (id, x1, y1, x2, y2, type, elem_color, screen = 1) => {
		if (props.screenToWriteTo > 0) {
			x1 += window.screen.width * props.screenToWriteTo;
			x2 += window.screen.width * props.screenToWriteTo;
		}
		switch (type) {
			case "line":
			case "rectangle":
				const roughElement =
					type === "line"
						? generator.line(x1, y1, x2, y2, { stroke: props.color })
						: generator.rectangle(x1, y1, x2 - x1, y2 - y1, { stroke: props.color });
				return { id, x1, y1, x2, y2, type, roughElement, elem_color, screen };
			case "pencil":
				return { id, type, points: [{ x: x1, y: y1 }], elem_color, screen };
			case "text":
				return { id, type, x1, y1, x2, y2, text: "", elem_color, screen };
			default:
				throw new Error(`Type not recognised: ${type}`);
		}
	};

	const handleBlur = (event) => {
		const { id, x1, y1, type } = selectedElement;
		setAction("none");
		setSelectedElement(null);
		updateElement(id, x1, y1, null, null, type, { text: event.target.value });
	};

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

	useEffect(() => {
		const textArea = textAreaRef.current;
		if (action === "writing") {
			textArea.focus();
			textArea.value = selectedElement.text;
		}
	}, [action, selectedElement]);
	const drawElement = (roughCanvas, context, element) => {
		switch (element.type) {
			case "line":
			case "rectangle":
				roughCanvas.draw(element.roughElement);
				break;
			case "pencil":
				const stroke = getSvgPathFromStroke(getStroke(element.points));
				context.fillStyle = element.elem_color;
				const path = new Path2D(stroke);
				context.fill(path);
				break;
			case "text":
				context.textBaseline = "top";
				context.font = "24px sans-serif";
				context.fillText(element.text, element.x1, element.y1);
				break;
			case "base64":
				let image = new Image();
				image.onload = function () {
					context.drawImage(image, 0, 0);
				};
				const last_saved_idx = element.image.Screens.length;
				image.src = element.image.Screens[last_saved_idx - 1].Image;
				// element.image.Screens.forEach((img) => {
				// 	image.src = img.Image
				// })
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
		props.setCurrElements(elements);
	}, [elements, action, selectedElement]);

	useEffect(() => {
		const undoRedoFunction = (event) => {
			if ((event.metaKey || event.ctrlKey) && event.key === "z") {
				if (event.shiftKey) {
					redo();
				} else {
					undo();
				}
			} else {
				if (!props.isDialogOpen) {
					if (event.key === "1" || event.key === "2" || event.key === "3" || event.key === "0") {
						console.log("key " + Number(event.key - 1) + " is pressed");
						props.setScreenToWriteTo(Number(event.key - 1));
						props.setDisplayScreenToWriteTo(true);
					}
				}
			}
		};

		document.addEventListener("keydown", undoRedoFunction);
		return () => {
			document.removeEventListener("keydown", undoRedoFunction);
		};
	}, [undo, redo]);
	const updateElement = (id, x1, y1, x2, y2, type, options, screen) => {
		const elementsCopy = [...elements];
		// const elementsCopy = null;

		switch (type) {
			case "line":
			case "rectangle":
				elementsCopy[id] = createElement(id, x1, y1, x2, y2, type, screen);
				break;
			case "pencil":
				elementsCopy[id].points = [...elementsCopy[id].points, { x: x2, y: y2 }];
				break;
			case "text":
				const textWidth = document.getElementById("canvas").getContext("2d").measureText(options.text).width;
				const textHeight = 24;
				elementsCopy[id] = {
					...createElement(id, x1, y1, x1 + textWidth, y1 + textHeight, type, screen),
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
			props.setPressureValue(force);
			if (force > 0.33 && force <= 0.66) {
				setScreenToWriteByPressure(2);
			} else if (force > 0.66) {
				setScreenToWriteByPressure(3);
			}
		},
	});
	const handleMouseMove = (event) => {
		const canvas = document.querySelector("canvas");
		const ctx = canvas.getContext("2d");
		const { nativeEvent } = event;
		let clientY = nativeEvent.offsetY;
		let clientX = nativeEvent.offsetX;

		if (props.tool === "selection") {
			let element = getElementAtPosition(clientX, clientY, elements);
			event.target.style.cursor = element ? cursorForPosition(element.position) : "default";
		}
		if (action === "drawing") {
			const index = elements.length - 1;
			let { x1, y1 } = elements[index];
			let width = window.screen.width;
			if (event.type == "touchmove") {
				console.log("TOUCHMOVE!");
				if (props.screenToWriteTo > 0) {
					x1 += width * props.screenToWriteTo;
					clientX = event.changedTouches[0].clientX;
					clientX += width * props.screenToWriteTo;
					console.log("Touch client x is , ", clientX);
				}
				updateElement(index, x1, y1, event.changedTouches[0].clientX, event.changedTouches[0].clientY, props.tool);
			} else {
				if (props.screenToWriteTo == 1) {
					clientX += width;
					updateElement(index, x1, y1, clientX, clientY, props.tool, 2);
				} else if (props.screenToWriteTo == 2) {
					clientX += width + width;
					updateElement(index, x1, y1, clientX, clientY, props.tool, 3);
				} else {
					updateElement(index, x1, y1, clientX, clientY, props.tool, 1);
				}
			}
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
		props.setDisplayPressure(false);
		const { clientX, clientY } = event;

		if (props.screenToWriteTo == -1) {
			if (screenToWriteByPressure > 1) {
				const currElement = elements[elements.length - 1];
				const new_elem = { id: currElement.id, type: currElement.type, elem_color: currElement.elem_color, points: [] };
				new_elem["screen"] = screenToWriteByPressure;
				let width = window.screen.width;
				if (screenToWriteByPressure == 2) {
					for (const i in currElement.points) {
						new_elem.points.push({
							x: currElement.points[i].x + width,
							y: currElement.points[i].y,
						});
					}
				} else {
					for (const i in currElement.points) {
						new_elem.points.push({
							x: currElement.points[i].x + width * 2,
							y: currElement.points[i].y,
						});
					}
				}
				undo();
				setElementToMove(new_elem);
				setScreenToWriteByPressure(0);
			}
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
			}
		}
		if (action === "writing") return;

		setAction("none");
		setSelectedElement(null);
	};

	const handleMouseDown = (event) => {
		if (action === "writing") return;

		const { nativeEvent } = event;
		const clientY = nativeEvent.offsetY;
		const clientX = nativeEvent.offsetX;
		if (props.tool === "selection") {
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
			if (props.tool == "pencil" || props.tool == "rectangle") {
				props.setDisplayPressure(true);
			}
			const id = elements.length;
			const element = createElement(id, clientX, clientY, clientX, clientY, props.tool, props.color);
			setElements((prevState) => [...prevState, element]);
			setSelectedElement(element);
			setAction(props.tool === "text" ? "writing" : "drawing");
		}
	};

	const { current: canvasDetails } = useRef({ color: "green", socketUrl: "http://localhost:8000/" });

	useEffect(() => {
		// console.log('client env', process.env.NODE_ENV)
		// if (process.env.NODE_ENV === 'development') {
		//
		// }
		canvasDetails.socketUrl = "http://localhost:8000/";

		console.log("inside socket useEffect");
		try {
			canvasDetails.socket = io.connect(canvasDetails.socketUrl, () => {
				console.log("connecting to server");
			});
		} catch {
			console.log("Cant connect");
		}
		canvasDetails.socket.on("image-data", (data) => {
			console.log('Doing something with the socket')
			// const image = new Image();
			// const canvas = document.getElementById("canvas");
			// const context = canvas.getContext("2d");
			// image.src = data;
			// image.addEventListener("load", () => {
			// 	context.drawImage(image, 0, 0);
			// });
		});
	}, []);

	return (
		<>
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
		</>
	);
};

export default Canvas;
