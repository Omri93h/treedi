import React, { useState, useEffect, useRef } from "react";
import Controller from "./Controller";
import Canvas from "./Canvas";
import Preload from "./components/Preload";
import getToken from "./utils/getToken";
import ScreenToWriteTo from "./components/ScreenToWriteTo";
import io from "socket.io-client";
import PressureSlider from "./components/PressureSlider";
import { Fade } from "@mui/material";
getToken();

const App = ({ handleLogout }) => {
	const [fileId, setFileId] = useState(null);
	const [elementsIdOnViewMode, setElementsIdOnViewMode] = useState([]);

	let user = useRef({
		name: localStorage.getItem("TreediUserName"),
		email: localStorage.getItem("TreediUserEmail"),
		img: localStorage.getItem("TreediUserImage"),
	});

	const [action, setAction] = useState("none");

	const [screenView, setScreenView] = useState("all");

	const [projectName, setProjectName] = useState(null);

	const [owner, setOwner] = useState(user.current.email);

	const [isDialogOpen, setIsDialogOpen] = useState(true);

	const [readPermission, setReadPermission] = useState({});
	const [editPermission, setEditPermission] = useState({});
	const [screenToWriteTo, setScreenToWriteTo] = useState(0);
	const [displayScreenToWriteTo, setDisplayScreenToWriteTo] = useState(false);
	const [color, setColor] = useState("black");
	const [tool, setTool] = useState("pencil");
	const [command, setCommand] = useState({});
	const [loadedElement, setLoadedElement] = useState(null);

	const [pressureValue, setPressureValue] = useState(0);
	const [pressureMode, setPressureMode] = useState(true);

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

	const preload = React.useMemo(
		() => <Preload setProjectName={setProjectName} setIsDialogOpen={setIsDialogOpen} />,
		[]
	);

	const divScreenToWriteTo = (
		<ScreenToWriteTo
			user={user.current}
			owner={owner}
			screenToWriteTo={screenToWriteTo}
			setDisplayScreenToWriteTo={setDisplayScreenToWriteTo}
			editPermission={editPermission}
		/>
	);

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
					console.log("data received:", data);
					if (data) {
						setCommand({ live: [data] });
					}
				});
			}
		}

		if (!liveApi.current) {
			console.log("error here");
			setSocket(io("https://treedi-socket.oa.r.appspot.com"));
			initSocket();
			console.log("sending socket!");
		}
	}, [socket.current]);

	useEffect(() => {
		if (fileId) {
			console.log("Creating Room, fileID:\n", fileId);
			socket.current.emit("create", fileId);
		} else {
			console.log("NO FILE IDDDDDD");
		}
	}, [fileId]);



	const sendElementToSocket = () => {
		socket.current.emit("data", currElements.current[currElements.ref.length - 1]);
	};

	return (
		<div id='app' style={{ overflow: "hidden" }}>
			{preload}

			{displayScreenToWriteTo ? divScreenToWriteTo : null}

			<Fade in={action === "none" ? true : false} timeout={250}>
				<span>
					<Controller
						owner={owner}
						user={user.current}
						setFileId={setFileId}
						setProjectName={setProjectName}
						projectName={projectName}
						setColor={setColor}
						color={color}
						setCommand={setCommand}
						pressureValue={pressureValue}
						setTool={setTool}
						readPermission={readPermission}
						setEditPermission={setEditPermission}
						setReadPermission={setReadPermission}
						editPermission={editPermission}
						setIsDialogOpen={setIsDialogOpen}
						handleLogout={handleLogout}
						setLoadedElement={setLoadedElement}
						elements={currElements.current}
						setOwner={setOwner}
						elementsIdOnViewMode={elementsIdOnViewMode}
						setScreenView={setScreenView}
					/>
				</span>
			</Fade>

			<PressureSlider
				// isMobile={isMobile.current}
				pressureValue={pressureValue}
				screenToWriteTo={screenToWriteTo}
				pressureMode={pressureMode}
			/>

			<Canvas
				screenView={screenView}
				action={action}
				setAction={setAction}
				pressureValue={pressureValue}
				socket={socket.current}
				loadedElement={loadedElement}
				readPermission={readPermission}
				editPermission={editPermission}
				isDialogOpen={isDialogOpen}
				tool={tool}
				owner={owner}
				user={user.current}
				setCurrElements={setCurrElements}
				setDisplayScreenToWriteTo={setDisplayScreenToWriteTo}
				color={color}
				screenToWriteTo={screenToWriteTo}
				setScreenToWriteTo={setScreenToWriteTo}
				command={command}
				setPressureValue={setPressureValue}
				pressureMode={pressureMode}
				setPressureMode={setPressureMode}
				setElementsIdOnViewMode={setElementsIdOnViewMode}
				elementsIdOnViewMode={elementsIdOnViewMode}
			/>
		</div>
	);
};

export default App;
