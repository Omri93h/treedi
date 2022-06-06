const fs = require("fs");
const { google } = require("googleapis");
require("dotenv").config();
const key = process.env.ALGORITHM_KEY;
const encryptor = require('simple-encryptor')(key);
const async = require('async');
const TOKEN_PATH = "token.json";
const User = require('../../config/user-model');
const mongoose = require('mongoose');
const logger = require('../../lib/logger');



//default authentication callback that will called every api call
async function authAndRunCallback(req, res, callback) {
	fs.readFile("credentials_drive.json", async (err, content) => {
		if (err) return console.log("Error loading client secret file:", err);
		// Authorize a client with credentials, then call the Google Drive API.
		const credentials = JSON.parse(content);
		const { client_secret, client_id, redirect_uris } = credentials.web;
		const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

		console.log(err);
		const code = req.query.code;
		if (code) {
			oAuth2Client
			.getToken(req.query.code)
			.then((response) => {
				oAuth2Client.setCredentials(response.tokens);
				console.log("AUTH:" ,oAuth2Client);
				console.log(req.query)
				let newUser = new User({ _id: mongoose.Types.ObjectId(), email: req.query.email, token: response.tokens });
				newUser.save();
				console.log(newUser);
				callback(oAuth2Client, res);
				
			})
			.catch((error) => {
				console.log(error);
			});
		} else {
			let user = await User.findOne({email: req.query.email});
			oAuth2Client.setCredentials(user.token);
			callback(oAuth2Client, res);
		}
		
			
	});
}

async function getToken(req, res) {
	authAndRunCallback(req, res, (oAuth2Client, res) => {
		sendTokenToClient(oAuth2Client, res);
	});
}
//Send the token to the frontend
function sendTokenToClient(oAuth2Client, res) {
	res.send(oAuth2Client.credentials.access_token);
}

async function getFileData(req, res) {
	authAndRunCallback(req, res, (oAuth2Client, res) => {
		getData(oAuth2Client, res, req);
	});
}
//Send the decrypted rawdata from .trdi file
function getData(oAuth2Client, res, req) {
	//get the fileId from the body
	const fileId = req.body.data.fileid;
	//create drive variable with the auth and version 
	const drive = google.drive({ version: "v3", auth: oAuth2Client });
	//call the API files.get and send the fileID
	drive.files.get({ fileId: fileId, alt: "media" }, { responseType: "stream" }, (err, { data }) => {
		//check if the API returned an error , and if it is , exit the function and print the error
		if (err) {
			console.log(err);
			return;
		}
		let buf = [];
		//get all the encrypted buffer data and push it to an array
		data.on("data", (e) => buf.push(e));
		data.on("end", () => {
			//when finish read the encrypted buffer, joins all buffer objects
			const buffer = Buffer.concat(buf);
			//convert the encrypted buffer varliable to string
			let dataToSend = new Buffer.from(buffer).toString();
			//decrypt the data from the buffer
			const decrypted = encryptor.decrypt(dataToSend);
			//print it just to be sure ;)
			console.log('decrypted: %s', decrypted);
			//send the decrypted data to the frontend 
			res.send(decrypted);
		});
	});
}

async function createFile(req, res) {
	authAndRunCallback(req, res, (oAuth2Client, res) => {
		const fileID = req.body.data["fileId"];
		//trying to get the fileId from the body
		console.log("Line 117", fileID);
		if (fileID !== "undefined" && fileID !== null) 
		{
			//if there is a fileId we need to update an exsiting file and send it to an update function
			updateFile(oAuth2Client, res, req);
		} 
		else 
		{
			createNewFile(oAuth2Client, res, req);
		}
	});
}

async function createNewFile(oAuth2Client, res, req) {
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

function updateFile(oAuth2Client, res, req) {
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
	authAndRunCallback(req, res, (oAuth2Client, res) => {
		shareFileWith(oAuth2Client, res, req);
	});
}

function shareFileWith(oAuth2Client, res, req) {
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
	authAndRunCallback(req, res, (oAuth2Client, res) => {
		logout(oAuth2Client, res);
	});
}

function logout(oAuth2Client, res) {
	console.log("inside the sever");
	// delete file named 'sample.txt'
	fs.unlink(TOKEN_PATH, function (err) {
		if (err) throw err;
		// if no error, file has been deleted successfully
		console.log('File deleted!');
	});
	res.send("Deleted");
}

module.exports = {createFile, getToken, getFileData, updateFile, shareFile, HandleLogout };
