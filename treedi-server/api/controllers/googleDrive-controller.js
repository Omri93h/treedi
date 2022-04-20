const webService = require("../../treediWevService.json");
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const logger = require('../../lib/logger');
const path = require("path");
const client_id = process.env.GOOGLE_LOGIN_CLIENT_ID;
const secret_id = process.env.CLIENT_SECRET;
const LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch')
require('dotenv').config();
// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive'];

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

let auth;
const credentials = require("../../credentials.json");

async function getKey(){
// Load client secrets from a local file.
fs.readFile('./credentials_drive.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Drive API.
    authorize(JSON.parse(content));
  });

  function authorize(credentials) {
    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );
  
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getAccessToken(oAuth2Client);
      oAuth2Client.setCredentials(JSON.parse(token));
      auth = oAuth2Client;
    });
  }

  function getAccessToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'online',
      scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log('Token stored to', TOKEN_PATH);
          console.log(TOKEN_PATH);
        });
        auth = authoAuth2Client;
        localStorage.setItem("auth", auth);
      });
    });
  }

}

async function getListFiles(req, res) {
    getKey();
    //var parents = "enter here the folder you target"
    //const Auth = localStorage.getItem("auth");
    //console.log(oauth2Client);
    // const ticket =localStorage.getItem("ticket"); 
    // logger.error(localStorage.getItem("ticket"));
    // logger.info(localStorage.getItem("client"));
    // logger.debug(JSON.stringify(googleAuth));
    // logger.error(JSON.stringify(oauth2Client));
    const service = google.drive('v3');
    service.files.list({
        auth: auth,
        pageSize: 10,
        fields: "nextPageToken, files(id, name)"
    }, function (err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }
        var files = response.files;
        if (files.length == 0) {
            console.log('No files found.');
        } else {
            console.log('Files:');
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                console.log('%s (%s)', file.name, file.id);
            }
        }
    });
}


const key_file_path = process.env.KEYFILEPATH;
const KEYFILEPATH = require('../../treediWevService.json')


async function createAndUploadFile(req, res) {
    logger.debug(req.body.link);
    const auth = new google.auth.GoogleAuth({
        keyFile: KEYFILEPATH,
        scopes: SCOPES
    });

    const driveService = google.drive({ version: 'v3', auth });


    let fileMetadata = {
        'name': 'icon.png',
        'parents': ['10krlloIS2i_2u_ewkdv3_1NqcpmWSL1w']
    };
    let media = {
        mimeType: 'image/jpeg',
        body: fs.createReadStream('icon.png')
    };

    let response = await driveService.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id'
    });

    switch (response.status) {
        case 200:
            let file = response.result;
            console.log('Created File Id: ', response.data.id);
            break;
        default:
            console.error('Error creating the file, ' + response.errors);
            break;
    }

}




























































// const OAuth2Data = require('../../credentials.json');


// //Add drive scope that will give a full access to Google drive account
// const SCOPES = ['https://googleapis.com/auth/drive'];

// const auth = new google.auth.GoogleAuth({
//     keyFile : temp,
//     scopes : SCOPES
// })


// const CLIENT_ID = OAuth2Data.web.client_id;

// const CLIENT_SECRET = OAuth2Data.web.client_secret;

// const oAuth2Client = new google.auth.OAuth2(
//     CLIENT_ID,
//     CLIENT_SECRET,
//     SCOPES
// )


// //const { version } = require('process');

// //Service account key file location from google cloud console



// async function createAndUploadFile(req , auth)
// {
//     logger.info(key_file_path);
//     logger.error(JSON.stringify(req.body) );
//     //init drive service , and from now on it will handle all authorizations.
//     const driveService = google.drive({version: 'v1' , oAuth2Client});

//     let fileMetaData = {
//         'name': 'icon.png'
//     }

//     let media = {
//         mimeType:'text/plain',// OPTION - application/vnd.google-apps.script+json
//         body: fs.createReadStream('.env')
//     }

//     //create the request
//     let response = await driveService.files.create({
//         resource: fileMetaData,
//         media : media,
//         fields : 'id'
//     })


//     //handle the response
//     switch(response.status){
//         case 200:
//             console.log('File created id:',response.data.id);
//             break;
//         default:
//             console.log('File Error:',response);
//     }
// }

module.exports = { createAndUploadFile, getListFiles };