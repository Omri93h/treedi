import { toast } from "react-toastify";
import axios from "axios";

const saveTrdiFile = async function (data, fileName) {
	try {
		console.log(data)
		let params = new URL(document.location).searchParams;
		let code = params.get("code");
		let fileid = localStorage.getItem("fileId");
		console.log("CODE:", code);
		const response = await axios
			.post("http://localhost:5001/api/googleDrive/save/?code=" + code, {
				data: {
					fileData: data,
					fileId: fileid,
					fileName: fileName,
				},
			})
			.then((res) => {
				console.log(res)
				localStorage.setItem("fileId", res.data);
				if (res.status == 200) {
					toast.success("Saved successfully", {
						position: "bottom-left",
						autoClose: 5000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
					});
				} else {
					toast.error("Could not save file", {
						position: "bottom-left",
						autoClose: 5000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
					});
				}
			});
	} catch (error) {
		toast.error("Save error", {
			position: "bottom-left",
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
		});
	}
};


export default saveTrdiFile;