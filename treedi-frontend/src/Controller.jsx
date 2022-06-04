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
				setCommand={props.setCommand}
				setElements={props.setElements}
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


			</div>
		</div>
	);
};

export default Controller;
