// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const socket = require('socket.io');
let users = []; let players = [];
let gameStarted = false, activePlayerIndex;


// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
app.use(express.static("views"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {   
    response.sendFile(__dirname + "/views/landing.html");
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

var io = socket(listener);

// runs when new user connects
io.sockets.on('connection', (socket) =>{
  users.push(socket.id);
  
  socket.on("playerJoin", username => {
    players.push(new Player(socket.id,username.username));
    console.log(players);
    console.log(players.length);
    
    if(players.length > 2){
      if(gameStarted == false){
        gameStarted = true;
        socket.broadcast.emit("gameStart", gameStarted);
        activePlayerIndex = Math.floor( Math.random(0, players.length) );
        console.log(activePlayerIndex);
        players[activePlayerIndex].active = true;
 
        io.to(players[activePlayerIndex].id).emit('active',true);
        socket.broadcast.emit("redirct");
      }
    }
    
  });
  
  socket.on("backgroundColor", (backgroundColor) => {
   socket.broadcast.emit("backgroundColor");
   console.log(backgroundColor);
  });
  
  socket.on("guess", msg => console.log(msg));
  
  socket.on("clearCanv", () => socket.broadcast.emit("clearCanv"));
  
  socket.on("mouse", (paintbrush)=>{
    socket.broadcast.emit("mouse", paintbrush);
  });
  
  socket.on('disconnect', ()=>{
    console.log(`${socket.id} has left the chat`);
    userLeave(socket.id);
    playerLeave(socket.id);
    console.log(players);
    if(players.length < 3){
      gameStarted = false;
    }
    
  });
  
});

if(gameStarted){
  setInterval()
}


function userLeave(id){
  let index = users.findIndex(user => user == id);
  
  
  if(index !== -1){
    users.splice(index,1);
    
  }
}

function playerLeave(id){
  let index = players.findIndex(player => player.id == id);
  

  
  if(index !== -1){
    players.splice(index,1);
  }
}


class Player{
  constructor(id, username){
    this.id = id;
    this.score = 0;
    this.active = false;
    this.username = username;
  }
}

function chooseNewActivePlayer(){
    io.to(players[activePlayerIndex].id).emit('active',false);
    players[activePlayerIndex].active = false;
  
    activePlayerIndex = Math.floor( Math.random(0, players.length) );
    players[activePlayerIndex].active = true;
  
    io.to(players[activePlayerIndex].id).emit('active',true);
}