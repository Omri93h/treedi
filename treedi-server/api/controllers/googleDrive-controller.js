const webService = require("../../treediWevService.json");
const fs = require('fs');
const { google } = require('googleapis');
const logger = require('../../lib/logger');
const LocalStorage = require('node-localstorage').LocalStorage,
  localStorage = new LocalStorage('./scratch')
require('dotenv').config();
// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive'];

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

async function getListFiles(req, res) {
  //var parents = "enter here the folder you target"
  fs.readFile('credentials_drive.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Drive API.
    const credentials = JSON.parse(content);
    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);
    oAuth2Client.getToken(req.query.code).then(response => {
      oAuth2Client.setCredentials(response.tokens);
      // fs.writeFile(TOKEN_PATH, JSON.stringify(response.tokens), (err) => {
      //         if (err) return console.error(err);
      //         console.log('Token stored to', TOKEN_PATH);
      //       });
      const drive = google.drive({ version: 'v3', auth: oAuth2Client });
      drive.files.list({
        pageSize: 100,
        fields: 'nextPageToken, files(id, name)',
      }, (err, response) => {
        if (err) return console.log('The API returned an error: ' + err);
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
    }).catch(error => {
      console.log(error);
    })
  });
}



module.exports = { getListFiles };