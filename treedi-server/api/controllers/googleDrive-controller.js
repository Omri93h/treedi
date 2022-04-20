const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const logger = require('../../lib/logger');
require('dotenv').config();

const key_file_path=process.env.KEYFILEPATH;
const KEYFILEPATH = require('../../treediWevService.json')


// Request full drive access.
const SCOPES = ['https://www.googleapis.com/auth/drive'];
async function createAndUploadFile(req, res)
{
    logger.debug(req.body.link);
    const auth = new google.auth.GoogleAuth({
        keyFile: KEYFILEPATH,
        scopes: SCOPES
    });
    
    const driveService = google.drive({version: 'v3', auth});
    
    
    let fileMetadata = {
        'name': 'icon.png',
        'parents':  [  '10krlloIS2i_2u_ewkdv3_1NqcpmWSL1w'  ]
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
    
    switch(response.status){
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

 module.exports = {createAndUploadFile};