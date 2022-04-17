const { google } = require('googleapis');


const CLIENT_ID = '274272455174-tb5ajm0ej27brqp03iam81rf54vb3cjb.apps.googleusercontent.com';

const CLIENT_SECRET = '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';

const REDIRECT_URI = 'https://developers.google.com/oauthplayground';

const REFRESH_TOKEN = '1//045R91eEwwA_fCgYIARAAGAQSNwF-L9IrYZ7bm451Kg6MXXyY4_UZY03tu36sNR4faX9bcl9l9aFFoBk5duiQF_SWB8G14ge1YtQ';

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
    version: 'v3',
    auth: oauth2Client
});

// const fs = require('fs');
// const path = require('path');
// const filePath = path.join(__dirname, 'logo512.png')

// const uploadFile = async () => {
const uploadFile = async (pngImage) => {
    try {
        const response = await drive.files.create({
            requestBody: {
                name: 'File1.png',
                mimetype: 'image/png'
            },
            media: {
                mimetype: 'image/png',
                // body: fs.createReadStream(filePath)
                body: pngImage
            }
        })
        console.log(response)
    } catch (error) {
        console.log(error)
    }
}

uploadFile();
