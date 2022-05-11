const app = require('./lib/express');
const logger = require('./lib/logger');
require('dotenv').config();


// const io = require('socket.io')(httpServer, {
//     cors: { origin: true }
// })

// io.on('connection', (socket) => {
//     console.log('user online')
//     socket.on('image-data', (data) => {
//         socket.broadcast.emit('image-data', data)
//     })
// })

const port = process.env.port || 5001;
app.listen(port , () => logger.info(`Lisining to Server : ${port}`));