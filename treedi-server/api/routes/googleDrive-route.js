const express = require('express');
const router = express.Router();
const {createFile, getListFiles} = require('../controllers/googleDrive-controller');

router.post('/api/googleDrive/save' , createFile);
router.get('/api/googleDrive/listFiles/' , getListFiles);
module.exports = router; 


