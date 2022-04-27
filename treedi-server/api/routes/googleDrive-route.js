const express = require('express');
const router = express.Router();
const {createFile, getListFiles, getToken} = require('../controllers/googleDrive-controller');

router.post('/api/googleDrive/save' , createFile);
router.get('/api/googleDrive/listFiles/' , getListFiles);
router.get('/api/googleDrive/getToken/' , getToken);

module.exports = router; 


