import React, { useState, useEffect } from "react";
import Controller from "./Controller";
import Canvas from "./Canvas";
import Preload from "./components/Preload";
import getToken from "./utils/getToken";
import ScreenToWriteTo from "./components/ScreenToWriteTo";
import io from "socket.io-client";
import getTrdiFileData from "./utils/getTrdiFileData";

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
	const [screenToWriteTo, setScreenToWriteTo] = useState(0);
	const [displayScreenToWriteTo, setDisplayScreenToWriteTo] = useState(false);
	const [color, setColor] = useState("black");
	const [tool, setTool] = useState("pencil");
	const [actions, setActions] = useState({});
	const [loadedElement, setLoadedElement] = useState(null);
	const [pressureValue, setPressureValue] = useState(0);
	const [displayPressure, setDisplayPressure] = useState(false);
	const [currElements, setCurrElements] = useState(null);
	const [liveApi, setLiveApi] = useState(false);
	const [socket, setSocket] = useState(null);
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

	// socket.on("time", function (data) {
	// 	console.log("here data\n", data, "\n");
	// 	console.log(currElements);
	// 	socket.emit({ elem: currElements });
	// });

	useEffect(() => {
		function initSocket() {
			if (socket) {
				console.log("inside init socket");
				setLiveApi(true);
				socket.on("welcome", function (data) {
					console.log("DATA::::", data);
					// Respond with a message including this clients' id sent from the server
					socket.emit("i am client", { data: "foo!", id: data.id });
				});
				socket.on("data", (data) => {
					console.log("data recaived:", data);
					if (data) {
						setActions({ live: [data] });
					}
				});
			}
		}

		if (!liveApi) {
			setSocket(io("http://localhost:4001"));
			initSocket();
		}
	}, [socket]);

	const sendElementToSocket = () => {
		socket.emit("data", currElements[currElements.length - 1]);
	};

	// useEffect(() => {
	// 	if (currElements) {
	// 		if (currElements[0] !== null) {
	// 			console.log('now should be sent')
	// 			// socket.emit("data", currElements[currElements.length - 1]);
	// 		}
	// 	}
	// }, [currElements]);

	return (
		<div style={{ backgroundColor: "#f0f0f0" }}>
			{preload}

			{displayScreenToWriteTo ? divScreenToWriteTo : null}
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
			<button style={{ position: "absolute", bottom: "50px", left: "200px" }} onClick={() => sendElementToSocket()}>
				Send Element
			</button>

			<Canvas
			socket={socket}
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
