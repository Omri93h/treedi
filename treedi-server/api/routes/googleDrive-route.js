const express = require('express');
const router = express.Router();
const {createFile, getListFiles, getToken , getFileData,shareFile, collab} = require('../controllers/googleDrive-controller');

router.post('/api/googleDrive/save' , createFile);
router.get('/api/googleDrive/listFiles/' , getListFiles);
router.get('/api/googleDrive/getToken/' , getToken);
router.post('/api/googleDrive/getFileData/' , getFileData);
router.post('/api/googleDrive/shareFile/' , shareFile);
router.get('/api/collab/', collab);



module.exports = router; 


