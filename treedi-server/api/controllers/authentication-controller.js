const logger = require('../../lib/logger');
// const client_id=process.env.GOOGLE_LOGIN_CLIENT_ID;
// const client_secret=process.env.CLIENT_SECRET;
const fs = require('fs');


  async function googleAuth(req, res) {

    const {google} = require('googleapis');
    
    // If modifying these scopes, delete token.json.
    const SCOPES = ['https://www.googleapis.com/auth/drive'];
    // The file token.json stores the user's access and refresh tokens, and is
    // created automatically when the authorization flow completes for the first
    // time.
    const TOKEN_PATH = 'token.json';
    
    // Load client secrets from a local file.
    fs.readFile('credentials_drive.json', (err, content) => {
      if (err) return console.log('Error loading client secret file:', err);
      // Authorize a client with credentials, then call the Google Drive API.
      authorize(JSON.parse(content), (authUrl) => { res.send({authUrl: authUrl});});
    });
    
    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     * @param {Object} credentials The authorization client credentials.
     * @param {function} callback The callback to call with the authorized client.
     */
    function authorize(credentials, callback) {
      const {client_secret, client_id, redirect_uris} = credentials.web;
      const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);
    
      // Check if we have previously stored a token.
      fs.readFile(TOKEN_PATH, (err, token) => {
        // if (err) 
        // {
          console.log(err)
          return getAccessToken(oAuth2Client, callback);
        // }
        // console.log("token: " + token)
        // oAuth2Client.setCredentials(JSON.parse(token));
        // callback(oAuth2Client.generateAuthUrl());
      });
    }
    
    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
     * @param {getEventsCallback} callback The callback for the authorized client.
     */
    function getAccessToken(oAuth2Client, callback) {
      const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
      });
      
      console.log('Authorize this app by visiting this url:', authUrl);
      callback(authUrl);
    }
    
    /**
     * Lists the names and IDs of up to 10 files.
     * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
     */

  }

  module.exports = { googleAuth};


