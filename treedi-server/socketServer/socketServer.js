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

// let express = require('express');
// let app = express();
// let host = 4000
// let server = app.listen(host)

// console.log("Socket server is running. localhost:" + host)

// let socket = require('socket.io')
// const io = require('socket.io')(server , {cors :{origin :"*"}});
// //let io = socket(server);

// io.sockets.on('connection', newConnection)

// function newConnection(socket){
// 	console.log('connection:',	socket.id);
// 	socket.on('mouse', mouseMsg);

// 	function mouseMsg(data) {
// 		socket.broadcast.emit('mouse', data)
// 		console.log(data)
// 	}
// }

const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });

// const http = require('http'),
// fs = require('fs')
// NEVER use a Sync function except at start-up!
// index = fs.readFileSync(__dirname + '/index.html');

// Send index.html to all requests
// const app = http.createServer(function(req, res) {
//     res.writeHead(200, {'Content-Type': 'text/html'});
//     res.end(index);
// });

// // Socket.io server listens to our app
// const io = require('socket.io').listen(app);

// Send current time every 10 secs


// Emit welcome message on connection
io.on("connection", function (socket) {
	// Use socket to communicate with this particular client only, sending it it's own id
	socket.emit("welcome", { message: "Welcome!", id: socket.id });
	// Send current time to all connected clients
	function sendTime() {
		// io.emit("time", { time: new Date().toJSON(), id: socket.id} );
		io.emit("time", { time: new Date().toJSON(), id: socket.id} );
		// console.log(socket)
	}
	socket.on("data", (e) => {
		socket.broadcast.emit("data", e );
	});
	// function sendData(e) {
	// 	socket.on("data", (e) => {
	// 		console.log(e)
	// 	});
		
	

	setInterval(sendTime, 30000);
	// setInterval(sendData, 8000);
	socket.on("i am client", console.log);

});

const port = 4001;
server.listen(port, () => console.log(`Lisining to Server : ${port}`));
// console.log("Socket server is running. localhost:" + 4001)
