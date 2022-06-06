const express = require('express');
const { getAllUsers, getUser, updateUser, deleteUser, checkId } = require('../controllers/users-controller');
let router = express.Router();


//Routes
router.get('/api/users/', getAllUsers);
router.get('/api/users/:id', checkId ,getUser)
      .put('/api/users/:id',checkId ,updateUser)
      .delete('/api/users/:id', checkId ,deleteUser);

module.exports = router;