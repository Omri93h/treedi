const logger = require('../../lib/logger');
const { OAuth2Client } = require("google-auth-library");
const client_id=process.env.GOOGLE_LOGIN_CLIENT_ID;
const LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch')
// Client ID for Google Login:
const client = new OAuth2Client(client_id);
  // Endpoint to verify token of a user and get user details:

  async function googleAuth(req, res) {




  
    // Get the token from the body of the request:
    const { token } = req.body;
    localStorage.setItem("token", JSON.stringify(token));

    // Verify the token and then get User details from the payload if verified:
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: client_id,
      });
      const payload = ticket.getPayload();
      logger.error("THE PAYLOAD IS:"+ JSON.stringify(payload));
      logger.info("THE TICKET IS:"+ JSON.stringify(ticket));
      logger.debug("THE token IS:"+ token);
      localStorage.setItem("payload", JSON.stringify(payload));
      localStorage.setItem("client", JSON.stringify(client));
      logger.error(localStorage.getItem("ticket"));
      logger.info(localStorage.getItem("client"));
      // Send the payload
      res.send({
        payload,
        isSuccess: true,
        
      });
    } catch (error) {
      console.log(error);
      // If error then send an empty payload:
      res.send({
        payload: {},
        isSuccess: false,
      });
    }
}

  module.exports = { googleAuth };

