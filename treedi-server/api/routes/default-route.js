const express = require('express');
const router = express.Router();
const { index, routeInvalid, errorHandler, method } = require('../controllers/default-controller');

router.use(method);
// router.get('/api/collab', function (req, res) {
//     console.log('response received', res);
//     // res.sendFile(path.join(__dirname, '../ui/build', 'index.html'));
// });  
router.get('/', index);
router.all('*', routeInvalid);

router.use(errorHandler);

module.exports = router; 


