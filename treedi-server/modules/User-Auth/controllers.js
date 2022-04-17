const { OAuth2Client } = require("google-auth-library");
// Client ID for Google Login:
const client = new OAuth2Client("101602613283-mg4l5v8f2ssl11qpusebl8n2dn0hrlil.apps.googleusercontent.com");

class Controller {
  // Endpoint to verify token of a user and get user details:
  async googleAuth(req, res) {
    // Get the token from the body of the request:
    const { token } = req.body;
    // Verify the token and then get User details from the payload if verified:
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: "101602613283-mg4l5v8f2ssl11qpusebl8n2dn0hrlil.apps.googleusercontent.com",
      });
      const payload = ticket.getPayload();

      /******* 
      ......
      Perform Database insertion or
      retrieval operations here ...
      ......
      *******/

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
