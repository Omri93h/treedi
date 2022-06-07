const express = require("express");
const app = express();
const server_2 = require("http").createServer(app);
// Socket.io server listens to our app
const io = require("socket.io")(server_2, { cors: { origin: "*" } });


//initialize connection
io.on("connection", async function (socket) {
	//creating a room with the file id
	socket.on("create", function (fileID) {
		console.log("Tryng to create a room");
		socket.join(fileID);
		console.log(fileID);
		//get and send the data if the fileID is the same
		socket.on("data", (e) => {
			io.sockets.in(room).emit("data", e);
		});
	});

});

const port = process.env.Socket_Port || 4001;
server_2.listen(port, () => console.log(`Socket Server Lisining to port : ${port}`));
