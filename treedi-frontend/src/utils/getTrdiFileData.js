function getTrdiFileData(user, fileName, elements, readPermission, editPermission) {
	// var canvas = document.querySelector("canvas");
	// var dataURL = canvas.toDataURL("image/png", 1.0);
	let data_format = {
		FileName: fileName,
		Owner: user["email"],
		Elements: elements,
		LastModified: new Date().toLocaleString(),
		ReadPermission: readPermission,
		EditPermission: editPermission,
	};
	const data = JSON.stringify(data_format);
	return data;
}

export default getTrdiFileData;
