import React from "react";
import Logout from "./components/Logout";
import TreediMenuBar from "./components/TreediMenuBar";

const Controller = (props) => {
	return (
		<div style={{ position: "absolute" }}>
			<TreediMenuBar
				setFileId={props.setFileId}
				user={props.user}
				projectName={props.projectName}
				setTool={props.setTool}
				color={props.color}
				elements={props.elements}
				setColor={props.setColor}
				setActions={props.setActions}
				setElements={props.setElements}
				displayPressure={props.displayPressure}
				pressureValue={props.pressureValue}
				readPermission={props.readPermission}
				setReadPermission={props.setReadPermission}
				editPermission={props.editPermission}
				setEditPermission={props.setEditPermission}
				setIsDialogOpen={props.setIsDialogOpen}
				setLoadedElement={props.setLoadedElement}
				setOwner={props.setOwner}
			/>

			<div style={{ position: "fixed", bottom: 0 }}>
				<Logout handleLogout={props.handleLogout} />

				<button
					onClick={() => {
						props.setActions({ clear: true });
					}}>
					clear elements
				</button>
			</div>
		</div>
	);
};

export default Controller;
