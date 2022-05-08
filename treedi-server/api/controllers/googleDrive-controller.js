const fs = require('fs');
const { google } = require('googleapis');
var async = require("async");
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
  //console.log(oAuth2Client.credentials.access_token)
  res.send(oAuth2Client.credentials.access_token);
}

async function getFileData(req, res) {
  authAndRunCallback(req, res, (oAuth2Client, res) => {
    getData(oAuth2Client, res, req)
  });
}

function getData(oAuth2Client, res, req) {
  const fileId = req.body.data.fileid;
  const drive = google.drive({ version: 'v3', auth: oAuth2Client });
  drive.files.get(
    {fileId: fileId, alt: "media",},
    {responseType: "stream"},
    (err, { data }) => {
      if (err) {
        console.log(err);
        return;
      }
      let buf = [];
      data.on("data", (e) => buf.push(e));
      data.on("end", () => {
        //console.log(buf);
        const buffer = Buffer.concat(buf);
        let dataToSend=new Buffer.from(buffer).toString();
        res.send(dataToSend);
      });
    }
  );



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
    const fileID = req.body.data["fileId"];
    //console.log(req.body.data);
    console.log("Line 117", fileID);
    if (fileID !== 'undefined' && fileID !== null ) {
      updateFile(oAuth2Client, res, req);
    }
    else {
      createNewFile(oAuth2Client, res, req)
    }
  }); 
}

async function createNewFile(oAuth2Client, res, req) {
  console.log('HEREEEE\n' );
  const filePath = req.body.data["fileData"];
  const fileName = req.body.data["fileName"];
  const drive = google.drive({ version: 'v3', auth: oAuth2Client });
  drive.files.create({
    requestBody: {
      name: fileName,
      mimeType: 'text/plain.trdi'
    },
    media: {
      mimeType: 'text/plain',
      body: filePath
    }
  }, (err, response) => {
    if (err) {
      return console.log('The API returned an error: ' + err);
    }

    console.log("responseID", response.data.id);
    if (response.data.id) {
      console.log('The ID of the create file is :', response.data.id);
      res.send(response.data.id);

    } else {
      console.log('Couldnt Create the file.');
    }
  });

}

function updateFile(oAuth2Client, res, req) {
  console.log('HEREEEE - UOPDATEETEF');

  const filePath = req.body.data["fileData"];
  const fileId = req.body.data["fileId"];
  console.log(fileId);
  //console.log(filePath);
  //console.log(fileId);
  const drive = google.drive({ version: 'v3', auth: oAuth2Client });

  drive.files.update({
    fileId: fileId,
    media: {
      mimeType: 'text/plain',
      body: filePath
    }
  }, (err, file) => {
    if (err) {
      return console.log('The API returned an error: ' + err);
    } else {
      console.log('The File with the ID:', fileId, 'Was updated');
      res.send(fileId);
    }
  });
}

async function shareFile(req, res) {
  authAndRunCallback(req, res, (oAuth2Client, res) => {
    shareFileWith(oAuth2Client, res, req)
  });
}


function shareFileWith(oAuth2Client, res, req) {
  var fileId = '14tFVAlJcfeWAu_CrV3efR5WPYKA5n4JF';
  var permissions = [
    {
      'type': 'user',
      'role': 'writer',
      'emailAddress': 'Omri93h@gmail.com'
    },
  ];
  const drive = google.drive({ version: 'v3', auth: oAuth2Client });
  async.eachSeries(permissions, function (permission, permissionCallback) {
    drive.permissions.create({
      resource: permission,
      fileId: fileId,
      fields: 'id',
    }, function (err, res) {
      if (err) {
        console.error(err);
        permissionCallback(err);
      } else {
        console.log('Permission ID: ', res.id)
        permissionCallback();
      }
    });
  }, function (err) {
    if (err) {
      // Handle error
      console.error(err);
    } else {
      // All permissions inserted
    }
  });
}


module.exports = { getListFiles, createFile, getToken, getFileData, updateFile,shareFile };