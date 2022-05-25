const express = require('express');
const router = express.Router();
const {createFile, getListFiles, getToken, getFileData, shareFile, HandleLogout} = require('../controllers/googleDrive-controller');

router.get('/api/googleDrive/listFiles/' , getListFiles);
router.get('/api/googleDrive/getToken/' , getToken);
router.get('/api/googleDrive/logOut/' , HandleLogout)
router.post('/api/googleDrive/save' , createFile);
router.post('/api/googleDrive/getFileData/' , getFileData);
router.post('/api/googleDrive/shareFile/' , shareFile);

module.exports = router; 


