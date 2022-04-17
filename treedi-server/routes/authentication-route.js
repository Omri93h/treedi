const express = require("express");
const app = express.Router();
const {googleAuth} = require('../controllers/authentication-controller');

app.post("/", googleAuth);

module.exports = app;
