import React, { useState, useRef } from "react";
import Controller from "./Controller";
import Canvas from "./Canvas";
import Preload from "./components/Preload";
import getToken from "./utils/getToken";
import ScreenToWriteTo from "./components/ScreenToWriteTo";

import io from "socket.io-client";

getToken();

const App = ({ handleLogout }) => {
	const [user, setUser] = useState({
		name: localStorage.getItem("TreediUserName"),
		email: localStorage.getItem("TreediUserEmail"),
		img: localStorage.getItem("TreediUserImage"),
	});

	const [projectName, setProjectName] = useState("");
	const [owner, setOwner] = useState(user.email);
	const [isDialogOpen, setIsDialogOpen] = useState(true);
	const [readPermission, setReadPermission] = useState({});
	const [editPermission, setEditPermission] = useState({});
	const [screenToWriteTo, setScreenToWriteTo] = useState(-1);
	const [displayScreenToWriteTo, setDisplayScreenToWriteTo] = useState(false);
	const [color, setColor] = useState("black");
	const [tool, setTool] = useState("pencil");
	const [actions, setActions] = useState({});
	const [loadedElement, setLoadedElement] = useState(null);
	const [pressureValue, setPressureValue] = useState(0);
	const [displayPressure, setDisplayPressure] = useState(false);
	const [currElements, setCurrElements] = useState(null);

	const clientId = process.env.REACT_APP_CLIENT_ID;
	const developerKey = process.env.REACT_APP_DEVELOPER_KEY;

	const preload = React.useMemo(
		() => <Preload projectName={projectName} setProjectName={setProjectName} setIsDialogOpen={setIsDialogOpen} />,
		[]
	);

	const divScreenToWriteTo = (
		<ScreenToWriteTo screenToWriteTo={screenToWriteTo} setDisplayScreenToWriteTo={setDisplayScreenToWriteTo} />
	);

	// const { current: canvasDetails } = useRef({ socketUrl: "/" });

	const sendElementToSocket = (element) => {
		
		const socket = io("http://localhost:4001");
		socket.on("connection");
		// const sendElement = () => {
		socket.emit("element", "Got it form the Front");
		// };
		// canvasDetails.socketUrl = "http://localhost:4000/";
		// canvasDetails.socket = io.connect(canvasDetails.socketUrl);
		// console.log(canvasDetails);
		// console.log(canvasDetails.socket);
		//console.log('inside socket useEffect')
		try {
			console.log("Inside the try");
			console.log(element)
			socket = io.connect(4001,'localhost', () => {
				console.log("connecting to server");
			});

		} catch {
			console.log("Cant connect");
		}
		console.log('outside try')
		socket.on("addElement", (data) => {
			// const image = new Image();
			console.log("On onnnnn");
			console.log(data);
			// const canvas = document.getElementById("canvas");
			// const context = canvas.getContext("2d");
			// image.src = data;
			// image.addEventListener("load", () => {
			// 	context.drawImage(image, 0, 0);
			// });
		});
	};

	return (
		<div style={{ backgroundColor: "#f0f0f0" }}>
			{preload}

			{displayScreenToWriteTo ? divScreenToWriteTo : null}
			<button onClick={() => sendElementToSocket(currElements[currElements.length - 1])}>Send Element</button>
			<Controller
				user={user}
				projectName={projectName}
				setColor={setColor}
				color={color}
				setActions={setActions}
				displayPressure={displayPressure}
				pressureValue={pressureValue}
				setTool={setTool}
				readPermission={readPermission}
				setEditPermission={setEditPermission}
				setReadPermission={setReadPermission}
				editPermission={editPermission}
				setIsDialogOpen={setIsDialogOpen}
				handleLogout={handleLogout}
				setLoadedElement={setLoadedElement}
				elements={currElements}
				setOwner={setOwner}
			/>

			<Canvas
				setDisplayPressure={setDisplayPressure}
				loadedElement={loadedElement}
				readPermission={readPermission}
				editPermission={editPermission}
				isDialogOpen={isDialogOpen}
				tool={tool}
				owner={owner}
				user={user}
				setCurrElements={setCurrElements}
				setDisplayScreenToWriteTo={setDisplayScreenToWriteTo}
				color={color}
				screenToWriteTo={screenToWriteTo}
				setScreenToWriteTo={setScreenToWriteTo}
				actions={actions}
				setPressureValue={setPressureValue}
			/>
			
		</div>
	);
};

export default App;
