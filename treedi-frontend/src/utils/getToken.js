import axios from "axios";

const getToken = async function () {
	let params = new URL(document.location).searchParams;
	let code = params.get("code");
	try {
		const res = await axios.get("http://localhost:5001/api/googleDrive/getToken/?code=" + code);
		console.log('ACCESS TOKEN RESPONSE\n',res.data);
		localStorage.setItem("TOKEN", res.data);
		if (res.ok) {
			console.log("OK");
		}
	} catch (error) {
		console.log(`error - GetToken - ${error}`);
	}
};

export default getToken;
