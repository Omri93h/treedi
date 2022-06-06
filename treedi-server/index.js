const app = require('./lib/express');
const logger = require('./lib/logger');
require('dotenv').config();
const { initConnection } = require('./lib/mongoose');
// const httpServer = require('http').createServer(app);
// const io = require('socket.io')(httpServer, {
//     cors: { origin: true }
// })

// io.on('connection', (socket) => {
//     console.log('user online')
//     socket.on('canvas', (data) => {
//         socket.broadcast.emit('canvas', data)
//     })
// })
initConnection();
const port = process.env.port || 5001;
app.listen(port , () => logger.info(`Lisining to Server : ${port}`));

// httpServer.listen(port , () => logger.info(`Lisining to Server : ${port}`));