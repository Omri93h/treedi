const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
//const { version } = require('process');

//Service account key file location from google cloud console
const key_file_path=process.env.KEYFILEPATH;

//Add drive scope that will give a full access to Google drive account
const SCOPES = ['https://googleapis.com/auth/drive'];

const auth = new google.auth.GoogleAuth({
    keyFile : key_file_path,
    scopes : SCOPES
})

async function createAndUploadFile(auth)
{
    //init drive service , and from now on it will handle all authorizations.
    const driveService = google.drive({version: 'v3' , auth});

    let fileMetaData = {
        'name': 'icon.png'
    }

    let media = {
        mimeType:'text/plain',// OPTION - application/vnd.google-apps.script+json
        body: fs.createReadStream('.env')
    }

    //create the request
    let response = await driveService.files.create({
        resource: fileMetaData,
        media : media,
        fields : 'id'
    })


    //handle the response
    switch(response.status){
        case 200:
            console.log('File created id:',response.data.id);
            break;
    }
}

module.exports = {createAndUploadFile};