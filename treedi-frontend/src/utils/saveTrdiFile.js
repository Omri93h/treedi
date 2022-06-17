import { toast } from "react-toastify";
import axios from "axios";
import Notificator from "./Notificator";

const saveTrdiFile = async function (data, fileName, setFileId) {
	try {
		console.log("DATA TO SAVE", data);
		// let params = new URL(document.location).searchParams;
		let email = localStorage.getItem("TreediUserEmail");
		let fileid = localStorage.getItem("fileId");
		console.log("email:", email);
		console.log("FINAL SAVED DATA", data);

		const response = await axios
			// .post("http://localhost:5001/api/googleDrive/save/?email=" + email, {
			.post("https://treedi-346309.oa.r.appspot.com/api/googleDrive/save/?email=" + email, {
				data: {
					fileData: data,
					fileId: fileid,
					fileName: fileName,
				},
			})
			.then((res) => {
				localStorage.setItem("fileId", res.data);
				setFileId(res.data);
				if (res.status == 200) {
					Notificator("save-success");
				} else {
					Notificator("save-error");
				}
			});
	} catch (error) {
		Notificator("save-error");
	}
};

export default saveTrdiFile;
