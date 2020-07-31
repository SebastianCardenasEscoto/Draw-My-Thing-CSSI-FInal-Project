// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through 

var express = require("express"); 
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
//setting the required variables

chat = []; //users array
chatConnections = []; //connections array

server.listen(process.env.PORT || 2020);  // It will run on localhost:(any number)
console.log("Chat Server Is Up");

app.get("/", function(req, res){

	res.sendFile(__dirname + "/chatChattut.html"); //links to html file CHANGE /index.html to you actually html file
	
});
	

io.sockets.on("connection", function(socket){
	//connections
	chatConnections.push(socket);	
				io.sockets.emit("new server"); //checks if anyone is online

	console.log("Chat connected: %s", chatConnections.length);
	

	
	
	// disconnections
	socket.on("disconnect", function(data){
		
		chat.splice(chat.indexOf(socket.username), 1); //accessing the array chatter
		
						io.sockets.emit("chat left"); //checks if chat left

	chatConnections.splice(chatConnections.indexOf(socket),1);
	console.log("chat disconnected: %s ", chatConnections.length);
	});
	
	//send messages
	socket.on("send chat messages", function(data){ 
		console.log(data);// reveal typed messages
		io.sockets.emit("new chat message", {msg: data});
	
	
	});



	});









