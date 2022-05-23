function getTrdiFileData(user, fileName) {
	var canvas = document.querySelector("canvas");
	var dataURL = canvas.toDataURL("image/png", 1.0);
	let data_format = {
		FileName: "",
		Owner: "",
		Screens: [],
		LastModified: "",
	};
	data_format.FileName = fileName;
	data_format.LastModified = new Date().toLocaleString();
	data_format.Owner = user["name"];
	data_format.Screens.push({ Image: dataURL, LastModified: new Date().toLocaleString() });
	const data = JSON.stringify(data_format);
	return data;
}

export default getTrdiFileData;
