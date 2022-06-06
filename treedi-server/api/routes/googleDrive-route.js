const express = require('express');
const router = express.Router();
const {createFile, getToken, getFileData, shareFile, TTC} = require('../controllers/googleDrive-controller');

router.get('/api/googleDrive/getToken/' , getToken);
router.get('/api/googleDrive/TTC/' , TTC);
router.post('/api/googleDrive/save' , createFile);
router.post('/api/googleDrive/getFileData/' , getFileData);
router.post('/api/googleDrive/shareFile/' , shareFile);

module.exports = router; 


