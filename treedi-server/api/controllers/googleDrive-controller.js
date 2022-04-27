const fs = require('fs');
const { google } = require('googleapis');
const LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch')
require('dotenv').config();
const SCOPES = ['https://www.googleapis.com/auth/drive'];
const TOKEN_PATH = 'token.json';

async function authAndRunCallback(req, res, callback) {
  fs.readFile('credentials_drive.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Drive API.
    const credentials = JSON.parse(content);
    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);
      fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) {
          console.log(err)
          oAuth2Client.getToken(req.query.code).then(response => {
            oAuth2Client.setCredentials(response.tokens);
            fs.writeFile(TOKEN_PATH, JSON.stringify(response.tokens), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
                callback(oAuth2Client, res);
                console.log("AFTER READ FROM DRIVE")
              });
          }).catch(error => {
            console.log(error);
          })
        }
        else {
          console.log("token is ", JSON.parse(token));
          oAuth2Client.setCredentials(JSON.parse(token));
          callback(oAuth2Client, res);
        }

      });
    
  });
}



async function getToken(req, res) {
  authAndRunCallback(req, res, (oAuth2Client, res) => {
    sendTokenToClient(oAuth2Client, res)
  });
}

function sendTokenToClient(oAuth2Client, res) {
  console.log("Entered");
  console.log(oAuth2Client.credentials.access_token)
  res.send(oAuth2Client.credentials.access_token);
}








async function getListFiles(req, res) {
  authAndRunCallback(req, res, (oAuth2Client, res) => {
    readListFromDrive(oAuth2Client, res)
  });
}



function readListFromDrive(oAuth2Client, res) {
  console.log("oAuth2Client", oAuth2Client);
  const drive = google.drive({ version: 'v3', auth: oAuth2Client });

  drive.files.list({
    pageSize: 100,
    fields: 'nextPageToken, files(id, name)',
  }, (err, response) => {
    if (err)
      return console.log('The API returned an error: ' + err);
      console.log("response", response);
    const files = response.data.files;
    if (files.length) {
      console.log('Files:');
      files.map((file) => {
        console.log(`${file.name} (${file.id})`);
      });
      res.send(files);

    } else {
      console.log('No files found.');
    }
  });
}



async function createFile(req, res) {
  authAndRunCallback(req, res, (oAuth2Client, res) => {
    createNewFile(oAuth2Client, res,req)
  });
}

async function createNewFile(oAuth2Client, res,req) {
  const filePath = req.body.data["Url"];
  const drive = google.drive({ version: 'v3', auth: oAuth2Client });
  drive.files.create({
    requestBody: {
      name: 'Temp',
      mimeType: 'text/plain.trdi'
    },
    media: {
      mimeType: 'text/plain',
      body: filePath
    }
  });

}
module.exports = { getListFiles, createFile, getToken };