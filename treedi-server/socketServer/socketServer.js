const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors);

const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
    cors: { origin: true }
})

io.on('connection', (socket) => {
    console.log('user online')
    socket.on('canvas', (data) => {
        socket.broadcast.emit('canvas', data)
    })
})

const port = 8000;
app.listen(port , () => console.log(`Lisining to Server : ${port}`));




module.exports = app;