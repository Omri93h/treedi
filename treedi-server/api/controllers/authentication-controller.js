// const logger = require('../../lib/logger');
// const { OAuth2Client } = require("google-auth-library");
// const client_id=process.env.GOOGLE_LOGIN_CLIENT_ID;
// const LocalStorage = require('node-localstorage').LocalStorage,
// localStorage = new LocalStorage('./scratch')
// // Client ID for Google Login:
// const client = new OAuth2Client();
//   // Endpoint to verify token of a user and get user details:

//   async function googleAuth(req, res) {
//       // Get the token from the body of the request:
//     const { token } = req.body;
//     localStorage.setItem("token", JSON.stringify(token));

//     // Verify the token and then get User details from the payload if verified:
//     try {
//       const ticket = await client.verifyIdToken({
//         scope:['https://www.googleapis.com/auth/drive'],
//         idToken: token,
//         audience: client_id,
//       });
//       const payload = ticket.getPayload();
//       // logger.error("THE PAYLOAD IS:"+ JSON.stringify(payload));
//       // logger.info("THE TICKET IS:"+ JSON.stringify(ticket));
//        logger.debug("THE token IS:"+ token);
//       // localStorage.setItem("payload", JSON.stringify(payload));
//       // localStorage.setItem("client", JSON.stringify(client));
//       // logger.error(localStorage.getItem("ticket"));
//       // logger.info(localStorage.getItem("client"));
//       // Send the payload
//       res.send({
//         payload,
//         isSuccess: true,
        
//       });
//     } catch (error) {
//       console.log(error);
//       // If error then send an empty payload:
//       res.send({
//         payload: {},
//         isSuccess: false,
//       });
//     }
// }
//   module.exports = { googleAuth };






const logger = require('../../lib/logger');
const { OAuth2Client } = require("google-auth-library");
const client_id=process.env.GOOGLE_LOGIN_CLIENT_ID;
const client_secret=process.env.CLIENT_SECRET;

const LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch')
  // Endpoint to verify token of a user and get user details:

  async function googleAuth(req, res) {

    const fs = require('fs');
    const readline = require('readline');
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
        if (err) {
          console.log(err)
          return getAccessToken(oAuth2Client, callback);
        }
        console.log("token: " + token)
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
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
      // const rl = readline.createInterface({
      //   input: process.stdin,
      //   output: process.stdout,
      // });

      // rl.question('Enter the code from that page here: ', (code) => {
      //   rl.close();
      //   oAuth2Client.getToken(code, (err, token) => {
      //     if (err) return console.error('Error retrieving access token', err);
      //     oAuth2Client.setCredentials(token);
      //     // Store the token to disk for later program executions
      //     fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
      //       if (err) return console.error(err);
      //       console.log('Token stored to', TOKEN_PATH);
      //     });
      //     callback(oAuth2Client);
      //     localStorage.setItem('oAuth2Client' , oAuth2Client);
      //   });
      // });
    }
    
    /**
     * Lists the names and IDs of up to 10 files.
     * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
     */

  }

  module.exports = { googleAuth};


