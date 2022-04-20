const express = require('express');
const router = express.Router();
const {createAndUploadFile} = require('../controllers/googleDrive-controller');

router.post('/api/googleDrive/save' , createAndUploadFile);

module.exports = router; 


