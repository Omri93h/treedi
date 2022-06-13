import axios from "axios";

const getToken = async function () {
	let params = new URL(document.location).searchParams;
	let code = params.get("code");
	if (code) {
		try {
			const email = localStorage.getItem('TreediUserEmail');
			// const res = await axios.get("http://localhost:5001/api/googleDrive/getToken/?code=" + code + "&email="+ email);
			const res = await axios.get("https://treedi-346309.oa.r.appspot.com/api/googleDrive/getToken/?code=" + code + "&email="+ email);
			console.log('ACCESS TOKEN RESPONSE\n',res.data);
			localStorage.setItem("TOKEN", res.data);
			if (res.ok) {
				console.log("OK");
			}
		} catch (error) {
			console.log(`error - GetToken - ${error}`);
		}
	}
};

export default getToken;
