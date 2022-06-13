function getTrdiFileData(owner, fileName, elements, readPermission, editPermission) {
	let data_format = {
		FileName: fileName,
		Owner: owner,
		Elements: elements,
		LastModified: new Date().toLocaleString(),
		ReadPermission: readPermission,
		EditPermission: editPermission,
	};
	const data = JSON.stringify(data_format);
	return data;
}

export default getTrdiFileData;
