import { toast } from "react-toastify";
import axios from "axios";

const loadTrdiDriveFile = async function (fileID) {
	toast.info("Loading File ...", {
		position: "bottom-left",
		autoClose: 2000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
	});
	let params = new URL(document.location).searchParams;
	// let code = params.get("code");

	let email = localStorage.getItem("TreediUserEmail");
	let res = {};
	try {
		res = await axios
			// .post("http://localhost:5001/api/googleDrive/getFileData/?email=" + email, {
			.post("https://treedi-346309.oa.r.appspot.com/api/googleDrive/getFileData/?email=" + email, {
				data: {
					fileid: fileID,
				},
			})
			.then((res) => {
				console.log('res OK')
				if (res.status === 200) {
					console.log("LOADED DATA:", res.data);
					toast.success("Loaded successfully", {
						position: "bottom-left",
						autoClose: 5000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
					});
					return res
				} else {
					toast.error("Could not load file", {
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
		return res;
	} catch (error) {
		console.log('ERROR RES')
		res["status"] = 401;
		toast.error("Load error", {
			position: "bottom-left",
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
		});

		return res;
	}
};

export default loadTrdiDriveFile;
