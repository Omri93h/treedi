const logger = require('../../lib/logger');
const { OAuth2Client } = require("google-auth-library");
const client_id=process.env.GOOGLE_LOGIN_CLIENT_ID;
// Client ID for Google Login:
const client = new OAuth2Client(client_id);
class Controller {

  // Endpoint to verify token of a user and get user details:
  async googleAuth(req, res) {
    // Get the token from the body of the request:
    const { token } = req.body;
    // Verify the token and then get User details from the payload if verified:
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: client_id,
      });
      const payload = ticket.getPayload();

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
}

module.exports = new Controller();
