const express = require('express');
const router = express.Router();
const {createAndUploadFile, getListFiles} = require('../controllers/googleDrive-controller');

//router.post('/api/googleDrive/save' , createAndUploadFile);
router.get('/api/googleDrive/listFiles/' , getListFiles);
module.exports = router; 


