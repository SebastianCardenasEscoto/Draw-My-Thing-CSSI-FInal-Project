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
    players.push(new Player(socket.id,username));
    console.log(players);
    
    if(players.length > 2){
      gameStarted = true;
      activePlayerIndex = Math.floor( Math.random(0, players.length) );
      
      players[activePlayerIndex].active = true;
      
      socket.broadcast.emit("gameStart",gameStarted);
    }
  });
  
  socket.on("guess", msg => console.log(msg));
  
  socket.on("mouse", (paintbrush)=>{
    socket.broadcast.emit("mouse", paintbrush);
  });
  
  socket.on('disconnect', ()=>{
    userLeave(socket.id);
    playerLeave(socket.id);
    console.log(players);
  });
  
});

// runs when user disconnects


function userLeave(id){
  let index = users.findIndex(user => user === id);
  
  if(index !== -1){
    return users.splice(index,1)[0];
  }
}

function playerLeave(id){
  let index = players.findIndex(player => player.id === id);
  
  if(index !== -1){
    return users.splice(index,1)[0];
  }
}

class Player{
  constructor(id, username){
    this.id = id;
    this.score = 0;
    this.active = false;
  }
}