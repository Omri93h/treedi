const express = require('express');
const router = express.Router();
const {googleAuth} = require('../controllers/authentication-controller');
router.post('/api/user-authentication', googleAuth);

module.exports = router; 
