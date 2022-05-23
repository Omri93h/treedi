import React, { useState } from "react";
import Controller from "./Controller";
import Canvas from "./Canvas";
import Preload from "./components/Preload";
import getToken from "./utils/getToken";
import ScreenToWriteTo from "./components/ScreenToWriteTo";

getToken();

const App = ({ handleLogout }) => {
	const [user, setUser] = useState({
		name: localStorage.getItem("TreediUserName"),
		email: localStorage.getItem("TreediUserEmail"),
		img: localStorage.getItem("TreediUserImage"),
	});

	const [projectName, setProjectName] = useState("");
	const [isDialogOpen, setIsDialogOpen] = useState(true);
	const [readPermission, setReadPermission] = useState(Array());
	const [editPermission, setEditPermission] = useState(Array());
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

	return (
		<div style={{ backgroundColor: "#f0f0f0" }}>
			{preload}

			{displayScreenToWriteTo ? divScreenToWriteTo  : null}

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
			/>

			<Canvas
				setDisplayPressure={setDisplayPressure}
				loadedElement={loadedElement}
				readPermission={readPermission}
				editPermission={editPermission}
				isDialogOpen={isDialogOpen}
				tool={tool}
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
