// const express = require('express');
// const cors = require('cors');
// const app = express();
// app.use(cors);

// const httpServer = require('http').createServer(app);
// const io = require('socket.io')(httpServer, {
//     cors: { origin: true }
// })

// io.on('connection', (socket) => {
//     var currentdate = new Date(); 
// var datetime = "Last Sync: " + currentdate.getDate() + "/"
//                 + (currentdate.getMonth()+1)  + "/" 
//                 + currentdate.getFullYear() + " @ "  
//                 + currentdate.getHours() + ":"  
//                 + currentdate.getMinutes() + ":" 
//                 + currentdate.getSeconds();
//     console.log( datetime +  '  user online');
//     socket.on('image-data', (data) => {
//         socket.broadcast.emit('image-data', data)
//     })
// })

// const port = 8000;
// httpServer.listen(port , () => console.log(`Lisining to Server : ${port}`));




// module.exports = app;




// const express = require('express');
// const app = express();
// const server = require('http').createServer(app);
// const io = require('socket.io')(server , {cors :{origin :"*"}});


// const port = 8000;
// server.listen(port , () => console.log(`Lisining to Server : ${port}`));

// io.on('connection', (socket) => {
//     var currentdate = new Date(); 
// var datetime = "Last Sync: " + currentdate.getDate() + "/"
//                 + (currentdate.getMonth()+1)  + "/" 
//                 + currentdate.getFullYear() + " @ "  
//                 + currentdate.getHours() + ":"  
//                 + currentdate.getMinutes() + ":" 
//                 + currentdate.getSeconds();
//     console.log( datetime +  '  user online  ' + socket.id);
//     socket.on('element', (data) => {
//         console.log(data);
//         socket.broadcast.emit('element', data)
//     })
// })

let express = require('express');
let app = express();
let host = 4000
let server = app.listen(host)


console.log("Socket server is running. localhost:" + host)

let socket = require('socket.io')
const io = require('socket.io')(server , {cors :{origin :"*"}});
//let io = socket(server);

io.sockets.on('connection', newConnection)

function newConnection(socket){
	console.log('connection:',	socket.id);
	socket.on('mouse', mouseMsg);
	
	function mouseMsg(data) {
		socket.broadcast.emit('mouse', data)
		console.log(data)
	}
}