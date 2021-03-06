import React from "react";
import TreediMenuBar from "./components/TreediMenuBar";

const Controller = (props) => {
	return (
		<div style={{ position: "absolute" }}>
			<TreediMenuBar
				setProjectName={props.setProjectName}
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
				handleLogout={props.handleLogout}
				elementsIdOnViewMode={props.elementsIdOnViewMode}
				setScreenView={props.setScreenView}
				setScreenToWriteTo={props.setScreenToWriteTo}
				owner={props.owner}
			/>
		</div>
	);
};

export default Controller;
