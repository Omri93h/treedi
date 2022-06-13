import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import rough from "roughjs/bundled/rough.esm";
import getStroke from "perfect-freehand";
import io from "socket.io-client";
// import Socket from "./utils/socket";

const generator = rough.generator();
let Pressure = require("pressure");

const Canvas = (props) => {
	const adjustmentRequired = (type) => ["line", "rectangle"].includes(type);
	const [selectedElement, setSelectedElement] = useState(null);
	const textAreaRef = useRef();

	const [screenToWriteByPressure, setScreenToWriteByPressure] = useState(1);

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

	const [elementsIdOnViewMode, setElementsIdOnViewMode] = useState([]);

	const distance = (a, b) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

	const handleOneScreenToMulti = () => {
		// Handle 1 screen display to Treedi multi-display (return elements to original position)
		const elementsCopy = [...elements];
		let finalElements = [];
		let ids = [...elementsIdOnViewMode];
		elementsCopy.forEach((element) => {
			let elementCopy = {};
			Object.assign(elementCopy, element);
			elementCopy.display = true;
			if (ids.indexOf(elementCopy.id) !== -1 && elementCopy.screen !== 1) {
				if (elementCopy.screen === 2) {
					elementCopy.points.forEach((point) => {
						point.x += window.screen.width;
					});
				} else {
					elementCopy.points.forEach((point) => {
						point.x += window.screen.width * 2;
					});
				}
				ids.splice(ids.indexOf(element.id), 1);
			}
			console.log("setting display true");
			finalElements.push(elementCopy);
		});
		setElementsIdOnViewMode([]);
		setElements(finalElements, true);
		console.log("FINAL ELEMENTS", finalElements);
	};

	useEffect(() => {
		// Decide which elements to display, if user does not has "Treedi" screen
		if (props.screenView === "all") {
			if (elementsIdOnViewMode.length == 0) {
				return; // rendered but state did not changed, stayed on multi screen view
			} else {
				handleOneScreenToMulti(); // init view
			}
		} else {
			const handleMultiScreensToOne = () => {
				// Decide which element to display (when user does not has "Treedi" screen)

				let elementsCopy = [...elements];
				let finalElements = [];
				let newViewMode = [];
				elementsCopy.forEach((element) => {
					let elementCopy = {};
					Object.assign(elementCopy, element);
					if (Number(props.screenView) === elementCopy.screen) {
						switch (elementCopy.screen) {
							case 1:
								elementCopy.display = true;
								if (elementsIdOnViewMode.indexOf(elementCopy.id) === -1) {
									console.log("ADDING ", elementCopy.id);
									newViewMode.push(elementCopy.id);
								}
								break;
							case 2:
								if (elementsIdOnViewMode.indexOf(elementCopy.id) === -1) {
									elementCopy.display = true;

									elementCopy.points.forEach((point) => {
										point.x -= window.screen.width;
									});
									console.log("SETTING ELEMENT 2 !!!!!!!");
									newViewMode.push(elementCopy.id);
								}
								break;
							case 3:
								if (elementsIdOnViewMode.indexOf(elementCopy.id) === -1) {
									elementCopy.display = true;
									elementCopy.points.forEach((point) => {
										point.x -= window.screen.width * 2;
									});
									newViewMode.push(elementCopy.id);
								}
								break;
							default:
								break;
						}
					} else {
						elementCopy.display = false;
						if (elementsIdOnViewMode.indexOf(elementCopy.id) > -1) {
							console.log("element id ", elementCopy.id, " in list!! need to be deleted");
							elementCopy.points.forEach((point) => {
								point.x += window.screen.width * (elementCopy.screen - 1);
							});
							// let filteredList = [...elementsIdOnViewMode]
							// console.log('filteredList:', filteredList)
							// setElementsIdOnViewMode(prevState => [filteredList]);
						}
						console.log(elementCopy.id, " ", elementCopy.display);
					}
					finalElements.push(elementCopy);
				});
				setElementsIdOnViewMode(newViewMode);
				console.log("FINAL ELEMENTS", finalElements);
				setElements(finalElements, true);
			};

			async function startOneScreenViewProcedure() {
				console.log("Procedure started");
				console.log("ASYNC started");

				// await handleOneScreenToMulti(); //Init
				console.log("ASYNC Ended");

				handleMultiScreensToOne();
			}
			startOneScreenViewProcedure();
		}
		if (props.screenView !== "all") props.setScreenToWriteTo(Number(props.screenView));
		else {
			props.setScreenToWriteTo(0);
		}
		props.setPressureMode(false);
		props.setDisplayScreenToWriteTo(true);
	}, [props.screenView]);

	useEffect(() => {
		console.log(props.command);
		if (props.command.clear) {
			clearElements();
		} else if (props.command.undo) {
			undo();
		} else if (props.command.redo) {
			redo();
		} else if (props.command.load) {
			setElements(props.command.load);
		} else if (props.command.live) {
			if (props.command.live.length > 0) {
				let elementToAdd = props.command.live[0];
				let elementsCopy = [...elements];
				if (elementsCopy[0] !== null) {
					const idx = elementsCopy.length - 1;
					if (elementsCopy[idx + 1] !== elementToAdd) {
						elementsCopy[elementToAdd.id] = elementToAdd;
						setElements(elementsCopy);
					}
				}
			}
		}
	}, [props.command]);

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
			case "del":
				return "not-allowed";
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

	const createElement = (id, x1, y1, x2, y2, type, elem_color, screen = 1, display = true) => {
		// Change the 'x' value if need to write to another screen and we are NOT on one screen view mode
		if (props.screenToWriteTo > 1 && Number(props.screenView === "all")) {
			x1 += window.screen.width * (props.screenToWriteTo - 1);
			x2 += window.screen.width * (props.screenToWriteTo - 1);
		}

		//if one screen view mode, then add the element id to the ids on current view
		if (Number(props.screenView) === screen) {
			setElementsIdOnViewMode([...elementsIdOnViewMode, id]);
		}

		switch (type) {
			case "line":
			case "rectangle":
				const roughElement =
					type === "line"
						? generator.line(x1, y1, x2, y2, { stroke: props.color })
						: generator.rectangle(x1, y1, x2 - x1, y2 - y1, { stroke: props.color });
				return { id, x1, y1, x2, y2, type, roughElement, elem_color, screen, display };
			case "pencil":
				return { id, type, points: [{ x: x1, y: y1 }], elem_color, screen, display };
			case "text":
				return { id, type, x1, y1, x2, y2, text: "", elem_color, screen, display };
			default:
				throw new Error(`Type not recognised: ${type}`);
		}
	};

	const handleBlur = (event) => {
		const { id, x1, y1, type } = selectedElement;
		props.setAction("none");

		setSelectedElement(null);
		updateElement(id, x1, y1, null, null, type, { text: event.target.value }, -1);
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
			case "prohibited":
				return null;
				break; // not allowed
			default:
				throw new Error(`Type not recognised: ${type}`);
		}
	};

	useEffect(() => {
		const textArea = textAreaRef.current;
		if (props.action === "writing") {
			textArea.focus();
			textArea.value = selectedElement.text;
		}
	}, [props.action, selectedElement]);
	const drawElement = (roughCanvas, context, element) => {
		if (!element) {
			console.log("ERROR WITH ELEMENT!!!!");
			return;
		}

		if (props.user.email !== props.owner) {
			if (props.readPermission[props.user.email].indexOf(element.screen) === -1) {
				console.log(JSON.stringify(element), "\n");
				return; // Not allowed to read
			} else {
				console.log(JSON.stringify(element), "\n");
			}
		}
		// console.log('Drawing Element\n', element)

		if (!element.display) {
			return;
		}

		switch (element.type) {
			case "line":
				roughCanvas.draw(element.roughElement);
				break;
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
			// case "base64":
			// 	let image = new Image();
			// 	image.onload = function () {
			// 		context.drawImage(image, 0, 0);
			// 	};
			// 	const last_saved_idx = element.image.Screens.length;
			// 	image.src = element.image.Screens[last_saved_idx - 1].Image;
			// 	break;
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
			if (props.action === "writing" && selectedElement.id === element.id) {
				return;
			}
			drawElement(roughCanvas, context, element);
		});
		props.setCurrElements(elements);
	}, [elements, props.action, selectedElement]);

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
					if (props.screenView !== "all") {
						// ADD NOTIFICATION
						console.log("Can't use screen switch buttons on Single Screen Mode!");
					} else if (event.key === "1" || event.key === "2" || event.key === "3") {
						console.log("key " + Number(event.key) + " is pressed");
						props.setScreenToWriteTo(Number(event.key));
						props.setPressureMode(false);
						props.setDisplayScreenToWriteTo(true);
					} else if (event.key === "0") {
						props.setScreenToWriteTo(0);
						props.setPressureMode(true);
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
		switch (type) {
			case "line":
			case "rectangle":
				elementsCopy[id] = createElement(id, x1, y1, x2, y2, type, screen, true);
				break;
			case "pencil":
				elementsCopy[id].points = [...elementsCopy[id].points, { x: x2, y: y2 }];
				break;
			case "text":
				const textWidth = document.getElementById("canvas").getContext("2d").measureText(options.text).width;
				const textHeight = 24;
				elementsCopy[id] = {
					...createElement(id, x1, y1, x1 + textWidth, y1 + textHeight, type, screen, true),
					text: options.text,
				};
				break;
			case "prohibited":
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
		const { nativeEvent } = event;
		let clientY = nativeEvent.offsetY;
		let clientX = nativeEvent.offsetX;

		if (props.tool === "selection" || props.tool === "eraser") {
			let pointedElements = [];
			for (let i = 0; i <= 2; i++) {
				pointedElements.push(getElementAtPosition(clientX + i * window.screen.width, clientY, elements));
			}
			// console.log(pointedElements);
			if (!pointedElements[0] && !pointedElements[1] && !pointedElements[2]) {
				event.target.style.cursor = "default";
			} else {
				switch (props.tool) {
					case "eraser":
						event.target.style.cursor = "not-allowed";
						break;
					case "selection":
						if (pointedElements[0]) {
							event.target.style.cursor = cursorForPosition(pointedElements[0].position);
						} else if (pointedElements[1]) {
							event.target.style.cursor = cursorForPosition(pointedElements[1].position);
						} else {
							event.target.style.cursor = cursorForPosition(pointedElements[2].position);
						}
						break;
					default:
						event.target.style.cursor = "default";
				}
			}
			// pointedElements.forEach((element) => {
			// 	if (!element) {
			// 		event.target.style.cursor = "default";
			// 		return;
			// 	} else if (props.tool === "eraser") {
			// 		event.target.style.cursor = element ? "not-allowed" : "default"; // cursor type for delete
			// 		return;
			// 	} else {
			// 		event.target.style.cursor = element ? cursorForPosition(element.position) : "default";
			// 		return;
			// 	}
			// });
		}
		if (props.action === "drawing") {
			let index = elements.length - 1;
			let { x1, y1 } = elements[index];
			let width = window.screen.width;
			if (event.type == "touchmove") {
				console.log("TOUCHMOVE!");
				if (props.screenToWriteTo > 0) {
					clientX = event.changedTouches[0].clientX;
					x1 += width * (props.screenToWriteTo - 1);
					clientX += width * (props.screenToWriteTo - 1);
					console.log("Touch client x is , ", clientX);
				}
				updateElement(index, x1, y1, event.changedTouches[0].clientX, event.changedTouches[0].clientY, props.tool);
			} else {
				let xPoint = clientX + width;
				console.log("props.screenToWriteTo", props.screenToWriteTo);
				if (props.screenToWriteTo == 0) {
					if (props.pressureValue > 0.33) {
						handleMouseUp(event, false);
						props.setScreenToWriteTo(2);
						index += 1;

						const element = createElement(index, xPoint, clientY, xPoint, clientY, props.tool, props.color, 2, true);
						setElements((prevState) => [...prevState, element]);
						setSelectedElement(element);
						props.setAction(props.tool === "text" ? "writing" : "drawing");
					} else {
						updateElement(index, x1, y1, clientX, clientY, props.tool, "", 1);
					}
				}

				if (props.screenToWriteTo > 0) {
					if (props.screenToWriteTo === 2 && !elementsIdOnViewMode.length) {
						clientX += width;
						updateElement(index, x1, y1, clientX, clientY, props.tool, "", 2);

						if (props.pressureValue > 0.66 && props.pressureMode) {
							props.setScreenToWriteTo(3);
							index += 1;
							const element = createElement(index, xPoint, clientY, xPoint, clientY, props.tool, props.color, 3, true);
							setElements((prevState) => [...prevState, element]);
							setSelectedElement(element);
						}
						if (props.pressureValue < 0.33 && props.pressureMode) {
							props.setScreenToWriteTo(1);
							index += 1;
							const element = createElement(
								index,
								clientX,
								clientY,
								clientX,
								clientY,
								props.tool,
								props.color,
								1,
								true
							);
							setElements((prevState) => [...prevState, element]);
							setSelectedElement(element);
						}
					} else if (props.screenToWriteTo === 3 && !elementsIdOnViewMode.length) {
						clientX += width + width;
						updateElement(index, x1, y1, clientX, clientY, props.tool, "", 3);
					} else {
						updateElement(index, x1, y1, clientX, clientY, props.tool, "", props.screenToWriteTo);
					}
				}
			}
		} else if (props.action === "moving") {
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
		} else if (props.action === "resizing") {
			const { id, type, position, ...coordinates } = selectedElement;
			const { x1, y1, x2, y2 } = resizedCoordinates(clientX, clientY, position, coordinates);
			updateElement(id, x1, y1, x2, y2, type);
		}
	};

	const handleMouseUp = (event, updatePressureValue = true) => {
		const { clientX, clientY } = event;
		const currElement = elements[elements.length - 1];

		// dicard if not allowed
		if (props.screenToWriteTo > 0) {
			if (props.user.email !== props.owner) {
				if (props.editPermission[props.user.email].indexOf(props.screenToWriteTo) === -1) {
					undo();
					console.log("not allowed!!!!!!!!!!!");
				} else {
					props.socket.emit("data", currElement);
				}
			} else {
				props.socket.emit("data", currElement);
			}
		}

		// if Pressure mode
		else if (props.screenToWriteTo == 0) {
			if (screenToWriteByPressure === 1) {
				console.log("screen 1");
				// if not allowed to write to screen 1
				if (props.user.email !== props.owner) {
					if (props.editPermission[props.user.email].indexOf(elements[elements.length - 1].screen) === -1) {
						undo();
						console.log("not allowed");
					} else {
						props.socket.emit("data", currElement);
					}
				} else {
					props.socket.emit("data", currElement);
				}
			} else if (screenToWriteByPressure > 1) {
				let new_elem = { id: currElement.id, type: currElement.type, elem_color: currElement.elem_color, points: [] };
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

				setScreenToWriteByPressure(1);

				if (props.user.email !== props.owner) {
					if (props.editPermission[props.user.email].indexOf(new_elem.screen) === -1) {
						if (!elementToMove) {
							// undo();
							{
							}
						}

						console.log("cant edit this screen");
					} else {
						props.socket.emit("data", new_elem);
					}
				} else {
					props.socket.emit("data", new_elem);
				}
			}
		} else if (selectedElement) {
			if (
				selectedElement.type === "text" &&
				clientX - selectedElement.offsetX === selectedElement.x1 &&
				clientY - selectedElement.offsetY === selectedElement.y1
			) {
				props.setAction("writing");
				return;
			}

			const index = selectedElement.id;
			const { id, type } = elements[index];
			if ((props.action === "drawing" || props.action === "resizing") && adjustmentRequired(type)) {
				const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[index]);
				updateElement(id, x1, y1, x2, y2, type);
			}
		}
		if (props.action === "writing") return;

		props.setAction("none");
		setSelectedElement(null);

		if (updatePressureValue) {
			props.setPressureValue(0);
		}
		if (props.pressureMode) {
			props.setScreenToWriteTo(0);
		}
	};

	const handleMouseDown = (event) => {
		if (props.action === "writing") {
			return;
		}
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
					props.setAction("moving");
				} else {
					props.setAction("resizing");
				}
			}
		} else if (props.tool === "eraser") {
			let element = getElementAtPosition(clientX, clientY, elements);
			if (element) {
				console.log("element\n:", element);
				console.log(elements);
				// elements[element.id] = null;
				setSelectedElement(element);
				const elementsCopy = [...elements];
				elementsCopy.splice(element.id, 1);
				let elementsCopy2 = [];

				let currId = 0;
				elementsCopy.forEach((element) => {
					let eCopy = {};
					Object.assign(eCopy, element);
					eCopy.id = currId;
					elementsCopy2.push(eCopy);
					currId++;
				});

				setElements([...elementsCopy2]);
			}
		} else {
			const id = elements.length;
			const screen = props.screenToWriteTo ? props.screenToWriteTo : screenToWriteByPressure;
			const element = createElement(id, clientX, clientY, clientX, clientY, props.tool, props.color, screen, true);
			setElements((prevState) => [...prevState, element]);
			console.log("rendered at mousedown");
			setSelectedElement(element);
			props.setAction(props.tool === "text" ? "writing" : "drawing");
		}
	};

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

			{props.action === "writing" ? (
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
