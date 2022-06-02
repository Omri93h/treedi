import React, { useState, useEffect, useRef } from "react";
import Controller from "./Controller";
import Canvas from "./Canvas";
import Preload from "./components/Preload";
import getToken from "./utils/getToken";
import ScreenToWriteTo from "./components/ScreenToWriteTo";
import io from "socket.io-client";
import getTrdiFileData from "./utils/getTrdiFileData";

getToken();

const App = ({ handleLogout }) => {
	console.log("APP IS rendered");
	const user = useRef({
		name: localStorage.getItem("TreediUserName"),
		email: localStorage.getItem("TreediUserEmail"),
		img: localStorage.getItem("TreediUserImage"),
	});

	const projectName = useRef("");
	function setProjectName(ref) {
		projectName.current = ref;
	}

	const owner = useRef(user.current.email);

	function setOwner(ref) {
		owner.current = ref;
	}

	const isDialogOpen = useRef(true);
	function setIsDialogOpen(ref) {
		isDialogOpen.current = ref;
	}

	const [readPermission, setReadPermission] = useState({});
	const [editPermission, setEditPermission] = useState({});
	const [screenToWriteTo, setScreenToWriteTo] = useState(0);
	const [displayScreenToWriteTo, setDisplayScreenToWriteTo] = useState(false);
	const [color, setColor] = useState("black");
	const [tool, setTool] = useState("pencil");
	const [actions, setActions] = useState({});
	const [loadedElement, setLoadedElement] = useState(null);

	const [pressureValue, setPressureValue] = useState(0);

	const displayPressure = useRef(false);
	function setDisplayPressure(ref) {
		displayPressure.current = ref;
	}

	const currElements = useRef(null);
	function setCurrElements(ref) {
		currElements.current = ref;
	}

	const liveApi = useRef(false);

	function setLiveApi(ref) {
		liveApi.current = ref;
	}
	const socket = useRef(null);
	function setSocket(ref) {
		socket.current = ref;
	}

	const clientId = process.env.REACT_APP_CLIENT_ID;
	const developerKey = process.env.REACT_APP_DEVELOPER_KEY;

	const preload = React.useMemo(
		() => (
			<Preload projectName={projectName.current} setProjectName={setProjectName} setIsDialogOpen={setIsDialogOpen} />
		),
		[]
	);

	const divScreenToWriteTo = (
		<ScreenToWriteTo screenToWriteTo={screenToWriteTo} setDisplayScreenToWriteTo={setDisplayScreenToWriteTo} />
	);

	// const { current: canvasDetails } = useRef({ socketUrl: "/" });

	// socket.current.on("time", function (data) {
	// 	console.log("here data\n", data, "\n");
	// 	console.log(currElements);
	// 	socket.current.emit({ elem: currElements });
	// });

	useEffect(() => {
		function initSocket() {
			if (socket.current) {
				console.log("inside init socket.current");
				setLiveApi(true);
				socket.current.on("welcome", function (data) {
					console.log("DATA::::", data);
					// Respond with a message including this clients' id sent from the server
					socket.current.emit("i am client", { data: "foo!", id: data.id });
				});
				socket.current.on("data", (data) => {
					console.log("data recaived:", data);
					if (data) {
						setActions({ live: [data] });
					}
				});
			}
		}

		if (!liveApi.current) {
			setSocket(io("http://localhost:4001"));
			initSocket();
			console.log("sending socket.current!");
		}
	}, [socket.current]);

	const sendElementToSocket = () => {
		socket.current.emit("data", currElements.current[currElements.ref.length - 1]);
	};

	// useEffect(() => {
	// 	if (currElements) {
	// 		if (currElements[0] !== null) {
	// 			console.log('now should be sent')
	// 			// socket.current.emit("data", currElements[currElements.length - 1]);
	// 		}
	// 	}
	// }, [currElements]);

	return (
		<div style={{ backgroundColor: "#f0f0f0" }}>
			{preload}

			{displayScreenToWriteTo ? divScreenToWriteTo : null}
			<Controller
				user={user.current}
				projectName={projectName.current}
				setColor={setColor}
				color={color}
				setActions={setActions}
				displayPressure={displayPressure.current}
				pressureValue={pressureValue}
				setTool={setTool}
				readPermission={readPermission}
				setEditPermission={setEditPermission}
				setReadPermission={setReadPermission}
				editPermission={editPermission}
				setIsDialogOpen={setIsDialogOpen}
				handleLogout={handleLogout}
				setLoadedElement={setLoadedElement}
				elements={currElements.ref}
				setOwner={setOwner}
			/>
			<button style={{ position: "absolute", bottom: "50px", left: "200px" }} onClick={() => sendElementToSocket()}>
				Send Element
			</button>

			<Canvas
				socket={socket.current}
				setDisplayPressure={setDisplayPressure}
				loadedElement={loadedElement}
				readPermission={readPermission}
				editPermission={editPermission}
				isDialogOpen={isDialogOpen.current}
				tool={tool}
				owner={owner.current}
				user={user.current}
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
