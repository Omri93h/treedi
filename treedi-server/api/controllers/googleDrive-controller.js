const fs = require("fs");
const { google } = require("googleapis");
require("dotenv").config();
const key = process.env.ALGORITHM_KEY;
const encryptor = require('simple-encryptor')(key);

const TOKEN_PATH = "token.json";


async function authAndRunCallback(req, res, callback) {
	fs.readFile("credentials_drive.json", (err, content) => {
		if (err) return console.log("Error loading client secret file:", err);
		// Authorize a client with credentials, then call the Google Drive API.
		const credentials = JSON.parse(content);
		const { client_secret, client_id, redirect_uris } = credentials.web;
		const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
		const token = req.body.token;
		// fs.readFile(TOKEN_PATH, (err, token) => {
			if (!token) {
				console.log("No token authAndRunCallback");
				oAuth2Client
					.getToken(req.query.code)
					.then((response) => {
						oAuth2Client.setCredentials(response.tokens);
						// fs.writeFile(TOKEN_PATH, JSON.stringify(response.tokens), (err) => {
							// if (err) return console.error(err);
							// console.log("Token stored to", TOKEN_PATH);
							callback(oAuth2Client, response.tokens, res);
							console.log("AFTER READ FROM DRIVE");
						// });
					})
					.catch((error) => {
						console.log(error);
					});
			} else {
				oAuth2Client.setCredentials(token);
				callback(oAuth2Client, token, res);
			}
		});
	// });
}

async function getToken(req, res) {
	authAndRunCallback(req, res, (oAuth2Client, token, res) => {
		sendTokenToClient(oAuth2Client, token, res);
	});
}

function sendTokenToClient(oAuth2Client, token, res) {
	res.send(token);
}

async function getFileData(req, res) {
	authAndRunCallback(req, res, (oAuth2Client, token, res) => {
		getData(oAuth2Client, res, req, token);
	});
}

function getData(oAuth2Client, res, req, token) {
	const fileId = req.body.data.fileid;
	const drive = google.drive({ version: "v3", auth: oAuth2Client });
	drive.files.get({ fileId: fileId, alt: "media" }, { responseType: "stream" }, (err, { data }) => {
		if (err) {
			console.log(err);
			return;
		}
		let buf = [];
		data.on("data", (e) => buf.push(e));
		data.on("end", () => {
			const buffer = Buffer.concat(buf);
			let dataToSend = new Buffer.from(buffer).toString();
			console.log("DataToSend:" + dataToSend);
			const decrypted = encryptor.decrypt(dataToSend);
			// Should print 'testing'
			console.log('decrypted: %s', decrypted);
			res.send(decrypted);
		});
	});
}

async function getListFiles(req, res) {
	authAndRunCallback(req, res, (oAuth2Client, token, res) => {
		readListFromDrive(oAuth2Client, token, res);
	});
}

function readListFromDrive(oAuth2Client, token, res) {
	console.log("oAuth2Client", oAuth2Client);
	const drive = google.drive({ version: "v3", auth: oAuth2Client });

	drive.files.list(
		{
			pageSize: 100,
			fields: "nextPageToken, files(id, name)",
		},
		(err, response) => {
			if (err) return console.log("The API returned an error: " + err);
			console.log("response", response);
			const files = response.data.files;
			if (files.length) {
				console.log("Files:");
				files.map((file) => {
					console.log(`${file.name} (${file.id})`);
				});
				res.send(files);
			} else {
				console.log("No files found.");
			}
		}
	);
}

async function createFile(req, res) {
	authAndRunCallback(req, res, (oAuth2Client, token, res) => {
		const fileID = req.body.data["fileId"];
		//console.log(req.body.data);
		console.log("Line 117", fileID);
		if (fileID !== "undefined" && fileID !== null) {
			updateFile(oAuth2Client, res, req, token);
		} else {
			createNewFile(oAuth2Client, res, req, token);
		}
	});
}

async function createNewFile(oAuth2Client, res, req, token) {
	console.log("HEREEEE\n");
	const filePath = req.body.data["fileData"];
	console.log(filePath);
	const encrypted = encryptor.encrypt(filePath);
	// Should print gibberish:
	console.log('encrypted: %s', encrypted);
	const fileName = req.body.data["fileName"];
	const drive = google.drive({ version: "v3", auth: oAuth2Client });
	drive.files.create(
		{
			requestBody: {
				name: fileName + ".trdi",
				mimeType: "text/plain",
			},
			media: {
				mimeType: "text/plain",
				body: encrypted,
			},
		},
		(err, response) => {
			if (err) {
				return console.log("The API returned an error: " + err);
			}

			console.log("responseID", response.data.id);
			if (response.data.id) {
				console.log("The ID of the create file is :", response.data.id);
				res.send(response.data.id);
			} else {
				console.log("Couldnt Create the file.");
			}
		}
	);
}

function updateFile(oAuth2Client, res, req, token) {
	console.log("HEREEEE - UOPDATEETEF");
	const filePath = req.body.data["fileData"];
	const fileId = req.body.data["fileId"];
	const encrypted = encryptor.encrypt(filePath);
	// Should print gibberish:
	console.log('encrypted: %s', encrypted);
	const drive = google.drive({ version: "v3", auth: oAuth2Client });
	drive.files.update(
		{
			fileId: fileId,
			media: {
				mimeType: "text/plain",
				body: encrypted,
			},
		},
		(err, file) => {
			if (err) {
				return console.log("The API returned an error: " + err);
			} else {
				console.log("The File with the ID:", fileId, "Was updated");
				res.send(fileId);
			}
		}
	);
}

async function shareFile(req, res) {
	authAndRunCallback(req, res, (oAuth2Client, token, res) => {
		shareFileWith(oAuth2Client, res, req, token);
	});
}

function shareFileWith(oAuth2Client, res, req, token) {
	let email = req.body.data["email"];
	let fileId = req.body.data["fileId"];
	console.log("EMAIL\n\n" + email + "\n\n");
	var permissions = [
		{
			type: "user",
			role: "writer",
			emailAddress: email,
		},
	];
	const drive = google.drive({ version: "v3", auth: oAuth2Client });
	async.eachSeries(
		permissions,
		function (permission, permissionCallback) {
			drive.permissions.create(
				{
					resource: permission,
					fileId: fileId,
					fields: "id",
				},
				function (err, localRes) {
					if (err) {
						console.error(err);
						permissionCallback(err);
					} else {
						console.log("Permission ID: ", localRes.data.id);
						res.send("success");
						permissionCallback();
					}
				}
			);
		},
		function (err) {
			if (err) {
				// Handle error
				console.error(err);
			} else {
				// All permissions inserted
			}
		}
	);
}

async function HandleLogout(req, res) {
	authAndRunCallback(req, res, (oAuth2Client, token, res) => {
		logout(oAuth2Client, res, token);
	});
}

function logout(oAuth2Client, res, token) {
	console.log("inside the sever");
	// delete file named 'sample.txt'
	// fs.unlink(TOKEN_PATH, function (err) {
		// if (err) throw err;
		// if no error, file has been deleted successfully
		// console.log('File deleted!');
	// });
	res.send("Deleted");
}

module.exports = { getListFiles, createFile, getToken, getFileData, updateFile, shareFile, HandleLogout };
