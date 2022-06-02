import io from "socket.io-client";

function Socket() {
	const socket = io("http://localhost:4001");
	socket.on("welcome", function (data) {
		console.log(data);
		// Respond with a message including this clients' id sent from the server
		socket.broadcast.emit("i am client", { data: "foo!", id: data.id });
	});
	console.log('using Socket.js');
	return socket;
}

export default Socket