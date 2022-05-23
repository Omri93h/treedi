const app = require('./lib/express');
const logger = require('./lib/logger');


const httpServer = require('http').createServer(app);
require('dotenv').config();




const io = require('socket.io')(httpServer, {
    cors: { origin: true }
})

io.on('connection', (socket) => {
    console.log('user online')
    socket.on('canvas', (data) => {
        socket.broadcast.emit('canvas', data)
    })
})

const port = process.env.port || 5001;
app.listen(port , () => logger.info(`Lisining to Server : ${port}`));